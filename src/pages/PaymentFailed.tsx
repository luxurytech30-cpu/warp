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
        <h1 className="text-2xl font-bold">התשלום נכשל</h1>
        {orderId && (
          <p className="text-muted-foreground">
            הזמנה מספר <span className="font-mono">{orderId}</span> לא חויבה.
          </p>
        )}
        <div className="space-x-2">
          <Link to="/cart">
            <Button>נסה שוב</Button>
          </Link>
          <Link to="/products">
            <Button variant="outline">חזרה לקניות</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default PaymentFailed;
