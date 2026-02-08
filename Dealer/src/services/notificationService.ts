import api from "@/lib/api";
import type { Notification } from "@/types";

export const notificationService = {
  getNotifications: async (): Promise<Notification[]> => {
    const response = await api.get("/notifications");
    return response.data.map((n: any) => ({
      id: n._id,
      type: n.type === 'system' ? 'system' : 'order', // Map backend types to frontend NotificationType
      title: n.title,
      message: n.message,
      read: false,
      createdAt: n.createdAt,
      actionUrl: n.targetRoles?.includes('Dealer') ? '/dealer-orders' : undefined
    }));
  },
  markAsRead: async (id: string): Promise<void> => {
    // Currently backend doesn't have mark read for broadcast notifs per user
    // We could implement this in a real app, for now just resolve locally
    return Promise.resolve();
  },
  markAllAsRead: (): Promise<void> => Promise.resolve(),
  deleteNotification: async (id: string): Promise<void> => {
    // Admins can delete, but can dealers? Usually not. 
    // We'll keep it local or hidden for dealers.
    return Promise.resolve();
  },
};