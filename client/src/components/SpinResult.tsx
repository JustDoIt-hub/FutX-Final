import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import PlayerCard from "./PlayerCard";
import { Link } from "wouter";
import { SpinResult as SpinResultType } from "@/hooks/useSpin";
import { FaFutbol, FaStar, FaTrophy } from "react-icons/fa";
import confetti from "canvas-confetti";
import { useEffect } from "react";

interface SpinResultProps {
  result: SpinResultType;
  onReset: () => void;
}

const SpinResult = ({ result, onReset }: SpinResultProps) => {
  if (!result || !result.player) {
    return null;
  }

  // Use confetti effect when a high-rated player is obtained
  useEffect(() => {
    if (result.player && result.player.overall >= 90) {
      confetti({
        particleCount: 200,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [result]);

  // Format the event name
  const formatEvent = (event: string) => {
    return event.replace(/_/g, " ");
  };

  return (
    <motion.div 
      className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl shadow-xl p-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-2xl font-bold mb-6 text-center text-white flex items-center justify-center">
        <FaTrophy className="text-yellow-400 mr-2" /> PLAYER ACQUIRED!
      </h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left side - Player card */}
        <div className="flex justify-center items-center">
          <PlayerCard player={result.player} size="lg" />
        </div>
        
        {/* Right side - Player details and stats */}
        <div className="text-white">
          <div className="bg-gray-900 rounded-lg p-4 mb-4">
            <h4 className="text-2xl font-bold text-yellow-400 mb-2">{result.player.name}</h4>
            
            <div className="flex items-center mb-4">
              <div className="bg-yellow-400 text-gray-900 rounded-full h-8 w-8 flex items-center justify-center font-bold mr-2">
                {result.player.position}
              </div>
              <span className="text-sm text-gray-300 uppercase mr-3">{formatEvent(result.player.event)}</span>
              <div className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-md px-2 py-1 flex items-center ml-auto">
                <span className="font-bold text-lg">{result.player.overall}</span>
                <FaStar className="ml-1 text-white text-sm" />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-800 rounded p-2 text-center">
                <div className="text-2xl font-bold text-green-400">{result.player.pace}</div>
                <div className="text-xs text-gray-400">PACE</div>
              </div>
              <div className="bg-gray-800 rounded p-2 text-center">
                <div className="text-2xl font-bold text-green-400">{result.player.shooting}</div>
                <div className="text-xs text-gray-400">SHOOTING</div>
              </div>
              <div className="bg-gray-800 rounded p-2 text-center">
                <div className="text-2xl font-bold text-green-400">{result.player.passing}</div>
                <div className="text-xs text-gray-400">PASSING</div>
              </div>
              <div className="bg-gray-800 rounded p-2 text-center">
                <div className="text-2xl font-bold text-green-400">{result.player.dribbling}</div>
                <div className="text-xs text-gray-400">DRIBBLING</div>
              </div>
              <div className="bg-gray-800 rounded p-2 text-center">
                <div className="text-2xl font-bold text-green-400">{result.player.defense}</div>
                <div className="text-xs text-gray-400">DEFENSE</div>
              </div>
              <div className="bg-gray-800 rounded p-2 text-center">
                <div className="text-2xl font-bold text-green-400">{result.player.physical}</div>
                <div className="text-xs text-gray-400">PHYSICAL</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button
                className="bg-yellow-500 hover:bg-yellow-600 font-bold transition-colors"
                onClick={onReset}
              >
                <FaFutbol className="mr-2" /> SPIN AGAIN
              </Button>
              
              <Button
                  className="border border-yellow-500 bg-transparent hover:bg-yellow-500/10 font-bold transition-colors"
                  variant="outline"
                  onClick={() => window.location.href = "/team-battle"}
                >
                  CREATE TEAM
                </Button>
            </div>
          </div>
          
          <div className="text-center text-gray-400 text-sm">
            <p>This player has been added to your collection</p>
            <p>Use the player to create a team and battle against the CPU!</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SpinResult;
