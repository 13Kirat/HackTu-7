import api from "@/lib/api";

export const companyService = {
  get: async (id: string) => {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/companies/${id}`, data);
    return response.data;
  }
};
