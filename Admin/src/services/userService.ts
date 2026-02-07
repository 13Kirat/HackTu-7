import type { User, Role } from "@/types";
import { users, roles } from "@/mock/data";

const delay = <T>(data: T, ms = 300): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

export const userService = {
  getAll: (): Promise<User[]> => delay(users),
  getById: (id: string): Promise<User | undefined> =>
    delay(users.find((u) => u.id === id)),
  create: (user: Omit<User, "id">): Promise<User> =>
    delay({ ...user, id: `u${Date.now()}` }),
  update: (id: string, data: Partial<User>): Promise<User> => {
    const u = users.find((u) => u.id === id)!;
    return delay({ ...u, ...data });
  },
  deactivate: (id: string): Promise<{ success: boolean }> =>
    delay({ success: true }),

  getRoles: (): Promise<Role[]> => delay(roles),
  createRole: (role: Omit<Role, "id">): Promise<Role> =>
    delay({ ...role, id: `r${Date.now()}` }),
  updateRole: (id: string, data: Partial<Role>): Promise<Role> => {
    const r = roles.find((r) => r.id === id)!;
    return delay({ ...r, ...data });
  },
};
