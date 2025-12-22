import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import { Search, SlidersHorizontal } from "lucide-react";

import { getProducts } from "@/lib/api";
import { Product } from "@/types";

const Products = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(true);

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
        يتم تحميل المنتجات...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        حدث خطأ أثناء تحميل المنتجات
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-black mb-4">
            تسوقي <span className="text-gradient-primary">مجموعة Perfect Wrap</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            منتجات أنثوية مخصصة بأسماء ورسائل شخصية، مع تغليف فاخر وشحن سريع.
          </p>
        </div>

        {/* Search and Filter Toggle */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="ابحثي عن منتج..."
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
            {showFilters ? "إخفاء" : "إظهار"} التصفية
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <aside className="lg:w-64 space-y-6">
              <Card className="p-6 shadow-card">
                <h3 className="font-bold text-lg mb-4">الفئات</h3>
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
                    مسح الكل
                  </Button>
                )}
              </Card>
            </aside>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-6 text-sm text-muted-foreground">
              تم العثور على {filteredProducts.length} منتج
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
                          منتج مميز
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
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-2xl font-bold text-muted-foreground mb-2">
                  لا توجد نتائج
                </p>
                <p className="text-muted-foreground">
                  جربي كلمات بحث مختلفة أو اختاري فئة أخرى
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
