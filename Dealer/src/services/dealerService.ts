import api from "@/lib/api";
import type { Dealer, Sale } from "@/types";

export const dealerService = {
  getCurrentDealer: async (): Promise<Dealer> => {
    const response = await api.get("/auth/profile");
    const u = response.data;
    return {
      id: u._id,
      name: u.name,
      email: u.email,
      location: u.address || "Unassigned",
      phone: u.phone || "",
      settings: u.settings
    };
  },
  
  updateProfile: async (data: Partial<Dealer>): Promise<Dealer> => {
    // Backend expects address instead of location
    const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.location,
        settings: data.settings
    };
    const response = await api.put("/auth/profile", payload);
    const u = response.data;
    return {
      id: u._id,
      name: u.name,
      email: u.email,
      location: u.address || "Unassigned",
      phone: u.phone || "",
      settings: u.settings
    };
  },

  getSalesHistory: async (): Promise<Sale[]> => {
    // Placeholder for real API
    return [];
  },
};