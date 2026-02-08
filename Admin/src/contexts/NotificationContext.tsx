import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import api from "@/lib/api";
import { notificationService } from "@/services/notificationService";

export interface Notification {
  id: string;
  type: "low_stock" | "overstock" | "high_demand" | "info" | "success" | "warning" | "system";
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
  refresh: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchAll = useCallback(async () => {
    try {
      // 1. Fetch Automated Alerts
      const alertsRes = await api.get("/alerts");
      const alerts = alertsRes.data.map((a: any) => ({
        id: a._id,
        type: a.type,
        title: a.type.replace("_", " ").toUpperCase(),
        message: a.message,
        timestamp: a.createdAt,
        read: a.status === 'resolved'
      }));

      // 2. Fetch Broadcast Notifications
      const notifsRes = await notificationService.getAll();
      const broadcasts = notifsRes.map((n: any) => ({
        id: n._id,
        type: n.type || "system",
        title: n.title,
        message: n.message,
        timestamp: n.createdAt,
        read: false // Broadcasts are usually unread for everyone initially
      }));

      // Combine and sort
      const combined = [...alerts, ...broadcasts].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setNotifications(combined);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [fetchAll]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback(async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    // If it's an alert, we could resolve it in backend
    try {
        await api.put(`/alerts/${id}/resolve`);
    } catch (e) {
        // Ignore if it was a broadcast notification
    }
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

  return (
    <NotificationContext.Provider value={{ 
        notifications, 
        unreadCount, 
        markAsRead, 
        markAllAsRead, 
        dismiss, 
        clearAll,
        refresh: fetchAll 
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotifications must be used within NotificationProvider");
  return context;
}