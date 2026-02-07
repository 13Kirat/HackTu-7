import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { alerts as mockAlerts } from "@/mock/data";

export interface Notification {
  id: string;
  type: "low_stock" | "overstock" | "high_demand" | "info" | "success" | "warning";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismiss: (id: string) => void;
  clearAll: () => void;
  addNotification: (n: Omit<Notification, "id" | "timestamp" | "read">) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Seed from mock alerts
const seedNotifications: Notification[] = mockAlerts.map((a) => ({
  id: a.id,
  type: a.type,
  title: `${a.type.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}`,
  message: `${a.productName} — ${a.locationName}`,
  timestamp: a.timestamp,
  read: false,
}));

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(seedNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const addNotification = useCallback((n: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotif: Notification = {
      ...n,
      id: `n${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, dismiss, clearAll, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotifications must be used within NotificationProvider");
  return context;
}
