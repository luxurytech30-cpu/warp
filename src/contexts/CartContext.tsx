// src/contexts/CartContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem,  Order, CustomerDetails } from "@/types";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  checkoutOrder, 
  startTranzilaPayment, 
  fetchCart,
  addToCartRequest,
  updateCartItemRequest,
  removeCartItemRequest,
  clearCartRequest,
  updateCartItemNoteRequest,
} from "@/lib/api";

interface CartContextType {
  cart: CartItem[];
  orders: Order[];
  addToCart: (item: Omit<CartItem, "quantity">) => Promise<void>;
  removeFromCart: (productId: string, optionIndex: number) => Promise<void>;
  updateQuantity: (
    productId: string,
    optionIndex: number,
    quantity: number
  ) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalWithoutMaam: () => number;
  getTotalWithMaam: () => number;
  placeOrder: (details: CustomerDetails) => Promise<void>;
    updateItemNote: (productId: string, optionIndex: number, itemNote: string) => Promise<void>;
  loadCart: () => Promise<void>;
}


const CartContext = createContext<CartContextType | undefined>(undefined);

const MAAM_RATE = 0.17;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const { user } = useAuth();

  // Load cart from server when user changes
  useEffect(() => {
   

    loadCart();
  }, [user]);


   const loadCart = async () => {
      if (!user) {
        setCart([]);
        return;
      }
      try {
        const serverCart = await fetchCart();
        setCart(serverCart);
      } catch (err) {
        console.error("FETCH CART ERROR:", err);
        toast.error("שגיאה בטעינת העגלה");
      }
    };
  const requireLogin = (): boolean => {
    if (!user) {
      toast.error("עליך להתחבר כדי להשתמש בעגלה");
      return false;
    }
    return true;
  };


const updateItemNote = async (productId: string, optionIndex: number, itemNote: string) => {
  if (!requireLogin()) return;

  const previous = [...cart];

  // optimistic
  setCart((current) =>
    current.map((it) =>
      it.productId === productId && it.optionIndex === optionIndex
        ? { ...it, itemNote }
        : it
    )
  );

  try {
    const updatedCart = await updateCartItemNoteRequest({ productId, optionIndex, itemNote });
    setCart(updatedCart);
  } catch (err) {
    console.error("UPDATE ITEM NOTE ERROR:", err);
    setCart(previous);
    toast.error("שגיאה בעדכון ההערה");
  }
};


  const addToCart = async (item: Omit<CartItem, "quantity">) => {
    if (!requireLogin()) return;

    try {
      const updatedCart = await addToCartRequest({
        productId: item.productId,
        optionIndex: item.optionIndex,
        quantity: 1,
      });
      setCart(updatedCart);
      toast.success("המוצר נוסף לעגלה");
    } catch (err) {
      console.error("ADD TO CART ERROR:", err);
      toast.error("שגיאה בהוספת המוצר לעגלה");
    }
  };

  const removeFromCart = async (productId: string, optionIndex: number) => {
    if (!requireLogin()) return;

    // optional: optimistic UI
    const previous = [...cart];
    setCart((current) =>
      current.filter(
        (item) =>
          !(item.productId === productId && item.optionIndex === optionIndex)
      )
    );

    try {
      const updatedCart = await removeCartItemRequest({
        productId,
        optionIndex,
      });
      setCart(updatedCart);
      toast.info("המוצר הוסר מהעגלה");
    } catch (err) {
      console.error("REMOVE FROM CART ERROR:", err);
      setCart(previous);
      toast.error("שגיאה בהסרת המוצר מהעגלה");
    }
  };

  const updateQuantity = async (
    productId: string,
    optionIndex: number,
    quantity: number
  ) => {
    if (!requireLogin()) return;

    if (quantity <= 0) {
      return removeFromCart(productId, optionIndex);
    }

    // optional: optimistic UI
    const previous = [...cart];
    setCart((current) =>
      current.map((item) =>
        item.productId === productId && item.optionIndex === optionIndex
          ? { ...item, quantity }
          : item
      )
    );

    try {
      const updatedCart = await updateCartItemRequest({
        productId,
        optionIndex,
        quantity,
      });
      setCart(updatedCart);
    } catch (err) {
      console.error("UPDATE CART QUANTITY ERROR:", err);
      setCart(previous);
      toast.error("שגיאה בעדכון הכמות");
    }
  };

  const clearCart = async () => {
    if (!requireLogin()) return;

    const previous = [...cart];
    setCart([]);

    try {
      const updatedCart = await clearCartRequest();
      setCart(updatedCart);
      toast.info("העגלה נוקתה");
    } catch (err) {
      console.error("CLEAR CART ERROR:", err);
      setCart(previous);
      toast.error("שגיאה בניקוי העגלה");
    }
  };

  const getTotalWithoutMaam = () => {
    return cart.reduce(
      (sum, item) => sum + item.priceWithoutMaam * item.quantity,
      0
    );
  };

  const getTotalWithMaam = () => {
    const totalWithout = getTotalWithoutMaam();
    return totalWithout * (1 + MAAM_RATE);
  };

  const placeOrder = async (details: CustomerDetails) => {
  if (!user) {
    toast.error("עליך להתחבר כדי לבצע הזמנה");
    return;
  }

  if (cart.length === 0) {
    toast.error("העגלה ריקה");
    return;
  }

  try {
    // 1. create order in backend (status: pending) + clear cart
    const { order } = await checkoutOrder(details);

    // 2. update local state
    setOrders((prev) => [order, ...prev]);
    setCart([]);

    // 3. Start Tranzila payment → redirect user to Tranzila page
    const { paymentUrl } = await startTranzilaPayment(order.id);
    window.location.href = paymentUrl;
  } catch (err: any) {
    console.error("CHECKOUT ERROR:", err);
    const msg =
      err?.response?.data?.message ||
      "שגיאה בביצוע ההזמנה. נסה שוב מאוחר יותר.";
    toast.error(msg);
  }
};


  return (
    <CartContext.Provider
      value={{
        cart,
        orders,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalWithoutMaam,
        getTotalWithMaam,
        placeOrder,
        loadCart,
          updateItemNote, 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
