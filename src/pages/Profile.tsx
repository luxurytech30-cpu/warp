// src/pages/Profile.tsx
import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  User as UserIcon,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  Truck,
} from "lucide-react";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { he } from "date-fns/locale";
import { getMyOrders, cancelOrderRequest } from "@/lib/api";
import type { Order } from "@/types";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

const Profile = () => {
  // ✅ Hooks ALWAYS called in same order
  const { user } = useAuth();
  const { isArabic } = useLanguage();
  const isAuthenticated = !!user;

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [open, setOpen] = useState(false);
  const [delayDone, setDelayDone] = useState(false);

  // ✅ NEW: cancel confirmation state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDelayDone(true), 800);
    return () => clearTimeout(t);
  }, []);

  const labels = useMemo(
    () =>
      isArabic
        ? {
            loadingGate: "Loading...",
            title: "ملفي",
            titleHighlight: "الشخصي",
            fallbackUser: "مستخدم",
            roleAdmin: "مدير",
            roleCustomer: "عميل مسجّل",
            totalOrders: "إجمالي الطلبات",
            lastOrder: "آخر طلب",
            ordersTitle: "سجل الطلبات",
            ordersLoading: "جاري تحميل الطلبات...",
            ordersError: "حدث خطأ أثناء تحميل الطلبات",
            emptyOrdersTitle: "لم تقوم بإجراء أي طلب بعد.",
            emptyOrdersBody: "عند أول عملية شراء — سيظهر الطلب هنا.",
            thOrder: "رقم الطلب",
            thDate: "التاريخ",
            thProducts: "المنتجات",
            thTotal: "الإجمالي",
            thStatus: "الحالة",
            thDetails: "التفاصيل",
            thCancel: "إلغاء",
            view: "عرض",
            cancel: "إلغاء",
            cancelNotAllowed:
              "لا يمكن إلغاء الطلب بعد ساعتين أو إذا لم يعد قيد المعالجة",
            cancelSuccess: "تم إلغاء الطلب",
            cancelError: "فشل إلغاء الطلب",
            dialogTitle: (id: string) => `تفاصيل الطلب #${id}`,
            quantity: "الكمية",
            totalToPay: "الإجمالي للدفع:",

            // ✅ NEW: confirmation labels
            confirmCancelTitle: "تأكيد الإلغاء",
            confirmCancelDesc:
              "هل أنت متأكد أنك تريد إلغاء هذا الطلب؟ لا يمكن التراجع عن ذلك.",
            confirmCancelYes: "نعم، إلغاء",
            confirmCancelNo: "لا",
            alreadyCanceled: "الطلب ملغي بالفعل.",
            cancelTooLate:
              "لا يمكن إلغاء الطلب لأنه مرّ أكثر من ساعتين على إنشائه.",
          }
        : {
            loadingGate: "טוען...",
            title: "הפרופיל",
            titleHighlight: "שלי",
            fallbackUser: "משתמש",
            roleAdmin: "מנהל",
            roleCustomer: "לקוח רשום",
            totalOrders: 'סה"כ הזמנות',
            lastOrder: "הזמנה אחרונה",
            ordersTitle: "היסטוריית הזמנות",
            ordersLoading: "טוענים הזמנות...",
            ordersError: "אירעה שגיאה בעת טעינת ההזמנות",
            emptyOrdersTitle: "לא ביצעת עדיין הזמנות.",
            emptyOrdersBody: "בביצוע הרכישה הראשונה — ההזמנה תופיע כאן.",
            thOrder: "מספר הזמנה",
            thDate: "תאריך",
            thProducts: "מוצרים",
            thTotal: 'סה"כ',
            thStatus: "סטטוס",
            thDetails: "פרטים",
            thCancel: "ביטול",
            view: "הצג",
            cancel: "בטל",
            cancelNotAllowed:
              "לא ניתן לבטל אחרי שעתיים או אם ההזמנה לא בטיפול",
            cancelSuccess: "ההזמנה בוטלה",
            cancelError: "ביטול ההזמנה נכשל",
            dialogTitle: (id: string) => `פרטי הזמנה #${id}`,
            quantity: "כמות",
            totalToPay: 'סה"כ לתשלום:',

            // ✅ NEW: confirmation labels
            confirmCancelTitle: "אישור ביטול",
            confirmCancelDesc:
              "בטוח שברצונך לבטל את ההזמנה? לא ניתן לבטל פעולה זו.",
            confirmCancelYes: "כן, בטל",
            confirmCancelNo: "לא",
            alreadyCanceled: "ההזמנה כבר בוטלה.",
            cancelTooLate: "לא ניתן לבטל כי עברו יותר משעתיים מאז יצירת ההזמנה.",
          },
    [isArabic]
  );

  const locale = isArabic ? arSA : he;

  const queryClient = useQueryClient();

  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery<Order[]>({
    queryKey: ["myOrders"],
    queryFn: getMyOrders,
    enabled: isAuthenticated, // ✅ still fine (hook runs, query just disabled)
  });

  const cancelMutation = useMutation({
    mutationFn: (orderId: string) => cancelOrderRequest(orderId),
    onSuccess: (data: any) => {
      toast.success(labels.cancelSuccess);
      queryClient.invalidateQueries({ queryKey: ["myOrders"] });

      if (data?.order) {
        setSelectedOrder((prev) =>
          prev && prev.id === data.order.id ? data.order : prev
        );
      }
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || labels.cancelError;
      toast.error(msg);
    },
  });

  const canCancelOrder = (order: Order) => {
    if (order.status !== "pending") return false;
    const createdAt = new Date(order.date).getTime();
    return Date.now() - createdAt <= TWO_HOURS_MS;
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return isArabic ? "قيد المعالجة" : "בטיפול";
      case "paid":
        return isArabic ? "مدفوع" : "שולם";
      case "shipped":
        return isArabic ? "تم الشحن" : "נשלח";
      case "completed":
        return isArabic ? "مكتمل" : "הושלם";
      case "canceled":
        return isArabic ? "ملغي" : "בוטל";
      case "failed":
        return isArabic ? "فشل" : "נכשל";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "paid":
        return <CreditCard className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "canceled":
        return <XCircle className="h-4 w-4" />;
      case "failed":
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-secondary text-secondary-foreground";
      case "paid":
        return "bg-blue-600 text-white";
      case "shipped":
        return "bg-purple-600 text-white";
      case "completed":
        return "bg-green-600 text-white";
      case "canceled":
        return "bg-zinc-700 text-white";
      case "failed":
        return "bg-red-600 text-white";
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

  // ✅ NEW: request cancel -> open confirmation dialog
  const requestCancelOrder = (order: Order) => {
    const ageMs = Date.now() - new Date(order.date).getTime();

    if (order.status === "canceled") {
      toast.error(labels.alreadyCanceled);
      return;
    }

    if (ageMs > TWO_HOURS_MS) {
      toast.error(labels.cancelTooLate);
      return;
    }

    if (order.status !== "pending") {
      toast.error(labels.cancelNotAllowed);
      return;
    }

    setOrderToCancel(order);
    setConfirmOpen(true);
  };

  // ✅ NEW: confirm cancel -> actually cancel
  const confirmCancelOrder = () => {
    if (!orderToCancel) return;
    cancelMutation.mutate(orderToCancel.id);
    setConfirmOpen(false);
    setOrderToCancel(null);
  };

  // ✅ NOW it's safe to return conditionally (after hooks)
  if (!user && !delayDone) return <div>{labels.loadingGate}</div>;
  if (!user && delayDone) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen py-12" dir="rtl" lang={isArabic ? "ar" : "he"}>
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-black mb-8">
          {labels.title}{" "}
          <span className="text-gradient-primary">{labels.titleHighlight}</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card className="p-8 shadow-premium text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center">
                <UserIcon className="h-12 w-12 text-white" />
              </div>

              <h2 className="text-2xl font-bold mb-2">
                {user?.username || labels.fallbackUser}
              </h2>

              <Badge className="gradient-gold text-white">
                {user?.role === "admin" ? labels.roleAdmin : labels.roleCustomer}
              </Badge>

              <div className="mt-8 pt-8 border-t text-right space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground">
                    {labels.totalOrders}
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {isLoading || isError ? "-" : orders.length}
                  </div>
                </div>

                {lastOrder && (
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {labels.lastOrder}
                    </div>
                    <div className="text-sm font-medium">
                      {format(new Date(lastOrder.date), "dd MMMM yyyy, HH:mm", {
                        locale,
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
                {labels.ordersTitle}
              </h2>

              {isLoading ? (
                <div className="text-center py-12 text-muted-foreground">
                  {labels.ordersLoading}
                </div>
              ) : isError ? (
                <div className="text-center py-12 text-red-500">
                  {labels.ordersError}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg text-muted-foreground">
                    {labels.emptyOrdersTitle}
                    <br />
                    {labels.emptyOrdersBody}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-right border-collapse">
                    <thead>
                      <tr className="border-b text-xs text-muted-foreground">
                        <th className="py-2 px-2">{labels.thOrder}</th>
                        <th className="py-2 px-2">{labels.thDate}</th>
                        <th className="py-2 px-2">{labels.thProducts}</th>
                        <th className="py-2 px-2">{labels.thTotal}</th>
                        <th className="py-2 px-2">{labels.thStatus}</th>
                        <th className="py-2 px-2">{labels.thDetails}</th>
                        <th className="py-2 px-2">{labels.thCancel}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr
                          key={order.id}
                          className="border-b hover:bg-muted/60 cursor-pointer"
                          onClick={() => handleRowClick(order)}
                        >
                          <td className="py-2 px-2 align-middle">#{order.id}</td>
                          <td className="py-2 px-2 align-middle">
                            {format(new Date(order.date), "dd.MM.yyyy HH:mm", {
                              locale,
                            })}
                          </td>
                          <td className="py-2 px-2 align-middle">
                            {order.items.length}
                          </td>
                          <td className="py-2 px-2 align-middle font-semibold">
                            <span dir="ltr">
                              ₪{order.totalWithoutMaam.toFixed(2)}
                            </span>
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
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRowClick(order);
                              }}
                            >
                              {labels.view}
                            </Button>
                          </td>
                          <td className="py-2 px-2 align-middle">
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={cancelMutation.isPending}
                              onClick={(e) => {
                                e.stopPropagation();
                                requestCancelOrder(order); // ✅ confirmation first
                              }}
                            >
                              {labels.cancel}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* (optional) You can hide/disable cancel button if not allowed */}
                  {/* Example usage: disabled={!canCancelOrder(order)} */}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Order details dialog */}
      <Dialog open={open} onOpenChange={handleDialogChange}>
        <DialogContent className="max-w-2xl" dir="rtl" lang={isArabic ? "ar" : "he"}>
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>{labels.dialogTitle(selectedOrder.id)}</DialogTitle>
                <DialogDescription className="flex items-center justify-between mt-2">
                  <span>
                    {format(new Date(selectedOrder.date), "dd MMMM yyyy, HH:mm", {
                      locale,
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
                            {item.optionName} · {labels.quantity}: {item.quantity}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold" dir="ltr">
                        ₪{(item.priceWithoutMaam * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-base font-bold">
                    <span>{labels.totalToPay}</span>
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

      {/* ✅ NEW: Cancel confirmation dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-md" dir="rtl" lang={isArabic ? "ar" : "he"}>
          <DialogHeader>
            <DialogTitle>{labels.confirmCancelTitle}</DialogTitle>
            <DialogDescription>{labels.confirmCancelDesc}</DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setConfirmOpen(false);
                setOrderToCancel(null);
              }}
            >
              {labels.confirmCancelNo}
            </Button>

            <Button
              variant="destructive"
              disabled={cancelMutation.isPending}
              onClick={confirmCancelOrder}
            >
              {labels.confirmCancelYes}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
