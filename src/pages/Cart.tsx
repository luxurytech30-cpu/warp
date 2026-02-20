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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
  const [payOpen, setPayOpen] = useState(false);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

  const { isArabic } = useLanguage();
  const isAuthenticated = !!user;

  const labels = isArabic
    ? {
        noteSaved: "تم حفظ الملاحظة",
        loginRequired: "يجب تسجيل الدخول لإتمام الطلب",
        missingFieldsBase: "يرجى تعبئة الاسم الكامل والهاتف",
        missingAddress: "يرجى تعبئة العنوان (المدينة، الشارع، رقم المنزل) للشحن",
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
        shippingDetails: "تفاصيل الطلب",
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

        // ✅ Delivery
        deliveryTitle: "طريقة الاستلام",
        pickup: "استلام من المتجر في الباقه الغربيه مع تنسيق مسبق (₪0)",
        shipHome: "شحن للبيت (₪40)",
        subtotal: "المجموع الفرعي",
        shippingFee: "الشحن",
      }
    : {
        noteSaved: "ההערה נשמרה",
        loginRequired: "יש להתחבר כדי להשלים את ההזמנה",
        missingFieldsBase: "נא למלא שם מלא וטלפון",
        missingAddress: "נא למלא כתובת (עיר, רחוב, מספר בית) למשלוח",
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
        shippingDetails: "פרטי הזמנה",
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

        // ✅ Delivery
        deliveryTitle: "שיטת קבלה",
        pickup: "איסוף מהחנות בבאקה אל-גרבייה בתיאום מראש (₪0)",
        shipHome: "משלוח עד הבית (₪40)",
        subtotal: "סכום ביניים",
        shippingFee: "משלוח",
      };

  const API_URL = import.meta.env.VITE_API_URL;

  // ✅ NEW: delivery method + shipping fee
  const SHIPPING_FEE = 40;
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "shipping">("pickup");

  const subtotal = getTotalWithoutMaam();
  const shippingFee = deliveryMethod === "shipping" ? SHIPPING_FEE : 0;
  const totalToPay = subtotal + shippingFee;

  // which item is being updated (for disabling + / - / input)
  const [updatingKey, setUpdatingKey] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // local quantities for the inputs
  const [editQuantities, setEditQuantities] = useState<Record<string, number>>({});

  const getKey = (productId: string, optionIndex: number) => `${productId}-${optionIndex}`;

  const normalizePhone = (value: string) => value.replace(/[^\d+]/g, "").trim();

  const isValidILPhone = (value: string) => {
    const p = normalizePhone(value);
    if (/^05\d{8}$/.test(p)) return true; // 05XXXXXXXX
    if (/^\+9725\d{8}$/.test(p)) return true; // +9725XXXXXXXX
    if (/^9725\d{8}$/.test(p)) return true; // 9725XXXXXXXX
    return false;
  };

  const isValidEmail = (value: string) => {
    const v = value.trim();
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

  // per-item image file (local before upload)
  const [editImages, setEditImages] = useState<Record<string, File | null>>({});
  const [imagePublicIds, setImagePublicIds] = useState<Record<string, string>>({});

  // per-item uploaded image url (what you send to backend / store in cart)
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});

  // uploading spinner
  const [uploadingImageKey, setUploadingImageKey] = useState<string | null>(null);

  const MAX_IMAGE_MB = 8;

  const isImageFileOk = (file: File) => {
    if (!file.type.startsWith("image/")) return false;
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) return false;
    return true;
  };

  const getUploadSignature = async () => {
    const token = localStorage.getItem("token");

    const r = await fetch(`${API_URL}/upload/signature/cart`, {
      method: "POST",
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    });

    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data?.message || `Failed (${r.status})`);
    return data;
  };

  const uploadItemImage = async (file: File) => {
    const sig = await getUploadSignature();

    const form = new FormData();
    form.append("file", file);
    form.append("api_key", sig.apiKey);
    form.append("timestamp", String(sig.timestamp));
    form.append("signature", sig.signature);
    form.append("folder", sig.folder);

    const cloudUrl = `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`;

    const r = await fetch(cloudUrl, { method: "POST", body: form });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data?.error?.message || "Cloudinary upload failed");

    return { url: data.secure_url as string, publicId: data.public_id as string };
  };

  const handleUploadImage = async (key: string) => {
    const file = editImages[key];
    if (!file) return;

    if (!isImageFileOk(file)) {
      toast.error(isArabic ? "الملف ليس صورة أو حجمه كبير" : "הקובץ לא תמונה או גדול מדי");
      return;
    }

    setUploadingImageKey(key);
    try {
      const { url, publicId } = await uploadItemImage(file);
      setImageUrls((prev) => ({ ...prev, [key]: url }));
      setImagePublicIds((prev) => ({ ...prev, [key]: publicId }));
      toast.success(isArabic ? "تم رفع الصورة" : "התמונה הועלתה");
    } catch (e: any) {
      toast.error(e?.message || (isArabic ? "فشل رفع الصورة" : "העלאת התמונה נכשלה"));
    } finally {
      setUploadingImageKey(null);
    }
  };

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

  // ✅ UPDATED: validation + hide address on pickup + send deliveryMethod/shippingFee
  const handleCheckout = async () => {
    if (!agreedToTerms) return toast.error(labels.mustAgree);
    if (!isAuthenticated) return toast.error(labels.loginRequired);

    // base required
    if (!fullName || !phone) return toast.error(labels.missingFieldsBase);
    if (!isValidILPhone(phone)) return toast.error(labels.invalidPhone);
    if (email.trim() && !isValidEmail(email)) return toast.error(labels.invalidEmail);

    // address only when shipping
    if (deliveryMethod === "shipping") {
      if (!city || !street || !houseNumber) return toast.error(labels.missingAddress);
    }

    setIsPlacingOrder(true);
    try {
      const itemsMeta = cart.map((item) => {
        const key = getKey(item.productId, item.optionIndex);
        return {
          productId: item.productId,
          optionIndex: item.optionIndex,
          note: (editNotes[key] ?? item.itemNote ?? "").trim(),
          imageUrl: imageUrls[key] || item.itemImageUrl || "",
          publicId: imagePublicIds[key] ?? "",
        };
      });

      const { order, iframeUrl } = await placeOrder({
        fullName,
        phone,
        email,
        // ✅ if pickup -> send empty address
        city: deliveryMethod === "shipping" ? city : "",
        street: deliveryMethod === "shipping" ? street : "",
        houseNumber: deliveryMethod === "shipping" ? houseNumber : "",
        postalCode: deliveryMethod === "shipping" ? postalCode : "",
        notes,
        itemsMeta,

        // ✅ NEW (requires types/backend updates too)
        deliveryMethod,
        shippingFee,
      } as any);

      if (!order?.id) throw new Error("Missing orderId");
      if (!iframeUrl) throw new Error("Missing iframeUrl");

      setCurrentOrderId(order.id);
      setIframeUrl(iframeUrl);
      setPayOpen(true);
    } catch (e: any) {
      toast.error(e.message || "Payment failed");
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
      <div className="min-h-screen flex items-center justify-center py-12" dir="rtl" lang={isArabic ? "ar" : "he"}>
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 mx-auto mb-6 text-muted-foreground" />
          <h2 className="text-3xl font-bold mb-4">{labels.emptyTitle}</h2>
          <p className="text-muted-foreground mb-8">{labels.emptyBody}</p>
          <Link to="/products">
            <Button size="lg" className="gradient-primary text-white shadow-premium">
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
          {labels.cartTitle} <span className="text-gradient-primary">{labels.cartHighlight}</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const key = getKey(item.productId, item.optionIndex);
              const isUpdating = updatingKey === key;
              const displayQty = editQuantities[key] !== undefined ? editQuantities[key] : item.quantity;

              const noteValue = editNotes[key] ?? (item.itemNote || "");
              const isSavingNote = savingNoteKey === key;

              return (
                <Card key={key} className="p-6 shadow-card">
                  <div className="flex flex-col md:flex-row gap-4">
                    <img src={item.image} alt={item.productName} className="w-24 h-24 object-cover rounded-lg" />

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg mb-1">{item.productName}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{item.optionName}</p>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 border rounded-lg">
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isUpdating}
                            onClick={() => handleDecrement(item.productId, item.optionIndex, item.quantity)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>

                          <Input
                            type="number"
                            min={1}
                            value={displayQty}
                            disabled={isUpdating}
                            onChange={(e) => handleChangeInput(key, e.target.value, item.quantity)}
                            onBlur={() => handleBlurInput(item.productId, item.optionIndex, key, item.quantity)}
                            className="w-16 text-center border-0"
                            dir="ltr"
                          />

                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isUpdating}
                            onClick={() => handleIncrement(item.productId, item.optionIndex, item.quantity)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isUpdating}
                          onClick={() => removeFromCart(item.productId, item.optionIndex)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="w-full md:w-auto md:text-left flex md:block justify-between md:justify-start">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">{labels.unitPrice}</div>
                        <div className="font-bold text-primary">₪{item.priceWithoutMaam}</div>
                      </div>

                      <div className="text-right md:text-left">
                        <div className="text-sm text-muted-foreground mt-0 md:mt-3">{labels.total}</div>
                        <div className="font-bold text-xl">₪{(item.priceWithoutMaam * displayQty).toFixed(2)}</div>
                      </div>
                    </div>
                  </div>

                  {/* note */}
                  <div className="mt-4 space-y-2">
                    <Textarea
                      placeholder={labels.notePlaceholder}
                      value={noteValue}
                      onChange={(e) => setEditNotes((prev) => ({ ...prev, [key]: e.target.value }))}
                    />

                    <Button
                      size="sm"
                      className="w-full md:w-auto"
                      disabled={isSavingNote}
                      onClick={() => handleSaveNote(item.productId, item.optionIndex, key, item.itemNote || "")}
                    >
                      {isSavingNote ? labels.saving : labels.saveNote}
                    </Button>
                  </div>

                  {/* image upload */}
                  <div className="mt-2 space-y-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0] || null;
                        setEditImages((prev) => ({ ...prev, [key]: f }));
                      }}
                    />

                    {editImages[key] && (
                      <img
                        src={URL.createObjectURL(editImages[key] as File)}
                        alt="preview"
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                    )}

                    {imageUrls[key] && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">{isArabic ? "تم حفظ الصورة:" : "תמונה נשמרה:"}</span>{" "}
                        <a className="text-primary underline" href={imageUrls[key]} target="_blank" rel="noreferrer">
                          {isArabic ? "عرض" : "צפייה"}
                        </a>
                      </div>
                    )}

                    <Button
                      size="sm"
                      className="w-full md:w-auto"
                      disabled={uploadingImageKey === key || !editImages[key]}
                      onClick={() => handleUploadImage(key)}
                    >
                      {uploadingImageKey === key ? (isArabic ? "جارٍ الرفع..." : "מעלה...") : isArabic ? "رفع صورة" : "העלה תמונה"}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Summary + checkout form */}
          <div className="lg:col-span-1">
            <Card className="p-6 shadow-premium lg:sticky lg:top-24">
              <h2 className="text-2xl font-bold mb-6">{labels.orderSummary}</h2>

              {/* Delivery options */}
              <div className="space-y-2 mb-4">
                <h3 className="text-lg font-semibold">{labels.deliveryTitle}</h3>

                <label className="flex items-center gap-2 border rounded-lg p-3 cursor-pointer">
                  <input
                    type="radio"
                    name="delivery"
                    value="pickup"
                    checked={deliveryMethod === "pickup"}
                    onChange={() => setDeliveryMethod("pickup")}
                  />
                  <span>{labels.pickup}</span>
                </label>

                <label className="flex items-center gap-2 border rounded-lg p-3 cursor-pointer">
                  <input
                    type="radio"
                    name="delivery"
                    value="shipping"
                    checked={deliveryMethod === "shipping"}
                    onChange={() => setDeliveryMethod("shipping")}
                  />
                  <span>{labels.shipHome}</span>
                </label>
              </div>

              {/* totals */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>{labels.subtotal}</span>
                  <span>₪{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>{labels.shippingFee}</span>
                  <span>₪{shippingFee.toFixed(2)}</span>
                </div>

                <div className="border-t pt-3 flex justify-between text-xl font-bold">
                  <span>{labels.totalToPay}</span>
                  <span className="text-2xl text-primary">₪{totalToPay.toFixed(2)}</span>
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

                {/* ✅ HIDE address fields when pickup */}
                {deliveryMethod === "shipping" && (
                  <>
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
                  </>
                )}

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
                    <Button size="lg" className="w-full gradient-primary text-white shadow-premium">
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

                <p className="text-xs text-muted-foreground text-center">{labels.cancelPolicy}</p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Dialog
        open={payOpen}
        onOpenChange={(o) => {
          setPayOpen(o);
          if (!o) setIframeUrl(null);
        }}
      >
        <DialogContent className="sm:max-w-2xl w-[95vw] h-[80vh] p-0 overflow-hidden">
          <DialogHeader className="px-4 pt-4">
            <DialogTitle className="text-center text-xl font-bold">Tranzila — תשלום מאובטח</DialogTitle>
          </DialogHeader>

          <div className="flex items-center justify-between gap-2 px-4 pb-2">
            <Button
              variant="secondary"
              className="text-xs"
              onClick={() => iframeUrl && window.open(iframeUrl, "_blank", "noopener")}
              disabled={!iframeUrl}
            >
              פתיחה בדף מלא
            </Button>
          </div>

          <div className="w-full h-[calc(80vh-110px)]">
            {iframeUrl ? (
              <iframe
                src={iframeUrl}
                title="Tranzila Payment"
                className="w-full h-full"
                style={{ border: "none" }}
                allow="payment"
              />
            ) : (
              <div className="w-full h-full grid place-items-center">טוען…</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cart;