// src/pages/AdminPage.tsx
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Category, Product, User, Order, CustomerDetails } from "@/types";

import {
  // categories
  getAdminCategories,
  createCategoryRequest,
  updateCategoryRequest,
  deleteCategoryRequest,
  // products
  getAdminProducts,
  createProductRequest,
  updateProductRequest,
  deleteProductRequest,
  // users
  getAllUsers,
  updateUserRoleRequest,
  // orders
  getAllOrdersAdmin,
} from "@/lib/api";

// ✅ helper for Cloudinary signed upload
import { uploadProductImageSigned } from "@/lib/cloudinaryUpload";

type Tab = "categories" | "products" | "users" | "orders";

const AdminPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>("products");
  const { isArabic } = useLanguage();
  const t = (ar: string, he: string) => (isArabic ? ar : he);
 
  return (
    <div className="min-h-screen py-8 px-4" dir="rtl" lang={isArabic ? "ar" : "he"}>
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">{t("لوحة التحكم", "לוח ניהול")}</h1>

        <div className="flex gap-2 flex-wrap">
          <Button
            variant={tab === "categories" ? "default" : "outline"}
            onClick={() => setTab("categories")}
          >
            {t("التصنيفات", "קטגוריות")}
          </Button>
          <Button
            variant={tab === "products" ? "default" : "outline"}
            onClick={() => setTab("products")}
          >
            {t("المنتجات", "מוצרים")}
          </Button>
          <Button
            variant={tab === "users" ? "default" : "outline"}
            onClick={() => setTab("users")}
          >
            {t("المستخدمون", "משתמשים")}
          </Button>
          <Button
            variant={tab === "orders" ? "default" : "outline"}
            onClick={() => setTab("orders")}
          >
            {t("الطلبات", "הזמנות")}
          </Button>
        </div>

        {tab === "categories" && <CategoriesSection />}
        {tab === "products" && <ProductsSection />}
        {tab === "users" && <UsersSection />}
        {tab === "orders" && <OrdersSection />}
      </div>
    </div>
  );
};

export default AdminPage;

//
// 1. Categories – simple CRUD
//

const CategoriesSection: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const { isArabic } = useLanguage();
  const t = (ar: string, he: string) => (isArabic ? ar : he);

  const load = async () => {
    try {
      const data = await getAdminCategories();
      setCategories(data);
    } catch (e) {
      console.error(e);
      toast.error(t("خطأ في تحميل التصنيفات", "שגיאה בטעינת הקטגוריות"));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      await createCategoryRequest(newName.trim());
      setNewName("");
      await load();
      toast.success(t("تمت إضافة التصنيف", "הקטגוריה נוספה"));
    } catch (e) {
      console.error(e);
      toast.error(t("خطأ أثناء إضافة التصنيف", "שגיאה בהוספת קטגוריה"));
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editingName.trim()) return;
    try {
      await updateCategoryRequest(id, editingName.trim());
      setEditingId(null);
      setEditingName("");
      await load();
      toast.success(t("تم تحديث التصنيف", "הקטגוריה עודכנה"));
    } catch (e) {
      console.error(e);
      toast.error(t("خطأ أثناء تحديث التصنيف", "שגיאה בעדכון קטגוריה"));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("هل تريد حذف هذا التصنيف؟", "האם למחוק את הקטגוריה הזו?"))) return;

    try {
      // check if there are products connected to this category
      const products = await getAdminProducts();
      const hasProducts = products.some((p) => p.category && p.category._id === id);

      if (hasProducts) {
        toast.error(t("لا يمكن حذف تصنيف مرتبط بمنتجات", "לא ניתן למחוק קטגוריה שמקושרת למוצרים"));
        return;
      }

      await deleteCategoryRequest(id);
      await load();
      toast.success(t("تم حذف التصنيف", "הקטגוריה נמחקה"));
    } catch (e) {
      console.error(e);
      toast.error(t("خطأ أثناء حذف التصنيف", "שגיאה במחיקת קטגוריה"));
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <h2 className="text-xl font-semibold mb-2">{t("التصنيفات", "קטגוריות")}</h2>

      <form onSubmit={handleCreate} className="flex gap-2 max-w-md">
        <Input
          placeholder={t("اسم تصنيف جديد", "שם קטגוריה חדש")}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <Button type="submit">{t("إضافة", "הוספה")}</Button>
      </form>

      <div className="mt-4 space-y-2">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="flex items-center justify-between border rounded-md px-3 py-2"
          >
            {editingId === cat._id ? (
              <div className="flex flex-1 gap-2">
                <Input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                />
                <Button size="sm" onClick={() => handleUpdate(cat._id)}>
                  {t("حفظ", "שמור")}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setEditingName("");
                  }}
                >
                  {t("إلغاء", "ביטול")}
                </Button>
              </div>
            ) : (
              <>
                <span>{cat.name}</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingId(cat._id);
                      setEditingName(cat.name);
                    }}
                  >
                    {t("تعديل", "ערוך")}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(cat._id)}
                  >
                    {t("حذف", "מחק")}
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
        {categories.length === 0 && <p>{t("لا توجد تصنيفات.", "אין קטגוריות.")}</p>}
      </div>
    </Card>
  );
};

//
// 2. Products – CRUD + options + Cloudinary signed upload
//

type ProductOptionForm = {
  optionName: string;
  priceWithoutMaam: string;
  salePriceWithoutMaam: string;
  stock: string;
};

type ProductFormState = {
  id?: string;
  name: string;
  description: string;
  categoryId: string;
  image: string;
  isTop: boolean;
  options: ProductOptionForm[];
};

const emptyProductForm: ProductFormState = {
  name: "",
  description: "",
  categoryId: "",
  image: "",
  isTop: false,
  options: [
    {
      optionName: "",
      priceWithoutMaam: "",
      salePriceWithoutMaam: "",
      stock: "0",
    },
  ],
};

const ProductsSection: React.FC = () => {
  const { loadCart } = useCart();
  const { isArabic } = useLanguage();
  const t = (ar: string, he: string) => (isArabic ? ar : he);

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<ProductFormState>(emptyProductForm);
  const [isEditing, setIsEditing] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImg, setUploadingImg] = useState(false);

  const formRef = useRef<HTMLFormElement | null>(null);

  const loadInitial = async () => {
    try {
      setLoading(true);
      const [cats, prods] = await Promise.all([
        getAdminCategories(),
        getAdminProducts(),
      ]);
      setCategories(cats);
      setProducts(prods);
    } catch (e) {
      console.error(e);
      toast.error(t("خطأ في تحميل بيانات المنتجات/التصنيفات", "שגיאה בטעינת נתוני מוצרים/קטגוריות"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitial();
  }, []);

  const resetForm = () => {
    setForm(emptyProductForm);
    setIsEditing(false);
    setImageFile(null);
    setUploadingImg(false);
  };

  const fromProductToForm = (p: Product): ProductFormState => ({
    id: p._id,
    name: p.name,
    description: p.description,
    categoryId: p.category?._id ?? "",
    image: p.image,
    isTop: p.isTop,
    options: p.options.map((o) => ({
      optionName: o.optionName,
      priceWithoutMaam: String(o.priceWithoutMaam),
      salePriceWithoutMaam:
        o.salePriceWithoutMaam !== undefined ? String(o.salePriceWithoutMaam) : "",
      stock: String(o.stock),
    })),
  });

  const handleEditProduct = (p: Product) => {
    setForm(fromProductToForm(p));
    setIsEditing(true);
    setImageFile(null);

    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm(t("هل تريد حذف هذا المنتج؟", "האם למחוק את המוצר הזה?"))) return;
    try {
      await deleteProductRequest(id);
      await loadInitial();
      await loadCart();
      if (form.id === id) resetForm();
      toast.success(t("تم حذف المنتج", "המוצר נמחק"));
    } catch (e) {
      console.error(e);
      toast.error(t("خطأ أثناء حذف المنتج", "שגיאה במחיקת מוצר"));
    }
  };

  const handleFormChange = (
    field: keyof ProductFormState,
    value: string | boolean
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (
    index: number,
    field: keyof ProductOptionForm,
    value: string
  ) => {
    setForm((prev) => {
      const opts = [...prev.options];
      opts[index] = { ...opts[index], [field]: value };
      return { ...prev, options: opts };
    });
  };

  const handleAddOption = () => {
    setForm((prev) => ({
      ...prev,
      options: [
        ...prev.options,
        {
          optionName: "",
          priceWithoutMaam: "",
          salePriceWithoutMaam: "",
          stock: "0",
        },
      ],
    }));
  };

  const handleRemoveOption = (index: number) => {
    setForm((prev) => {
      const opts = [...prev.options];
      if (opts.length === 1) return prev;
      opts.splice(index, 1);
      return { ...prev, options: opts };
    });
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      toast.error(t("اسم المنتج مطلوب", "שם מוצר נדרש"));
      return false;
    }
    if (!form.description.trim()) {
      toast.error(t("وصف المنتج مطلوب", "תיאור מוצר נדרש"));
      return false;
    }
    if (!form.categoryId) {
      toast.error(t("يرجى اختيار التصنيف", "אנא בחר קטגוריה"));
      return false;
    }
    if (!form.image.trim()) {
      toast.error(t("يرجى رفع صورة للمنتج", "נא להעלות תמונה למוצר"));
      return false;
    }
    if (!form.options.length) {
      toast.error(t("يجب وجود خيار واحد على الأقل", "חייבת להיות לפחות אפשרות אחת"));
      return false;
    }
    for (const opt of form.options) {
      if (!opt.optionName.trim()) {
        toast.error(t("اسم الخيار مطلوب", "שם אפשרות נדרש"));
        return false;
      }
      if (!opt.priceWithoutMaam.trim()) {
        toast.error(t("السعر بدون ضريبة مطلوب", "מחיר ללא מע\"מ נדרש"));
        return false;
      }
    }
    return true;
  };

  const handleUploadImage = async () => {
    if (!imageFile) return;
    setUploadingImg(true);
    try {
      const url = await uploadProductImageSigned(imageFile);
      handleFormChange("image", url);
      toast.success(t("تم رفع الصورة", "התמונה הועלתה"));
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || t("خطأ أثناء رفع الصورة", "שגיאה בהעלאת התמונה"));
    } finally {
      setUploadingImg(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payloadOptions = form.options.map((o) => ({
      optionName: o.optionName.trim(),
      priceWithoutMaam: Number(o.priceWithoutMaam) || 0,
      salePriceWithoutMaam: o.salePriceWithoutMaam
        ? Number(o.salePriceWithoutMaam)
        : undefined,
      stock: Number(o.stock) || 0,
    }));

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      categoryId: form.categoryId,
      image: form.image.trim(),
      isTop: form.isTop,
      options: payloadOptions,
    };

    try {
      if (isEditing && form.id) {
        await updateProductRequest(form.id, payload);
        toast.success(t("تم تحديث المنتج", "המוצר עודכן"));
      } else {
        await createProductRequest(payload);
        toast.success(t("تم إنشاء المنتج", "המוצר נוצר"));
      }
      await loadInitial();
      await loadCart();
      resetForm();
    } catch (e) {
      console.error(e);
      toast.error(t("خطأ أثناء حفظ المنتج", "שגיאה בשמירת המוצר"));
    }
  };

  return (
    <Card className="p-4 space-y-6">
      <h2 className="text-xl font-semibold mb-2">{t("المنتجات", "מוצרים")}</h2>

      {/* Product form */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="grid gap-4 md:grid-cols-2 border rounded-md p-4"
      >
        <div className="space-y-2">
          <Label htmlFor="name">{t("اسم المنتج", "שם מוצר")}</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => handleFormChange("name", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">{t("التصنيف", "קטגוריה")}</Label>
          <select
            id="category"
            className="border rounded-md px-2 py-2 w-full bg-background"
            value={form.categoryId}
            onChange={(e) => handleFormChange("categoryId", e.target.value)}
          >
            <option value="">{t("اختر تصنيفًا", "בחר קטגוריה")}</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">{t("الوصف", "תיאור")}</Label>
          <textarea
            id="description"
            className="border rounded-md px-2 py-2 w-full bg-background min-h-[80px]"
            value={form.description}
            onChange={(e) => handleFormChange("description", e.target.value)}
          />
        </div>

        {/* Cloudinary signed image upload */}
        <div className="space-y-2">
          <Label>{t("صورة المنتج", "תמונת מוצר")}</Label>
          <div className="flex gap-2 items-center">
            <Input
              type="file"
              accept="image/*"
              disabled={uploadingImg}
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
            <Button
              type="button"
              variant="outline"
              disabled={!imageFile || uploadingImg}
              onClick={handleUploadImage}
            >
              {uploadingImg ? t("جاري الرفع...", "מעלה...") : t("رفع", "העלה")}
            </Button>
          </div>

          <Input
            placeholder={t("سيظهر رابط الصورة هنا بعد الرفع", "קישור התמונה יופיע כאן לאחר ההעלאה")}
            value={form.image}
            onChange={(e) => handleFormChange("image", e.target.value)}
            dir="ltr"
          />

          {form.image && (
            <img
              src={form.image}
              alt="preview"
              className="w-24 h-24 object-cover rounded-md border"
            />
          )}
        </div>

        <div className="space-y-2 flex items-center gap-2">
          <input
            id="isTop"
            type="checkbox"
            checked={form.isTop}
            onChange={(e) => handleFormChange("isTop", e.target.checked)}
          />
          <Label htmlFor="isTop">{t("منتج مميز (Top)", "מוצר מובחר (Top)")}</Label>
        </div>

        {/* Options list */}
        <div className="md:col-span-2 space-y-3 mt-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{t("الخيارات", "אפשרויות")}</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddOption}
            >
              {t("إضافة خيار", "הוסף אפשרות")}
            </Button>
          </div>

          <div className="space-y-2">
            {form.options.map((opt, index) => (
              <div
                key={index}
                className="grid gap-2 md:grid-cols-4 border rounded-md p-3"
              >
                <div className="space-y-1">
                  <Label>{t("اسم الخيار", "שם אפשרות")}</Label>
                  <Input
                    value={opt.optionName}
                    onChange={(e) =>
                      handleOptionChange(index, "optionName", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-1">
                  <Label>{t("السعر", "מחיר")}</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={opt.priceWithoutMaam}
                    onChange={(e) =>
                      handleOptionChange(index, "priceWithoutMaam", e.target.value)
                    }
                    dir="ltr"
                  />
                </div>

                <div className="space-y-1">
                  <Label>{t("سعر التخفيض  (اختياري)", "מחיר מבצע (אופציונלי)")}</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={opt.salePriceWithoutMaam}
                    onChange={(e) =>
                      handleOptionChange(
                        index,
                        "salePriceWithoutMaam",
                        e.target.value
                      )
                    }
                    dir="ltr"
                  />
                </div>

                <div className="space-y-1">
                  <Label>{t("المخزون", "מלאי")}</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={opt.stock}
                      onChange={(e) =>
                        handleOptionChange(index, "stock", e.target.value)
                      }
                      dir="ltr"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemoveOption(index)}
                      title={t("حذف الخيار", "מחק אפשרות")}
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 flex gap-2 justify-end mt-2">
          {isEditing && (
            <Button type="button" variant="outline" onClick={resetForm}>
              {t("إلغاء التعديل", "בטל עריכה")}
            </Button>
          )}
          <Button type="submit">{isEditing ? t("حفظ التغييرات", "שמור שינויים") : t("إنشاء منتج", "צור מוצר")}</Button>
        </div>
      </form>

      {/* Products table */}
      <div className="space-y-2">
        <h3 className="font-semibold">{t("قائمة المنتجات", "רשימת מוצרים")}</h3>
        {loading ? (
          <p>{t("جاري التحميل...", "טוען...")}</p>
        ) : products.length === 0 ? (
          <p>{t("لا توجد منتجات.", "אין מוצרים.")}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-2">{t("الصورة", "תמונה")}</th>
                  <th className="text-right p-2">{t("الاسم", "שם")}</th>
                  <th className="text-right p-2">{t("التصنيف", "קטגוריה")}</th>
                  <th className="text-right p-2">{t("مميز", "מובחר")}</th>
                  <th className="text-right p-2">{t("عدد الخيارات", "מספר אפשרויות")}</th>
                  <th className="text-right p-2">{t("الإجراءات", "פעולות")}</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-b">
                    <td className="p-2">
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 object-cover rounded border"
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-2">{p.name}</td>
                    <td className="p-2">{p.category?.name}</td>
                    <td className="p-2">{p.isTop ? t("نعم", "כן") : t("لا", "לא")}</td>
                    <td className="p-2">{p.options?.length ?? 0}</td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditProduct(p)}>
                          {t("تعديل", "ערוך")}
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteProduct(p._id)}>
                          {t("حذف", "מחק")}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  );
};

//
// 3. Users – show + change role
//

const UsersSection: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { isArabic } = useLanguage();
  const t = (ar: string, he: string) => (isArabic ? ar : he);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (e) {
      console.error(e);
      toast.error(t("خطأ في تحميل المستخدمين", "שגיאה בטעינת משתמשים"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const changeRole = async (userId: string, role: "customer" | "admin") => {
    try {
      await updateUserRoleRequest(userId, role);
      await load();
      toast.success(t("تم تحديث الصلاحية", "ההרשאה עודכנה"));
    } catch (e) {
      console.error(e);
      toast.error(t("خطأ في تحديث الصلاحية", "שגיאה בעדכון הרשאה"));
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <h2 className="text-xl font-semibold mb-2">{t("المستخدمون", "משתמשים")}</h2>
      {loading ? (
        <p>{t("جاري التحميل...", "טוען...")}</p>
      ) : users.length === 0 ? (
        <p>{t("لا يوجد مستخدمون.", "אין משתמשים.")}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-right p-2">{t("اسم المستخدم", "שם משתמש")}</th>
                <th className="text-right p-2">{t("الصلاحية", "הרשאה")}</th>
                <th className="text-right p-2">{t("تغيير الصلاحية", "שינוי הרשאה")}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b">
                  <td className="p-2">{u.username}</td>
                  <td className="p-2">{u.role === "admin" ? t("مدير", "מנהל") : t("عميل", "לקוח")}</td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={u.role === "customer" ? "default" : "outline"}
                        onClick={() => changeRole(u.id, "customer")}
                      >
                        {t("عميل", "לקוח")}
                      </Button>
                      <Button
                        size="sm"
                        variant={u.role === "admin" ? "default" : "outline"}
                        onClick={() => changeRole(u.id, "admin")}
                      >
                        {t("مدير", "מנהל")}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

//
// 4. Orders – list + details
//

const OrdersSection: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const { isArabic } = useLanguage();
  const t = (ar: string, he: string) => (isArabic ? ar : he);

  const detailsRef = useRef<HTMLDivElement | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getAllOrdersAdmin();
      setOrders(data);
      if (data.length && !selectedOrderId) {
        setSelectedOrderId(data[0].id);
      }
    } catch (e) {
      console.error(e);
      toast.error(t("خطأ في تحميل الطلبات", "שגיאה בטעינת הזמנות"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) ?? null;

  const formatCustomer = (c?: CustomerDetails) => {
    if (!c) return "-";
    return `${c.fullName} (${c.phone})`;
  };

  const scrollToDetails = () => {
    if (!detailsRef.current) return;
    const rect = detailsRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    const offset = -120;

    window.scrollTo({
      top: rect.top + scrollTop + offset,
      behavior: "smooth",
    });
  };

  return (
    <Card className="p-4 space-y-4">
      <h2 className="text-xl font-semibold mb-2">{t("كل الطلبات", "כל ההזמנות")}</h2>
      {loading ? (
        <p>{t("جاري التحميل...", "טוען...")}</p>
      ) : orders.length === 0 ? (
        <p>{t("لا توجد طلبات.", "אין הזמנות.")}</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-2">{t("رقم الطلب", "מספר הזמנה")}</th>
                  <th className="text-right p-2">{t("التاريخ", "תאריך")}</th>
                  <th className="text-right p-2">{t("العميل", "לקוח")}</th>
                  <th className="text-right p-2">{t("الإجمالي مع الضريبة", "סה\"כ עם מע\"מ")}</th>
                  <th className="text-right p-2">{t("الحالة", "סטטוס")}</th>
                  <th className="text-right p-2">{t("التفاصيل", "פרטים")}</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr
                    key={o.id}
                    className={
                      "border-b " + (o.id === selectedOrderId ? "bg-muted/60" : "")
                    }
                  >
                    <td className="p-2">{o.id}</td>
                    <td className="p-2">{new Date(o.date).toLocaleString(isArabic ? "ar" : "he")}</td>
                    <td className="p-2">{formatCustomer(o.customerDetails)}</td>
                    <td className="p-2">
                      <span dir="ltr">{o.totalWithoutMaam.toFixed(2)} ₪</span>
                    </td>
                    <td className="p-2">{o.status}</td>
                    <td className="p-2">
                      <Button
                        size="sm"
                        variant={o.id === selectedOrderId ? "default" : "outline"}
                        onClick={() => {
                          setSelectedOrderId(o.id);
                          setTimeout(scrollToDetails, 0);
                        }}
                      >
                        {t("عرض", "הצג")}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedOrder && (
            <div ref={detailsRef} className="mt-4 grid gap-4 md:grid-cols-3">
              <Card className="p-4 space-y-2 md:col-span-1">
                <h3 className="font-semibold mb-2">{t("تفاصيل الطلب", "פרטי הזמנה")}</h3>
                <p>
                  <span className="font-medium">{t("رقم الطلب:", "מספר הזמנה:")}</span> {selectedOrder.id}
                </p>
                <p>
                  <span className="font-medium">{t("التاريخ:", "תאריך:")}</span>{" "}
                  {new Date(selectedOrder.date).toLocaleString(isArabic ? "ar" : "he")}
                </p>
                <p>
                  <span className="font-medium">{t("الحالة:", "סטטוס:")}</span> {selectedOrder.status}
                </p>
                <p>
                  <span className="font-medium">{t("الإجمالي:", "סה\"כ:")}</span>{" "}
                  <span dir="ltr">{selectedOrder.totalWithoutMaam.toFixed(2)} ₪</span>
                </p>
               
              </Card>

              <Card className="p-4 space-y-2 md:col-span-1">
                <h3 className="font-semibold mb-2">{t("تفاصيل العميل", "פרטי לקוח")}</h3>
                {selectedOrder.customerDetails ? (
                  <>
                    <p>
                      <span className="font-medium">{t("الاسم:", "שם:")}</span>{" "}
                      {selectedOrder.customerDetails.fullName}
                    </p>
                    <p>
                      <span className="font-medium">{t("الهاتف:", "טלפון:")}</span>{" "}
                      <span dir="ltr">{selectedOrder.customerDetails.phone}</span>
                    </p>
                    {selectedOrder.customerDetails.email && (
                      <p>
                        <span className="font-medium">{t("البريد:", "דוא\"ל:")}</span>{" "}
                        <span dir="ltr">{selectedOrder.customerDetails.email}</span>
                      </p>
                    )}
                    <p>
                      <span className="font-medium">{t("العنوان:", "כתובת:")}</span>{" "}
                      {selectedOrder.customerDetails.street}{" "}
                      {selectedOrder.customerDetails.houseNumber},{" "}
                      {selectedOrder.customerDetails.city}
                    </p>
                    {selectedOrder.customerDetails.postalCode && (
                      <p>
                        <span className="font-medium">{t("الرمز البريدي:", "מיקוד:")}</span>{" "}
                        <span dir="ltr">{selectedOrder.customerDetails.postalCode}</span>
                      </p>
                    )}
                    {selectedOrder.customerDetails.notes && (
                      <p>
                        <span className="font-medium">{t("ملاحظات:", "הערות:")}</span>{" "}
                        {selectedOrder.customerDetails.notes}
                      </p>
                    )}
                  </>
                ) : (
                  <p>{t("لا توجد تفاصيل عميل.", "אין פרטי לקוח.")}</p>
                )}
              </Card>

              <Card className="p-4 space-y-2 md:col-span-1 md:row-span-2">
                <h3 className="font-semibold mb-2">{t("منتجات الطلب", "מוצרי ההזמנה")}</h3>
                {selectedOrder.items.length === 0 ? (
                  <p>{t("لا توجد عناصر.", "אין פריטים.")}</p>
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="border rounded-md p-2 flex gap-2">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1 text-sm">
  <div className="font-medium">
    {item.productName} – {item.optionName}
  </div>

  <div>
    {t("الكمية", "כמות")}: {item.quantity} | {t("سعر القطعة", "מחיר יחידה")}:{" "}
    <span dir="ltr">{item.priceWithoutMaam.toFixed(2)} ₪</span>
  </div>

  <div className="font-medium">
    {t("المجموع", "סה\"כ")}:{" "}
    <span dir="ltr">
      {(item.priceWithoutMaam * item.quantity).toFixed(2)} ₪
    </span>
  </div>

  {item.itemNote && item.itemNote.trim() !== "" && (
    <div className="mt-2 text-sm">
      <span className="font-medium">{t("ملاحظة للمنتج:", "הערה למוצר:")}</span>{" "}
      <span className="text-muted-foreground">{item.itemNote}</span>
    </div>
  )}
</div>

                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}
        </>
      )}
    </Card>
  );
};
