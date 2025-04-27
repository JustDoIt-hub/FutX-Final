import { useEffect } from "react";

const LoginPage = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", "futdraftrobot"); // <-- Replace with your bot username (without @)
    script.setAttribute("data-size", "large");
    script.setAttribute("data-userpic", "false");
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-auth-url", `${import.meta.env.VITE_API_URL}/api/auth/login`); // Your backend auth URL
    document.getElementById("telegram-login-button")?.appendChild(script);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div id="telegram-login-button"></div>
    </div>
  );
};

export default LoginPage;
