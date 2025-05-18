// import { useEffect } from "react";

// const LoginPage = () => {
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://telegram.org/js/telegram-widget.js?22";
//     script.async = true;
//     script.setAttribute("data-telegram-login", "futdraftrobot"); // <-- Replace with your bot username (without @)
//     script.setAttribute("data-size", "large");
//     script.setAttribute("data-userpic", "false");
//     script.setAttribute("data-request-access", "write");
//     script.setAttribute("data-auth-url", `${import.meta.env.VITE_API_URL}/api/auth/telegram`); // Your backend auth URL
//     document.getElementById("telegram-login-button")?.appendChild(script);
//   }, []);

//   return (
//     <div className="flex items-center justify-center h-screen bg-gray-900">
//       <div id="telegram-login-button"></div>
//     </div>
//   );
// };

// export default LoginPage;



import { useState } from "react";

const LoginPage = () => {
  const [userId, setUserId] = useState("");

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
        // TODO: Save user in state or navigate
        console.log("Logged in:", data.user);
        alert("Login successful!");
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

