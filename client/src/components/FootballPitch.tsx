import { useMemo } from 'react';
import { Player } from '@/hooks/useSpin';
import { cn } from '@/lib/utils';

interface FootballPitchProps {
  formation: string;
  players?: Player[];
}

const FootballPitch = ({ formation, players = [] }: FootballPitchProps) => {
  // Define player positions based on formation
  const positions = useMemo(() => {
    switch (formation) {
      case '4-3-3':
        return [
          { position: 'GK', x: '50%', y: '85%' },
          { position: 'LB', x: '20%', y: '70%' },
          { position: 'CB', x: '35%', y: '70%' },
          { position: 'CB', x: '65%', y: '70%' },
          { position: 'RB', x: '80%', y: '70%' },
          { position: 'CM', x: '35%', y: '50%' },
          { position: 'CDM', x: '50%', y: '55%' },
          { position: 'CM', x: '65%', y: '50%' },
          { position: 'LW', x: '20%', y: '30%' },
          { position: 'ST', x: '50%', y: '25%' },
          { position: 'RW', x: '80%', y: '30%' }
        ];
      case '4-4-2':
        return [
          { position: 'GK', x: '50%', y: '85%' },
          { position: 'LB', x: '20%', y: '70%' },
          { position: 'CB', x: '35%', y: '70%' },
          { position: 'CB', x: '65%', y: '70%' },
          { position: 'RB', x: '80%', y: '70%' },
          { position: 'LM', x: '20%', y: '50%' },
          { position: 'CM', x: '35%', y: '50%' },
          { position: 'CM', x: '65%', y: '50%' },
          { position: 'RM', x: '80%', y: '50%' },
          { position: 'ST', x: '35%', y: '25%' },
          { position: 'ST', x: '65%', y: '25%' }
        ];
      case '3-5-2':
        return [
          { position: 'GK', x: '50%', y: '85%' },
          { position: 'CB', x: '30%', y: '70%' },
          { position: 'CB', x: '50%', y: '70%' },
          { position: 'CB', x: '70%', y: '70%' },
          { position: 'LM', x: '15%', y: '50%' },
          { position: 'CDM', x: '35%', y: '50%' },
          { position: 'CDM', x: '65%', y: '50%' },
          { position: 'RM', x: '85%', y: '50%' },
          { position: 'CAM', x: '50%', y: '35%' },
          { position: 'ST', x: '35%', y: '20%' },
          { position: 'ST', x: '65%', y: '20%' }
        ];
      case '4-2-3-1':
        return [
          { position: 'GK', x: '50%', y: '85%' },
          { position: 'LB', x: '20%', y: '70%' },
          { position: 'CB', x: '35%', y: '70%' },
          { position: 'CB', x: '65%', y: '70%' },
          { position: 'RB', x: '80%', y: '70%' },
          { position: 'CDM', x: '35%', y: '55%' },
          { position: 'CDM', x: '65%', y: '55%' },
          { position: 'CAM', x: '20%', y: '40%' },
          { position: 'CAM', x: '50%', y: '35%' },
          { position: 'CAM', x: '80%', y: '40%' },
          { position: 'ST', x: '50%', y: '20%' }
        ];
      case '5-3-2':
        return [
          { position: 'GK', x: '50%', y: '85%' },
          { position: 'LWB', x: '10%', y: '65%' },
          { position: 'CB', x: '30%', y: '70%' },
          { position: 'CB', x: '50%', y: '70%' },
          { position: 'CB', x: '70%', y: '70%' },
          { position: 'RWB', x: '90%', y: '65%' },
          { position: 'CM', x: '30%', y: '50%' },
          { position: 'CM', x: '50%', y: '45%' },
          { position: 'CM', x: '70%', y: '50%' },
          { position: 'ST', x: '35%', y: '25%' },
          { position: 'ST', x: '65%', y: '25%' }
        ];
      case '4-1-2-1-2':
        return [
          { position: 'GK', x: '50%', y: '85%' },
          { position: 'LB', x: '20%', y: '70%' },
          { position: 'CB', x: '35%', y: '70%' },
          { position: 'CB', x: '65%', y: '70%' },
          { position: 'RB', x: '80%', y: '70%' },
          { position: 'CDM', x: '50%', y: '60%' },
          { position: 'CM', x: '35%', y: '45%' },
          { position: 'CM', x: '65%', y: '45%' },
          { position: 'CAM', x: '50%', y: '35%' },
          { position: 'ST', x: '35%', y: '20%' },
          { position: 'ST', x: '65%', y: '20%' }
        ];
      default:
        return [
          { position: 'GK', x: '50%', y: '85%' },
          { position: 'LB', x: '20%', y: '70%' },
          { position: 'CB', x: '35%', y: '70%' },
          { position: 'CB', x: '65%', y: '70%' },
          { position: 'RB', x: '80%', y: '70%' },
          { position: 'CM', x: '30%', y: '50%' },
          { position: 'CDM', x: '50%', y: '55%' },
          { position: 'CM', x: '70%', y: '50%' },
          { position: 'LW', x: '25%', y: '30%' },
          { position: 'ST', x: '50%', y: '25%' },
          { position: 'RW', x: '75%', y: '30%' }
        ];
    }
  }, [formation]);

  // Map players to positions
  const positionsWithPlayers = useMemo(() => {
    return positions.map(pos => {
      const matchingPlayer = players.find(p => p.position === pos.position);
      return {
        ...pos,
        player: matchingPlayer
      };
    });
  }, [positions, players]);

  return (
    <div className="relative w-full h-64 md:h-80 bg-green-800 bg-cover bg-center rounded-lg mb-6 overflow-hidden">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-25"></div>
      
      {/* Field markings */}
      <div className="absolute inset-0 flex flex-col">
        <div className="flex-1 border-b-2 border-white border-opacity-20 relative">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-16 border-2 border-white border-opacity-20 rounded-tr-full rounded-tl-full"></div>
        </div>
        <div className="flex-1 relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-16 border-2 border-white border-opacity-20 rounded-br-full rounded-bl-full"></div>
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white border-opacity-20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white bg-opacity-30 rounded-full"></div>
      </div>
      
      {/* Players */}
      {positionsWithPlayers.map((pos, index) => (
        <div 
          key={index}
          className="absolute player-position transform -translate-x-1/2"
          style={{ 
            top: pos.y, 
            left: pos.x,
            transition: 'all 0.5s ease'
          }}
        >
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            pos.player 
              ? "bg-blue-500 border-2 border-yellow-400 text-white" 
              : "bg-gray-700 border-2 border-gray-500 text-gray-300"
          )}>
            <span className="text-xs font-bold">
              {pos.player?.name?.substring(0, 3) || pos.position}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FootballPitch;
