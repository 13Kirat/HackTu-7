import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import api from "@/lib/api";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  locationId?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "dealer_token";
const USER_KEY = "dealer_auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.get('/auth/profile');
      const userData = response.data;
      
      const roleName = userData.role?.name || userData.role;
      const allowedRoles = ['Dealer', 'Factory Manager', 'Operator', 'operator', 'manager', 'dealer'];
      
      const normalizedRole = roleName.toLowerCase();
      const isAllowed = allowedRoles.some(r => r.toLowerCase() === normalizedRole);

      if (!isAllowed) {
        logout();
        return;
      }

      const authUser: AuthUser = {
        id: userData._id,
        email: userData.email,
        name: userData.name,
        role: roleName,
        locationId: userData.locationId?._id || userData.locationId
      };
      
      setUser(authUser);
      localStorage.setItem(USER_KEY, JSON.stringify(authUser));
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, ...userData } = response.data;

    const roleName = userData.role;
    const allowedRoles = ['Dealer', 'Factory Manager', 'Operator', 'operator', 'manager', 'dealer'];
    
    const normalizedRole = roleName.toLowerCase();
    const isAllowed = allowedRoles.some(r => r.toLowerCase() === normalizedRole);

    if (!isAllowed) {
      throw new Error("Access denied. Only Operators, Managers, and Dealers can login to this portal.");
    }

    const authUser: AuthUser = {
      id: userData._id,
      email: userData.email,
      name: userData.name,
      role: roleName,
      locationId: userData.locationId
    };

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(authUser));
    setUser(authUser);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}