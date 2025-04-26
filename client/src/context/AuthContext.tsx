import { createContext, useState, ReactNode, useEffect } from 'react';
import { useLocation } from "wouter"; // to redirect

// Simplified user interface
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
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  logout: () => {},
  setUser: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [location, setLocation] = useLocation();

  const logout = () => {
    setUser(null);
    setLocation("/login"); // redirect to login page
  };

  useEffect(() => {
    // optional: load user from localStorage/sessionStorage if you want persistence
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      sessionStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.removeItem("user");
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
