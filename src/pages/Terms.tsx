import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";

const Terms = () => {
  const { isArabic } = useLanguage();

  const labels = isArabic
    ? {
        title: "شروط الخدمة",
        subtitle: "يرجى قراءة هذه الشروط بعناية قبل استخدام متجر Perfect Wrap.",

        introTitle: "نظرة عامة",
        introBody:
          "باستخدامك للموقع أو إتمام عملية شراء، فإنك توافق على هذه الشروط بالكامل. إذا كنت لا توافق، يرجى عدم استخدام الخدمات.",

        eligibilityTitle: "الأهلية والحساب",
        eligibilityBody:
          "يجب أن تكون لديك الأهلية القانونية لإبرام العقود. أنت مسؤول عن دقة معلومات الحساب والحفاظ على سرية بيانات الدخول.",

        ordersTitle: "الطلبات والدفع",
        ordersBody:
          "قد نرفض أو نلغي أي طلب وفقاً لتقديرنا. يتم تأكيد الطلب بعد استلام الدفع بنجاح وإصدار رسالة تأكيد.",

        pricingTitle: "الأسعار والتوفر",
        pricingBody:
          "نحتفظ بالحق في تعديل الأسعار أو إيقاف المنتجات في أي وقت دون إشعار مسبق. الأسعار تشمل الضرائب إن وُجدت.",

        shippingTitle: "الشحن والتسليم",
        shippingBody:
          "نوضح أوقات التسليم المتوقعة أثناء الدفع. قد تتأثر المواعيد بعوامل خارجية مثل توفر المواد أو مواسم الذروة.",

        returnsTitle: "الاسترجاع والاستبدال",
        returnsBody:
          "إذا وصل المنتج تالفاً أو غير مطابق، يرجى التواصل خلال 7 أيام. قد تُطبق شروط على المنتجات المخصصة حسب الطلب.",

        // ✅ NEW: cancel policy (2 hours)
        cancelTitle: "إلغاء الطلب",
        cancelBody:
          "يمكن إلغاء الطلب خلال ساعتين فقط من وقت إنشائه. بعد مرور ساعتين  لا يمكن الإلغاء.",

        ipTitle: "الملكية الفكرية",
        ipBody:
          "جميع المحتويات والتصاميم والشعارات هي ملك لـ Perfect Wrap. لا يجوز النسخ أو الاستخدام دون إذن كتابي.",

        liabilityTitle: "تحديد المسؤولية",
        liabilityBody:
          "لا نتحمل مسؤولية الأضرار غير المباشرة أو التبعية الناتجة عن استخدام الموقع أو المنتجات بقدر ما يسمح به القانون.",

        privacyTitle: "الخصوصية",
        privacyBody:
          "نحترم خصوصيتك ونتعامل مع بياناتك وفق سياسة الخصوصية الخاصة بنا. استخدامك للخدمة يعني قبول هذه السياسة.",

        changesTitle: "تحديث الشروط",
        changesBody:
          "قد نقوم بتحديث هذه الشروط من وقت لآخر. استمرارك في استخدام الخدمات بعد التحديث يعني موافقتك على النسخة الجديدة.",

        contactTitle: "تواصل معنا",
        contactBody:
          "للاستفسارات حول الشروط، تواصل معنا عبر صفحة التواصل أو البريد الإلكتروني الظاهر في أسفل الموقع.",
      }
    : {
        title: "תנאי שירות",
        subtitle: "אנא קראו תנאים אלה בעיון לפני השימוש בחנות Perfect Wrap.",

        introTitle: "סקירה כללית",
        introBody:
          "בשימוש באתר או בביצוע רכישה אתם מסכימים לתנאים במלואם. אם אינכם מסכימים, אל תשתמשו בשירותים.",

        eligibilityTitle: "כשירות וחשבון",
        eligibilityBody:
          "עליכם להיות בעלי כשירות משפטית להתקשר בהסכמים. אתם אחראים לנכונות פרטי החשבון ולשמירה על סודיות ההתחברות.",

        ordersTitle: "הזמנות ותשלום",
        ordersBody:
          "אנו רשאים לסרב או לבטל הזמנה לפי שיקול דעתנו. הזמנה מאושרת רק לאחר קבלת תשלום והודעת אישור.",

        pricingTitle: "מחירים וזמינות",
        pricingBody:
          "אנו שומרים לעצמנו את הזכות לשנות מחירים או להפסיק מוצרים בכל עת וללא הודעה מוקדמת. המחירים כוללים מס אם נדרש.",

        shippingTitle: "משלוח ואספקה",
        shippingBody:
          "מועדי אספקה משוערים מוצגים בעת התשלום. ייתכנו עיכובים עקב גורמים חיצוניים כמו זמינות חומרים או עומסים.",

        returnsTitle: "החזרות והחלפות",
        returnsBody:
          "אם מוצר הגיע פגום או אינו תואם, אנא פנו אלינו תוך 7 ימים. ייתכנו תנאים מיוחדים למוצרים בהתאמה אישית.",

        // ✅ NEW: cancel policy (2 hours)
        cancelTitle: "ביטול הזמנה",
        cancelBody:
          "ניתן לבטל הזמנה בתוך שעתיים בלבד מרגע יצירתה. לאחר שעתיים  — לא ניתן לבטל.",

        ipTitle: "קניין רוחני",
        ipBody:
          "כל התכנים, העיצובים והלוגואים הם רכוש Perfect Wrap. אין להעתיק או להשתמש ללא אישור בכתב.",

        liabilityTitle: "הגבלת אחריות",
        liabilityBody:
          "איננו אחראים לנזקים עקיפים או תוצאתיים הנובעים מהשימוש באתר או במוצרים, ככל שמותר על פי דין.",

        privacyTitle: "פרטיות",
        privacyBody:
          "אנו מכבדים את פרטיותכם ומטפלים בנתונים בהתאם למדיניות הפרטיות שלנו. שימוש בשירות מהווה הסכמה למדיניות זו.",

        changesTitle: "שינויים בתנאים",
        changesBody:
          "ייתכן שנעדכן את התנאים מעת לעת. המשך שימוש בשירותים לאחר עדכון מהווה הסכמה לגרסה החדשה.",

        contactTitle: "צרו קשר",
        contactBody:
          "לשאלות לגבי התנאים, ניתן לפנות דרך עמוד יצירת הקשר או למייל המופיע בתחתית האתר.",
      };

  return (
    <div className="min-h-screen py-12" dir="rtl" lang={isArabic ? "ar" : "he"}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            {labels.title}{" "}
            <span className="text-gradient-primary">Perfect Wrap</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {labels.subtitle}
          </p>
        </div>

        {/* ✅ Removed the Effective/Updated dates card */}

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="p-8 shadow-card">
            <h2 className="text-2xl font-bold mb-4">{labels.introTitle}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {labels.introBody}
            </p>
          </Card>

          <Card className="p-8 shadow-card">
            <h2 className="text-2xl font-bold mb-4">{labels.ordersTitle}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {labels.ordersBody}
            </p>
          </Card>

          <Card className="p-8 shadow-card">
            <h2 className="text-2xl font-bold mb-4">{labels.pricingTitle}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {labels.pricingBody}
            </p>
          </Card>

          <Card className="p-8 shadow-card">
            <h2 className="text-2xl font-bold mb-4">{labels.shippingTitle}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {labels.shippingBody}
            </p>
          </Card>

          <Card className="p-8 shadow-card">
            <h2 className="text-2xl font-bold mb-4">{labels.returnsTitle}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {labels.returnsBody}
            </p>
          </Card>

          {/* ✅ NEW cancel policy card */}
          <Card className="p-8 shadow-card">
            <h2 className="text-2xl font-bold mb-4">{labels.cancelTitle}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {labels.cancelBody}
            </p>
          </Card>
        </div>

        <Separator className="my-12" />

        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="p-8 shadow-card">
            <h2 className="text-2xl font-bold mb-4">{labels.ipTitle}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {labels.ipBody}
            </p>
          </Card>

          <Card className="p-8 shadow-card">
            <h2 className="text-2xl font-bold mb-4">{labels.liabilityTitle}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {labels.liabilityBody}
            </p>
          </Card>

          <Card className="p-8 shadow-card">
            <h2 className="text-2xl font-bold mb-4">{labels.privacyTitle}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {labels.privacyBody}
            </p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mt-10">
          <Card className="p-8 shadow-premium gradient-hero text-white">
            <h2 className="text-2xl font-bold mb-4">{labels.changesTitle}</h2>
            <p className="leading-relaxed">{labels.changesBody}</p>
          </Card>

          <Card className="p-8 shadow-card">
            <h2 className="text-2xl font-bold mb-4">{labels.contactTitle}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {labels.contactBody}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Terms;
