import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { FaFutbol, FaGamepad, FaFootballBall, FaTrophy } from "react-icons/fa";
import { motion } from "framer-motion";

const Home = () => {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <div className="flex justify-center mb-4">
          <FaFootballBall className="text-yellow-400 text-5xl" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          FUT Draft Spin
        </h1>
        <p className="text-gray-300 max-w-3xl mx-auto text-lg">
          Spin to collect players, build your dream team, and battle against opponents in exciting matches!
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
        >
          <div className="p-8">
            <div className="bg-yellow-400 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <FaFutbol className="text-3xl text-gray-900" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Player Spin</h2>
            <p className="text-gray-200 mb-6 min-h-[80px]">
              Spin the wheel to get new players for your collection. Combine position, event, and rating to find rare cards with high stats!
            </p>
            <Button 
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-6 py-3 text-lg rounded-full"
              onClick={() => setLocation("/spin")}
            >
              Start Spinning
            </Button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
        >
          <div className="p-8">
            <div className="bg-yellow-400 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <FaGamepad className="text-3xl text-gray-900" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Team Battle</h2>
            <p className="text-gray-200 mb-6 min-h-[80px]">
              Create your ultimate team with different formations and play styles. Challenge CPU teams in exciting matches with real-time commentary!
            </p>
            <Button 
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-6 py-3 text-lg rounded-full"
              onClick={() => setLocation("/team-battle")}
            >
              Battle Now
            </Button>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-16 text-center"
      >
        <div className="flex justify-center items-center gap-2 text-lg text-yellow-400 mb-4">
          <FaTrophy />
          <span>You have <strong>{user.coins.toLocaleString()}</strong> coins</span>
        </div>
        <p className="text-gray-400 max-w-xl mx-auto">
          Spin for players, build your ultimate team, and battle against CPU teams to earn more coins and glory!
        </p>
      </motion.div>
    </div>
  );
};

export default Home;
