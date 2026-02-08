import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import type { Notification } from "@/types";
import { notificationService } from "@/services/notificationService";
import { alertService } from "@/services/alertService";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  addNotification: (n: Omit<Notification, "id" | "read" | "createdAt">) => void;
  refresh: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchAll = useCallback(async () => {
    try {
      // 1. Fetch Automated Alerts (mapped to Notifications)
      const alerts = await alertService.getAlerts();
      const alertNotifs: Notification[] = alerts.map(a => ({
        id: a.id,
        type: a.type.includes('stock') ? 'stock' : 'alert',
        title: a.type.replace('_', ' ').toUpperCase(),
        message: `${a.productName} Alert: ${a.recommendedAction || 'Action Required'}`,
        read: a.status === 'resolved',
        createdAt: a.createdAt,
        actionUrl: '/alerts'
      }));

      // 2. Fetch Broadcast Notifications
      const broadcasts = await notificationService.getNotifications();

      // Combine and sort by date desc
      const combined = [...alertNotifs, ...broadcasts].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = useCallback(async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    // If it was an alert, resolve it in backend
    try {
        await alertService.resolveAlert(id);
    } catch (e) {
        // Might be a broadcast notif, ignore
    }
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

  return (
    <NotificationContext.Provider value={{ 
        notifications, 
        unreadCount, 
        markAsRead, 
        markAllAsRead, 
        deleteNotification, 
        clearAll, 
        addNotification,
        refresh: fetchAll
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}