import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Sparkles, Shield, Truck, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import heroImg from "@/assets/hero.jpeg";
import hero2 from "@/assets/hero2.jpeg"
import { useLanguage } from "@/contexts/LanguageContext";

import { getProducts } from "@/lib/api";
import type { Product } from "@/types";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isArabic } = useLanguage();
  function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" }); // or "smooth"
  }, [pathname]);

  return null;
}
  const labels = isArabic
    ? {
        loadError: "حدث خطأ أثناء تحميل المنتجات",
        heroBadge: "إطلاق جديد — هدايا مخصصة لكِ",
        heroHeadline: "هدايا راقية بلمسة شخصية",
        heroCopy:
          "اكتشف مجموعتنا الحصرية من الهدايا المطبوعة بعناية فائقة، المصممة خصيصًا لتضفي لمسة من الأناقة والتميّز على جميع مناسباتك الخاصة. اجعل لحظاتك أكثر جمالًا بهدايا تعبّر عن ذوقك الرفيع وتبقى ذكرى لا تُنسى.",
        discoverProducts: "اكتشف المنتجات",
        talkToUs: "تحدث معنا",
        featureCustomTitle: "تصميمات مخصصة",
        featureCustomBody: "اطبع اسمك أو رسالتك على كل قطعة",
        featureQualityTitle: "جودة فاخرة",
        featureQualityBody: "مواد مختارة بعناية وتغليف أنيق",
        featureShippingTitle: "شحن سريع",
        featureShippingBody: "إلى بابك مع تحديثات لحظية للحالة",
        featureWrapTitle: "تغليف ساحر",
        featureWrapBody: "علب وشرايط حريرية جاهزة للإهداء",
        topTitle: "منتجات",
        topHighlight: "مميزة",
        topSubtitle: "مختارات أنيقة تم تنسيقها لعشاق اللمسات الشخصية",
        loading: "يتم تحميل المنتجات...",
        noTop: "لم يتم تحديد منتجات مميزة بعد.",
        details: "التفاصيل",
        browseAll: "تصفح كل المنتجات",
        ctaTitle: "جاهز لتبهر من تحب؟",
        ctaBody:
          "اختار التصميم، أضيفي الاسم أو الرسالة، واترك لنا مهمة إعداد التغليف الفاخر والشحن السريع.",
        ctaShop: "ابدئ التسوق",
        ctaExpert: "تحدث مع خبيرة",
        titleName:"بيرفكت راب"
      }
    : {
        loadError: "אירעה שגיאה בעת טעינת המוצרים",
        heroBadge: "השקה חדשה — מתנות מותאמות עבורך",
        heroHeadline: "מתנות יוקרתיות בנגיעה אישית",
        heroCopy:
          "גלו את הקולקציה הבלעדית שלנו של מתנות מודפסות בקפידה, מעוצבות במיוחד כדי להוסיף נגיעה של אלגנטיות וייחוד לכל האירועים המיוחדים שלכם. הפכו את הרגעים שלכם ליפים יותר עם מתנות שמבטאות את הטעם שלכם ונשארות זיכרון שלא נשכח.",
        discoverProducts: "גלו את המוצרים",
        talkToUs: "דברו איתנו",
        featureCustomTitle: "עיצובים מותאמים אישית",
        featureCustomBody: "הדפיסו את שמכם או המסר שלכם על כל פריט",
        featureQualityTitle: "איכות יוקרתית",
        featureQualityBody: "חומרים שנבחרו בקפידה ואריזה אלגנטית",
        featureShippingTitle: "משלוח מהיר",
        featureShippingBody: "עד הבית עם עדכונים בזמן אמת",
        featureWrapTitle: "אריזה קסומה",
        featureWrapBody: "קופסאות וסרטי משי מוכנים למתנה",
        topTitle: "מוצרים",
        topHighlight: "מובחרים",
        topSubtitle: "בחירות אלגנטיות שתואמו לחובבי הנגיעה האישית",
        loading: "טוענים מוצרים...",
        noTop: "לא נבחרו עדיין מוצרים מובחרים.",
        details: "פרטים",
        browseAll: "עיינו בכל המוצרים",
        ctaTitle: "מוכנים להדהים את מי שאתם אוהבים?",
        ctaBody:
          "בחרו את העיצוב, הוסיפו שם או מסר, והשאירו לנו את המשימה להכין את האריזה היוקרתית והמשלוח המהיר.",
        ctaShop: "התחילו לקנות",
        ctaExpert: "דברו עם מומחית",
        titleName:"פרפקט ראב"
      };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProducts(); // fetch from backend
        setProducts(data);
      } catch (err) {
        console.error("Failed to load products:", err);
        setError(labels.loadError);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const topProducts = products.filter((p) => p.isTop);

  return (
    <div className="min-h-screen">
      {/* local animation (no separate files) */}
      <style>{`
        @keyframes pw-float-slow {
          0%, 100% { transform: translateY(0) scale(1.08); }
          50% { transform: translateY(-14px) scale(1.08); }
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-24 min-h-[70vh] flex items-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-16 h-64 w-64 rounded-full bg-primary/35 blur-3xl" />
          <div className="absolute right-6 top-10 h-48 w-48 rounded-full bg-accent/30 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
        </div>

        <div className="container relative mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: text */}
            <div className="order-2 lg:order-1 max-w-3xl space-y-6 animate-fade-slide-up text-primary">
              <p className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-4 py-2 text-sm backdrop-blur border border-primary/20">
                <Sparkles className="h-4 w-4" />
                <span>{labels.heroBadge}</span>
              </p>

              <h1 className="text-5xl md:text-6xl font-black leading-tight drop-shadow-lg">
                {labels.titleName}
                <br />
                <span className="bg-gradient-to-l from-primary via-accent to-primary bg-clip-text text-transparent">
                  {labels.heroHeadline}
                </span>
              </h1>

              <p className="text-lg md:text-xl text-black">
                     {labels.heroCopy}
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/products">
                  <Button
                    size="lg"
                    className="gradient-primary text-white shadow-premium text-lg px-8 py-6 h-auto animate-soft-glow"
                  >
                    {labels.discoverProducts}
                    <ArrowLeft className="mr-2 h-5 w-5" />
                  </Button>
                </Link>

                <Link to="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-primary/10 backdrop-blur border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg px-8 py-6 h-auto"
                  >
                    {labels.talkToUs}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right: moving image (slow up/down) + fixed border/frame OVER it */}
         <div className="relative order-1 lg:order-2 flex justify-center">
  <div className="absolute -inset-10 rounded-full bg-primary/25 blur-3xl" />

  <div className="relative w-72 md:w-80 lg:w-96 aspect-square">
    <div className="relative h-full w-full overflow-hidden rounded-[28px] bg-white/10 backdrop-blur shadow-premium">
      <img
        src={hero2}
        alt="Perfect Wrap"
        className="h-full w-full object-contain will-change-transform  motion-reduce:transform-none"
        style={{ animation: "pw-float-slow 9s ease-in-out infinite" }}
      />
    </div>

    <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-4 ring-white/70 shadow-[0_0_0_1px_rgba(255,255,255,0.25)]" />
  </div>
</div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <Card className="p-8 text-center shadow-card hover:shadow-premium transition-shadow">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{labels.featureCustomTitle}</h3>
              <p className="text-muted-foreground">
                {labels.featureCustomBody}
              </p>
            </Card>

            <Card className="p-8 text-center shadow-card hover:shadow-premium transition-shadow">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-gold flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{labels.featureQualityTitle}</h3>
              <p className="text-muted-foreground">
                {labels.featureQualityBody}
              </p>
            </Card>

            <Card className="p-8 text-center shadow-card hover:shadow-premium transition-shadow">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{labels.featureShippingTitle}</h3>
              <p className="text-muted-foreground">
                {labels.featureShippingBody}
              </p>
            </Card>

            <Card className="p-8 text-center shadow-card hover:shadow-premium transition-shadow">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-gold flex items-center justify-center">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{labels.featureWrapTitle}</h3>
              <p className="text-muted-foreground">
                {labels.featureWrapBody}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Top Products Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-4">
            {labels.topTitle} <span className="text-gradient-gold">{labels.topHighlight}</span>
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12">
            {labels.topSubtitle}
          </p>

          {loading && (
            <p className="text-center text-muted-foreground">
              {labels.loading}
            </p>
          )}

          {error && !loading && (
            <p className="text-center text-destructive">{error}</p>
          )}

          {!loading && !error && topProducts.length === 0 && (
            <p className="text-center text-muted-foreground">
              {labels.noTop}
            </p>
          )}

          {!loading && !error && topProducts.length > 0 && (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {topProducts.map((product) => {
                  const firstOption = product.options[0];
                  const price =
                    firstOption.salePriceWithoutMaam ??
                    firstOption.priceWithoutMaam;

                  return (
                    <Link key={product._id} to={`/products/${product._id}`}>
                      <Card className="overflow-hidden shadow-card hover:shadow-premium transition-all hover:-translate-y-2 h-full">
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-6">
                          <div className="text-xs text-primary font-semibold mb-2">
                            {typeof product.category === "string"
                              ? product.category
                              : product.category?.name}
                          </div>
                          <h3 className="text-xl font-bold mb-2">
                            {product.name}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-2xl font-bold text-primary">
                                ₪{price}
                              </span>
                              
                            </div>
                            <Button
                              variant="outline"
                              className="hover:gradient-primary hover:text-white"
                            >
                              {labels.details}
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>

              <div className="text-center mt-12">
                <Link to="/products">
                  <Button
                    size="lg"
                    className="gradient-primary text-white shadow-premium px-8"
                  >
                    {labels.browseAll}
                    <ArrowLeft className="mr-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 gradient-hero relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            {labels.ctaTitle}
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {labels.ctaBody}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/products">
              <Button
                size="lg"
                className="bg-white text-foreground hover:bg-white/90 shadow-card text-lg px-8 py-6 h-auto"
              >
                {labels.ctaShop}
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                className="bg-white text-foreground hover:bg-white/90 shadow-card text-lg px-8 py-6 h-auto"
              >
                {labels.ctaExpert}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
