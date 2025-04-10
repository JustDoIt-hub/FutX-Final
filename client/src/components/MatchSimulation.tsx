import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import MatchCommentary from "./MatchCommentary";
import FootballPitch from "./FootballPitch";
import { FaFastForward, FaFlag, FaPause, FaPlay } from "react-icons/fa";

interface MatchSimulationProps {
  isSimulating: boolean;
  matchState: any;
  matchEvents: any[];
  userTeam: any;
  cpuTeam: any;
  onEndMatch: () => void;
}

const MatchSimulation = ({
  isSimulating,
  matchState,
  matchEvents,
  userTeam,
  cpuTeam,
  onEndMatch
}: MatchSimulationProps) => {
  const [isPaused, setIsPaused] = useState(false);
  const [ballPosition, setBallPosition] = useState({ x: 50, y: 50 });
  const [activePlayers, setActivePlayers] = useState<any[]>([]);
  const previousEvents = useRef<any[]>([]);

  // Handle ball movement based on match events
  useEffect(() => {
    if (!matchEvents || matchEvents.length === 0) return;
    
    // If new event is different from previous event
    if (matchEvents[0] !== previousEvents.current[0]) {
      previousEvents.current = [...matchEvents];
      
      const event = matchEvents[0];
      const isUserTeam = event.team === 'USER';
      
      // Determine active players based on event
      const activePlayerPositions = [];
      
      if (event.eventType === 'goal' || event.eventType === 'miss') {
        // Create attacker moving with the ball
        activePlayerPositions.push({
          x: isUserTeam ? 60 : 40,
          y: 40,
          player: event.player,
          team: event.team,
          hasBall: true
        });
        
        // Add defender
        activePlayerPositions.push({
          x: isUserTeam ? 30 : 70,
          y: 30,
          player: { position: 'CB', name: isUserTeam ? 'CPU DEF' : 'YOUR DEF' },
          team: isUserTeam ? 'CPU' : 'USER',
          hasBall: false
        });
        
        // Update ball position
        setBallPosition({ x: isUserTeam ? 60 : 40, y: 40 });
      } else if (event.eventType === 'defense') {
        // Create defender with the ball
        activePlayerPositions.push({
          x: isUserTeam ? 70 : 30,
          y: 60,
          player: event.player,
          team: event.team,
          hasBall: true
        });
        
        // Add attacker
        activePlayerPositions.push({
          x: isUserTeam ? 65 : 35,
          y: 50,
          player: { position: isUserTeam ? 'ST' : 'ST', name: isUserTeam ? 'CPU ATT' : 'YOUR ATT' },
          team: isUserTeam ? 'CPU' : 'USER',
          hasBall: false
        });
        
        // Update ball position
        setBallPosition({ x: isUserTeam ? 70 : 30, y: 60 });
      } else if (event.eventType === 'possession') {
        // Create player with possession
        activePlayerPositions.push({
          x: isUserTeam ? 50 : 50,
          y: 60,
          player: event.player,
          team: event.team,
          hasBall: true
        });
        
        // Add supporting players
        activePlayerPositions.push({
          x: isUserTeam ? 60 : 40,
          y: 55,
          player: { position: isUserTeam ? 'CM' : 'CM', name: isUserTeam ? 'YOUR MID' : 'CPU MID' },
          team: event.team,
          hasBall: false
        });
        
        // Add opposing player
        activePlayerPositions.push({
          x: isUserTeam ? 45 : 55,
          y: 50,
          player: { position: isUserTeam ? 'CM' : 'CM', name: isUserTeam ? 'CPU MID' : 'YOUR MID' },
          team: isUserTeam ? 'CPU' : 'USER',
          hasBall: false
        });
        
        // Update ball position
        setBallPosition({ x: isUserTeam ? 50 : 50, y: 60 });
      }
      
      setActivePlayers(activePlayerPositions);
    }
  }, [matchEvents]);

  if (!matchState) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mx-auto"></div>
        <p className="mt-4 text-white">Loading match simulation...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Match Visualization Area */}
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl shadow-xl p-6 mb-8">
          <h3 className="text-xl font-bold mb-4 text-white">Match Simulation</h3>
          
          {/* Teams Info */}
          <div className="flex justify-between items-center mb-4">
            <div className="team-info text-center">
              <div className="w-12 h-12 mx-auto bg-blue-600 rounded-full flex items-center justify-center mb-1">
                <span className="font-bold text-yellow-400">YOU</span>
              </div>
              <div className="text-sm text-white">Team OVR: {userTeam?.players.reduce((sum: number, p: any) => sum + p.overall, 0) / (userTeam?.players.length || 1) || 0}</div>
            </div>
            
            <div className="score-display flex items-center">
              <span className="font-bold text-3xl text-white">{matchState.userScore}</span>
              <span className="font-bold text-lg mx-2 text-gray-400">-</span>
              <span className="font-bold text-3xl text-white">{matchState.cpuScore}</span>
            </div>
            
            <div className="team-info text-center">
              <div className="w-12 h-12 mx-auto bg-red-600 rounded-full flex items-center justify-center mb-1">
                <span className="font-bold text-white">CPU</span>
              </div>
              <div className="text-sm text-white">Team OVR: {cpuTeam?.players.reduce((sum: number, p: any) => sum + p.overall, 0) / (cpuTeam?.players.length || 1) || 0}</div>
            </div>
          </div>
          
          {/* Match Timer */}
          <div className="text-center mb-4">
            <span className="font-bold text-yellow-400 text-lg">{matchState.minute}'</span>
            <Progress value={(matchState.minute / 90) * 100} className="h-1 mt-1" />
          </div>
          
          {/* Match Visualization */}
          <div className="relative w-full h-48 bg-green-800 rounded-lg mb-4 overflow-hidden border border-gray-700">
            {/* Field markings */}
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="absolute inset-0 flex flex-col">
              <div className="flex-1 border-b-2 border-white border-opacity-20 relative">
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-8 border-2 border-white border-opacity-20 rounded-tr-full rounded-tl-full"></div>
              </div>
              <div className="flex-1 relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-8 border-2 border-white border-opacity-20 rounded-br-full rounded-bl-full"></div>
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-2 border-white border-opacity-20 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white bg-opacity-20 rounded-full"></div>
            </div>
            
            {/* Active Players */}
            <AnimatePresence>
              {activePlayers.map((player, index) => (
                <motion.div
                  key={`active-${index}`}
                  initial={{ x: `${player.x}%`, y: `${player.y}%`, opacity: 0 }}
                  animate={{ x: `${player.x}%`, y: `${player.y}%`, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${player.x}%`, top: `${player.y}%` }}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    player.team === 'USER' 
                      ? 'bg-blue-600 border-yellow-400 text-white' 
                      : 'bg-red-600 border-white text-white'
                  }`}>
                    <span className="text-xs font-bold">{player.player.position}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Ball */}
            <motion.div
              className="match-ball absolute w-3 h-3 bg-white rounded-full shadow-lg z-10"
              animate={{ x: `${ballPosition.x}%`, y: `${ballPosition.y}%` }}
              transition={{ duration: 0.5 }}
              style={{ left: `${ballPosition.x}%`, top: `${ballPosition.y}%`, transform: 'translate(-50%, -50%)' }}
            />
          </div>
          
          {/* Match Controls */}
          <div className="flex justify-center space-x-3 mt-4">
            <Button
              variant="outline"
              className="border-gray-700 text-white hover:bg-gray-700"
              onClick={() => setIsPaused(!isPaused)}
              disabled={!isSimulating}
            >
              {isPaused ? <FaPlay className="mr-1" /> : <FaPause className="mr-1" />}
              {isPaused ? 'RESUME' : 'PAUSE'}
            </Button>
            
            <Button
              variant="destructive"
              onClick={onEndMatch}
              disabled={!isSimulating}
            >
              <FaFlag className="mr-1" /> FORFEIT
            </Button>
            
            <Button
              variant="default"
              className="bg-green-600 hover:bg-green-700"
              onClick={onEndMatch}
              disabled={!isSimulating}
            >
              <FaFastForward className="mr-1" /> SIM TO END
            </Button>
          </div>
        </div>
        
        {/* Commentary and Stats */}
        <div>
          {/* Commentary */}
          <MatchCommentary commentary={matchState.commentary || []} />
          
          {/* Match Stats */}
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl shadow-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-white">Match Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-10 text-center font-bold text-sm text-white">{matchState.shots || 0}</div>
                <div className="flex-grow mx-3">
                  <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                    <div className="bg-yellow-400 h-full rounded-full" style={{width: '65%'}}></div>
                  </div>
                  <div className="text-xs text-center mt-1 text-gray-400">Shots</div>
                </div>
                <div className="w-10 text-center font-bold text-sm text-white">{Math.floor(matchState.shots * 0.6) || 0}</div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 text-center font-bold text-sm text-white">{matchState.shotsOnTarget || 0}</div>
                <div className="flex-grow mx-3">
                  <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                    <div className="bg-yellow-400 h-full rounded-full" style={{width: '70%'}}></div>
                  </div>
                  <div className="text-xs text-center mt-1 text-gray-400">Shots on Target</div>
                </div>
                <div className="w-10 text-center font-bold text-sm text-white">{Math.floor(matchState.shotsOnTarget * 0.7) || 0}</div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 text-center font-bold text-sm text-white">{matchState.possession || 50}%</div>
                <div className="flex-grow mx-3">
                  <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                    <div className="bg-yellow-400 h-full rounded-full" style={{width: `${matchState.possession || 50}%`}}></div>
                  </div>
                  <div className="text-xs text-center mt-1 text-gray-400">Possession</div>
                </div>
                <div className="w-10 text-center font-bold text-sm text-white">{100 - (matchState.possession || 50)}%</div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 text-center font-bold text-sm text-white">{matchState.corners || 0}</div>
                <div className="flex-grow mx-3">
                  <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                    <div className="bg-yellow-400 h-full rounded-full" style={{width: '55%'}}></div>
                  </div>
                  <div className="text-xs text-center mt-1 text-gray-400">Corners</div>
                </div>
                <div className="w-10 text-center font-bold text-sm text-white">{Math.floor(matchState.corners * 0.8) || 0}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchSimulation;
