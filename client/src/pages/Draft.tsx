import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';

interface Player {
  id: number;
  name: string;
  rating: number;
  position: string;
  club: string;
  nation: string;
  image: string;
}

export default function Draft() {
  const [formation, setFormation] = useState('433');
  const [currentPick, setCurrentPick] = useState<number>(0);
  const [playerChoices, setPlayerChoices] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);

  const formations = [
    '433', '442', '4231', '352', '532'
  ];

  useEffect(() => {
    // Initial setup
    generatePlayerChoices();
  }, []);

  const generatePlayerChoices = async () => {
    try {
      // Simulate API call to get player choices
      // In production, replace with actual API call
      const mockPlayers: Player[] = [
        // Add mock players here
      ];
      setPlayerChoices(mockPlayers);
    } catch (error) {
      console.error('Error generating player choices:', error);
    }
  };

  const handlePlayerSelect = (player: Player) => {
    setSelectedPlayers([...selectedPlayers, player]);
    setCurrentPick(currentPick + 1);
    generatePlayerChoices(); // Get new choices for next pick
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation activeTab="draft" />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">FUT Draft</h1>
        
        {currentPick === 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Select Formation</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {formations.map((f) => (
                <Button
                  key={f}
                  variant={formation === f ? "default" : "outline"}
                  onClick={() => setFormation(f)}
                  className="w-full"
                >
                  {f}
                </Button>
              ))}
            </div>
          </div>
        )}

        {currentPick > 0 && currentPick <= 11 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">
              Pick {currentPick} of 11
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {playerChoices.map((player) => (
                <div
                  key={player.id}
                  className="bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700"
                  onClick={() => handlePlayerSelect(player)}
                >
                  <img
                    src={player.image}
                    alt={player.name}
                    className="w-24 h-24 mx-auto mb-2"
                  />
                  <div className="text-center">
                    <div className="text-white font-bold">{player.name}</div>
                    <div className="text-yellow-400">{player.rating}</div>
                    <div className="text-gray-400">{player.position}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
