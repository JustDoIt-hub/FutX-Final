import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { FaTrophy, FaUsers, FaFootballBall, FaPlay } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

interface TeamListProps {
  teams: any[];
  onSelectTeam: (teamId: number) => void;
}

const TeamList = ({ teams, onSelectTeam }: TeamListProps) => {
  const [expandedTeamId, setExpandedTeamId] = useState<number | null>(null);

  const toggleTeamExpansion = (teamId: number) => {
    setExpandedTeamId(expandedTeamId === teamId ? null : teamId);
  };

  const handleStartMatch = (e: React.MouseEvent, teamId: number) => {
    e.stopPropagation();
    onSelectTeam(teamId);
  };

  // Function to get badge color based on formation
  const getFormationColor = (formation: string) => {
    switch (formation) {
      case '4-3-3':
        return 'bg-blue-600 hover:bg-blue-700';
      case '4-4-2':
        return 'bg-green-600 hover:bg-green-700';
      case '3-5-2':
        return 'bg-yellow-600 hover:bg-yellow-700';
      case '4-2-3-1':
        return 'bg-purple-600 hover:bg-purple-700';
      case '5-3-2':
        return 'bg-red-600 hover:bg-red-700';
      case '4-1-2-1-2':
        return 'bg-indigo-600 hover:bg-indigo-700';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl shadow-xl p-6 mb-8">
      <div className="flex items-center mb-4">
        <FaTrophy className="text-2xl text-yellow-400 mr-2" />
        <h3 className="text-xl font-bold text-white">Your Teams</h3>
      </div>

      {teams && teams.length > 0 ? (
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {teams.map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="bg-gray-800 border-gray-700 overflow-hidden hover:bg-gray-750 transition-colors cursor-pointer"
                  onClick={() => toggleTeamExpansion(team.id)}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-white">{team.name}</CardTitle>
                      <Badge className={getFormationColor(team.formation)}>
                        {team.formation}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-400 mt-1">
                      <FaUsers className="mr-1" />
                      {team.players.length} Players
                      <span className="mx-2">•</span>
                      <span>
                        {formatDistanceToNow(new Date(team.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </CardHeader>

                  {expandedTeamId === team.id && (
                    <CardContent className="pb-4">
                      <div className="mt-2">
                        <p className="text-sm text-gray-300 mb-2">
                          <Badge variant="outline" className="mr-2 border-blue-500 text-blue-400">
                            {team.play_style.replace('_', ' ')}
                          </Badge>
                          Play Style
                        </p>

                        <div className="mt-3">
                          <h4 className="text-sm font-semibold text-gray-300 mb-2">Team Players:</h4>
                          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2">
                            {team.players.map((player: any, i: number) => (
                              <div key={i} className="text-center">
                                <div className="w-10 h-10 mx-auto bg-blue-600 rounded-full flex items-center justify-center mb-1">
                                  <span className="text-xs font-bold text-white">{player.position}</span>
                                </div>
                                <p className="text-xs text-gray-300 truncate">{player.name}</p>
                                <p className="text-xs text-yellow-400">{player.overall}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4">
                          <Button
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                            onClick={(e) => handleStartMatch(e, team.id)}
                          >
                            <FaPlay className="mr-2" /> Start Match
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="text-center py-10 border border-dashed border-gray-700 rounded-lg">
          <FaFootballBall className="text-4xl text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">You haven't created any teams yet</p>
          <p className="text-sm text-gray-500 mt-1">Create a team to start playing matches</p>
        </div>
      )}
    </div>
  );
};

export default TeamList;
