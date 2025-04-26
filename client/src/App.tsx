import { useEffect } from "react";
import { Switch, Route } from "wouter";
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
import LoginPage from "@/pages/Login"; // 🆕 import your login page

// Placeholder Shop page
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

  useEffect(() => {
    if (tg) {
      tg.ready();
      tg.expand();
      document.body.style.backgroundColor = theme?.bg_color || "#111827"; // fallback to Tailwind's gray-900
    }
  }, [tg, theme]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/spin" component={Spin} />
          <Route path="/draft" component={Draft} />
          <Route path="/team-battle" component={TeamBattle} />
          <Route path="/collection" component={Collection} />
          <Route path="/shop" component={Shop} />
          <Route path="/tournaments" component={Tournaments} />
          <Route path="/tournaments/create" component={TournamentCreate} />
          <Route path="/tournaments/:id" component={TournamentDetails} />
          <Route path="/login" component={LoginPage} /> {/* 🆕 added /login */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

function App() {
  return <Router />;
}

export default App;
