import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { UserProfile } from '@/types';
import api from '@/lib/api';

interface AuthUser {
  id: string;
  email: string;
  profile: UserProfile;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (data: { name: string; email: string; password: string; company?: string }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'buyer_token';
const USER_KEY = 'buyer_user';

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
      const allowedRoles = ['Buyer', 'Retailer', 'Contractor'];
      
      if (!allowedRoles.includes(roleName)) {
        logout();
        return;
      }

      const authUser: AuthUser = {
        id: userData._id,
        email: userData.email,
        profile: {
          id: userData._id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone || '',
          location: userData.address || '',
          avatar: userData.avatar || '',
          company: userData.companyId?.name || 'My Company',
          companyId: userData.companyId?._id || userData.companyId,
        }
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

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, ...userData } = response.data;

      const roleName = userData.role;
      const allowedRoles = ['Buyer', 'Retailer', 'Contractor'];
      
      if (!allowedRoles.includes(roleName)) {
        return { success: false, message: 'Access denied. Use the appropriate portal.' };
      }

      const authUser: AuthUser = {
        id: userData._id,
        email: userData.email,
        profile: {
          id: userData._id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone || '',
          location: userData.address || '',
          avatar: userData.avatar || '',
          company: 'My Company', // Backend login doesn't populate company name by default
          companyId: userData.companyId,
        }
      };

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(authUser));
      setUser(authUser);
      
      return { success: true, message: 'Login successful' };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Invalid email or password';
      return { success: false, message };
    }
  }, []);

  const register = useCallback(async (data: { name: string; email: string; password: string; company?: string }) => {
    try {
      const response = await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password
      });
      
      const { token, ...userData } = response.data;

      const authUser: AuthUser = {
        id: userData._id,
        email: userData.email,
        profile: {
          id: userData._id,
          name: userData.name,
          email: userData.email,
          phone: '',
          location: '',
          avatar: '',
          company: data.company || 'My Company',
          companyId: userData.companyId,
        }
      };

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(authUser));
      setUser(authUser);
      
      return { success: true, message: 'Account created' };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      return { success: false, message };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const updateProfile = useCallback((data: Partial<UserProfile>) => {
    // For now, local update. Ideally would call API PUT /buyer/profile
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, profile: { ...prev.profile, ...data } };
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}