import { alerts } from "@/mock/data";
import type { Alert } from "@/types";

export const alertService = {
  getAlerts: (): Promise<Alert[]> => Promise.resolve(alerts),
  resolveAlert: (id: string): Promise<Alert> => {
    const alert = alerts.find(a => a.id === id);
    if (!alert) return Promise.reject(new Error("Alert not found"));
    return Promise.resolve({ ...alert, status: "resolved" as const });
  },
};
