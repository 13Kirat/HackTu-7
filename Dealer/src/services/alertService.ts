import api from "@/lib/api";
import type { Alert } from "@/types";

export const alertService = {
  getAlerts: async (): Promise<Alert[]> => {
    const response = await api.get("/alerts");
    return response.data.map((a: any) => ({
      id: a._id,
      type: a.type,
      productId: a.productId?._id,
      productName: a.productId?.name || "Product",
      currentStock: 0, // Would need inventory fetch for this
      threshold: 0,
      recommendedAction: "Review stock levels",
      status: a.status,
      createdAt: a.createdAt
    }));
  },
  resolveAlert: async (id: string): Promise<Alert> => {
    const response = await api.put(`/alerts/${id}/resolve`);
    const a = response.data;
    return {
      id: a._id,
      type: a.type,
      productId: a.productId?._id,
      productName: a.productId?.name || "Product",
      currentStock: 0,
      threshold: 0,
      recommendedAction: "Review stock levels",
      status: a.status,
      createdAt: a.createdAt
    };
  },
};