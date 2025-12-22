import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Shield, Truck, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import heroImg from "@/assets/hero-construction.jpg";

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
        setError("שגיאה בטעינת המוצרים");
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
      <section className="relative h-[80vh] min-h-[600px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-l from-foreground/80 via-foreground/60 to-transparent" />
        </div>

        <div className="container relative h-full mx-auto px-4 flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight animate-fade-in">
              חומרי בניין
              <br />
              <span className="text-gradient-gold">איכותיים</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
              מגוון עצום של מוצרי בנייה ושיפוצים באיכות פרימיום. מחירים מיוחדים למקצוענים ולבעלי מלאכה.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products">
                <Button
                  size="lg"
                  className="gradient-primary text-white shadow-premium text-lg px-8 py-6 h-auto"
                >
                  לקטלוג המוצרים
                  <ArrowLeft className="mr-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 backdrop-blur border-white text-white hover:bg-white hover:text-foreground text-lg px-8 py-6 h-auto"
                >
                  צור קשר
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
              <h3 className="text-xl font-bold mb-2">איכות פרימיום</h3>
              <p className="text-muted-foreground">מוצרים מהשורה הראשונה בלבד</p>
            </Card>

            <Card className="p-8 text-center shadow-card hover:shadow-premium transition-shadow">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-gold flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">אחריות מלאה</h3>
              <p className="text-muted-foreground">כל המוצרים באחריות יבואן רשמי</p>
            </Card>

            <Card className="p-8 text-center shadow-card hover:shadow-premium transition-shadow">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">משלוחים מהירים</h3>
              <p className="text-muted-foreground">אספקה לכל הארץ תוך 48 שעות</p>
            </Card>

            <Card className="p-8 text-center shadow-card hover:shadow-premium transition-shadow">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-gold flex items-center justify-center">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">מחירים מיוחדים</h3>
              <p className="text-muted-foreground">הנחות למקצוענים ורוכשים קבועים</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Top Products Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-4">
            מוצרים <span className="text-gradient-gold">מובילים</span>
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12">
            המוצרים הנמכרים והמבוקשים ביותר
          </p>

          {loading && (
            <p className="text-center text-muted-foreground">טוען מוצרים...</p>
          )}

          {error && !loading && (
            <p className="text-center text-destructive">{error}</p>
          )}

          {!loading && !error && topProducts.length === 0 && (
            <p className="text-center text-muted-foreground">
              עדיין לא סומנו מוצרים מובילים.
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
                                ללא מע״מ
                              </span>
                            </div>
                            <Button
                              variant="outline"
                              className="hover:gradient-primary hover:text-white"
                            >
                              פרטים
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
                    לכל המוצרים
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
            מוכנים להתחיל את הפרויקט שלכם?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            צוות המומחים שלנו כאן לעזור לכם לבחור את חומרי הבניין המושלמים לכל פרויקט
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/products">
              <Button
                size="lg"
                className="bg-white text-foreground hover:bg-white/90 shadow-card text-lg px-8 py-6 h-auto"
              >
                התחל לקנות
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                className="bg-white text-foreground hover:bg-white/90 shadow-card text-lg px-8 py-6 h-auto"
              >
                דבר עם מומחה
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
