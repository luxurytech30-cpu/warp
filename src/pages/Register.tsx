import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { registerRequest } from "@/lib/api";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { isArabic } = useLanguage();
  const navigate = useNavigate();
  const labels = isArabic
    ? {
        passwordMismatch: "كلمتا المرور غير متطابقتين",
        registerSuccess: "تم إنشاء الحساب بنجاح! يمكنك تسجيل الدخول الآن.",
        registerFailed: "حدث خطأ أثناء التسجيل، حاول لاحقًا.",
        title: "إنشاء حساب",
        subtitle: "أنشئ حسابًا جديدًا",
        username: "اسم المستخدم",
        usernamePlaceholder: "أدخل اسم المستخدم",
        password: "كلمة المرور",
        passwordPlaceholder: "أدخل كلمة المرور",
        confirmPassword: "تأكيد كلمة المرور",
        confirmPasswordPlaceholder: "أعد إدخال كلمة المرور",
        submit: "تسجيل",
        submitting: "جارٍ التسجيل...",
        haveAccount: "لديك حساب بالفعل؟",
        login: "تسجيل الدخول",
      }
    : {
        passwordMismatch: "הסיסמאות אינן תואמות",
        registerSuccess: "החשבון נוצר בהצלחה! ניתן להתחבר כעת.",
        registerFailed: "אירעה שגיאה בעת ההרשמה, נסה שוב מאוחר יותר.",
        title: "הרשמה",
        subtitle: "צור חשבון חדש",
        username: "שם משתמש",
        usernamePlaceholder: "הזן שם משתמש",
        password: "סיסמה",
        passwordPlaceholder: "הזן סיסמה",
        confirmPassword: "אימות סיסמה",
        confirmPasswordPlaceholder: "הזן את הסיסמה שוב",
        submit: "הרשם",
        submitting: "נרשמים...",
        haveAccount: "יש לך חשבון כבר?",
        login: "התחברות",
      };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error(labels.passwordMismatch);
      return;
    }

    try {
      setLoading(true);
      await registerRequest(username, password, "customer");

      toast.success(labels.registerSuccess);
      navigate("/login");
    } catch (err: any) {
      console.error("REGISTER FAILED:", err);
      const message =
        err?.response?.data?.message || labels.registerFailed;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-muted py-12 px-4"
      dir="rtl"
      lang={isArabic ? "ar" : "he"}
    >
      <Card className="w-full max-w-md p-8 shadow-premium">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-black mb-2">{labels.title}</h1>
          <p className="text-muted-foreground">{labels.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">{labels.username}</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={labels.usernamePlaceholder}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{labels.password}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={labels.passwordPlaceholder}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{labels.confirmPassword}</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={labels.confirmPasswordPlaceholder}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full gradient-primary text-white shadow-premium"
            disabled={loading}
          >
            {loading ? labels.submitting : labels.submit}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {labels.haveAccount}{" "}
          <button
            type="button"
            className="text-primary underline"
            onClick={() => navigate("/login")}
          >
            {labels.login}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Register;
