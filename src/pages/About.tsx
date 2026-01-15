import { Card } from '@/components/ui/card';
import { Award, Users, Truck, Shield, Target, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const About = () => {
  const { isArabic } = useLanguage();
  const labels = isArabic
    ? {
        heroTitle: "عن",
        heroBody:
          "علامة  متخصصة في الهدايا المخصصة، تجمع بين الطباعة الفاخرة والتغليف الراقي لتصنعي لحظات لا تُنسى.",
        statYears: "سنوات من الإبداع",
        statGifts: "هدية شخصية وصلت لأحبابكم",
        statDesigns: "تصميمات وأنماط جاهزة للتخصيص",
        statSatisfaction: "رضا العملاء وشغفهم",
        storyTitle: "حكايتنا",
        storyP1:
          "بدأت فكرتنا من شغف بسيط: تحويل الصور العادية والتصاميم المبتكرة إلى هدايا ملموسة تحمل قيمة عاطفية حقيقية. أدركنا أن أفضل الهدايا هي تلك التي تتحدث بلسان صاحبها، ولذلك قررنا أن نكون جسرًا بين الفكرة والتطبيق.",
        storyP2:
          "اليوم، Perfect Wrap تضم فريق تصميم، طباعة، وتغليف يعمل بتناغم، ليصلك كل منتج بلمسة  فاخرة وبجودة تُحاكي الهدايا الراقية.",
        storyP3:
          "نختار خاماتنا بعناية، من السيراميك المخملي إلى الأقمشة الناعمة، ونطبع بأحبار صديقة للبيئة، لنقدم لكِ هدية تدوم وتبهر.",
        valuesTitle: "قيمنا",
        valuesHighlight: "الراقية",
        valueQualityTitle: "جودة محسوسة",
        valueQualityBody:
          "كل قطعة تمر باختبارات جودة دقيقة، لنضمن ملمسًا ناعمًا، طباعة حادة، وتغليفًا يحفظ اللمعة.",
        valueServiceTitle: "خدمة شخصية",
        valueServiceBody:
          "نهتم بتفاصيلك: من اختيار الخط المناسب لاسمك، حتى اقتراح ألوان التغليف التي تعبر عن المناسبة.",
        valueSpeedTitle: "سرعة بتأنق",
        valueSpeedBody:
          "نجهز طلبك بسرعة دون أن نفقد التفاصيل الدقيقة أو اللمسة اللامعة على كل عبوة.",
        valueTrustTitle: "موثوقية",
        valueTrustBody:
          "نفي بالوعد: تصميمك كما تخيلته، شحنك في موعده، وتغليف يحافظ على فخامة الهدية.",
        valueCraftTitle: "إتقان حرفي",
        valueCraftBody:
          "فريق التصميم والطباعة لدينا مدرَّب على أدق التفاصيل لتخرج القطعة متوازنة وأنيقة.",
        valueInnovationTitle: "ابتكار",
        valueInnovationBody:
          "نتابع أحدث التقنيات في الطباعة والمواد المستدامة لنقدم لكِ تصاميم جديدة ولمسات ساحرة.",
        missionTitle: "رسالتنا",
        missionHighlight: "إليكِ",
        missionBody:
          "اجعل هديتكِ تتحدث عنكِ—باسمكِ ولمستكِ الخاصة، لتبقى ذكرى لا تُنسى.",
      }
    : {
        heroTitle: "על",
        heroBody:
          "מותג המתמחה במתנות מותאמות, שמשלב הדפסה יוקרתית ואריזה אלגנטית כדי ליצור רגעים בלתי נשכחים.",
        statYears: "שנות יצירה",
        statGifts: "מתנות אישיות שהגיעו לאהובים שלכם",
        statDesigns: "עיצובים ותבניות מוכנים להתאמה",
        statSatisfaction: "שביעות רצון הלקוחות והתשוקה שלהם",
        storyTitle: "הסיפור שלנו",
        storyP1:
          "הרעיון שלנו התחיל מתשוקה פשוטה: להפוך תמונות רגילות ועיצובים חדשניים למתנות מוחשיות עם ערך רגשי אמיתי. הבנו שהמתנות הטובות ביותר הן אלו שמדברות בשמו של בעליהן, ולכן החלטנו להיות הגשר בין הרעיון לבין הביצוע.",
        storyP2:
          "היום, Perfect Wrap כוללת צוות עיצוב, הדפסה ואריזה שעובדים בהרמוניה, כדי שכל מוצר יגיע אליכם בנגיעה יוקרתית ובאיכות שמזכירה מתנות יוקרה.",
        storyP3:
          "אנו בוחרים את חומרי הגלם שלנו בקפידה, מקרמיקה קטיפתית ועד בדים רכים, ומדפיסים בדיו ידידותיים לסביבה כדי להעניק לכם מתנה שמחזיקה ומרשימה.",
        valuesTitle: "הערכים",
        valuesHighlight: "שלנו",
        valueQualityTitle: "איכות מורגשת",
        valueQualityBody:
          "כל פריט עובר בדיקות איכות מדויקות כדי להבטיח תחושה רכה, הדפס חד ואריזה ששומרת על הברק.",
        valueServiceTitle: "שירות אישי",
        valueServiceBody:
          "אכפת לנו מהפרטים שלך: מבחירת הפונט המתאים לשמך ועד הצעת צבעי אריזה שמתאימים לאירוע.",
        valueSpeedTitle: "מהירות בסטייל",
        valueSpeedBody:
          "אנו מכינים את ההזמנה במהירות בלי לאבד את הפרטים או את הברק שעל כל אריזה.",
        valueTrustTitle: "אמינות",
        valueTrustBody:
          "אנחנו עומדים בהבטחה: העיצוב כפי שדמיינת, המשלוח בזמן, ואריזה ששומרת על יוקרת המתנה.",
        valueCraftTitle: "דיוק מקצועי",
        valueCraftBody:
          "צוות העיצוב וההדפסה שלנו מיומן בפרטים הקטנים כדי שהפריט יצא מאוזן ואלגנטי.",
        valueInnovationTitle: "חדשנות",
        valueInnovationBody:
          "אנחנו עוקבים אחר הטכנולוגיות החדשות בהדפסה ובחומרים ברי־קיימא כדי להציע עיצובים חדשים ונגיעות קסומות.",
        missionTitle: "המסר שלנו",
        missionHighlight: "אליכם",
        missionBody:
          "הפכו את המתנה שלכם לדבר בשמכם—עם שמכם והנגיעה האישית שלכם, כדי שתישאר זיכרון שלא נשכח.",
      };
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            {labels.heroTitle} <span className="text-gradient-primary">Perfect Wrap</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {labels.heroBody}
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-20">
          <Card className="p-8 text-center shadow-card hover:shadow-premium transition-shadow">
            <div className="text-4xl font-black text-primary mb-2">8+</div>
            <div className="text-muted-foreground">{labels.statYears}</div>
          </Card>
          <Card className="p-8 text-center shadow-card hover:shadow-premium transition-shadow">
            <div className="text-4xl font-black text-primary mb-2">40K+</div>
            <div className="text-muted-foreground">{labels.statGifts}</div>
          </Card>
          <Card className="p-8 text-center shadow-card hover:shadow-premium transition-shadow">
            <div className="text-4xl font-black text-primary mb-2">500+</div>
            <div className="text-muted-foreground">{labels.statDesigns}</div>
          </Card>
          <Card className="p-8 text-center shadow-card hover:shadow-premium transition-shadow">
            <div className="text-4xl font-black text-primary mb-2">99%</div>
            <div className="text-muted-foreground">{labels.statSatisfaction}</div>
          </Card>
        </div>

        {/* Story Section */}
        <section className="mb-20">
          <Card className="p-12 shadow-premium gradient-hero text-white">
            <h2 className="text-3xl font-black mb-6">{labels.storyTitle}</h2>
            <div className="space-y-4 text-lg leading-relaxed">
              <p>
{labels.storyP1}
              </p>
              <p>
                {labels.storyP2}
              </p>
              <p>
                {labels.storyP3}
              </p>
            </div>
          </Card>
        </section>

        {/* Values Section */}
        <section className="mb-20">
          <h2 className="text-4xl font-black text-center mb-12">
            {labels.valuesTitle} <span className="text-gradient-gold"> {labels.valuesHighlight}</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 shadow-card hover:shadow-premium transition-all hover:-translate-y-2">
              <div className="w-16 h-16 mb-4 rounded-full gradient-primary flex items-center justify-center">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{labels.valueQualityTitle}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {labels.valueQualityBody}
              </p>
            </Card>

            <Card className="p-8 shadow-card hover:shadow-premium transition-all hover:-translate-y-2">
              <div className="w-16 h-16 mb-4 rounded-full gradient-gold flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{labels.valueServiceTitle}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {labels.valueServiceBody}
              </p>
            </Card>

            <Card className="p-8 shadow-card hover:shadow-premium transition-all hover:-translate-y-2">
              <div className="w-16 h-16 mb-4 rounded-full gradient-primary flex items-center justify-center">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{labels.valueSpeedTitle}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {labels.valueSpeedBody}
              </p>
            </Card>

            <Card className="p-8 shadow-card hover:shadow-premium transition-all hover:-translate-y-2">
              <div className="w-16 h-16 mb-4 rounded-full gradient-gold flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{labels.valueTrustTitle}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {labels.valueTrustBody}
              </p>
            </Card>

            <Card className="p-8 shadow-card hover:shadow-premium transition-all hover:-translate-y-2">
              <div className="w-16 h-16 mb-4 rounded-full gradient-primary flex items-center justify-center">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{labels.valueCraftTitle}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {labels.valueCraftBody}
              </p>
            </Card>

            <Card className="p-8 shadow-card hover:shadow-premium transition-all hover:-translate-y-2">
              <div className="w-16 h-16 mb-4 rounded-full gradient-gold flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{labels.valueInnovationTitle}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {labels.valueInnovationBody}
              </p>
            </Card>
          </div>
        </section>

        {/* Mission Section */}
        <section>
          <Card className="p-12 shadow-premium bg-muted">
            <h2 className="text-3xl font-black text-center mb-6">
              {labels.missionTitle} <span className="text-gradient-primary">{labels.missionHighlight}</span>
            </h2>
            <p className="text-xl text-center text-muted-foreground max-w-4xl mx-auto leading-relaxed">
{labels.missionBody}            </p>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default About;
