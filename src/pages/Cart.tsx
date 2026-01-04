// src/pages/Cart.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
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
  const isAuthenticated = !!user;

  const totalWithoutMaam = getTotalWithoutMaam();
  
  

  // which item is being updated (for disabling + / - / input)
  const [updatingKey, setUpdatingKey] = useState<string | null>(null);

  // local quantities for the inputs
  const [editQuantities, setEditQuantities] = useState<Record<string, number>>(
    {}
  );

  const getKey = (productId: string, optionIndex: number) =>
    `${productId}-${optionIndex}`;

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
    toast.success("تم حفظ الملاحظة");
  } finally {
    setSavingNoteKey(null);
  }
};
 

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error("يجب تسجيل الدخول لإتمام الطلب");
      return;
    }

    if (!fullName || !phone || !city || !street || !houseNumber) {
      toast.error("يرجى تعبئة الاسم الكامل، الهاتف، والعنوان (المدينة، الشارع، رقم المنزل)");
      return;
    }

    setIsPlacingOrder(true);
    try {
      await placeOrder({
        fullName,
        phone,
        email,
        city,
        street,
        houseNumber,
        postalCode,
        notes,
      });
      // إذا أردت: يمكن تفريغ الحقول بعد إتمام الطلب
      // setFullName(""); setPhone(""); ...
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
    if (newQty === currentQuantity) return; // nothing to update

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
      <div className="min-h-screen flex items-center justify-center py-12" dir="rtl" lang="ar">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 mx-auto mb-6 text-muted-foreground" />
          <h2 className="text-3xl font-bold mb-4">السلة فارغة</h2>
          <p className="text-muted-foreground mb-8">لم تقوم بإضافة أي منتجات بعد</p>
          <Link to="/products">
            <Button size="lg" className="gradient-primary text-white shadow-premium">
              ابدء التسوق
              <ArrowLeft className="mr-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12" dir="rtl" lang="ar">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-black mb-8">
          سلة <span className="text-gradient-primary">التسوق</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const key = getKey(item.productId, item.optionIndex);
              const isUpdating = updatingKey === key;
              const displayQty =
                editQuantities[key] !== undefined ? editQuantities[key] : item.quantity;
                // ✅ ADD THESE TWO LINES HERE
  const noteValue = editNotes[key] ?? (item.itemNote || "");
  const isSavingNote = savingNoteKey === key;
              return (
                <Card key={key} className="p-6 shadow-card">
                  <div className="flex gap-6">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-24 h-24 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{item.productName}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{item.optionName}</p>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 border rounded-lg">
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isUpdating}
                            onClick={() =>
                              handleDecrement(item.productId, item.optionIndex, item.quantity)
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>

                          <Input
                            type="number"
                            min={1}
                            value={displayQty}
                            disabled={isUpdating}
                            onChange={(e) => handleChangeInput(key, e.target.value, item.quantity)}
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
                              handleIncrement(item.productId, item.optionIndex, item.quantity)
                            }
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

                    {/* price box */}
                    <div className="text-left">
                      <div className="text-sm text-muted-foreground mb-1">سعر القطعة</div>
                      <div className="font-bold text-primary">₪{item.priceWithoutMaam}</div>

                      <div className="text-sm text-muted-foreground mt-3">المجموع</div>
                      <div className="font-bold text-xl">
                        ₪{(item.priceWithoutMaam * displayQty).toFixed(2)}
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
  <Textarea
    placeholder="ملاحظة لهذا المنتج (مثال: اكتب الاسم للطباعة)"
    value={noteValue}
    onChange={(e) =>
      setEditNotes((prev) => ({ ...prev, [key]: e.target.value }))
    }
  />

  <Button
    size="sm"
    disabled={isSavingNote}
    onClick={() => handleSaveNote(item.productId, item.optionIndex, key, item.itemNote || "")}
  >
    {isSavingNote ? "جارٍ الحفظ..." : "حفظ الملاحظة"}
  </Button>
</div>


                  </div>
                </Card>
              );
            })}
          </div>

          {/* Summary + checkout form */}
          <div className="lg:col-span-1">
            <Card className="p-6 shadow-premium sticky top-24">
              <h2 className="text-2xl font-bold mb-6">ملخص الطلب</h2>

              <div className="space-y-3 mb-6">
                

                <div className="border-t pt-3 flex justify-between text-xl font-bold">
                  <span>الإجمالي للدفع:</span>
                  <span className="text-2xl text-primary">₪{totalWithoutMaam.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout details form */}
              <div className="space-y-3 mb-6">
                <h3 className="text-lg font-semibold">تفاصيل الشحن</h3>

                <Input
                  placeholder="الاسم الكامل *"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <Input
                  placeholder="الهاتف *"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  dir="ltr"
                />
                <Input
                  placeholder="البريد الإلكتروني (اختياري)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  dir="ltr"
                />
                <Input
                  placeholder="المدينة *"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <Input
                  placeholder="الشارع *"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                />
                <Input
                  placeholder="رقم المنزل *"
                  value={houseNumber}
                  onChange={(e) => setHouseNumber(e.target.value)}
                  dir="ltr"
                />
                <Input
                  placeholder="الرمز البريدي (اختياري)"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  dir="ltr"
                />
                <Textarea
                  placeholder="ملاحظات على الطلب (اختياري)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                {isAuthenticated ? (
                  <Button
                    size="lg"
                    onClick={handleCheckout}
                    disabled={isPlacingOrder}
                    className="w-full gradient-primary text-white shadow-premium"
                  >
                    {isPlacingOrder ? "جاري تحويلك لصفحة الدفع..." : "متابعة للدفع"}
                  </Button>
                ) : (
                  <Link to="/login" className="block">
                    <Button size="lg" className="w-full gradient-primary text-white shadow-premium">
                      سجّلي الدخول لإتمام الطلب
                    </Button>
                  </Link>
                )}

                <Link to="/products" className="block">
                  <Button variant="outline" size="lg" className="w-full">
                    متابعة التسوق
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleClearCart}
                  className="w-full border-destructive text-destructive hover:bg-destructive/10"
                >
                  تفريغ السلة
                </Button>
              </div>

              
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
