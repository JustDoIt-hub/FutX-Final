import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useSpin } from "@/hooks/useSpin";
import { useTeamBattle } from "@/hooks/useTeamBattle";
import { Button } from "@/components/ui/button";
import TeamBuilder from "@/components/TeamBuilder";
import TeamList from "@/components/TeamList";
import MatchSimulation from "@/components/MatchSimulation";
import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import { FaGamepad, FaSpinner } from "react-icons/fa";
import { getUserPlayers } from "@/api";

const TeamBattle = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'builder' | 'battle'>('builder');
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  
  const { data: players = [], isLoading: isLoadingPlayers } = useQuery({
    queryKey: ['/api/players'],
    queryFn: async () => {
      const data = await getUserPlayers();
      return data.players;
    }
  });
  
  const {
    teams,
    isLoading: isLoadingTeams,
    createTeam,
    startMatch,
    matchState,
    matchEvents,
    isSimulating,
    userTeam,
    cpuTeam,
    endMatch
  } = useTeamBattle();

  const handleCreateTeam = (teamData: any) => {
    createTeam(teamData);
  };

  const handleStartMatch = (teamId: number) => {
    setSelectedTeamId(teamId);
    startMatch(teamId);
    setActiveView('battle');
  };

  const handleBackToTeams = () => {
    if (isSimulating) {
      endMatch();
    }
    setActiveView('builder');
    setSelectedTeamId(null);
  };

  const isLoading = isLoadingPlayers || isLoadingTeams;

  return (
    <div>
      <Navigation activeTab="team-battle" />

      <section className="py-8 container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 flex items-center text-white">
          <FaGamepad className="text-yellow-400 mr-3" /> TEAM BATTLE
        </h2>

        {isLoading ? (
          <div className="text-center py-12">
            <FaSpinner className="animate-spin text-4xl text-yellow-400 mx-auto" />
            <p className="mt-4 text-white">Loading...</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {activeView === 'builder' ? (
              // Team Builder View
              <>
                <motion.div 
                  className="w-full lg:w-1/2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <TeamBuilder 
                    players={players} 
                    onCreateTeam={handleCreateTeam} 
                    isLoading={isLoadingTeams}
                  />
                </motion.div>
                <motion.div 
                  className="w-full lg:w-1/2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <TeamList 
                    teams={teams || []} 
                    onSelectTeam={handleStartMatch}
                  />
                </motion.div>
              </>
            ) : (
              // Match Simulation View
              <div className="w-full">
                <div className="mb-4">
                  <Button 
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    onClick={handleBackToTeams}
                  >
                    ← Back to Teams
                  </Button>
                </div>
                
                <MatchSimulation 
                  isSimulating={isSimulating}
                  matchState={matchState}
                  matchEvents={matchEvents}
                  userTeam={userTeam}
                  cpuTeam={cpuTeam}
                  onEndMatch={endMatch}
                />
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default TeamBattle;
