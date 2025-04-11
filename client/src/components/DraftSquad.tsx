
import PlayerCard from './PlayerCard';

interface DraftSquadProps {
  formation: string;
  squad: any[];
}

export default function DraftSquad({ formation, squad }: DraftSquadProps) {
  const getPositionStyle = (position: string) => {
    // Add position-specific styling based on formation
    const baseStyles = "absolute transform -translate-x-1/2 -translate-y-1/2";
    
    const positions: Record<string, string> = {
      'GK': 'bottom-[10%] left-[50%]',
      'LB': 'bottom-[30%] left-[20%]',
      'CB': 'bottom-[30%] left-[50%]',
      'RB': 'bottom-[30%] left-[80%]',
      'CM': 'bottom-[50%] left-[50%]',
      'LM': 'bottom-[50%] left-[20%]',
      'RM': 'bottom-[50%] left-[80%]',
      'ST': 'bottom-[70%] left-[50%]',
    };

    return `${baseStyles} ${positions[position] || ''}`;
  };

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-b from-green-800 to-green-600 rounded-xl">
      {squad.map((player, index) => (
        <div key={player.id} className={getPositionStyle(player.position)}>
          <PlayerCard player={player} />
        </div>
      ))}
    </div>
  );
}
