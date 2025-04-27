import { createContext, useState, ReactNode, useEffect } from "react";
import { useLocation } from "wouter"; // for redirection
import api from "../api"; // import your API

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
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setLoading(false);
    } else {
      // if not in session storage, try to fetch user
      const fetchUser = async () => {
        try {
          const res = await api.get("/auth/me"); // calling your backend
          if (res?.data) {
            setUser(res.data);
            sessionStorage.setItem("user", JSON.stringify(res.data));
          } else {
            console.error("No user data received.");
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }
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
