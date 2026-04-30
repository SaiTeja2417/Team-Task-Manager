import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser } from '../types';

const API_URL = "http://localhost:5000/api";

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<any>;
  signup: (email: string, password: string, name: string) => Promise<any>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("authUser");
    if (saved) setUser(JSON.parse(saved));
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) return { success: false, error: data.message };

      localStorage.setItem("authUser", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      setUser(data.user);

      return { success: true };
    } catch {
      return { success: false, error: "Server error" };
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, password, name })
      });

      const data = await res.json();

      if (!res.ok) return { success: false, error: data.message };

      localStorage.setItem("authUser", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      setUser(data.user);

      return { success: true };
    } catch {
      return { success: false, error: "Server error" };
    }
  };

const logout = () => {
  localStorage.removeItem("authUser");
  localStorage.removeItem("token");
  setUser(null);
};

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("Auth error");
  return ctx;
};