import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import type { Notification } from "@/types";

const now = "2026-02-07T";

const initialNotifications: Notification[] = [
  { id: "N001", type: "order", title: "Order Confirmed", message: "ORD-003 for 20× Hydraulic Valve HV50 has been confirmed by Warehouse B.", read: false, createdAt: `${now}10:30:00`, actionUrl: "/order-tracking" },
  { id: "N002", type: "stock", title: "Low Stock Alert", message: "Safety Valve SV15 has dropped below reorder level (18/25 units).", read: false, createdAt: `${now}09:45:00`, actionUrl: "/alerts", meta: { productId: "P007" } },
  { id: "N003", type: "order", title: "Shipment Update", message: "ORD-002 is now in transit via Highway 45. Estimated delivery: Feb 5.", read: false, createdAt: `${now}08:15:00`, actionUrl: "/order-tracking" },
  { id: "N004", type: "alert", title: "High Demand Forecast", message: "Industrial Pump X200 demand forecasted to rise 35% next quarter.", read: true, createdAt: "2026-02-06T16:00:00", actionUrl: "/alerts" },
  { id: "N005", type: "promotion", title: "New Coupon Available", message: "SPRING25 — 25% off all products starting March 1.", read: true, createdAt: "2026-02-06T14:30:00", actionUrl: "/coupons" },
  { id: "N006", type: "system", title: "Profile Updated", message: "Your dealer profile information was updated successfully.", read: true, createdAt: "2026-02-06T11:00:00", actionUrl: "/profile" },
  { id: "N007", type: "order", title: "Order Delivered", message: "ORD-001 has been delivered to your location.", read: true, createdAt: "2026-01-22T15:00:00", actionUrl: "/order-tracking" },
  { id: "N008", type: "stock", title: "Control Panel CP80 Low Stock", message: "Control Panel CP80 stock is at 42 units, below the 50-unit threshold.", read: true, createdAt: "2026-02-03T09:00:00", actionUrl: "/alerts" },
  { id: "N009", type: "order", title: "Dealer Order Received", message: "Beta Supplies sent you 15× Safety Valve SV15. Review the order.", read: false, createdAt: `${now}07:00:00`, actionUrl: "/dealer-orders" },
  { id: "N010", type: "system", title: "Scheduled Maintenance", message: "Platform maintenance scheduled for Feb 10, 2:00–4:00 AM IST.", read: false, createdAt: `${now}06:00:00` },
];

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  addNotification: (n: Omit<Notification, "id" | "read" | "createdAt">) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const addNotification = useCallback((n: Omit<Notification, "id" | "read" | "createdAt">) => {
    const newNotif: Notification = {
      ...n,
      id: `N-${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [newNotif, ...prev]);
    toast(n.title, { description: n.message });
  }, []);

  // Simulate a real-time notification arriving after 15 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      addNotification({
        type: "order",
        title: "New Order Update",
        message: "ORD-004 has been confirmed and is being prepared for shipment.",
        actionUrl: "/order-tracking",
      });
    }, 15000);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}
