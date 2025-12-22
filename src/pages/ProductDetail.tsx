import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useCart } from "@/contexts/CartContext";

import {
  ArrowRight,
  ShoppingCart,
  Package,
  Shield,
  Truck,
} from "lucide-react";

import { getProductById } from "@/lib/api";
import { Product, ProductOption } from "@/types";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: () => getProductById(id as string),
    enabled: !!id,
  });

  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isAdding, setIsAdding] = useState(false); // <- NEW

  useEffect(() => {
    if (product && product.options?.length > 0) {
      setSelectedOption(product.options[0].optionName);
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        טוען מוצר...
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">המוצר לא נמצא</h2>
          <Button onClick={() => navigate("/products")}>חזור למוצרים</Button>
        </div>
      </div>
    );
  }

  const selectedOptionData: ProductOption | undefined = product.options.find(
    (o) => o.optionName === selectedOption
  );

  const effectivePrice =
    selectedOptionData?.salePriceWithoutMaam ??
    selectedOptionData?.priceWithoutMaam ??
    0;

  const priceWithMaam = effectivePrice * 1.17;
  const hasDiscount = !!selectedOptionData?.salePriceWithoutMaam;

  const handleAddToCart = async () => {
    if (!selectedOptionData || isAdding) return;

    const optionIndex = product.options.findIndex(
      (o) => o.optionName === selectedOption
    );

    if (optionIndex === -1) {
      toast.error("אפשרות המוצר אינה תקינה");
      return;
    }

    try {
      setIsAdding(true);
      await addToCart({
        productId: product._id,
        productName: product.name,
        optionName: selectedOption,
        optionIndex,
        priceWithoutMaam: effectivePrice,
        image: product.image,
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/products")}
          className="mb-8"
        >
          <ArrowRight className="ml-2 h-4 w-4" />
          חזור למוצרים
        </Button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg shadow-premium">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-3 gradient-primary text-white">
                {product.category.name}
              </Badge>
              <h1 className="text-4xl font-black mb-4">{product.name}</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Options */}
            <Card className="p-6 shadow-card">
              <Label className="text-lg font-bold mb-4 block">
                בחר אפשרות
              </Label>
              <RadioGroup
                value={selectedOption}
                onValueChange={setSelectedOption}
              >
                <div className="space-y-3">
                  {product.options.map((option) => {
                    const price =
                      option.salePriceWithoutMaam || option.priceWithoutMaam;
                    const isOnSale = !!option.salePriceWithoutMaam;

                    return (
                      <div
                        key={option.optionName}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem
                            value={option.optionName}
                            id={option.optionName}
                          />
                          <Label
                            htmlFor={option.optionName}
                            className="cursor-pointer font-medium"
                          >
                            {option.optionName}
                          </Label>
                        </div>
                        <div className="text-left">
                          {isOnSale && (
                            <div className="text-sm text-muted-foreground line-through">
                              ₪{option.priceWithoutMaam}
                            </div>
                          )}
                          <div className="font-bold text-primary">₪{price}</div>
                          <div className="text-xs text-muted-foreground">
                            במלאי: {option.stock}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </RadioGroup>
            </Card>

            {/* Price Summary */}
            <Card className="p-6 gradient-hero text-white shadow-premium">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-lg">
                  <span>מחיר ללא מע״מ:</span>
                  <div className="text-left">
                    {hasDiscount && (
                      <span className="line-through text-white/70 text-sm ml-2">
                        ₪{selectedOptionData?.priceWithoutMaam}
                      </span>
                    )}
                    <span className="font-bold text-2xl">
                      ₪{effectivePrice.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-lg">
                  <span>מע״מ (17%):</span>
                  <span className="font-semibold">
                    ₪{(effectivePrice * 0.17).toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-white/30 pt-3 flex justify-between items-center text-xl font-bold">
                  <span>סה״כ כולל מע״מ:</span>
                  <span className="text-3xl">
                    ₪{priceWithMaam.toFixed(2)}
                  </span>
                </div>
              </div>
            </Card>

            {/* Add to Cart */}
            <Button
              size="lg"
              onClick={handleAddToCart}
              disabled={
                isAdding ||
                !selectedOptionData ||
                selectedOptionData.stock === 0
              }
              className="w-full gradient-primary text-white shadow-premium text-lg py-6 h-auto"
            >
              <ShoppingCart className="ml-2 h-5 w-5" />
              {isAdding ? "מוסיף לעגלה..." : "הוסף לעגלה"}
            </Button>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="text-center">
                <Package className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-sm font-medium">איכות מובטחת</div>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-sm font-medium">אחריות מלאה</div>
              </div>
              <div className="text-center">
                <Truck className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-sm font-medium">משלוח מהיר</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
