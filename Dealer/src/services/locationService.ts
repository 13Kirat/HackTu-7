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
  }
};
