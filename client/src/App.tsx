import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext"; // your AuthContext
import { Switch, Route, Redirect } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import Spin from "@/pages/Spin";
import TeamBattle from "@/pages/TeamBattle";
import Collection from "@/pages/Collection";
import NotFound from "@/pages/not-found";
import Tournaments from "@/pages/Tournaments";
import TournamentDetails from "@/pages/TournamentDetails";
import TournamentCreate from "@/pages/TournamentCreate";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTelegram } from "@/hooks/useTelegram";
import Draft from "@/pages/Draft";
import LoginPage from "@/pages/Login";

// Shop page
const Shop = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold text-white mb-6">FUT Shop</h1>
    <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl shadow-xl p-6">
      <p className="text-white text-lg">Shop items will be displayed here.</p>
    </div>
  </div>
);

function Router() {
  const { tg, user, theme } = useTelegram();
  const { isAuthenticated, loading } = useContext(AuthContext);

  useEffect(() => {
    if (tg) {
      tg.ready();
      tg.expand();
      document.body.style.backgroundColor = theme?.bg_color || "#111827";
    }
  }, [tg, theme]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      {isAuthenticated && <Header />}
      <main className="flex-grow">
        <Switch>
          <Route path="/login" component={LoginPage} />
          {/* 👇 protected routes */}
          <ProtectedRoute path="/" component={Home} />
          <ProtectedRoute path="/spin" component={Spin} />
          <ProtectedRoute path="/draft" component={Draft} />
          <ProtectedRoute path="/team-battle" component={TeamBattle} />
          <ProtectedRoute path="/collection" component={Collection} />
          <ProtectedRoute path="/shop" component={Shop} />
          <ProtectedRoute path="/tournaments" component={Tournaments} />
          <ProtectedRoute path="/tournaments/create" component={TournamentCreate} />
          <ProtectedRoute path="/tournaments/:id" component={TournamentDetails} />
          <Route component={NotFound} />
        </Switch>
      </main>
      {isAuthenticated && <Footer />}
      <Toaster />
    </div>
  );
}

// 👇 helper ProtectedRoute
function ProtectedRoute({ component: Component, path }: { component: any, path: string }) {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return <Route path={path} component={Component} />;
}

function App() {
  return <Router />;
}

export default App;
