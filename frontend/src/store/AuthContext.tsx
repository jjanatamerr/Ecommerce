import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface AuthContextType {
  token: string | null;
  fullName: string | null;
  role: string | null;
  setAuth: (token: string, fullName: string, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [fullName, setFullName] = useState<string | null>(localStorage.getItem("fullName"));
  const [role, setRole] = useState<string | null>(localStorage.getItem("role"));

  const setAuth = (newToken: string, newFullName: string, newRole: string) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("fullName", newFullName);
    localStorage.setItem("role", newRole);
    setToken(newToken);
    setFullName(newFullName);
    setRole(newRole);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("fullName");
    localStorage.removeItem("role");
    setToken(null);
    setFullName(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, fullName, role, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};