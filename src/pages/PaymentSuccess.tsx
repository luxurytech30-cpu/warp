import { useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { loadCart } = useCart();
  const syncedRef = useRef(false);
  const { isArabic } = useLanguage();
  const labels = isArabic
    ? {
        title: "تم الدفع بنجاح",
        orderNumber: "رقم الطلب:",
        viewOrders: "عرض طلباتك",
      }
    : {
        title: "התשלום בוצע בהצלחה",
        orderNumber: "מספר הזמנה:",
        viewOrders: "הצג את ההזמנות שלך",
      };

  useEffect(() => {
    if (window.self !== window.top) {
      window.parent.postMessage(
        {
          type: "tranzila:payment-success",
          orderId,
        },
        window.location.origin
      );
      return;
    }

    if (syncedRef.current) return;
    syncedRef.current = true;
    void loadCart();
  }, [orderId, loadCart]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="p-8 text-center space-y-4">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
        <h1 className="text-2xl font-bold">{labels.title}</h1>
        {orderId && (
          <p className="text-muted-foreground">
            {labels.orderNumber} <span className="font-mono">{orderId}</span>
          </p>
        )}
        <Link to="/profile">
          <Button className="mt-4">{labels.viewOrders}</Button>
        </Link>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
