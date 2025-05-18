import { useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useLocation } from "wouter";

const LoginPage = () => {
  const [userId, setUserId] = useState("");
  const { setUser } = useContext(AuthContext);
  const [, setLocation] = useLocation();

  const handleLogin = async () => {
    if (!userId.trim()) {
      alert("Please enter a valid User ID");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login?userId=${userId}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (data.user) {
        // ✅ Update context and sessionStorage
        setUser(data.user);
        sessionStorage.setItem("user", JSON.stringify(data.user));
        setLocation("/"); // ✅ redirect after login
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("An error occurred during login");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white space-y-4">
      <h1 className="text-2xl font-semibold">Login</h1>
      <input
        type="text"
        placeholder="Enter your User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="p-2 rounded text-black"
      />
      <button
        onClick={handleLogin}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
      >
        Login
      </button>
    </div>
  );
};

export default LoginPage;
