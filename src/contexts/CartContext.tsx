// src/contexts/CartContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem,  Order, CustomerDetails } from "@/types";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
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
type PlaceOrderResult = {
  order: Order;
  iframeUrl: string;   // ✅ required
  paymentUrl?: string; // optional only if you still support redirect mode
};


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
  placeOrder: (details: CustomerDetails) => Promise<PlaceOrderResult>;
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
  const { isArabic } = useLanguage();
  const labels = isArabic
    ? {
        loadError: "حدث خطأ أثناء تحميل السلة",
        loginRequired: "يجب تسجيل الدخول لاستخدام السلة",
        noteUpdateError: "حدث خطأ أثناء تحديث الملاحظة",
        addSuccess: "تمت إضافة المنتج إلى السلة",
        addError: "حدث خطأ أثناء إضافة المنتج إلى السلة",
        removeSuccess: "تمت إزالة المنتج من السلة",
        removeError: "حدث خطأ أثناء إزالة المنتج من السلة",
        updateQtyError: "حدث خطأ أثناء تحديث الكمية",
        clearSuccess: "تم تفريغ السلة",
        clearError: "حدث خطأ أثناء تفريغ السلة",
        orderLoginRequired: "يجب تسجيل الدخول لإتمام الطلب",
        cartEmpty: "السلة فارغة",
        checkoutError: "حدث خطأ أثناء تنفيذ الطلب. حاول لاحقًا.",
      }
    : {
        loadError: "שגיאה בטעינת העגלה",
        loginRequired: "עליך להתחבר כדי להשתמש בעגלה",
        noteUpdateError: "שגיאה בעדכון ההערה",
        addSuccess: "המוצר נוסף לעגלה",
        addError: "שגיאה בהוספת המוצר לעגלה",
        removeSuccess: "המוצר הוסר מהעגלה",
        removeError: "שגיאה בהסרת המוצר מהעגלה",
        updateQtyError: "שגיאה בעדכון הכמות",
        clearSuccess: "העגלה נוקתה",
        clearError: "שגיאה בניקוי העגלה",
        orderLoginRequired: "עליך להתחבר כדי לבצע הזמנה",
        cartEmpty: "העגלה ריקה",
        checkoutError: "שגיאה בביצוע ההזמנה. נסה שוב מאוחר יותר.",
      };

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
        toast.error(labels.loadError);
      }
    };
  const requireLogin = (): boolean => {
    if (!user) {
      toast.error(labels.loginRequired);
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
    toast.error(labels.noteUpdateError);
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
      toast.success(labels.addSuccess);
    } catch (err) {
      console.error("ADD TO CART ERROR:", err);
      toast.error(labels.addError);
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
      toast.info(labels.removeSuccess);
    } catch (err) {
      console.error("REMOVE FROM CART ERROR:", err);
      setCart(previous);
      toast.error(labels.removeError);
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
      toast.error(labels.updateQtyError);
    }
  };

  const clearCart = async () => {
    if (!requireLogin()) return;

    const previous = [...cart];
    setCart([]);

    try {
      const updatedCart = await clearCartRequest();
      setCart(updatedCart);
      toast.info(labels.clearSuccess);
    } catch (err) {
      console.error("CLEAR CART ERROR:", err);
      setCart(previous);
      toast.error(labels.clearError);
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


const placeOrder = async (details: CustomerDetails): Promise<PlaceOrderResult> => {
  if (!user) {
    toast.error(labels.orderLoginRequired);
    throw new Error("NOT_AUTHENTICATED");
  }

  if (cart.length === 0) {
    toast.error(labels.cartEmpty);
    throw new Error("CART_EMPTY");
  }

  const { order } = await checkoutOrder(details);
  setOrders((prev) => [order, ...prev]);

  
const pay = await startTranzilaPayment(order.id); // returns { iframeUrl }
return { order, iframeUrl: pay.iframeUrl };


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
