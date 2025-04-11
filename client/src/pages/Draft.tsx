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
  rarity: string;
}

export default function Draft() {
  const [formation, setFormation] = useState('433');
  const [currentPick, setCurrentPick] = useState<number>(0);
  const [playerChoices, setPlayerChoices] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [squadRating, setSquadRating] = useState<number>(0);
  const [chemistry, setChemistry] = useState<number>(0);

  const formations = [
    '4-3-3', '4-4-2', '4-2-3-1', '3-5-2', '5-3-2'
  ];

  // Mock players for demonstration
  const mockPlayers: Player[] = [
    {
      id: 1,
      name: "Lionel Messi",
      rating: 93,
      position: "RW",
      club: "Inter Miami",
      nation: "Argentina",
      image: "https://futhead.cursecdn.com/static/img/24/players/158023.png",
      rarity: "gold"
    },
    {
      id: 2,
      name: "Cristiano Ronaldo",
      rating: 90,
      position: "ST",
      club: "Al Nassr",
      nation: "Portugal",
      image: "https://futhead.cursecdn.com/static/img/24/players/20801.png",
      rarity: "gold"
    },
    {
      id: 3,
      name: "Kevin De Bruyne",
      rating: 91,
      position: "CAM",
      club: "Manchester City",
      nation: "Belgium",
      image: "https://futhead.cursecdn.com/static/img/24/players/192985.png",
      rarity: "gold"
    },
    {
      id: 4,
      name: "Erling Haaland",
      rating: 91,
      position: "ST",
      club: "Manchester City",
      nation: "Norway",
      image: "https://futhead.cursecdn.com/static/img/24/players/239085.png",
      rarity: "gold"
    }
  ];

  useEffect(() => {
    generatePlayerChoices();
  }, []);

  const generatePlayerChoices = () => {
    setPlayerChoices(mockPlayers);
  };

  return (
    <div className="min-h-screen bg-[#202020]">
      <Navigation activeTab="draft" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">FUT Draft Simulator</h1>
          <div className="flex gap-4">
            <div className="bg-gradient-to-b from-gray-700 to-gray-800 p-3 rounded-lg">
              <span className="text-white font-bold">Rating: {squadRating}</span>
            </div>
            <div className="bg-gradient-to-b from-gray-700 to-gray-800 p-3 rounded-lg">
              <span className="text-white font-bold">Chemistry: {chemistry}</span>
            </div>
          </div>
        </div>

        {currentPick === 0 ? (
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Select Formation</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {formations.map((f) => (
                <Button
                  key={f}
                  variant={formation === f ? "default" : "outline"}
                  onClick={() => {
                    setFormation(f);
                    setCurrentPick(1);
                  }}
                  className={`w-full h-16 text-lg ${
                    formation === f 
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-black' 
                      : 'border-2 border-gray-600 hover:border-yellow-500'
                  }`}
                >
                  {f}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Pick {currentPick} of 11: {getPositionForPick(currentPick, formation)}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {playerChoices.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  onSelect={() => handlePlayerSelect(player)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface PlayerCardProps {
  player: Player;
  onSelect: () => void;
}

const PlayerCard = ({ player, onSelect }: PlayerCardProps) => (
  <div
    onClick={onSelect}
    className="bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] rounded-lg p-4 cursor-pointer hover:shadow-lg hover:shadow-yellow-500/20 transition-all"
  >
    <div className="relative">
      <img
        src={player.image}
        alt={player.name}
        className="w-32 h-32 mx-auto mb-2 object-contain"
      />
      <div className="absolute top-0 right-0 bg-yellow-500 text-black font-bold rounded-full w-8 h-8 flex items-center justify-center">
        {player.rating}
      </div>
    </div>
    <div className="text-center">
      <div className="text-white font-bold text-lg">{player.name}</div>
      <div className="text-gray-400">{player.position} · {player.club}</div>
    </div>
  </div>
);

function getPositionForPick(pick: number, formation: string): string {
  // This is a simplified version - you'll want to expand this based on the formation
  const positions = {
    '4-3-3': ['ST', 'LW', 'RW', 'CM', 'CM', 'CM', 'LB', 'CB', 'CB', 'RB', 'GK'],
    '4-4-2': ['ST', 'ST', 'LM', 'CM', 'CM', 'RM', 'LB', 'CB', 'CB', 'RB', 'GK'],
    // Add other formations
  };
  
  return positions[formation as keyof typeof positions]?.[pick - 1] || 'ANY';
}

