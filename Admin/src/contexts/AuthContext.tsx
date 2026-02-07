import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { User } from "@/types";
import api from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.get("/auth/profile");
      const userData = response.data;
      
      // Ensure role is Admin
      const roleName = userData.role?.name || userData.role;
      if (roleName !== "Company Admin" && roleName !== "Super Admin") {
        logout();
        return;
      }

      setUser({
        id: userData._id,
        name: userData.name,
        email: userData.email,
        role: roleName,
        companyId: userData.companyId?._id || userData.companyId,
      });
    } catch (error) {
      console.error("Auth check failed:", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, ...userData } = response.data;

      // Ensure the user logging in has Admin role
      const roleName = userData.role; // Backend returns role name as string in login response
      if (roleName !== "Company Admin" && roleName !== "Super Admin") {
        setIsLoading(false);
        return { success: false, error: "Access denied. Only Admins can login to this panel." };
      }

      const userObj: User = {
        id: userData._id,
        name: userData.name,
        email: userData.email,
        role: roleName,
        companyId: userData.companyId,
      };

      localStorage.setItem("auth_token", token);
      setUser(userObj);
      setIsLoading(false);
      return { success: true };
    } catch (error: any) {
      setIsLoading(false);
      const message = error.response?.data?.message || "Login failed. Please check your credentials.";
      return { success: false, error: message };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("auth_token");
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
