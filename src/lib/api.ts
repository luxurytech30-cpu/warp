// src/lib/api.ts
import axios from "axios";
import type { CartItem, Order, CustomerDetails, Category, Product, User } from "@/types";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    if (!config.headers) {
      config.headers = {} as any;
    }
    (config.headers as any).Authorization = `Bearer ${token}`;
  }

  return config;
});

// PRODUCTS
export const getProducts = async () => {
  const res = await api.get("/products");
  return res.data;
};

export const getProductById = async (id: string) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

// CONTACT
export const sendContactMessage = async (data: any) => {
  const res = await api.post("/contact", data);
  return res.data;
};

// AUTH
export const getCurrentUser = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

export const loginRequest = async (username: string, password: string) => {
  const res = await api.post("/auth/login", { username, password });
  return res.data; // { token, user }
};

export const registerRequest = async (
  username: string,
  password: string,
  role: "customer" | "admin" = "customer"
) => {
  const res = await api.post("/auth/register", { username, password, role });
  return res.data; // { message, user }
};

// CART
export const fetchCart = async (): Promise<CartItem[]> => {
  const res = await api.get("/cart");
  return res.data; // CartItem[]
};

export const addToCartRequest = async (data: {
  productId: string;
  optionIndex: number;
  quantity: number;
}): Promise<CartItem[]> => {
  const res = await api.post("/cart/add", data);
  return res.data.cart; // CartItem[]
};

export const updateCartItemRequest = async (data: {
  productId: string;
  optionIndex: number;
  quantity: number;
}): Promise<CartItem[]> => {
  const res = await api.patch("/cart/update", data);
  return res.data.cart; // CartItem[]
};

export const removeCartItemRequest = async (data: {
  productId: string;
  optionIndex: number;
}): Promise<CartItem[]> => {
  const res = await api.delete("/cart/item", { data });
  return res.data.cart; // CartItem[]
};

export const clearCartRequest = async (): Promise<CartItem[]> => {
  const res = await api.delete("/cart/clear");
  return res.data.cart; // []
};

export const checkoutOrder = async (
  details: CustomerDetails
): Promise<{ order: Order }> => {
  const res = await api.post("/orders/checkout", details);
  return res.data;
};

export async function startTranzilaPayment(orderId: string): Promise<{ iframeUrl: string }> {
  const token = localStorage.getItem("token");

  const API_BASE = "https://wrap-back.onrender.com";

  const r = await fetch(`${API_BASE}/api/payments/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // only if your auth middleware expects it
    },
    body: JSON.stringify({ orderId }),
  });

  // safer parsing:
  const text = await r.text();
  let data: any = {};
  try { data = text ? JSON.parse(text) : {}; } catch {}

  if (!r.ok) throw new Error(data?.message || `Payment start failed (${r.status})`);
  if (!data?.iframeUrl) throw new Error("Missing iframeUrl from server");

  return { iframeUrl: data.iframeUrl };
}



export const getMyOrders = async (): Promise<Order[]> => {
  const res = await api.get("/orders/my");
  return res.data;
};

export async function updateCartItemNoteRequest(data: {
  productId: string;
  optionIndex: number;
  itemNote: string;
}) {
  const res = await api.patch("/cart/note", data);
  return res.data.cart;
}


//
// 3.1 Categories (Admin)
//

export const getAdminCategories = async (): Promise<Category[]> => {
  const res = await api.get("/admin/categories");
  return res.data;
};

export const createCategoryRequest = async (name: string): Promise<Category> => {
  const res = await api.post("/admin/categories", { name });
  return res.data;
};

export const updateCategoryRequest = async (
  id: string,
  name: string
): Promise<Category> => {
  const res = await api.patch(`/admin/categories/${id}`, { name });
  return res.data;
};

export const deleteCategoryRequest = async (id: string): Promise<void> => {
  await api.delete(`/admin/categories/${id}`);
};

//
// 3.2 Products (Admin)
//

export const getAdminProducts = async (): Promise<Product[]> => {
  const res = await api.get("/admin/products");
  return res.data;
};

// body uses categoryId string, backend maps it to category ObjectId
export const createProductRequest = async (data: {
  name: string;
  description: string;
  categoryId: string;
  image: string;
  isTop: boolean;
  options: {
    optionName: string;
    priceWithoutMaam: number;
    salePriceWithoutMaam?: number;
    stock: number;
  }[];
}): Promise<Product> => {
  const res = await api.post("/admin/products", data);
  return res.data;
};

export const updateProductRequest = async (
  id: string,
  data: {
    name: string;
    description: string;
    categoryId: string;
    image: string;
    isTop: boolean;
    options: {
      optionName: string;
      priceWithoutMaam: number;
      salePriceWithoutMaam?: number;
      stock: number;
    }[];
  }
): Promise<Product> => {
  const res = await api.patch(`/admin/products/${id}`, data);
  return res.data;
};

export const deleteProductRequest = async (id: string): Promise<void> => {
  await api.delete(`/admin/products/${id}`);
};

//
// 3.3 Users (Admin)
//

export const getAllUsers = async (): Promise<User[]> => {
  const res = await api.get("/admin/users");
  return res.data;
};

export const updateUserRoleRequest = async (
  id: string,
  role: "customer" | "admin"
): Promise<User> => {
  const res = await api.patch(`/admin/users/${id}/role`, { role });
  return res.data;
};

//
// 3.4 Orders (Admin)
//

export const getAllOrdersAdmin = async (): Promise<Order[]> => {
  const res = await api.get("/admin/orders");
  return res.data;
};

export async function getUploadSignature() {
  const { data } = await api.post("/upload/signature");
  return data as {
    timestamp: number;
    signature: string;
    apiKey: string;
    cloudName: string;
    folder: string;
  };
}

export const cancelOrderRequest = async (orderId: string): Promise<{ order: Order }> => {
  const res = await api.patch(`/orders/${orderId}/cancel`);
  return res.data; // { message, order }
};

export default api;

