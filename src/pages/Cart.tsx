// src/pages/Cart.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const Cart = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    getTotalWithoutMaam,
    updateItemNote,
    placeOrder,
    clearCart,
  } = useCart();

  const { user } = useAuth();
  const { isArabic } = useLanguage();
  const isAuthenticated = !!user;

  const labels = isArabic
    ? {
        noteSaved: "تم حفظ الملاحظة",
        loginRequired: "يجب تسجيل الدخول لإتمام الطلب",
        missingFields:
          "يرجى تعبئة الاسم الكامل، الهاتف، والعنوان (المدينة، الشارع، رقم المنزل)",
        emptyTitle: "السلة فارغة",
        emptyBody: "لم تقوم بإضافة أي منتجات بعد",
        startShopping: "ابدء التسوق",
        cartTitle: "سلة",
        cartHighlight: "التسوق",
        unitPrice: "سعر القطعة",
        total: "المجموع",
        notePlaceholder: "ملاحظة لهذا المنتج (مثال: اكتب الاسم للطباعة)",
        saving: "جارٍ الحفظ...",
        saveNote: "حفظ الملاحظة",
        orderSummary: "ملخص الطلب",
        totalToPay: "الإجمالي للدفع:",
        shippingDetails: "تفاصيل الشحن",
        fullName: "الاسم الكامل *",
        phone: "*الهاتف",
        email: "البريد الإلكتروني (اختياري)",
        city: "المدينة *",
        street: "الشارع *",
        houseNumber: "*رقم المنزل",
        postalCode: "الرمز البريدي (اختياري)",
        orderNotes: "ملاحظات على الطلب (اختياري)",
        redirecting: "جاري تحويلك لصفحة الدفع...",
        proceedToPay: "متابعة للدفع",
        loginToCheckout: "سجّلي الدخول لإتمام الطلب",
        continueShopping: "متابعة التسوق",
        clearCart: "تفريغ السلة",
        cancelPolicy: "** يمكن إلغاء الطلب خلال ساعتين فقط من وقت إنشائه.",
        agreeToTerms: "أوافق على الشروط والأحكام",
terms: "الشروط والأحكام",
mustAgree: "يجب الموافقة على الشروط والأحكام للمتابعة",
invalidPhone: "رقم الهاتف غير صحيح",
invalidEmail: "البريد الإلكتروني غير صحيح",


      }
    : {
        noteSaved: "ההערה נשמרה",
        loginRequired: "יש להתחבר כדי להשלים את ההזמנה",
        missingFields:
          "נא למלא שם מלא, טלפון וכתובת (עיר, רחוב, מספר בית)",
        emptyTitle: "העגלה ריקה",
        emptyBody: "לא הוספת עדיין מוצרים",
        startShopping: "התחילו לקנות",
        cartTitle: "עגלה",
        cartHighlight: "קניות",
        unitPrice: "מחיר יחידה",
        total: 'סה"כ',
        notePlaceholder: "הערה למוצר הזה (לדוגמה: כתבו את השם להדפסה)",
        saving: "שומרים...",
        saveNote: "שמור הערה",
        orderSummary: "סיכום הזמנה",
        totalToPay: 'סה"כ לתשלום:',
        shippingDetails: "פרטי משלוח",
        fullName: "שם מלא *",
        phone: "*טלפון ",
        email: 'דוא"ל (אופציונלי)',
        city: "עיר *",
        street: "רחוב *",
        houseNumber: "*מספר בית ",
        postalCode: "מיקוד (אופציונלי)",
        orderNotes: "הערות להזמנה (אופציונלי)",
        redirecting: "מעבירים אותך לעמוד התשלום...",
        proceedToPay: "המשך לתשלום",
        loginToCheckout: "התחברו כדי להשלים את ההזמנה",
        continueShopping: "המשיכו לקנות",
        clearCart: "רוקן עגלה",
        cancelPolicy: "** ניתן לבטל הזמנה רק בתוך שעתיים מרגע יצירתה.",
        agreeToTerms: "אני מאשר/ת שקראתי ואני מסכים/ה לתקנון",
terms: "תקנון",
mustAgree: "צריך לאשר את התקנון כדי להמשיך",
invalidPhone: "מספר טלפון לא תקין",
invalidEmail: "כתובת אימייל לא תקינה",

      };

  const totalWithoutMaam = getTotalWithoutMaam();

  const startPayment = async (orderId: string) => {
  const res = await fetch("https://wrap-back.onrender.com/api/payments/start", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // אם auth אצלך עובד עם cookies, תשאיר רק credentials למטה
      // ואם עובד עם Bearer token – תוסיף Authorization כאן
    },
    credentials: "include", // חשוב אם אתה משתמש בקוקיז/סשן
    body: JSON.stringify({ orderId }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Payment start failed");

  return data.paymentUrl as string;
};

  // which item is being updated (for disabling + / - / input)
  const [updatingKey, setUpdatingKey] = useState<string | null>(null);
const [agreedToTerms, setAgreedToTerms] = useState(false);

  // local quantities for the inputs
  const [editQuantities, setEditQuantities] = useState<Record<string, number>>(
    {}
  );

  const getKey = (productId: string, optionIndex: number) =>
    `${productId}-${optionIndex}`;

  const normalizePhone = (value: string) =>
  value.replace(/[^\d+]/g, "").trim();

const isValidILPhone = (value: string) => {
  const p = normalizePhone(value);

  // 05XXXXXXXX (10 digits)
  if (/^05\d{8}$/.test(p)) return true;

  // +9725XXXXXXXX or 9725XXXXXXXX  (country code, 9 digits after 972)
  if (/^\+9725\d{8}$/.test(p)) return true;
  if (/^9725\d{8}$/.test(p)) return true;

  return false;
};

const isValidEmail = (value: string) => {
  const v = value.trim();
  // simple solid email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
};


  // checkout form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [notes, setNotes] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // notes per item
  const [editNotes, setEditNotes] = useState<Record<string, string>>({});
  const [savingNoteKey, setSavingNoteKey] = useState<string | null>(null);

  const handleSaveNote = async (
    productId: string,
    optionIndex: number,
    key: string,
    fallback: string
  ) => {
    const noteToSave = (editNotes[key] ?? fallback).trim();

    setSavingNoteKey(key);
    try {
      await updateItemNote(productId, optionIndex, noteToSave);
      toast.success(labels.noteSaved);
    } finally {
      setSavingNoteKey(null);
    }
  };

//   if (!agreedToTerms) {
//   toast.error(labels.mustAgree);
//   return;
// }
const handleCheckout = async () => {
  if (!agreedToTerms) {
    toast.error(labels.mustAgree);
    return;
  }

  if (!isAuthenticated) {
    toast.error(labels.loginRequired);
    return;
  }

  if (!fullName || !phone || !city || !street || !houseNumber) {
    toast.error(labels.missingFields);
    return;
  }

  if (!isValidILPhone(phone)) {
    toast.error(labels.invalidPhone);
    return;
  }

  if (email.trim() && !isValidEmail(email)) {
    toast.error(labels.invalidEmail);
    return;
  }

  setIsPlacingOrder(true);
  try {
    // 1) create pending order
    const result: any = await placeOrder({
      fullName,
      phone,
      email,
      city,
      street,
      houseNumber,
      postalCode,
      notes,
    });

    // 2) get orderId (support both possible shapes)
    const orderId =
      result?.order?.id || result?.orderId || result?.id || result?._id;

    if (!orderId) {
      throw new Error("Missing orderId from placeOrder()");
    }

    // 3) start payment and redirect to Tranzila
    const paymentUrl = await startPayment(orderId);
    window.location.href = paymentUrl;
  } catch (err: any) {
    toast.error(err?.message || "שגיאה בהתחלת תשלום");
  } finally {
    setIsPlacingOrder(false);
  }
};


  const handleClearCart = () => {
    clearCart();
  };

  const handleChangeInput = (key: string, value: string, fallback: number) => {
    const parsed = parseInt(value, 10);
    setEditQuantities((prev) => ({
      ...prev,
      [key]: isNaN(parsed) || parsed <= 0 ? fallback : parsed,
    }));
  };

  const handleBlurInput = async (
    productId: string,
    optionIndex: number,
    key: string,
    currentQuantity: number
  ) => {
    const newQty = editQuantities[key] ?? currentQuantity;
    if (newQty === currentQuantity) return;

    setUpdatingKey(key);
    try {
      await updateQuantity(productId, optionIndex, newQty);
    } finally {
      setUpdatingKey(null);
    }
  };

  const handleIncrement = async (
    productId: string,
    optionIndex: number,
    currentQuantity: number
  ) => {
    const key = getKey(productId, optionIndex);
    if (updatingKey === key) return;

    const newQty = currentQuantity + 1;
    setEditQuantities((prev) => ({ ...prev, [key]: newQty }));
    setUpdatingKey(key);
    try {
      await updateQuantity(productId, optionIndex, newQty);
    } finally {
      setUpdatingKey(null);
    }
  };

  const handleDecrement = async (
    productId: string,
    optionIndex: number,
    currentQuantity: number
  ) => {
    const key = getKey(productId, optionIndex);
    if (updatingKey === key) return;

    const newQty = Math.max(1, currentQuantity - 1);
    setEditQuantities((prev) => ({ ...prev, [key]: newQty }));
    setUpdatingKey(key);
    try {
      await updateQuantity(productId, optionIndex, newQty);
    } finally {
      setUpdatingKey(null);
    }
  };

  if (cart.length === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center py-12"
        dir="rtl"
        lang={isArabic ? "ar" : "he"}
      >
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 mx-auto mb-6 text-muted-foreground" />
          <h2 className="text-3xl font-bold mb-4">{labels.emptyTitle}</h2>
          <p className="text-muted-foreground mb-8">{labels.emptyBody}</p>
          <Link to="/products">
            <Button
              size="lg"
              className="gradient-primary text-white shadow-premium"
            >
              {labels.startShopping}
              <ArrowLeft className="mr-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12" dir="rtl" lang={isArabic ? "ar" : "he"}>
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-black mb-8">
          {labels.cartTitle}{" "}
          <span className="text-gradient-primary">{labels.cartHighlight}</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const key = getKey(item.productId, item.optionIndex);
              const isUpdating = updatingKey === key;
              const displayQty =
                editQuantities[key] !== undefined
                  ? editQuantities[key]
                  : item.quantity;

              const noteValue = editNotes[key] ?? (item.itemNote || "");
              const isSavingNote = savingNoteKey === key;

              return (
                <Card key={key} className="p-6 shadow-card">
                  {/* ✅ responsive row (no shrinking on mobile) */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-24 h-24 object-cover rounded-lg"
                    />

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg mb-1">
                        {item.productName}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {item.optionName}
                      </p>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 border rounded-lg">
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isUpdating}
                            onClick={() =>
                              handleDecrement(
                                item.productId,
                                item.optionIndex,
                                item.quantity
                              )
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>

                          <Input
                            type="number"
                            min={1}
                            value={displayQty}
                            disabled={isUpdating}
                            onChange={(e) =>
                              handleChangeInput(
                                key,
                                e.target.value,
                                item.quantity
                              )
                            }
                            onBlur={() =>
                              handleBlurInput(
                                item.productId,
                                item.optionIndex,
                                key,
                                item.quantity
                              )
                            }
                            className="w-16 text-center border-0"
                            dir="ltr"
                          />

                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isUpdating}
                            onClick={() =>
                              handleIncrement(
                                item.productId,
                                item.optionIndex,
                                item.quantity
                              )
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isUpdating}
                          onClick={() =>
                            removeFromCart(item.productId, item.optionIndex)
                          }
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* ✅ price box: full width on mobile, side on desktop */}
                    <div className="w-full md:w-auto md:text-left flex md:block justify-between md:justify-start">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          {labels.unitPrice}
                        </div>
                        <div className="font-bold text-primary">
                          ₪{item.priceWithoutMaam}
                        </div>
                      </div>

                      <div className="text-right md:text-left">
                        <div className="text-sm text-muted-foreground mt-0 md:mt-3">
                          {labels.total}
                        </div>
                        <div className="font-bold text-xl">
                          ₪{(item.priceWithoutMaam * displayQty).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ✅ note section under (full width) */}
                  <div className="mt-4 space-y-2">
                    <Textarea
                      placeholder={labels.notePlaceholder}
                      value={noteValue}
                      onChange={(e) =>
                        setEditNotes((prev) => ({
                          ...prev,
                          [key]: e.target.value,
                        }))
                      }
                    />

                    <Button
                      size="sm"
                      className="w-full md:w-auto"
                      disabled={isSavingNote}
                      onClick={() =>
                        handleSaveNote(
                          item.productId,
                          item.optionIndex,
                          key,
                          item.itemNote || ""
                        )
                      }
                    >
                      {isSavingNote ? labels.saving : labels.saveNote}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Summary + checkout form */}
          <div className="lg:col-span-1">
            {/* ✅ sticky only on large screens */}
            <Card className="p-6 shadow-premium lg:sticky lg:top-24">
              <h2 className="text-2xl font-bold mb-6">{labels.orderSummary}</h2>

              <div className="space-y-3 mb-6">
                <div className="border-t pt-3 flex justify-between text-xl font-bold">
                  <span>{labels.totalToPay}</span>
                  <span className="text-2xl text-primary">
                    ₪{totalWithoutMaam.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout details form */}
              <div className="space-y-3 mb-6">
                <h3 className="text-lg font-semibold">{labels.shippingDetails}</h3>

                <Input
                  placeholder={labels.fullName}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="text-right placeholder:text-right"
                />

              <Input
  placeholder={labels.phone}
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  onBlur={() => phone && !isValidILPhone(phone) && toast.error(labels.invalidPhone)}
  dir="ltr"
  className="text-right placeholder:text-right"
/>


            <Input
  placeholder={labels.email}
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  onBlur={() => email.trim() && !isValidEmail(email) && toast.error(labels.invalidEmail)}
  dir="ltr"
  className="text-right placeholder:text-right"
/>


                <Input
                  placeholder={labels.city}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="text-right placeholder:text-right"
                />

                <Input
                  placeholder={labels.street}
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="text-right placeholder:text-right"
                />

                <Input
                  placeholder={labels.houseNumber}
                  value={houseNumber}
                  onChange={(e) => setHouseNumber(e.target.value)}
                  dir="ltr"
                  className="text-right placeholder:text-right"
                />

                <Input
                  placeholder={labels.postalCode}
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  dir="ltr"
                  className="text-right placeholder:text-right"
                />

                <Textarea
                  placeholder={labels.orderNotes}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="text-right placeholder:text-right"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 rounded-lg border p-3">
  <input
    id="agree"
    type="checkbox"
    checked={agreedToTerms}
    onChange={(e) => setAgreedToTerms(e.target.checked)}
    className="mt-1 h-4 w-4"
  />

  <label htmlFor="agree" className="text-sm leading-6">
    {labels.agreeToTerms}{" "}
    <Link to="/terms" className="text-primary underline underline-offset-4">
      {labels.terms}
    </Link>
  </label>
</div>

                {isAuthenticated ? (
                 <Button
  size="lg"
  onClick={handleCheckout}
  disabled={isPlacingOrder || !agreedToTerms}
  className="w-full gradient-primary text-white shadow-premium"
>
  {isPlacingOrder ? labels.redirecting : labels.proceedToPay}
</Button>

                ) : (
                  <Link to="/login" className="block">
                    <Button
                      size="lg"
                      className="w-full gradient-primary text-white shadow-premium"
                    >
                      {labels.loginToCheckout}
                    </Button>
                  </Link>
                )}

                <Link to="/products" className="block">
                  <Button variant="outline" size="lg" className="w-full">
                    {labels.continueShopping}
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleClearCart}
                  className="w-full border-destructive text-destructive hover:bg-destructive/10"
                >
                  {labels.clearCart}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  {labels.cancelPolicy}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
