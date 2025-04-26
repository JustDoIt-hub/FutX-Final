import { useEffect } from "react";

declare global {
  interface Window {
    TelegramLoginWidget: any;
  }
}

export default function LoginWithTelegramButton({ onAuth }: { onAuth: (userData: any) => void }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute('data-telegram-login', 'YOUR_BOT_USERNAME'); // 👈 change this
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-userpic', 'false');
    script.setAttribute('data-auth-url', `${window.location.origin}/api/auth/telegram-login`);
    script.setAttribute('data-request-access', 'write');
    script.async = true;

    document.getElementById('telegram-login-button')?.appendChild(script);
  }, []);

  return (
    <div id="telegram-login-button" className="flex justify-center"></div>
  );
}
