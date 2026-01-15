import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";

import { Search, SlidersHorizontal } from "lucide-react";

import { getProducts } from "@/lib/api";
import { Product } from "@/types";

const Products = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(true);
  const { isArabic } = useLanguage();
  const labels = isArabic
    ? {
        loading: "يتم تحميل المنتجات...",
        error: "حدث خطأ أثناء تحميل المنتجات",
        title: "تسوق مجموعة ",
        subtitle: "منتجات مخصصة بأسماء ورسائل شخصية، مع تغليف فاخر وشحن سريع.",
        searchPlaceholder: "ابحث عن منتج...",
        show: "إظهار",
        hide: "إخفاء",
        filter: "التصفية",
        categories: "الفئات",
        clearAll: "مسح الكل",
        results: (count: number) => `تم العثور على ${count} منتج`,
        featured: "منتج مميز",
        details: "التفاصيل",
        noResultsTitle: "لا توجد نتائج",
        noResultsBody: "جربي كلمات بحث مختلفة أو اختاري فئة أخرى",
      }
    : {
        loading: "טוענים מוצרים...",
        error: "אירעה שגיאה בעת טעינת המוצרים",
        title: "קנו את קולקציית ",
        subtitle: "מוצרים מותאמים עם שמות והודעות אישיות, עם אריזה יוקרתית ומשלוח מהיר.",
        searchPlaceholder: "חפשו מוצר...",
        show: "הצג",
        hide: "הסתר",
        filter: "סינון",
        categories: "קטגוריות",
        clearAll: "נקה הכל",
        results: (count: number) => `נמצאו ${count} מוצרים`,
        featured: "מוצר מובחר",
        details: "פרטים",
        noResultsTitle: "לא נמצאו תוצאות",
        noResultsBody: "נסו מילות חיפוש שונות או בחרו קטגוריה אחרת",
      };

  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  // category names from populated category objects
  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category.name))),
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category.name);

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategories]);

  const toggleCategory = (categoryName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {labels.loading}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {labels.error}
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-black mb-4">
            {labels.title} <span className="text-gradient-primary">Perfect Wrap</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {labels.subtitle}
          </p>
        </div>

        {/* Search and Filter Toggle */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={labels.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {showFilters ? labels.hide : labels.show} {labels.filter}
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <aside className="lg:w-64 space-y-6">
              <Card className="p-6 shadow-card">
                <h3 className="font-bold text-lg mb-4">{labels.categories}</h3>
                <div className="space-y-3">
                  {categories.map((categoryName) => (
                    <div key={categoryName} className="flex items-center gap-2">
                      <Checkbox
                        id={categoryName}
                        checked={selectedCategories.includes(categoryName)}
                        onCheckedChange={() => toggleCategory(categoryName)}
                      />
                      <Label
                        htmlFor={categoryName}
                        className="cursor-pointer text-sm"
                      >
                        {categoryName}
                      </Label>
                    </div>
                  ))}
                </div>
                {selectedCategories.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCategories([])}
                    className="w-full mt-4"
                  >
                    {labels.clearAll}
                  </Button>
                )}
              </Card>
            </aside>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-6 text-sm text-muted-foreground">
              {labels.results(filteredProducts.length)}
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Link key={product._id} to={`/products/${product._id}`}>
                  <Card className="overflow-hidden shadow-card hover:shadow-premium transition-all hover:-translate-y-2 h-full">
                    <div className="aspect-square overflow-hidden relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                      {product.isTop && (
                        <div className="absolute top-4 left-4 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-bold shadow-gold">
                          {labels.featured}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="text-xs text-primary font-semibold mb-2">
                        {product.category.name}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-primary">
                            ₪
                            {product.options[0].salePriceWithoutMaam ??
                              product.options[0].priceWithoutMaam}
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
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-2xl font-bold text-muted-foreground mb-2">
                  {labels.noResultsTitle}
                </p>
                <p className="text-muted-foreground">
                  {labels.noResultsBody}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
