
import PlayerCard from './PlayerCard';
import { Button } from './ui/button';

interface DraftPicksProps {
  picks: any[];
  onSelect: (player: any, position: string) => void;
}

export default function DraftPicks({ picks, onSelect }: DraftPicksProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {picks.map(player => (
        <div key={player.id} className="relative">
          <PlayerCard player={player} />
          <div className="mt-2 grid grid-cols-2 gap-2">
            {['GK', 'CB', 'LB', 'RB', 'CM', 'ST'].map(position => (
              <Button
                key={position}
                variant="secondary"
                size="sm"
                onClick={() => onSelect(player, position)}
              >
                {position}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
