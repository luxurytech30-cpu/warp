import { Card } from '@/components/ui/card';
import { Award, Users, Truck, Shield, Target, Sparkles } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            אודות <span className="text-gradient-primary">בניה פרימיום</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            אנחנו מובילים את שוק חומרי הבניין בישראל כבר למעלה מ-25 שנה, ומספקים פתרונות איכותיים למקצוענים ולבעלי מלאכה
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-20">
          <Card className="p-8 text-center shadow-card hover:shadow-premium transition-shadow">
            <div className="text-4xl font-black text-primary mb-2">25+</div>
            <div className="text-muted-foreground">שנות ניסיון</div>
          </Card>
          <Card className="p-8 text-center shadow-card hover:shadow-premium transition-shadow">
            <div className="text-4xl font-black text-primary mb-2">50K+</div>
            <div className="text-muted-foreground">לקוחות מרוצים</div>
          </Card>
          <Card className="p-8 text-center shadow-card hover:shadow-premium transition-shadow">
            <div className="text-4xl font-black text-primary mb-2">10K+</div>
            <div className="text-muted-foreground">מוצרים במלאי</div>
          </Card>
          <Card className="p-8 text-center shadow-card hover:shadow-premium transition-shadow">
            <div className="text-4xl font-black text-primary mb-2">100%</div>
            <div className="text-muted-foreground">שביעות רצון</div>
          </Card>
        </div>

        {/* Story Section */}
        <section className="mb-20">
          <Card className="p-12 shadow-premium gradient-hero text-white">
            <h2 className="text-3xl font-black mb-6">הסיפור שלנו</h2>
            <div className="space-y-4 text-lg leading-relaxed">
              <p>
                בניה פרימיום נוסדה בשנת 1998 מתוך חזון ברור - לספק את חומרי הבניין האיכותיים ביותר בשוק הישראלי. 
                מה שהתחיל כמחסן קטן בפרברי תל אביב, הפך לאחת מרשתות אספקת חומרי הבניין המובילות במדינה.
              </p>
              <p>
                לאורך השנים, בנינו מוניטין של מצוינות ואמינות. אנחנו עובדים רק עם היצרנים והספקים המובילים בעולם,
                ומקפידים על בקרת איכות קפדנית לכל מוצר שנכנס למחסנים שלנו. הצוות המקצועי שלנו מורכב ממומחי בניין 
                ותיקים שיודעים להמליץ על הפתרון המושלם לכל פרויקט.
              </p>
              <p>
                אנחנו מאמינים שכל פרויקט בנייה, קטן כגדול, ראוי לחומרים באיכות הגבוהה ביותר. לכן אנחנו משקיעים 
                באופן מתמיד בהרחבת המלאי, בשיפור השירות, ובאימוץ טכנולוגיות חדשניות שמקלות על תהליך הרכישה.
              </p>
            </div>
          </Card>
        </section>

        {/* Values Section */}
        <section className="mb-20">
          <h2 className="text-4xl font-black text-center mb-12">
            הערכים <span className="text-gradient-gold">שלנו</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 shadow-card hover:shadow-premium transition-all hover:-translate-y-2">
              <div className="w-16 h-16 mb-4 rounded-full gradient-primary flex items-center justify-center">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">איכות מעל הכל</h3>
              <p className="text-muted-foreground leading-relaxed">
                אנחנו מתפשרים על הרבה דברים, אבל לעולם לא על האיכות. כל מוצר שאנחנו מוכרים עובר בקרת איכות קפדנית
                ועומד בתקנים הבינלאומיים המחמירים ביותר.
              </p>
            </Card>

            <Card className="p-8 shadow-card hover:shadow-premium transition-all hover:-translate-y-2">
              <div className="w-16 h-16 mb-4 rounded-full gradient-gold flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">שירות אישי</h3>
              <p className="text-muted-foreground leading-relaxed">
                כל לקוח הוא עולם ומלואו. אנחנו מאמינים ביחס אישי, בהקשבה לצרכים, ובמתן פתרונות מותאמים אישית
                לכל פרויקט ולכל תקציב.
              </p>
            </Card>

            <Card className="p-8 shadow-card hover:shadow-premium transition-all hover:-translate-y-2">
              <div className="w-16 h-16 mb-4 rounded-full gradient-primary flex items-center justify-center">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">אספקה מהירה</h3>
              <p className="text-muted-foreground leading-relaxed">
                זמן זה כסף, במיוחד בפרויקטי בניין. אנחנו מתחייבים לאספקה מהירה ויעילה לכל רחבי הארץ,
                תוך עמידה בלוחות זמנים קשיחים.
              </p>
            </Card>

            <Card className="p-8 shadow-card hover:shadow-premium transition-all hover:-translate-y-2">
              <div className="w-16 h-16 mb-4 rounded-full gradient-gold flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">אמינות</h3>
              <p className="text-muted-foreground leading-relaxed">
                25 שנות פעילות בנו מוניטין של אמינות מוחלטת. הלקוחות שלנו יודעים שהם יכולים לסמוך עלינו
                לספק בדיוק מה שהבטחנו, בדיוק במועד.
              </p>
            </Card>

            <Card className="p-8 shadow-card hover:shadow-premium transition-all hover:-translate-y-2">
              <div className="w-16 h-16 mb-4 rounded-full gradient-primary flex items-center justify-center">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">מקצועיות</h3>
              <p className="text-muted-foreground leading-relaxed">
                הצוות שלנו כולל מומחים ותיקים בתחום הבניין, שיודעים לייעץ ולהדריך בכל שלב של הפרויקט.
                ידע מקצועי זה המפתח להצלחה.
              </p>
            </Card>

            <Card className="p-8 shadow-card hover:shadow-premium transition-all hover:-translate-y-2">
              <div className="w-16 h-16 mb-4 rounded-full gradient-gold flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">חדשנות</h3>
              <p className="text-muted-foreground leading-relaxed">
                אנחנו תמיד צעד אחד קדימה, עוקבים אחר הטכנולוגיות והחומרים החדשניים ביותר,
                ומביאים את הטוב ביותר ללקוחות שלנו.
              </p>
            </Card>
          </div>
        </section>

        {/* Mission Section */}
        <section>
          <Card className="p-12 shadow-premium bg-muted">
            <h2 className="text-3xl font-black text-center mb-6">
              המשימה <span className="text-gradient-primary">שלנו</span>
            </h2>
            <p className="text-xl text-center text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              להיות הכתובת המובילה והאמינה ביותר לחומרי בניין באיכות פרימיום בישראל, תוך מתן שירות יוצא דופן,
              ייעוץ מקצועי, ומחירים הוגנים. אנחנו שואפים לבנות יחסי אמון ארוכי טווח עם כל לקוח, ולהיות שותפים
              מלאים להצלחת כל פרויקט בנייה.
            </p>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default About;
