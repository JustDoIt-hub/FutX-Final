import { createContext, useState, useEffect } from "react";
import { getCurrentUser } from "@/api"; // or wherever it is
import { useLocation } from "wouter";

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  setUser: (_user: any) => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getCurrentUser(); // calls /api/auth/me
        setUser(data.user);
      } catch (err) {
        console.log("User not authenticated.");
        sessionStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="text-white p-8">Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
