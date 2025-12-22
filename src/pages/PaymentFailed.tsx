import { useSearchParams, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="p-8 text-center space-y-4">
        <XCircle className="h-16 w-16 text-red-500 mx-auto" />
        <h1 className="text-2xl font-bold">فشل الدفع</h1>
        {orderId && (
          <p className="text-muted-foreground">
            لم يتم تحصيل الطلب رقم <span className="font-mono">{orderId}</span>.
          </p>
        )}
        <div className="flex flex-wrap gap-2 justify-center">
          <Link to="/cart">
            <Button>حاولي مجددًا</Button>
          </Link>
          <Link to="/products">
            <Button variant="outline">عودة للتسوق</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default PaymentFailed;
