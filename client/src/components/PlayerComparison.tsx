import { useState } from 'react';
import { Player } from '@/hooks/useSpin';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import { Button } from '@/components/ui/button';
import PlayerCard from '@/components/PlayerCard';
import { motion } from 'framer-motion';
import { FaExchangeAlt, FaChartPie, FaTimes } from 'react-icons/fa';

interface PlayerComparisonProps {
  players: Player[];
  onClose?: () => void;
}

const PlayerComparison = ({ players, onClose }: PlayerComparisonProps) => {
  const [selectedPlayer1, setSelectedPlayer1] = useState<Player | null>(null);
  const [selectedPlayer2, setSelectedPlayer2] = useState<Player | null>(null);
  const [view, setView] = useState<'selection' | 'comparison'>('selection');

  // Handle player selection
  const handlePlayerSelect = (player: Player) => {
    if (!selectedPlayer1) {
      setSelectedPlayer1(player);
    } else if (!selectedPlayer2) {
      setSelectedPlayer2(player);
      setView('comparison');
    }
  };

  // Reset selected players
  const handleReset = () => {
    setSelectedPlayer1(null);
    setSelectedPlayer2(null);
    setView('selection');
  };

  // Replace a selected player
  const handleReplacePlayer = (index: 1 | 2) => {
    if (index === 1) {
      setSelectedPlayer1(null);
    } else {
      setSelectedPlayer2(null);
    }
    setView('selection');
  };

  // Convert player stats to radar chart data
  const getChartData = () => {
    if (!selectedPlayer1 || !selectedPlayer2) return [];

    return [
      { stat: 'Pace', player1: selectedPlayer1.pace, player2: selectedPlayer2.pace },
      { stat: 'Shooting', player1: selectedPlayer1.shooting, player2: selectedPlayer2.shooting },
      { stat: 'Passing', player1: selectedPlayer1.passing, player2: selectedPlayer2.passing },
      { stat: 'Dribbling', player1: selectedPlayer1.dribbling, player2: selectedPlayer2.dribbling },
      { stat: 'Defense', player1: selectedPlayer1.defense, player2: selectedPlayer2.defense },
      { stat: 'Physical', player1: selectedPlayer1.physical, player2: selectedPlayer2.physical },
    ];
  };

  // Getting stats difference
  const getStatDiff = (stat1: number, stat2: number) => {
    const diff = stat1 - stat2;
    const color = diff > 0 ? 'text-green-500' : diff < 0 ? 'text-red-500' : 'text-gray-400';
    return (
      <span className={color}>
        {diff > 0 ? `+${diff}` : diff}
      </span>
    );
  };

  // Render the player selection view
  const renderSelectionView = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Select Players to Compare</h3>
        {onClose && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <FaTimes size={18} />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-center min-h-[200px]">
          {selectedPlayer1 ? (
            <div className="relative">
              <PlayerCard player={selectedPlayer1} size="lg" />
              <Button 
                variant="ghost" 
                className="absolute top-2 right-2 bg-gray-900/70 text-white rounded-full p-2 h-auto w-auto"
                onClick={() => setSelectedPlayer1(null)}
              >
                <FaTimes size={16} />
              </Button>
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <p className="font-bold mb-2">Player 1</p>
              <p>Select a player below</p>
            </div>
          )}
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-center min-h-[200px]">
          {selectedPlayer2 ? (
            <div className="relative">
              <PlayerCard player={selectedPlayer2} size="lg" />
              <Button 
                variant="ghost" 
                className="absolute top-2 right-2 bg-gray-900/70 text-white rounded-full p-2 h-auto w-auto"
                onClick={() => setSelectedPlayer2(null)}
              >
                <FaTimes size={16} />
              </Button>
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <p className="font-bold mb-2">Player 2</p>
              <p>Select a player below</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 max-h-[500px] overflow-y-auto p-2">
        {players.map((player) => (
          <div 
            key={player.id}
            className="cursor-pointer transform transition hover:scale-105"
            onClick={() => handlePlayerSelect(player)}
          >
            <PlayerCard player={player} size="sm" />
          </div>
        ))}
      </div>

      {selectedPlayer1 && selectedPlayer2 && (
        <div className="mt-4 text-center">
          <Button 
            onClick={() => setView('comparison')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
          >
            <FaChartPie className="mr-2" /> Compare Players
          </Button>
        </div>
      )}
    </motion.div>
  );

  // Render the comparison view
  const renderComparisonView = () => {
    if (!selectedPlayer1 || !selectedPlayer2) return null;
    
    const chartData = getChartData();
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Player Comparison</h3>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleReset}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Reset
            </Button>
            {onClose && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes size={18} />
              </Button>
            )}
          </div>
        </div>
        
        {/* Player cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center">
            <div className="relative">
              <PlayerCard player={selectedPlayer1} size="lg" />
              <Button 
                variant="ghost" 
                className="absolute top-2 right-2 bg-gray-900/70 text-white rounded-full p-2 h-auto w-auto"
                onClick={() => handleReplacePlayer(1)}
              >
                <FaExchangeAlt size={16} />
              </Button>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center">
            <div className="relative">
              <PlayerCard player={selectedPlayer2} size="lg" />
              <Button 
                variant="ghost" 
                className="absolute top-2 right-2 bg-gray-900/70 text-white rounded-full p-2 h-auto w-auto"
                onClick={() => handleReplacePlayer(2)}
              >
                <FaExchangeAlt size={16} />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Radar chart */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h4 className="text-lg font-bold text-white mb-4 text-center">Stat Comparison</h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius="80%" data={chartData}>
                <PolarGrid stroke="#444" />
                <PolarAngleAxis dataKey="stat" tick={{ fill: '#ccc' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#ccc' }} />
                <Radar
                  name={selectedPlayer1.name}
                  dataKey="player1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
                <Radar
                  name={selectedPlayer2.name}
                  dataKey="player2"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '4px' }} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Side-by-side stat comparison */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h4 className="text-lg font-bold text-white mb-4 text-center">Detailed Stats</h4>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="text-center font-bold text-blue-400">{selectedPlayer1.name}</div>
            <div className="text-center font-bold text-white">Attribute</div>
            <div className="text-center font-bold text-green-400">{selectedPlayer2.name}</div>
            
            <div className="text-center">{selectedPlayer1.pace}</div>
            <div className="text-center bg-gray-700 rounded py-1">Pace</div>
            <div className="text-center">{selectedPlayer2.pace} {getStatDiff(selectedPlayer2.pace, selectedPlayer1.pace)}</div>
            
            <div className="text-center">{selectedPlayer1.shooting}</div>
            <div className="text-center bg-gray-700 rounded py-1">Shooting</div>
            <div className="text-center">{selectedPlayer2.shooting} {getStatDiff(selectedPlayer2.shooting, selectedPlayer1.shooting)}</div>
            
            <div className="text-center">{selectedPlayer1.passing}</div>
            <div className="text-center bg-gray-700 rounded py-1">Passing</div>
            <div className="text-center">{selectedPlayer2.passing} {getStatDiff(selectedPlayer2.passing, selectedPlayer1.passing)}</div>
            
            <div className="text-center">{selectedPlayer1.dribbling}</div>
            <div className="text-center bg-gray-700 rounded py-1">Dribbling</div>
            <div className="text-center">{selectedPlayer2.dribbling} {getStatDiff(selectedPlayer2.dribbling, selectedPlayer1.dribbling)}</div>
            
            <div className="text-center">{selectedPlayer1.defense}</div>
            <div className="text-center bg-gray-700 rounded py-1">Defense</div>
            <div className="text-center">{selectedPlayer2.defense} {getStatDiff(selectedPlayer2.defense, selectedPlayer1.defense)}</div>
            
            <div className="text-center">{selectedPlayer1.physical}</div>
            <div className="text-center bg-gray-700 rounded py-1">Physical</div>
            <div className="text-center">{selectedPlayer2.physical} {getStatDiff(selectedPlayer2.physical, selectedPlayer1.physical)}</div>
            
            <div className="text-center">{selectedPlayer1.overall}</div>
            <div className="text-center bg-gray-700 rounded py-1">Overall</div>
            <div className="text-center">{selectedPlayer2.overall} {getStatDiff(selectedPlayer2.overall, selectedPlayer1.overall)}</div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl shadow-xl p-6 mb-8">
      {view === 'selection' ? renderSelectionView() : renderComparisonView()}
    </div>
  );
};

export default PlayerComparison;