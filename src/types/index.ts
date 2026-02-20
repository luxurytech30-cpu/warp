export interface ProductOption {
  optionName: string;
  priceWithoutMaam: number;
  stock: number;
  salePriceWithoutMaam?: number;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  options: ProductOption[];
  image: string;
  isTop: boolean;
  category: Category; // not string anymore
}

export interface User {
  username: string;
  id: string;
  role: "customer" | "admin";
}

export interface CartItem {
  productId: string;
  productName: string;
  optionName: string;
  optionIndex: number; // <--- add this
  priceWithoutMaam: number;
  quantity: number;
  image: string;
  itemNote: string;
  itemImageUrl?: string;
  itemImagePublicId?: string;
}

export type DeliveryMethod = "pickup" | "shipping";

export interface CustomerDetails {
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  street: string;
  houseNumber: string;
  postalCode?: string;
  notes?: string;
  itemsMeta: any;

  // ✅ NEW
  deliveryMethod: DeliveryMethod;
  shippingFee: number; // 0 or 40
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  totalWithoutMaam: number;

  // ✅ NEW
  shippingFee?: number;
  totalToPay?: number;
  deliveryMethod?: DeliveryMethod;

  status: "pending" | "paid" | "shipped" | "completed" | "failed" | "canceled";
  customerDetails?: CustomerDetails;
}

export interface Category {
  _id: string; // MongoDB ID
  name: string; // Category name
}