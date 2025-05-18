import { createContext, useState, ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import * as api from "../api";

interface User {
  id: number;
  username: string;
  coins: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  logout: () => void;
  setUser: (user: User) => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
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

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    setLocation("/login");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.getCurrentUser(); // checks if session is valid
        if (res?.data) {
          setUser(res.data);
          sessionStorage.setItem("user", JSON.stringify(res.data));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser(); // always try fetching fresh user from backend
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        logout,
        setUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
