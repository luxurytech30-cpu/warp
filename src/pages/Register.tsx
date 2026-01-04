import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { registerRequest } from "@/lib/api";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("كلمتا المرور غير متطابقتين");
      return;
    }

    try {
      setLoading(true);
      await registerRequest(username, password, "customer");

      toast.success("تم إنشاء الحساب بنجاح! يمكنك تسجيل الدخول الآن.");
      navigate("/login");
    } catch (err: any) {
      console.error("REGISTER FAILED:", err);
      const message =
        err?.response?.data?.message || "حدث خطأ أثناء التسجيل، حاول لاحقًا.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-muted py-12 px-4"
      dir="rtl"
      lang="ar"
    >
      <Card className="w-full max-w-md p-8 shadow-premium">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-black mb-2">إنشاء حساب</h1>
          <p className="text-muted-foreground">أنشئ حسابًا جديدًا</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">اسم المستخدم</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="أدخل اسم المستخدم"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="أدخل كلمة المرور"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="أعد إدخال كلمة المرور"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full gradient-primary text-white shadow-premium"
            disabled={loading}
          >
            {loading ? "جارٍ التسجيل..." : "تسجيل"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          لديك حساب بالفعل؟{" "}
          <button
            type="button"
            className="text-primary underline"
            onClick={() => navigate("/login")}
          >
            تسجيل الدخول
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Register;
