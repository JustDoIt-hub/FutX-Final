import { createContext, useState, useEffect, ReactNode } from "react";
import { useLocation } from "wouter";
import { login as apiLogin, logout as apiLogout } from "../api";

interface User {
  id: number;
  username: string;
  coins: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userId: number) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  setUser: () => {},
  loading: true,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  // ✅ Login function
  const login = async (userId: number) => {
    try {
      const loggedInUser = await apiLogin(userId); // returns user
      setUser(loggedInUser);
      sessionStorage.setItem("user", JSON.stringify(loggedInUser));
      setLocation("/");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const logout = () => {
    apiLogout().catch(console.error);
    setUser(null);
    sessionStorage.removeItem("user");
    setLocation("/login");
  };

  // ✅ On mount, read from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        setUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
