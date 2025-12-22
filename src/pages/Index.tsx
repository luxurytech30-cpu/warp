import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Shield, Truck, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { getProducts } from "@/lib/api";
import type { Product } from "@/types";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProducts(); // fetch from backend
        setProducts(data);
      } catch (err) {
        console.error("Failed to load products:", err);
        setError("حدث خطأ أثناء تحميل المنتجات");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const topProducts = products.filter((p) => p.isTop);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero text-white py-24 min-h-[70vh] flex items-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-16 h-64 w-64 rounded-full bg-primary/35 blur-3xl" />
          <div className="absolute right-6 top-10 h-48 w-48 rounded-full bg-accent/30 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
        </div>

        <div className="container relative mx-auto px-4">
          <div className="max-w-3xl space-y-6 animate-fade-slide-up">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur">
              <Sparkles className="h-4 w-4" />
              <span>إطلاق جديد — هدايا مخصصة لكِ</span>
            </p>
            <h1 className="text-5xl md:text-6xl font-black leading-tight drop-shadow-lg">
              Perfect Wrap
              <br />
              <span className="text-gradient-gold">هدايا راقية بلمسة شخصية</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              أكواب، حقائب، وإكسسوارات تحمل اسمك أو رسالة خاصة. صُممت لتكون هدية فاخرة، أنيقة، وأنثوية تلائم كل مناسبة.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products">
                <Button
                  size="lg"
                  className="gradient-primary text-white shadow-premium text-lg px-8 py-6 h-auto animate-soft-glow"
                >
                  اكتشفي المنتجات
                  <ArrowLeft className="mr-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 backdrop-blur border-white text-white hover:bg-white hover:text-foreground text-lg px-8 py-6 h-auto"
                >
                  تحدثي معنا
                </Button>
              </Link>
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
              <h3 className="text-xl font-bold mb-2">تصميمات مخصصة</h3>
              <p className="text-muted-foreground">اطبعي اسمك أو رسالتك على كل قطعة</p>
            </Card>

            <Card className="p-8 text-center shadow-card hover:shadow-premium transition-shadow">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-gold flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">جودة فاخرة</h3>
              <p className="text-muted-foreground">مواد مختارة بعناية وتغليف أنيق</p>
            </Card>

            <Card className="p-8 text-center shadow-card hover:shadow-premium transition-shadow">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">شحن سريع</h3>
              <p className="text-muted-foreground">إلى بابك مع تحديثات لحظية للحالة</p>
            </Card>

            <Card className="p-8 text-center shadow-card hover:shadow-premium transition-shadow">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-gold flex items-center justify-center">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">تغليف ساحر</h3>
              <p className="text-muted-foreground">علب وشرايط حريرية جاهزة للإهداء</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Top Products Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-4">
            منتجات <span className="text-gradient-gold">مميزة</span>
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12">
            مختارات أنيقة تم تنسيقها لعشاق اللمسات الشخصية
          </p>

          {loading && (
            <p className="text-center text-muted-foreground">يتم تحميل المنتجات...</p>
          )}

          {error && !loading && (
            <p className="text-center text-destructive">{error}</p>
          )}

          {!loading && !error && topProducts.length === 0 && (
            <p className="text-center text-muted-foreground">
              لم يتم تحديد منتجات مميزة بعد.
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
                              <span className="text-sm text-muted-foreground mr-1">
                                بدون ضريبة
                              </span>
                            </div>
                            <Button
                              variant="outline"
                              className="hover:gradient-primary hover:text-white"
                            >
                              التفاصيل
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
                    تصفح كل المنتجات
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
            جاهزة لتبهري من تحبين؟
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            اختاري التصميم، أضيفي الاسم أو الرسالة، واتركي لنا مهمة إعداد التغليف الفاخر والشحن السريع.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/products">
              <Button
                size="lg"
                className="bg-white text-foreground hover:bg-white/90 shadow-card text-lg px-8 py-6 h-auto"
              >
                ابدئي التسوق
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                className="bg-white text-foreground hover:bg-white/90 shadow-card text-lg px-8 py-6 h-auto"
              >
                تحدثي مع خبيرة
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
