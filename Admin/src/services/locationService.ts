import api from "@/lib/api";
import type { Location } from "@/types";

export const locationService = {
  getAll: async (): Promise<Location[]> => {
    const response = await api.get("/locations");
    return response.data.map((l: any) => ({
      id: l._id,
      name: l.name,
      type: l.type,
      address: l.address,
      managerId: l.managerId,
      coordinates: l.coordinates
    }));
  },
  getById: async (id: string): Promise<Location> => {
    const response = await api.get(`/locations/${id}`);
    const l = response.data;
    return {
      id: l._id,
      name: l.name,
      type: l.type,
      address: l.address,
      managerId: l.managerId,
      coordinates: l.coordinates
    };
  },
  create: async (location: Omit<Location, "id">): Promise<Location> => {
    const response = await api.post("/locations", location);
    const l = response.data;
    return {
      id: l._id,
      name: l.name,
      type: l.type,
      address: l.address,
      managerId: l.managerId,
      coordinates: l.coordinates
    };
  },
  update: async (id: string, data: Partial<Location>): Promise<Location> => {
    const response = await api.put(`/locations/${id}`, data);
    const l = response.data;
    return {
      id: l._id,
      name: l.name,
      type: l.type,
      address: l.address,
      managerId: l.managerId,
      coordinates: l.coordinates
    };
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/locations/${id}`);
  },
};
