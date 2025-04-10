import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Player } from '@/hooks/useSpin';

interface PlayerCardProps {
  player: Player;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

const PlayerCard = ({ 
  player, 
  size = 'md', 
  className, 
  onClick,
  selected = false
}: PlayerCardProps) => {
  // Calculate card dimensions based on size
  const getCardDimensions = () => {
    switch (size) {
      case 'sm':
        return 'w-20 h-28';
      case 'lg':
        return 'w-64 h-80';
      case 'md':
      default:
        return 'w-40 h-56';
    }
  };

  // Calculate font sizes based on card size
  const getFontSizes = () => {
    switch (size) {
      case 'sm':
        return {
          position: 'text-xs',
          overall: 'text-xs',
          event: 'text-[8px]',
          name: 'text-xs',
          stats: 'text-[8px]'
        };
      case 'lg':
        return {
          position: 'text-lg',
          overall: 'text-lg',
          event: 'text-xs',
          name: 'text-xl',
          stats: 'text-xs'
        };
      case 'md':
      default:
        return {
          position: 'text-sm',
          overall: 'text-sm',
          event: 'text-xs',
          name: 'text-base',
          stats: 'text-xs'
        };
    }
  };

  const fontSizes = getFontSizes();

  return (
    <motion.div
      className={cn(
        "player-card relative bg-gradient-to-br from-primary to-blue-500 rounded-xl overflow-hidden shadow-lg cursor-pointer",
        getCardDimensions(),
        selected && "ring-2 ring-yellow-400",
        className
      )}
      onClick={onClick}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-20 z-0"></div>
      
      {/* Position */}
      <div className="absolute top-2 left-2 w-8 h-8 flex items-center justify-center bg-yellow-400 rounded-full">
        <span className={`font-bold text-gray-900 ${fontSizes.position}`}>{player.position}</span>
      </div>
      
      {/* Overall rating */}
      <div className="absolute top-2 right-2 flex items-center justify-center">
        <span className={`font-bold text-white bg-black bg-opacity-40 px-2 rounded ${fontSizes.overall}`}>
          {player.overall}
        </span>
      </div>
      
      {/* Event badge */}
      <div className="absolute top-12 left-0 w-full flex flex-col items-center">
        <div className={`uppercase px-2 py-1 bg-yellow-400 text-gray-900 rounded font-bold ${fontSizes.event}`}>
          {player.event.replace('_', ' ')}
        </div>
      </div>
      
      {/* Player image placeholder */}
      <div className="absolute top-1/4 w-full flex justify-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1" 
          className={`text-white ${size === 'sm' ? 'w-12 h-12' : size === 'lg' ? 'w-32 h-32' : 'w-20 h-20'}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      
      {/* Player name and stats */}
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent p-2">
        <h4 className={`font-bold text-white text-center mb-1 ${fontSizes.name}`}>{player.name}</h4>
        
        {size !== 'sm' && (
          <>
            <div className="flex justify-center space-x-3 text-white">
              <div className="stat">
                <span className="font-body opacity-70">{fontSizes.stats} PAC</span>
                <span className="font-bold ml-1">{player.pace}</span>
              </div>
              <div className="stat">
                <span className="font-body opacity-70">{fontSizes.stats} SHO</span>
                <span className="font-bold ml-1">{player.shooting}</span>
              </div>
              <div className="stat">
                <span className="font-body opacity-70">{fontSizes.stats} PAS</span>
                <span className="font-bold ml-1">{player.passing}</span>
              </div>
            </div>
            
            <div className="flex justify-center space-x-3 text-white mt-1">
              <div className="stat">
                <span className="font-body opacity-70">{fontSizes.stats} DRI</span>
                <span className="font-bold ml-1">{player.dribbling}</span>
              </div>
              <div className="stat">
                <span className="font-body opacity-70">{fontSizes.stats} DEF</span>
                <span className="font-bold ml-1">{player.defense}</span>
              </div>
              <div className="stat">
                <span className="font-body opacity-70">{fontSizes.stats} PHY</span>
                <span className="font-bold ml-1">{player.physical}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default PlayerCard;
