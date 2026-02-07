import api from "@/lib/api";

export const shipmentService = {
  getAll: async () => {
    const response = await api.get("/shipments");
    return response.data;
  },
  create: async (data: { orderId: string; carrier?: string; trackingNumber?: string }) => {
    const response = await api.post("/shipments", data);
    return response.data;
  },
  updateStatus: async (id: string, status: string) => {
    const response = await api.put(`/shipments/${id}/status`, { status });
    return response.data;
  }
};
