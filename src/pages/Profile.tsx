// src/pages/Profile.tsx
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { User, Package, Clock, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { getMyOrders } from "@/lib/api";
import type { Order } from "@/types";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const Profile = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery<Order[]>({
    queryKey: ["myOrders"],
    queryFn: getMyOrders,
    enabled: isAuthenticated,
  });

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [open, setOpen] = useState(false);

  const [delayDone, setDelayDone] = useState(false);

useEffect(() => {
  const t = setTimeout(() => setDelayDone(true), 800);
  return () => clearTimeout(t);
}, []);

if (!user && !delayDone) return <div>Loading...</div>;
if (!user && delayDone) return <Navigate to="/login" />;

  // ✅ Status mapping (supports Hebrew OR backend English)
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "בתהליך":
      case "processing":
        return "قيد المعالجة";
      case "הושלם":
      case "completed":
        return "مكتمل";
      case "נכשל":
      case "failed":
        return "فشل";
      default:
        return status; // fallback
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "בתהליך":
      case "processing":
        return <Clock className="h-4 w-4" />;
      case "הושלם":
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "נכשל":
      case "failed":
        return <Package className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "בתהליך":
      case "processing":
        return "bg-secondary text-secondary-foreground";
      case "הושלם":
      case "completed":
        return "bg-green-500 text-white";
      case "נכשל":
      case "failed":
        return "bg-red-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const lastOrder = orders[0] || null;

  const handleRowClick = (order: Order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleDialogChange = (value: boolean) => {
    setOpen(value);
    if (!value) setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen py-12" dir="rtl" lang="ar">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-black mb-8">
          ملفي <span className="text-gradient-primary">الشخصي</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card className="p-8 shadow-premium text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center">
                <User className="h-12 w-12 text-white" />
              </div>

              <h2 className="text-2xl font-bold mb-2">{user?.username || "مستخدم"}</h2>

              <Badge className="gradient-gold text-white">
                {user?.role === "admin" ? "مدير" : "عميل مسجّل"}
              </Badge>

              <div className="mt-8 pt-8 border-t text-right space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground">إجمالي الطلبات</div>
                  <div className="text-2xl font-bold text-primary">
                    {isLoading || isError ? "-" : orders.length}
                  </div>
                </div>

                {lastOrder && (
                  <div>
                    <div className="text-sm text-muted-foreground">آخر طلب</div>
                    <div className="text-sm font-medium">
                      {format(new Date(lastOrder.date), "dd MMMM yyyy, HH:mm", {
                        locale: arSA,
                      })}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Orders History */}
          <div className="lg:col-span-2">
            <Card className="p-6 shadow-card">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Package className="h-6 w-6 text-primary" />
                سجل الطلبات
              </h2>

              {isLoading ? (
                <div className="text-center py-12 text-muted-foreground">
                  جاري تحميل الطلبات...
                </div>
              ) : isError ? (
                <div className="text-center py-12 text-red-500">
                  حدث خطأ أثناء تحميل الطلبات
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg text-muted-foreground">
                    لم تقوم بإجراء أي طلب بعد.
                    <br />
                    عند أول عملية شراء — سيظهر الطلب هنا.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-right border-collapse">
                    <thead>
                      <tr className="border-b text-xs text-muted-foreground">
                        <th className="py-2 px-2">رقم الطلب</th>
                        <th className="py-2 px-2">التاريخ</th>
                        <th className="py-2 px-2">المنتجات</th>
                        <th className="py-2 px-2">الإجمالي</th>
                        <th className="py-2 px-2">الحالة</th>
                        <th className="py-2 px-2">التفاصيل</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr
                          key={order.id}
                          className="border-b hover:bg-muted/60 cursor-pointer"
                        >
                          <td className="py-2 px-2 align-middle">#{order.id}</td>
                          <td className="py-2 px-2 align-middle">
                            {format(new Date(order.date), "dd.MM.yyyy HH:mm", {
                              locale: arSA,
                            })}
                          </td>
                          <td className="py-2 px-2 align-middle">
                            {order.items.length}
                          </td>
                          <td className="py-2 px-2 align-middle font-semibold">
                            <span dir="ltr">₪{order.totalWithoutMaam.toFixed(2)}</span>
                          </td>
                          <td className="py-2 px-2 align-middle">
                            <Badge
                              className={`${getStatusColor(
                                order.status
                              )} flex items-center gap-1 justify-center`}
                            >
                              {getStatusIcon(order.status)}
                              {getStatusLabel(order.status)}
                            </Badge>
                          </td>
                          <td className="py-2 px-2 align-middle">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRowClick(order)}
                            >
                              عرض
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Order details dialog */}
      <Dialog open={open} onOpenChange={handleDialogChange}>
        <DialogContent className="max-w-2xl" dir="rtl" lang="ar">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>تفاصيل الطلب #{selectedOrder.id}</DialogTitle>
                <DialogDescription className="flex items-center justify-between mt-2">
                  <span>
                    {format(new Date(selectedOrder.date), "dd MMMM yyyy, HH:mm", {
                      locale: arSA,
                    })}
                  </span>
                  <Badge
                    className={`${getStatusColor(
                      selectedOrder.status
                    )} flex items-center gap-1`}
                  >
                    {getStatusIcon(selectedOrder.status)}
                    {getStatusLabel(selectedOrder.status)}
                  </Badge>
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-4">
                {/* Items with images */}
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-3 border rounded-lg p-3"
                    >
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-14 h-14 rounded-md object-cover border"
                          />
                        )}
                        <div>
                          <div className="font-medium">{item.productName}</div>
                          <div className="text-xs text-muted-foreground">
                            {item.optionName} · الكمية: {item.quantity}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold" dir="ltr">
                        ₪{(item.priceWithoutMaam * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t pt-4 space-y-2 text-sm">
                  
                  
                  <div className="flex justify-between text-base font-bold">
                    <span>الإجمالي للدفع:</span>
                    <span className="text-primary" dir="ltr">
                      ₪{selectedOrder.totalWithoutMaam.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
