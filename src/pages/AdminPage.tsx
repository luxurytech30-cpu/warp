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

// ✅ you should create this helper as we discussed
import { uploadProductImageSigned } from "@/lib/cloudinaryUpload";

type Tab = "categories" | "products" | "users" | "orders";

const AdminPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>("products");

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">ניהול מערכת</h1>

        <div className="flex gap-2 flex-wrap">
          <Button
            variant={tab === "categories" ? "default" : "outline"}
            onClick={() => setTab("categories")}
          >
            קטגוריות
          </Button>
          <Button
            variant={tab === "products" ? "default" : "outline"}
            onClick={() => setTab("products")}
          >
            מוצרים
          </Button>
          <Button
            variant={tab === "users" ? "default" : "outline"}
            onClick={() => setTab("users")}
          >
            משתמשים
          </Button>
          <Button
            variant={tab === "orders" ? "default" : "outline"}
            onClick={() => setTab("orders")}
          >
            הזמנות
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
      toast.error("שגיאה בטעינת קטגוריות");
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
      toast.success("קטגוריה נוספה");
    } catch (e) {
      console.error(e);
      toast.error("שגיאה בהוספת קטגוריה");
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editingName.trim()) return;
    try {
      await updateCategoryRequest(id, editingName.trim());
      setEditingId(null);
      setEditingName("");
      await load();
      toast.success("קטגוריה עודכנה");
    } catch (e) {
      console.error(e);
      toast.error("שגיאה בעדכון קטגוריה");
    }
  };

 const handleDelete = async (id: string) => {
  if (!window.confirm("למחוק את הקטגוריה?")) return;

  try {
    // בדיקה אם יש מוצרים שמשויכים לקטגוריה הזו
    const products = await getAdminProducts();
    const hasProducts = products.some(
      (p) => p.category && p.category._id === id
      // אם ב־Product יש רק categoryId ולא אובייקט category, אז:
      // const hasProducts = products.some((p) => p.categoryId === id);
    );

    if (hasProducts) {
      toast.error("לא ניתן למחוק קטגוריה שיש אליה מוצרים משויכים");
      return;
    }

    // אם אין מוצרים → למחוק כרגיל
    await deleteCategoryRequest(id);
    await load();
    toast.success("קטגוריה נמחקה");
  } catch (e) {
    console.error(e);
    toast.error("שגיאה במחיקת קטגוריה");
  }
};

  return (
    <Card className="p-4 space-y-4">
      <h2 className="text-xl font-semibold mb-2">קטגוריות</h2>

      <form onSubmit={handleCreate} className="flex gap-2 max-w-md">
        <Input
          placeholder="שם קטגוריה חדשה"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <Button type="submit">הוסף</Button>
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
                  שמור
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setEditingName("");
                  }}
                >
                  ביטול
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
                    ערוך
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(cat._id)}
                  >
                    מחיקה
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
        {categories.length === 0 && <p>אין קטגוריות.</p>}
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
  categoryId: string; // ✅ form field only
  image: string; // ✅ final Cloudinary secure_url
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
      toast.error("שגיאה בטעינת נתוני מוצרים/קטגוריות");
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
        o.salePriceWithoutMaam !== undefined
          ? String(o.salePriceWithoutMaam)
          : "",
      stock: String(o.stock),
    })),
  });

  const handleEditProduct = (p: Product) => {
    setForm(fromProductToForm(p));
    setIsEditing(true);
    setImageFile(null);

    if (formRef.current) {
      formRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("למחוק את המוצר?")) return;
    try {
      await deleteProductRequest(id);
      await loadInitial();
      await loadCart();
      if (form.id === id) resetForm();
      toast.success("המוצר נמחק");
    } catch (e) {
      console.error(e);
      toast.error("שגיאה במחיקת מוצר");
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
      toast.error("שם מוצר חובה");
      return false;
    }
    if (!form.description.trim()) {
      toast.error("תיאור מוצר חובה");
      return false;
    }
    if (!form.categoryId) {
      toast.error("חובה לבחור קטגוריה");
      return false;
    }
    if (!form.image.trim()) {
      toast.error("חובה להעלות תמונה");
      return false;
    }
    if (!form.options.length) {
      toast.error("חייבת להיות לפחות אופציה אחת");
      return false;
    }
    for (const opt of form.options) {
      if (!opt.optionName.trim()) {
        toast.error("שם אופציה חובה");
        return false;
      }
      if (!opt.priceWithoutMaam.trim()) {
        toast.error("מחיר ללא מע״מ חובה");
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
      toast.success("התמונה הועלתה");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "שגיאה בהעלאת תמונה");
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

    // ✅ backend can store categoryId and later return populated category object
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
        toast.success("מוצר עודכן");
      } else {
        await createProductRequest(payload);
        toast.success("מוצר נוצר");
      }
      await loadInitial();
       await loadCart(); 
      resetForm();
    } catch (e) {
      console.error(e);
      toast.error("שגיאה בשמירת המוצר");
    }
  };

  return (
    <Card className="p-4 space-y-6">
      <h2 className="text-xl font-semibold mb-2">מוצרים</h2>

      {/* Product form */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="grid gap-4 md:grid-cols-2 border rounded-md p-4"
      >
        <div className="space-y-2">
          <Label htmlFor="name">שם מוצר</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => handleFormChange("name", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">קטגוריה</Label>
          <select
            id="category"
            className="border rounded-md px-2 py-2 w-full bg-background"
            value={form.categoryId}
            onChange={(e) => handleFormChange("categoryId", e.target.value)}
          >
            <option value="">בחר קטגוריה</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">תיאור</Label>
          <textarea
            id="description"
            className="border rounded-md px-2 py-2 w-full bg-background min-h-[80px]"
            value={form.description}
            onChange={(e) => handleFormChange("description", e.target.value)}
          />
        </div>

        {/* ✅ Cloudinary signed image upload */}
        <div className="space-y-2">
          <Label>תמונת מוצר (Cloudinary Signed)</Label>
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
              {uploadingImg ? "מעלה..." : "העלה"}
            </Button>
          </div>

          {/* show current image url (read-only) */}
          <Input
            placeholder="URL יופיע כאן אחרי העלאה"
            value={form.image}
            onChange={(e) => handleFormChange("image", e.target.value)}
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
          <Label htmlFor="isTop">מוצר מומלץ (Top)</Label>
        </div>

        {/* Options list */}
        <div className="md:col-span-2 space-y-3 mt-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">אופציות</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddOption}
            >
              הוסף אופציה
            </Button>
          </div>

          <div className="space-y-2">
            {form.options.map((opt, index) => (
              <div
                key={index}
                className="grid gap-2 md:grid-cols-4 border rounded-md p-3"
              >
                <div className="space-y-1">
                  <Label>שם אופציה</Label>
                  <Input
                    value={opt.optionName}
                    onChange={(e) =>
                      handleOptionChange(index, "optionName", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label>מחיר ללא מע״מ</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={opt.priceWithoutMaam}
                    onChange={(e) =>
                      handleOptionChange(
                        index,
                        "priceWithoutMaam",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label>מחיר מבצע ללא מע״מ (לא חובה)</Label>
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
                  />
                </div>
                <div className="space-y-1">
                  <Label>מלאי</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={opt.stock}
                      onChange={(e) =>
                        handleOptionChange(index, "stock", e.target.value)
                      }
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemoveOption(index)}
                      title="הסר אופציה"
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
              ביטול עריכה
            </Button>
          )}
          <Button type="submit">
            {isEditing ? "שמור שינויים" : "צור מוצר"}
          </Button>
        </div>
      </form>

      {/* Products table */}
      <div className="space-y-2">
        <h3 className="font-semibold">רשימת מוצרים</h3>
        {loading ? (
          <p>טוען...</p>
        ) : products.length === 0 ? (
          <p>אין מוצרים.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-2">תמונה</th>
                  <th className="text-right p-2">שם</th>
                  <th className="text-right p-2">קטגוריה</th>
                  <th className="text-right p-2">Top</th>
                  <th className="text-right p-2">אופציות</th>
                  <th className="text-right p-2">פעולות</th>
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
                    <td className="p-2">{p.isTop ? "כן" : "לא"}</td>
                    <td className="p-2">{p.options?.length ?? 0}</td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditProduct(p)}
                        >
                          ערוך
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteProduct(p._id)}
                        >
                          מחיקה
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
      toast.error("שגיאה בטעינת משתמשים");
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
      toast.success("תפקיד עודכן");
    } catch (e) {
      console.error(e);
      toast.error("שגיאה בעדכון תפקיד");
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <h2 className="text-xl font-semibold mb-2">משתמשים</h2>
      {loading ? (
        <p>טוען...</p>
      ) : users.length === 0 ? (
        <p>אין משתמשים.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-right p-2">שם משתמש</th>
                <th className="text-right p-2">תפקיד</th>
                <th className="text-right p-2">שינוי תפקיד</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b">
                  <td className="p-2">{u.username}</td>
                  <td className="p-2">{u.role === "admin" ? "מנהל" : "לקוח"}</td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={u.role === "customer" ? "default" : "outline"}
                        onClick={() => changeRole(u.id, "customer")}
                      >
                        לקוח
                      </Button>
                      <Button
                        size="sm"
                        variant={u.role === "admin" ? "default" : "outline"}
                        onClick={() => changeRole(u.id, "admin")}
                      >
                        מנהל
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
      toast.error("שגיאה בטעינת הזמנות");
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
      <h2 className="text-xl font-semibold mb-2">כל ההזמנות</h2>
      {loading ? (
        <p>טוען...</p>
      ) : orders.length === 0 ? (
        <p>אין הזמנות.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-2">מס׳ הזמנה</th>
                  <th className="text-right p-2">תאריך</th>
                  <th className="text-right p-2">לקוח</th>
                  <th className="text-right p-2">סה״כ עם מע״מ</th>
                  <th className="text-right p-2">סטטוס</th>
                  <th className="text-right p-2">פרטים</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr
                    key={o.id}
                    className={
                      "border-b " +
                      (o.id === selectedOrderId ? "bg-muted/60" : "")
                    }
                  >
                    <td className="p-2">{o.id}</td>
                    <td className="p-2">
                      {new Date(o.date).toLocaleString("he-IL")}
                    </td>
                    <td className="p-2">{formatCustomer(o.customerDetails)}</td>
                    <td className="p-2">{o.totalWithMaam.toFixed(2)} ₪</td>
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
                        הצג
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
                <h3 className="font-semibold mb-2">פרטי הזמנה</h3>
                <p>
                  <span className="font-medium">מס׳ הזמנה:</span>{" "}
                  {selectedOrder.id}
                </p>
                <p>
                  <span className="font-medium">תאריך:</span>{" "}
                  {new Date(selectedOrder.date).toLocaleString("he-IL")}
                </p>
                <p>
                  <span className="font-medium">סטטוס:</span>{" "}
                  {selectedOrder.status}
                </p>
                <p>
                  <span className="font-medium">סה״כ לפני מע״מ:</span>{" "}
                  {selectedOrder.totalWithoutMaam.toFixed(2)} ₪
                </p>
                <p>
                  <span className="font-medium">סה״כ עם מע״מ:</span>{" "}
                  {selectedOrder.totalWithMaam.toFixed(2)} ₪
                </p>
              </Card>

              <Card className="p-4 space-y-2 md:col-span-1">
                <h3 className="font-semibold mb-2">פרטי לקוח</h3>
                {selectedOrder.customerDetails ? (
                  <>
                    <p>
                      <span className="font-medium">שם:</span>{" "}
                      {selectedOrder.customerDetails.fullName}
                    </p>
                    <p>
                      <span className="font-medium">טלפון:</span>{" "}
                      {selectedOrder.customerDetails.phone}
                    </p>
                    {selectedOrder.customerDetails.email && (
                      <p>
                        <span className="font-medium">אימייל:</span>{" "}
                        {selectedOrder.customerDetails.email}
                      </p>
                    )}
                    <p>
                      <span className="font-medium">כתובת:</span>{" "}
                      {selectedOrder.customerDetails.street}{" "}
                      {selectedOrder.customerDetails.houseNumber},{" "}
                      {selectedOrder.customerDetails.city}
                    </p>
                    {selectedOrder.customerDetails.postalCode && (
                      <p>
                        <span className="font-medium">מיקוד:</span>{" "}
                        {selectedOrder.customerDetails.postalCode}
                      </p>
                    )}
                    {selectedOrder.customerDetails.notes && (
                      <p>
                        <span className="font-medium">הערות:</span>{" "}
                        {selectedOrder.customerDetails.notes}
                      </p>
                    )}
                  </>
                ) : (
                  <p>אין פרטי לקוח.</p>
                )}
              </Card>

              <Card className="p-4 space-y-2 md:col-span-1 md:row-span-2">
                <h3 className="font-semibold mb-2">מוצרים בהזמנה</h3>
                {selectedOrder.items.length === 0 ? (
                  <p>אין פריטים.</p>
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {selectedOrder.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="border rounded-md p-2 flex gap-2"
                      >
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
                            כמות: {item.quantity} | מחיר ליחידה:{" "}
                            {item.priceWithoutMaam.toFixed(2)} ₪ (לפני מע״מ)
                          </div>
                          <div className="font-medium">
                            סה״כ:{" "}
                            {(item.priceWithoutMaam * item.quantity).toFixed(2)}{" "}
                            ₪ (לפני מע״מ)
                          </div>
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
