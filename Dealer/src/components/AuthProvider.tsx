import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "supplyhub_auth_user";
const USERS_KEY = "supplyhub_users";

interface StoredUser {
  id: string;
  email: string;
  name: string;
  password: string;
}

function getStoredUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {}
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const users = getStoredUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) throw new Error("Invalid email or password");
    const authUser: AuthUser = { id: found.id, email: found.email, name: found.name };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    setUser(authUser);
  };

  const signup = async (name: string, email: string, password: string) => {
    const users = getStoredUsers();
    if (users.find(u => u.email === email)) throw new Error("Email already registered");
    const newUser: StoredUser = { id: crypto.randomUUID(), email, name, password };
    saveUsers([...users, newUser]);
    const authUser: AuthUser = { id: newUser.id, email, name };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    setUser(authUser);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
