import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { toast } from "sonner";
import { sendContactMessage } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import PerfectWrapSocialNav from "@/components/socialLinks";

const Contact = () => {
  const { isArabic } = useLanguage();
  const labels = isArabic
    ? {
        success: "تم إرسال الرسالة بنجاح! سنعود إليك قريبًا.",
        error: "فشل إرسال الرسالة. حاول مرة أخرى.",
        title: "تواصل",
        titleHighlight: "معنا",
        subtitle: "هل لديك سؤال؟ تريد استشارة؟ نحن هنا من أجلك",
        phoneTitle: "الهاتف",
        phoneBody: "يمكنك الاتصال بنا",
        emailTitle: "البريد الإلكتروني",
        emailBody: "أرسل لنا رسالة",
        formTitle: "أرسل لنا رسالة",
        fullName: "الاسم الكامل *",
        fullNamePlaceholder: "اكتب اسمك الكامل",
        email: "البريد الإلكتروني *",
        phone: "الهاتف",
        subject: "الموضوع *",
        subjectPlaceholder: "كيف يمكننا مساعدتك؟",
        message: "الرسالة *",
        messagePlaceholder: "اكتب تفاصيل رسالتك...",
        send: "إرسال الرسالة",
        consultTitle: "تحتاج استشارة؟",
        consultBody:
          "فريقنا جاهز لمساعدتك مجانًا في اختيار الهدية أو التصميم المناسب. تواصل معنا الآن واحصل على توصيات سريعة.",
        callNow: "اتصل الآن:",
      }
    : {
        success: "ההודעה נשלחה בהצלחה! נחזור אליך בקרוב.",
        error: "שליחת ההודעה נכשלה. נסו שוב.",
        title: "צור",
        titleHighlight: "קשר",
        subtitle: "יש לך שאלה? רוצה ייעוץ? אנחנו כאן בשבילך",
        phoneTitle: "טלפון",
        phoneBody: "אפשר ליצור קשר",
        emailTitle: "דוא\"ל",
        emailBody: "שלחו לנו הודעה",
        formTitle: "שלחו לנו הודעה",
        fullName: "שם מלא *",
        fullNamePlaceholder: "כתבו את שמכם המלא",
        email: "דוא\"ל *",
        phone: "טלפון",
        subject: "נושא *",
        subjectPlaceholder: "איך נוכל לעזור לך?",
        message: "הודעה *",
        messagePlaceholder: "כתבו את פרטי ההודעה...",
        send: "שליחת ההודעה",
        consultTitle: "צריך ייעוץ?",
        consultBody:
          "הצוות שלנו מוכן לעזור לך בחינם בבחירת המתנה או העיצוב המתאים. דברו איתנו עכשיו וקבלו המלצות מהירות.",
        callNow: "התקשרו עכשיו:",
      };
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await sendContactMessage(formData);

      toast.success(labels.success);

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast.error(labels.error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen py-12" dir="rtl" lang={isArabic ? "ar" : "he"}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            {labels.title} <span className="text-gradient-primary">{labels.titleHighlight}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {labels.subtitle}
          </p>
        </div>
  <div
  className="aa relative z-[9999] pointer-events-auto flex justify-center w-full mb-10"
  style={{ marginTop: "-40px" }}
>
  <div className="mx-auto px-4">
    <PerfectWrapSocialNav />
  </div>
</div>
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Info Cards */}
          <Card className="p-8 shadow-card hover:shadow-premium transition-shadow text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center">
              <Phone className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">{labels.phoneTitle}</h3>
            <p className="text-muted-foreground mb-3">{labels.phoneBody}</p>
            <a
              href="tel:050-601-6901"
              className="text-primary font-semibold text-lg hover:underline"
              dir="ltr"
            >
              050-601-6901
            </a>
          </Card>

          <Card className="p-8 shadow-card hover:shadow-premium transition-shadow text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-gold flex items-center justify-center">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">{labels.emailTitle}</h3>
            <p className="text-muted-foreground mb-3">{labels.emailBody}</p>
            <a
              href="mailto:info@building-premium.co.il"
              className="text-primary font-semibold hover:underline"
              dir="ltr"
            >
             Perfectwrap2022@gmail.com
            </a>
          </Card>

          {/*<Card className="p-8 shadow-card hover:shadow-premium transition-shadow text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">العنوان</h3>
            <p className="text-muted-foreground mb-3">زورينا</p>
            <p className="font-semibold">شارع 123، تل أبيب</p>
          </Card>*/}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="p-8 shadow-premium">
            <h2 className="text-3xl font-black mb-6">{labels.formTitle}</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">{labels.fullName}</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={labels.fullNamePlaceholder}
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{labels.email}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{labels.phone}</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="050-1234567"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">{labels.subject}</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder={labels.subjectPlaceholder}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">{labels.message}</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={labels.messagePlaceholder}
                  rows={6}
                  required
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full gradient-primary text-white shadow-premium"
              >
                <Send className="ml-2 h-5 w-5" />
                {labels.send}
              </Button>
            </form>
          </Card>

          {/* Additional Info */}
          <div className="space-y-8">
            {/*<Card className="p-8 shadow-card">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">ساعات العمل</h3>
                  <div className="space-y-2 text-muted-foreground">
                    <p>
                      <strong>الأحد - الخميس:</strong> 07:00 - 18:00
                    </p>
                    <p>
                      <strong>الجمعة:</strong> 07:00 - 14:00
                    </p>
                    <p>
                      <strong>السبت:</strong> مغلق
                    </p>
                  </div>
                </div>
              </div>
            </Card>*/}

            <Card className="p-8 gradient-hero text-white shadow-premium">
              <h3 className="text-2xl font-bold mb-4">{labels.consultTitle}</h3>
              <p className="mb-6 leading-relaxed">
                {labels.consultBody}
              </p>
              <Button
                size="lg"
                className="w-full bg-white text-foreground hover:bg-white/90"
              >
                <Phone className="ml-2 h-5 w-5" />
                {labels.callNow} <span className="ml-2" dir="ltr">050-601-6901</span>
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
