import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { UserProfile } from '@/types';
import { mockProfile } from '@/mock/data';

interface AuthUser {
  id: string;
  email: string;
  profile: UserProfile;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (data: { name: string; email: string; password: string; company: string }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'supplyhub_auth';
const USERS_KEY = 'supplyhub_users';

// Seed a demo account
const DEMO_USER = {
  email: 'rajesh.kumar@example.com',
  password: 'password123',
  profile: mockProfile,
};

function getStoredUsers(): Record<string, { password: string; profile: UserProfile }> {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      // Seed demo user
      const seed: Record<string, { password: string; profile: UserProfile }> = {
        [DEMO_USER.email]: { password: DEMO_USER.password, profile: DEMO_USER.profile },
      };
      localStorage.setItem(USERS_KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveUsers(users: Record<string, { password: string; profile: UserProfile }>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch { /* ignore */ }
    setIsLoading(false);
  }, []);

  const persistSession = (authUser: AuthUser | null) => {
    if (authUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    setUser(authUser);
  };

  const login = useCallback(async (email: string, password: string) => {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 500));
    const users = getStoredUsers();
    const entry = users[email.toLowerCase()];
    if (!entry || entry.password !== password) {
      return { success: false, message: 'Invalid email or password' };
    }
    const authUser: AuthUser = { id: entry.profile.id, email: email.toLowerCase(), profile: entry.profile };
    persistSession(authUser);
    return { success: true, message: 'Login successful' };
  }, []);

  const register = useCallback(async (data: { name: string; email: string; password: string; company: string }) => {
    await new Promise(r => setTimeout(r, 500));
    const users = getStoredUsers();
    if (users[data.email.toLowerCase()]) {
      return { success: false, message: 'An account with this email already exists' };
    }
    const profile: UserProfile = {
      id: `USR-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: '',
      location: '',
      avatar: '',
      company: data.company,
    };
    users[data.email.toLowerCase()] = { password: data.password, profile };
    saveUsers(users);
    const authUser: AuthUser = { id: profile.id, email: data.email.toLowerCase(), profile };
    persistSession(authUser);
    return { success: true, message: 'Account created' };
  }, []);

  const logout = useCallback(() => {
    persistSession(null);
  }, []);

  const updateProfile = useCallback((data: Partial<UserProfile>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, profile: { ...prev.profile, ...data } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      // Also update the users store
      const users = getStoredUsers();
      if (users[prev.email]) {
        users[prev.email].profile = updated.profile;
        saveUsers(users);
      }
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
