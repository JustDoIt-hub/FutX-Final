import LoginWithTelegramButton from "../components/LoginWithTelegramButton";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Login with Telegram</h1>
      <LoginWithTelegramButton onAuth={(userData) => {
        console.log("Telegram Auth Data:", userData);
        // Here you could automatically log them in or redirect them
      }} />
    </div>
  );
}
