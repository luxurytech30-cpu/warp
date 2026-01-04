// src/pages/AdminPage.tsx
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
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
 
  return (
    <div className="min-h-screen py-8 px-4" dir="rtl" lang="ar">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">لوحة التحكم</h1>

        <div className="flex gap-2 flex-wrap">
          <Button
            variant={tab === "categories" ? "default" : "outline"}
            onClick={() => setTab("categories")}
          >
            التصنيفات
          </Button>
          <Button
            variant={tab === "products" ? "default" : "outline"}
            onClick={() => setTab("products")}
          >
            المنتجات
          </Button>
          <Button
            variant={tab === "users" ? "default" : "outline"}
            onClick={() => setTab("users")}
          >
            المستخدمون
          </Button>
          <Button
            variant={tab === "orders" ? "default" : "outline"}
            onClick={() => setTab("orders")}
          >
            الطلبات
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

  const load = async () => {
    try {
      const data = await getAdminCategories();
      setCategories(data);
    } catch (e) {
      console.error(e);
      toast.error("خطأ في تحميل التصنيفات");
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
      toast.success("تمت إضافة التصنيف");
    } catch (e) {
      console.error(e);
      toast.error("خطأ أثناء إضافة التصنيف");
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editingName.trim()) return;
    try {
      await updateCategoryRequest(id, editingName.trim());
      setEditingId(null);
      setEditingName("");
      await load();
      toast.success("تم تحديث التصنيف");
    } catch (e) {
      console.error(e);
      toast.error("خطأ أثناء تحديث التصنيف");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("هل تريد حذف هذا التصنيف؟")) return;

    try {
      // check if there are products connected to this category
      const products = await getAdminProducts();
      const hasProducts = products.some((p) => p.category && p.category._id === id);

      if (hasProducts) {
        toast.error("لا يمكن حذف تصنيف مرتبط بمنتجات");
        return;
      }

      await deleteCategoryRequest(id);
      await load();
      toast.success("تم حذف التصنيف");
    } catch (e) {
      console.error(e);
      toast.error("خطأ أثناء حذف التصنيف");
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <h2 className="text-xl font-semibold mb-2">التصنيفات</h2>

      <form onSubmit={handleCreate} className="flex gap-2 max-w-md">
        <Input
          placeholder="اسم تصنيف جديد"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <Button type="submit">إضافة</Button>
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
                  حفظ
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setEditingName("");
                  }}
                >
                  إلغاء
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
                    تعديل
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(cat._id)}
                  >
                    حذف
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
        {categories.length === 0 && <p>لا توجد تصنيفات.</p>}
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
      toast.error("خطأ في تحميل بيانات المنتجات/التصنيفات");
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
    if (!window.confirm("هل تريد حذف هذا المنتج؟")) return;
    try {
      await deleteProductRequest(id);
      await loadInitial();
      await loadCart();
      if (form.id === id) resetForm();
      toast.success("تم حذف المنتج");
    } catch (e) {
      console.error(e);
      toast.error("خطأ أثناء حذف المنتج");
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
      toast.error("اسم المنتج مطلوب");
      return false;
    }
    if (!form.description.trim()) {
      toast.error("وصف المنتج مطلوب");
      return false;
    }
    if (!form.categoryId) {
      toast.error("يرجى اختيار التصنيف");
      return false;
    }
    if (!form.image.trim()) {
      toast.error("يرجى رفع صورة للمنتج");
      return false;
    }
    if (!form.options.length) {
      toast.error("يجب وجود خيار واحد على الأقل");
      return false;
    }
    for (const opt of form.options) {
      if (!opt.optionName.trim()) {
        toast.error("اسم الخيار مطلوب");
        return false;
      }
      if (!opt.priceWithoutMaam.trim()) {
        toast.error("السعر بدون ضريبة مطلوب");
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
      toast.success("تم رفع الصورة");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "خطأ أثناء رفع الصورة");
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
        toast.success("تم تحديث المنتج");
      } else {
        await createProductRequest(payload);
        toast.success("تم إنشاء المنتج");
      }
      await loadInitial();
      await loadCart();
      resetForm();
    } catch (e) {
      console.error(e);
      toast.error("خطأ أثناء حفظ المنتج");
    }
  };

  return (
    <Card className="p-4 space-y-6">
      <h2 className="text-xl font-semibold mb-2">المنتجات</h2>

      {/* Product form */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="grid gap-4 md:grid-cols-2 border rounded-md p-4"
      >
        <div className="space-y-2">
          <Label htmlFor="name">اسم المنتج</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => handleFormChange("name", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">التصنيف</Label>
          <select
            id="category"
            className="border rounded-md px-2 py-2 w-full bg-background"
            value={form.categoryId}
            onChange={(e) => handleFormChange("categoryId", e.target.value)}
          >
            <option value="">اختر تصنيفًا</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">الوصف</Label>
          <textarea
            id="description"
            className="border rounded-md px-2 py-2 w-full bg-background min-h-[80px]"
            value={form.description}
            onChange={(e) => handleFormChange("description", e.target.value)}
          />
        </div>

        {/* Cloudinary signed image upload */}
        <div className="space-y-2">
          <Label>صورة المنتج (Cloudinary Signed)</Label>
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
              {uploadingImg ? "جاري الرفع..." : "رفع"}
            </Button>
          </div>

          <Input
            placeholder="سيظهر رابط الصورة هنا بعد الرفع"
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
          <Label htmlFor="isTop">منتج مميز (Top)</Label>
        </div>

        {/* Options list */}
        <div className="md:col-span-2 space-y-3 mt-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">الخيارات</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddOption}
            >
              إضافة خيار
            </Button>
          </div>

          <div className="space-y-2">
            {form.options.map((opt, index) => (
              <div
                key={index}
                className="grid gap-2 md:grid-cols-4 border rounded-md p-3"
              >
                <div className="space-y-1">
                  <Label>اسم الخيار</Label>
                  <Input
                    value={opt.optionName}
                    onChange={(e) =>
                      handleOptionChange(index, "optionName", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-1">
                  <Label>السعر </Label>
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
                  <Label>سعر التخفيض  (اختياري)</Label>
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
                  <Label>المخزون</Label>
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
                      title="حذف الخيار"
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
              إلغاء التعديل
            </Button>
          )}
          <Button type="submit">{isEditing ? "حفظ التغييرات" : "إنشاء منتج"}</Button>
        </div>
      </form>

      {/* Products table */}
      <div className="space-y-2">
        <h3 className="font-semibold">قائمة المنتجات</h3>
        {loading ? (
          <p>جاري التحميل...</p>
        ) : products.length === 0 ? (
          <p>لا توجد منتجات.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-2">الصورة</th>
                  <th className="text-right p-2">الاسم</th>
                  <th className="text-right p-2">التصنيف</th>
                  <th className="text-right p-2">مميز</th>
                  <th className="text-right p-2">عدد الخيارات</th>
                  <th className="text-right p-2">الإجراءات</th>
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
                    <td className="p-2">{p.isTop ? "نعم" : "لا"}</td>
                    <td className="p-2">{p.options?.length ?? 0}</td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditProduct(p)}>
                          تعديل
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteProduct(p._id)}>
                          حذف
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

  const load = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (e) {
      console.error(e);
      toast.error("خطأ في تحميل المستخدمين");
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
      toast.success("تم تحديث الصلاحية");
    } catch (e) {
      console.error(e);
      toast.error("خطأ في تحديث الصلاحية");
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <h2 className="text-xl font-semibold mb-2">المستخدمون</h2>
      {loading ? (
        <p>جاري التحميل...</p>
      ) : users.length === 0 ? (
        <p>لا يوجد مستخدمون.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-right p-2">اسم المستخدم</th>
                <th className="text-right p-2">الصلاحية</th>
                <th className="text-right p-2">تغيير الصلاحية</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b">
                  <td className="p-2">{u.username}</td>
                  <td className="p-2">{u.role === "admin" ? "مدير" : "عميل"}</td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={u.role === "customer" ? "default" : "outline"}
                        onClick={() => changeRole(u.id, "customer")}
                      >
                        عميل
                      </Button>
                      <Button
                        size="sm"
                        variant={u.role === "admin" ? "default" : "outline"}
                        onClick={() => changeRole(u.id, "admin")}
                      >
                        مدير
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
      toast.error("خطأ في تحميل الطلبات");
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
      <h2 className="text-xl font-semibold mb-2">كل الطلبات</h2>
      {loading ? (
        <p>جاري التحميل...</p>
      ) : orders.length === 0 ? (
        <p>لا توجد طلبات.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-2">رقم الطلب</th>
                  <th className="text-right p-2">التاريخ</th>
                  <th className="text-right p-2">العميل</th>
                  <th className="text-right p-2">الإجمالي مع الضريبة</th>
                  <th className="text-right p-2">الحالة</th>
                  <th className="text-right p-2">التفاصيل</th>
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
                    <td className="p-2">{new Date(o.date).toLocaleString("ar")}</td>
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
                        عرض
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
                <h3 className="font-semibold mb-2">تفاصيل الطلب</h3>
                <p>
                  <span className="font-medium">رقم الطلب:</span> {selectedOrder.id}
                </p>
                <p>
                  <span className="font-medium">التاريخ:</span>{" "}
                  {new Date(selectedOrder.date).toLocaleString("ar")}
                </p>
                <p>
                  <span className="font-medium">الحالة:</span> {selectedOrder.status}
                </p>
                <p>
                  <span className="font-medium">الإجمالي:</span>{" "}
                  <span dir="ltr">{selectedOrder.totalWithoutMaam.toFixed(2)} ₪</span>
                </p>
               
              </Card>

              <Card className="p-4 space-y-2 md:col-span-1">
                <h3 className="font-semibold mb-2">تفاصيل العميل</h3>
                {selectedOrder.customerDetails ? (
                  <>
                    <p>
                      <span className="font-medium">الاسم:</span>{" "}
                      {selectedOrder.customerDetails.fullName}
                    </p>
                    <p>
                      <span className="font-medium">الهاتف:</span>{" "}
                      <span dir="ltr">{selectedOrder.customerDetails.phone}</span>
                    </p>
                    {selectedOrder.customerDetails.email && (
                      <p>
                        <span className="font-medium">البريد:</span>{" "}
                        <span dir="ltr">{selectedOrder.customerDetails.email}</span>
                      </p>
                    )}
                    <p>
                      <span className="font-medium">العنوان:</span>{" "}
                      {selectedOrder.customerDetails.street}{" "}
                      {selectedOrder.customerDetails.houseNumber},{" "}
                      {selectedOrder.customerDetails.city}
                    </p>
                    {selectedOrder.customerDetails.postalCode && (
                      <p>
                        <span className="font-medium">الرمز البريدي:</span>{" "}
                        <span dir="ltr">{selectedOrder.customerDetails.postalCode}</span>
                      </p>
                    )}
                    {selectedOrder.customerDetails.notes && (
                      <p>
                        <span className="font-medium">ملاحظات:</span>{" "}
                        {selectedOrder.customerDetails.notes}
                      </p>
                    )}
                  </>
                ) : (
                  <p>لا توجد تفاصيل عميل.</p>
                )}
              </Card>

              <Card className="p-4 space-y-2 md:col-span-1 md:row-span-2">
                <h3 className="font-semibold mb-2">منتجات الطلب</h3>
                {selectedOrder.items.length === 0 ? (
                  <p>لا توجد عناصر.</p>
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
    الكمية: {item.quantity} | سعر القطعة:{" "}
    <span dir="ltr">{item.priceWithoutMaam.toFixed(2)} ₪</span>
  </div>

  <div className="font-medium">
    المجموع:{" "}
    <span dir="ltr">
      {(item.priceWithoutMaam * item.quantity).toFixed(2)} ₪
    </span>
  </div>

  {item.itemNote && item.itemNote.trim() !== "" && (
    <div className="mt-2 text-sm">
      <span className="font-medium">ملاحظة للمنتج:</span>{" "}
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
