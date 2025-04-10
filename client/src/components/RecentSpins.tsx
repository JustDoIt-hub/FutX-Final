import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FaHistory } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { RecentSpin } from "@/hooks/useSpin";

interface RecentSpinsProps {
  recentSpins: RecentSpin[];
}

const RecentSpins = ({ recentSpins }: RecentSpinsProps) => {
  // Helper function to format event name
  const formatEvent = (event: string) => {
    return event.replace(/_/g, " ");
  };

  // Helper function to get position-based colors
  const getPositionColor = (position: string) => {
    const positionColors: Record<string, { from: string, to: string }> = {
      'GK': { from: 'from-yellow-600', to: 'to-yellow-800' },
      'CB': { from: 'from-blue-600', to: 'to-blue-800' },
      'LB': { from: 'from-blue-500', to: 'to-blue-700' },
      'RB': { from: 'from-blue-500', to: 'to-blue-700' },
      'CDM': { from: 'from-green-600', to: 'to-green-800' },
      'CM': { from: 'from-green-500', to: 'to-green-700' },
      'CAM': { from: 'from-green-400', to: 'to-green-600' },
      'LW': { from: 'from-red-500', to: 'to-red-700' },
      'RW': { from: 'from-red-500', to: 'to-red-700' },
      'ST': { from: 'from-red-600', to: 'to-red-800' },
    };
    
    return positionColors[position] || { from: 'from-gray-600', to: 'to-gray-800' };
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 flex items-center text-white">
        <FaHistory className="text-yellow-400 mr-3" /> RECENT SPINS
      </h2>
      
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl shadow-xl p-4">
        <ScrollArea className="pr-3 max-h-96">
          <div className="space-y-3">
            {recentSpins && recentSpins.length > 0 ? (
              recentSpins.map((spin, index) => {
                const positionColors = getPositionColor(spin.position_result);
                return (
                  <motion.div 
                    key={spin.id}
                    className="recent-spin flex items-center bg-gray-900 bg-opacity-50 p-3 rounded-lg hover:bg-gray-800 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${positionColors.from} ${positionColors.to} rounded-full flex items-center justify-center mr-3 flex-shrink-0 shadow-md`}>
                      <span className="font-bold text-white text-sm">{spin.position_result}</span>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{spin.player?.name || "Unknown"}</span>
                        <span className="font-bold text-yellow-400 text-lg">{spin.player?.overall || "??"}</span>
                      </div>
                      <div className="grid grid-cols-2 text-xs text-gray-400">
                        <span>{formatEvent(spin.event_result)}</span>
                        <span className="text-right">
                          {spin.spun_at ? formatDistanceToNow(new Date(spin.spun_at), { addSuffix: true }) : ""}
                        </span>
                      </div>
                      {spin.player && (
                        <div className="mt-1 grid grid-cols-6 gap-1 text-xs">
                          <div className="text-center">
                            <div className="font-bold text-green-400">{spin.player.pace}</div>
                            <div className="text-gray-500">PAC</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-green-400">{spin.player.shooting}</div>
                            <div className="text-gray-500">SHO</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-green-400">{spin.player.passing}</div>
                            <div className="text-gray-500">PAS</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-green-400">{spin.player.dribbling}</div>
                            <div className="text-gray-500">DRI</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-green-400">{spin.player.defense}</div>
                            <div className="text-gray-500">DEF</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-green-400">{spin.player.physical}</div>
                            <div className="text-gray-500">PHY</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-10 text-gray-400">
                No recent spins. Start spinning to build your collection!
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default RecentSpins;
