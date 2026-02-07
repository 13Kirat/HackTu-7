import { notifications as mockNotifications } from "@/mock/notificationData";
import type { Notification } from "@/types";

export const notificationService = {
  getNotifications: (): Promise<Notification[]> => Promise.resolve(mockNotifications),
  markAsRead: (id: string): Promise<void> => Promise.resolve(),
  markAllAsRead: (): Promise<void> => Promise.resolve(),
  deleteNotification: (id: string): Promise<void> => Promise.resolve(),
};
