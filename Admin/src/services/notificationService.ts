import api from "@/lib/api";

export const notificationService = {
  getAll: async () => {
    const response = await api.get("/notifications");
    return response.data;
  },
  create: async (data: { title: string; message: string; type: string; targetRoles?: string[] }) => {
    const response = await api.post("/notifications", data);
    return response.data;
  },
  delete: async (id: string) => {
    await api.delete(`/notifications/${id}`);
  }
};
