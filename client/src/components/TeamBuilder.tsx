import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import PlayerCard from './PlayerCard';
import FormationSelector from './FormationSelector';
import PlayStyleSelector from './PlayStyleSelector';
import FootballPitch from './FootballPitch';
import { Player } from '@/hooks/useSpin';

interface TeamBuilderProps {
  players: Player[];
  onCreateTeam: (team: {
    name: string;
    formation: string;
    playStyle: string;
    players: number[];
  }) => void;
  isLoading: boolean;
}

const TeamBuilder = ({ players, onCreateTeam, isLoading }: TeamBuilderProps) => {
  const [teamName, setTeamName] = useState('My Team');
  const [selectedFormation, setSelectedFormation] = useState('4-3-3');
  const [selectedPlayStyle, setSelectedPlayStyle] = useState('TIKI_TAKA');
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const { toast } = useToast();

  const handlePlayerSelect = (player: Player) => {
    const isSelected = selectedPlayers.some(p => p.id === player.id);
    
    if (isSelected) {
      setSelectedPlayers(selectedPlayers.filter(p => p.id !== player.id));
    } else {
      // Check if we already have 11 players
      if (selectedPlayers.length >= 11) {
        toast({
          title: 'Team limit reached',
          description: 'You can only select 11 players for your team',
          variant: 'destructive',
        });
        return;
      }
      
      // Check if position is already filled
      const positionsNeeded = getPositionsForFormation(selectedFormation);
      const selectedPositions = selectedPlayers.map(p => p.position);
      
      if (!positionsNeeded.includes(player.position) || 
          selectedPositions.filter(pos => pos === player.position).length >= 
          positionsNeeded.filter(pos => pos === player.position).length) {
        toast({
          title: 'Position already filled',
          description: `Your formation does not need more ${player.position} players`,
          variant: 'destructive',
        });
        return;
      }
      
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  const getPositionsForFormation = (formation: string): string[] => {
    switch (formation) {
      case '4-3-3':
        return ['GK', 'LB', 'CB', 'CB', 'RB', 'CDM', 'CM', 'CM', 'LW', 'ST', 'RW'];
      case '4-4-2':
        return ['GK', 'LB', 'CB', 'CB', 'RB', 'LM', 'CM', 'CM', 'RM', 'ST', 'ST'];
      case '3-5-2':
        return ['GK', 'CB', 'CB', 'CB', 'LM', 'CDM', 'CDM', 'CAM', 'RM', 'ST', 'ST'];
      case '4-2-3-1':
        return ['GK', 'LB', 'CB', 'CB', 'RB', 'CDM', 'CDM', 'CAM', 'CAM', 'CAM', 'ST'];
      case '5-3-2':
        return ['GK', 'LWB', 'CB', 'CB', 'CB', 'RWB', 'CM', 'CM', 'CM', 'ST', 'ST'];
      case '4-1-2-1-2':
        return ['GK', 'LB', 'CB', 'CB', 'RB', 'CDM', 'CM', 'CM', 'CAM', 'ST', 'ST'];
      default:
        return ['GK', 'LB', 'CB', 'CB', 'RB', 'CDM', 'CM', 'CM', 'LW', 'ST', 'RW'];
    }
  };

  const handleSaveTeam = () => {
    if (selectedPlayers.length < 11) {
      toast({
        title: 'Incomplete team',
        description: `You need 11 players to create a team (${selectedPlayers.length}/11 selected)`,
        variant: 'destructive',
      });
      return;
    }
    
    if (!teamName.trim()) {
      toast({
        title: 'Missing team name',
        description: 'Please enter a name for your team',
        variant: 'destructive',
      });
      return;
    }
    
    onCreateTeam({
      name: teamName,
      formation: selectedFormation,
      playStyle: selectedPlayStyle,
      players: selectedPlayers.map(p => p.id),
    });
  };

  return (
    <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl shadow-xl p-6 mb-8">
      <h3 className="text-xl font-bold mb-6 text-white">Build Your Team</h3>
      
      <div className="mb-6">
        <Label htmlFor="team-name" className="text-white mb-2 block">Team Name</Label>
        <Input 
          id="team-name" 
          value={teamName}
          onChange={e => setTeamName(e.target.value)}
          className="bg-gray-900 text-white border-gray-700"
          maxLength={30}
        />
      </div>
      
      {/* Formation Selector */}
      <div className="mb-6">
        <Label className="block text-white mb-2">Formation</Label>
        <FormationSelector 
          selectedFormation={selectedFormation} 
          onChange={setSelectedFormation} 
        />
      </div>
      
      {/* Play Style Selector */}
      <div className="mb-6">
        <Label className="block text-white mb-2">Play Style</Label>
        <PlayStyleSelector 
          selectedPlayStyle={selectedPlayStyle} 
          onChange={setSelectedPlayStyle} 
        />
      </div>
      
      {/* Formation Visualization */}
      <div className="mb-6">
        <Label className="block text-white mb-2">Team Layout</Label>
        <FootballPitch 
          formation={selectedFormation}
          players={selectedPlayers}
        />
      </div>
      
      {/* Player Selection */}
      <div>
        <h4 className="font-bold text-white text-sm mb-3">Select Players From Your Collection</h4>
        
        <ScrollArea className="h-48 rounded-md border border-gray-700">
          <div className="flex flex-wrap gap-3 p-4">
            {players.length > 0 ? (
              players.map(player => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  size="sm"
                  selected={selectedPlayers.some(p => p.id === player.id)}
                  onClick={() => handlePlayerSelect(player)}
                />
              ))
            ) : (
              <div className="w-full text-center text-gray-400 py-8">
                No players in your collection. Try spinning to get players!
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      
      {/* Team Submit */}
      <div className="mt-6 text-center">
        <Button 
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all transform hover:scale-105"
          onClick={handleSaveTeam}
          disabled={isLoading}
        >
          {isLoading ? 'Creating Team...' : 'Create Team'}
        </Button>
      </div>
    </div>
  );
};

export default TeamBuilder;
