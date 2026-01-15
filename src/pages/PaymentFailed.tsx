import { useSearchParams, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { isArabic } = useLanguage();
  const labels = isArabic
    ? {
        title: "فشل الدفع",
        orderNotCharged: (id: string) => `لم يتم تحصيل الطلب رقم ${id}.`,
        retry: "حاول مجددًا",
        backToShopping: "عودة للتسوق",
      }
    : {
        title: "התשלום נכשל",
        orderNotCharged: (id: string) => `ההזמנה מספר ${id} לא חויבה.`,
        retry: "נסה שוב",
        backToShopping: "חזרה לקניות",
      };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="p-8 text-center space-y-4">
        <XCircle className="h-16 w-16 text-red-500 mx-auto" />
        <h1 className="text-2xl font-bold">{labels.title}</h1>
        {orderId && (
          <p className="text-muted-foreground">
            {labels.orderNotCharged(orderId)}
          </p>
        )}
        <div className="flex flex-wrap gap-2 justify-center">
          <Link to="/cart">
            <Button>{labels.retry}</Button>
          </Link>
          <Link to="/products">
            <Button variant="outline">{labels.backToShopping}</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default PaymentFailed;
