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
  category: Category;        // not string anymore
}

export interface User {
  username: string;
  id: string;
  role: 'customer' | 'admin';
}

export interface CartItem {
  productId: string;
  productName: string;
  optionName: string;
  optionIndex: number;          // <--- add this
  priceWithoutMaam: number;
  quantity: number;
  image: string;
}


export interface CustomerDetails {
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  street: string;
  houseNumber: string;
  postalCode?: string;
  notes?: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  totalWithoutMaam: number;
  totalWithMaam: number;
  status: "pending" | "paid" | "shipped" | "completed" | "failed" | "canceled";
  customerDetails?: CustomerDetails;
}

export interface Category {
  _id: string;           // MongoDB ID
  name: string;          // Category name
 
}