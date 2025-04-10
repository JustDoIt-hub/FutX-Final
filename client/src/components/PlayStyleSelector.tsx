import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PlayStyleSelectorProps {
  selectedPlayStyle: string;
  onChange: (playStyle: string) => void;
}

const playStyles = [
  { id: 'TIKI_TAKA', label: 'Tiki-Taka' },
  { id: 'COUNTER_ATTACK', label: 'Counter Attack' },
  { id: 'TOTAL_FOOTBALL', label: 'Total Football' },
  { id: 'HIGH_PRESS', label: 'High Press' }
];

const PlayStyleSelector = ({ selectedPlayStyle, onChange }: PlayStyleSelectorProps) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {playStyles.map(style => (
        <Button
          key={style.id}
          variant="outline"
          className={cn(
            "bg-gray-900 hover:bg-primary text-white border-gray-700",
            selectedPlayStyle === style.id && "border-2 border-blue-500 bg-blue-500/20"
          )}
          onClick={() => onChange(style.id)}
        >
          {style.label}
        </Button>
      ))}
    </div>
  );
};

export default PlayStyleSelector;
