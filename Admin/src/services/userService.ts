import api from "@/lib/api";
import type { User, Role } from "@/types";

export const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get("/users");
    return response.data.map((u: any) => ({
      id: u._id,
      name: u.name,
      email: u.email,
      role: u.role?.name || u.role,
      location: u.locationId?.name || "Unassigned",
      status: u.isActive ? "active" : "inactive",
    }));
  },
  getById: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    const u = response.data;
    return {
      id: u._id,
      name: u.name,
      email: u.email,
      role: u.role?.name || u.role,
      location: u.locationId?.name || "Unassigned",
      status: u.isActive ? "active" : "inactive",
    };
  },
  create: async (user: any): Promise<User> => {
    const response = await api.post("/users", user);
    return response.data;
  },
  update: async (id: string, data: any): Promise<User> => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  getRoles: async (): Promise<Role[]> => {
    const response = await api.get("/roles");
    return response.data.map((r: any) => ({
      id: r._id,
      name: r.name,
      description: r.description || "No description",
      permissions: r.permissions || [],
    }));
  },
  createRole: async (role: any): Promise<Role> => {
    const response = await api.post("/roles", role);
    return response.data;
  },
  updateRole: async (id: string, data: any): Promise<Role> => {
    const response = await api.put(`/roles/${id}`, data);
    return response.data;
  },
  deleteRole: async (id: string): Promise<void> => {
    await api.delete(`/roles/${id}`);
  },
};