import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { User } from "@/types";
import { users } from "@/mock/data";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("auth_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 800));

    if (!email || !password) {
      setIsLoading(false);
      return { success: false, error: "Email and password are required" };
    }

    if (password.length < 6) {
      setIsLoading(false);
      return { success: false, error: "Password must be at least 6 characters" };
    }

    // Check mock users (any password >= 6 chars works for mock)
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      setIsLoading(false);
      return { success: false, error: "No account found with this email" };
    }

    if (found.status === "inactive") {
      setIsLoading(false);
      return { success: false, error: "This account has been deactivated" };
    }

    setUser(found);
    localStorage.setItem("auth_user", JSON.stringify(found));
    setIsLoading(false);
    return { success: true };
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    if (!name || !email || !password) {
      setIsLoading(false);
      return { success: false, error: "All fields are required" };
    }

    if (password.length < 6) {
      setIsLoading(false);
      return { success: false, error: "Password must be at least 6 characters" };
    }

    const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      setIsLoading(false);
      return { success: false, error: "An account with this email already exists" };
    }

    const newUser: User = {
      id: `u${Date.now()}`,
      name,
      email,
      role: "viewer",
      location: "Unassigned",
      status: "active",
    };

    setUser(newUser);
    localStorage.setItem("auth_user", JSON.stringify(newUser));
    setIsLoading(false);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("auth_user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
