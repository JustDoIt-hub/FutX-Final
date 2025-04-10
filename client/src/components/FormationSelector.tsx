import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FormationSelectorProps {
  selectedFormation: string;
  onChange: (formation: string) => void;
}

const formations = [
  '4-3-3',
  '4-4-2',
  '3-5-2',
  '4-2-3-1',
  '5-3-2',
  '4-1-2-1-2'
];

const FormationSelector = ({ selectedFormation, onChange }: FormationSelectorProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {formations.map(formation => (
        <Button
          key={formation}
          variant="outline"
          className={cn(
            "bg-gray-900 hover:bg-primary text-white border-gray-700",
            selectedFormation === formation && "border-2 border-blue-500 bg-blue-500/20"
          )}
          onClick={() => onChange(formation)}
        >
          {formation}
        </Button>
      ))}
    </div>
  );
};

export default FormationSelector;
