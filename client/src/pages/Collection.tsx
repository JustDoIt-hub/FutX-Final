import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSpin, Player } from '@/hooks/useSpin';
import Navigation from '@/components/Navigation';
import PlayerCard from '@/components/PlayerCard';
import PlayerComparison from '@/components/PlayerComparison';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  FaSearch, 
  FaSort, 
  FaFilter, 
  FaTrophy, 
  FaChartBar, 
  FaChartPie,
  FaChevronDown 
} from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

// Stats shown in the collection grid
const statOptions = [
  { value: 'overall', label: 'OVR' },
  { value: 'pace', label: 'PAC' },
  { value: 'shooting', label: 'SHO' },
  { value: 'passing', label: 'PAS' },
  { value: 'dribbling', label: 'DRI' },
  { value: 'defense', label: 'DEF' },
  { value: 'physical', label: 'PHY' },
];

// Sort options
const sortOptions = [
  { value: 'overall-desc', label: 'Overall (High to Low)' },
  { value: 'overall-asc', label: 'Overall (Low to High)' },
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'latest', label: 'Latest Acquired' },
];

// Position filter groups
const positionGroups = [
  { 
    name: 'Attackers', 
    positions: ['ST', 'CF', 'LW', 'RW'] 
  },
  { 
    name: 'Midfielders',
    positions: ['CAM', 'CM', 'CDM', 'LM', 'RM'] 
  },
  { 
    name: 'Defenders',
    positions: ['CB', 'LB', 'RB', 'LWB', 'RWB'] 
  },
  { 
    name: 'Goalkeepers',
    positions: ['GK'] 
  },
];

// Event types to filter by
const eventTypes = [
  'TOTS', 'TOTY', 'ICY_MAGICIANS', 'FUTURE_STARS', 'ICONS', 'HEROES'
];

const Collection = () => {
  // State for collection view
  const [viewMode, setViewMode] = useState<'grid' | 'comparison'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStat, setSelectedStat] = useState('overall');
  const [sortOption, setSortOption] = useState('overall-desc');
  
  // Filter states
  const [positionFilters, setPositionFilters] = useState<string[]>([]);
  const [eventFilters, setEventFilters] = useState<string[]>([]);
  const [ratingRange, setRatingRange] = useState<[number, number]>([0, 100]);
  
  // Get player collection from useSpin hook
  const { userPlayers, isLoading } = useSpin();
  
  // Toggle a position filter
  const togglePositionFilter = (position: string) => {
    setPositionFilters(prev => 
      prev.includes(position)
        ? prev.filter(p => p !== position)
        : [...prev, position]
    );
  };
  
  // Toggle an event filter
  const toggleEventFilter = (event: string) => {
    setEventFilters(prev => 
      prev.includes(event)
        ? prev.filter(e => e !== event)
        : [...prev, event]
    );
  };
  
  // Clear all filters
  const clearFilters = () => {
    setPositionFilters([]);
    setEventFilters([]);
    setRatingRange([0, 100]);
    setSearchQuery('');
  };
  
  // Filter and sort players
  const filteredAndSortedPlayers = userPlayers ? [...userPlayers]
    // Filter by search query
    .filter(player => {
      if (!searchQuery) return true;
      return player.name.toLowerCase().includes(searchQuery.toLowerCase());
    })
    // Filter by position
    .filter(player => {
      if (positionFilters.length === 0) return true;
      return positionFilters.includes(player.position);
    })
    // Filter by event type
    .filter(player => {
      if (eventFilters.length === 0) return true;
      return eventFilters.includes(player.event);
    })
    // Filter by rating range
    .filter(player => {
      return player.overall >= ratingRange[0] && player.overall <= ratingRange[1];
    })
    // Sort players
    .sort((a, b) => {
      const [field, direction] = sortOption.split('-');
      
      if (field === 'overall') {
        return direction === 'desc' 
          ? b.overall - a.overall 
          : a.overall - b.overall;
      }
      
      if (field === 'name') {
        return direction === 'desc'
          ? b.name.localeCompare(a.name)
          : a.name.localeCompare(b.name);
      }
      
      // Default to latest (by ID for now since we don't have acquired date)
      return b.id - a.id;
    }) : [];
  
  // Function to get the value of the selected stat for a player
  const getStatValue = (player: Player, statKey: string) => {
    return player[statKey as keyof Player] as number;
  };
  
  // Render player cards in grid view
  const renderPlayerGrid = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {filteredAndSortedPlayers.map(player => (
        <motion.div 
          key={player.id}
          className="transform transition hover:scale-105"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <PlayerCard 
            player={player} 
            size="md" 
            className="mx-auto"
            onClick={() => {/* Implement player details view */}}
          />
          
          {/* Show selected stat */}
          <div className="mt-2 text-center">
            <span className="inline-block bg-gray-800 px-3 py-1 rounded text-sm font-medium">
              {statOptions.find(opt => opt.value === selectedStat)?.label}: {getStatValue(player, selectedStat)}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mx-auto"></div>
        <p className="mt-4 text-white">Loading your player collection...</p>
      </div>
    );
  }
  
  return (
    <div>
      <Navigation activeTab="collection" />
      
      <section className="py-8 container mx-auto px-4">
        <div className="flex flex-col space-y-6">
          {/* Header with title and view toggles */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <FaTrophy className="text-yellow-400 mr-3" /> 
              MY COLLECTION {userPlayers && userPlayers.length ? `(${userPlayers.length})` : ''}
            </h2>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                <FaChartBar className="mr-2" /> Grid View
              </Button>
              
              <Button
                variant={viewMode === 'comparison' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('comparison')}
                className={viewMode === 'comparison' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                <FaChartPie className="mr-2" /> Compare
              </Button>
            </div>
          </div>
          
          {/* Search and filter tools */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Search */}
            <div className="relative flex-grow max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search players..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-gray-700">
                  <FaSort className="mr-2" /> Sort
                  <FaChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700">
                <DropdownMenuGroup>
                  {sortOptions.map(option => (
                    <DropdownMenuItem 
                      key={option.value}
                      className={`${sortOption === option.value ? 'bg-blue-600/20 text-blue-400' : ''} cursor-pointer`}
                      onClick={() => setSortOption(option.value)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Stat Display Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-gray-700">
                  <FaChartBar className="mr-2" /> Show Stat
                  <FaChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700">
                <DropdownMenuGroup>
                  {statOptions.map(option => (
                    <DropdownMenuItem 
                      key={option.value}
                      className={`${selectedStat === option.value ? 'bg-blue-600/20 text-blue-400' : ''} cursor-pointer`}
                      onClick={() => setSelectedStat(option.value)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Filters Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="border-gray-700">
                  <FaFilter className="mr-2" /> Filters
                  {(positionFilters.length > 0 || eventFilters.length > 0) && (
                    <span className="ml-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {positionFilters.length + eventFilters.length}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-gray-900 text-white border-gray-800">
                <SheetHeader>
                  <SheetTitle className="text-white">Filter Players</SheetTitle>
                  <SheetDescription className="text-gray-400">
                    Narrow down your player collection.
                  </SheetDescription>
                </SheetHeader>
                
                <div className="mt-4 space-y-6">
                  {/* Position filters */}
                  <div>
                    <h4 className="text-lg font-bold mb-2">Positions</h4>
                    {positionGroups.map(group => (
                      <div key={group.name} className="mb-4">
                        <h5 className="text-sm font-medium text-gray-400 mb-2">{group.name}</h5>
                        <div className="grid grid-cols-2 gap-2">
                          {group.positions.map(position => (
                            <div key={position} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`pos-${position}`} 
                                checked={positionFilters.includes(position)}
                                onCheckedChange={() => togglePositionFilter(position)}
                              />
                              <Label htmlFor={`pos-${position}`} className="text-sm">
                                {position}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Event type filters */}
                  <div>
                    <h4 className="text-lg font-bold mb-2">Event Types</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {eventTypes.map(event => (
                        <div key={event} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`event-${event}`} 
                            checked={eventFilters.includes(event)}
                            onCheckedChange={() => toggleEventFilter(event)}
                          />
                          <Label htmlFor={`event-${event}`} className="text-sm">
                            {event.replace('_', ' ')}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex justify-end space-x-2 pt-4 border-t border-gray-800">
                    <Button 
                      variant="outline" 
                      className="border-gray-700"
                      onClick={clearFilters}
                    >
                      Clear All
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          {/* No results message */}
          {filteredAndSortedPlayers.length === 0 && (
            <div className="bg-gray-800 rounded-xl p-8 text-center">
              <h3 className="text-xl font-bold text-white mb-2">No Players Found</h3>
              <p className="text-gray-400 mb-4">
                {userPlayers && userPlayers.length > 0
                  ? "Try changing your filters or search query." 
                  : "Start spinning to build your player collection!"}
              </p>
              
              {userPlayers && userPlayers.length > 0 && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          )}
          
          {/* Player display */}
          {filteredAndSortedPlayers.length > 0 && (
            viewMode === 'grid' 
              ? renderPlayerGrid()
              : <PlayerComparison players={filteredAndSortedPlayers} />
          )}
        </div>
      </section>
    </div>
  );
};

export default Collection;