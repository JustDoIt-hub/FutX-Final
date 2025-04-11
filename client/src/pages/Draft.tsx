import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import DraftSquad from '@/components/DraftSquad';
import DraftPicks from '@/components/DraftPicks';
import FormationSelector from '@/components/FormationSelector';

export default function Draft() {
  const [formation, setFormation] = useState('4-3-3');
  const [squad, setSquad] = useState<any[]>([]);
  const [picks, setPicks] = useState<any[]>([]);
  const [round, setRound] = useState(1);

  const handleFormationChange = (newFormation: string) => {
    setFormation(newFormation);
  };

  const handlePickPlayer = (player: any, position: string) => {
    setSquad(prev => [...prev, { ...player, position }]);
    setPicks(prev => prev.filter(p => p.id !== player.id));
    if (round < 11) {
      setRound(round + 1);
      // Generate new picks for next round
      generateNewPicks();
    }
  };

  const generateNewPicks = async () => {
    try {
      const response = await fetch('/api/draft/picks');
      const data = await response.json();
      setPicks(data.picks);
    } catch (error) {
      console.error('Failed to get draft picks:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation activeTab="draft" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Draft Squad</h2>
            <div className="mb-6">
              <FormationSelector formation={formation} onSelect={handleFormationChange} />
            </div>
            <DraftSquad formation={formation} squad={squad} />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Pick {round} of 11</h2>
            <DraftPicks picks={picks} onSelect={handlePickPlayer} />
          </div>
        </div>
      </div>
    </div>
  );
}
