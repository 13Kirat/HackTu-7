import api from "@/lib/api";

export const orderService = {
  getAll: async () => {
    const response = await api.get("/orders");
    return response.data;
  },
  createDealerOrder: async (data: { fromLocationId: string; toLocationId: string; items: { productId: string; quantity: number }[] }) => {
    const response = await api.post("/orders/dealer", data);
    return response.data;
  },
  updateStatus: async (id: string, status: string) => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  }
};
