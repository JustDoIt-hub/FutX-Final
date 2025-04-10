import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Player } from '@/hooks/useSpin';

export interface Team {
  id: number;
  user_id: number;
  name: string;
  formation: string;
  play_style: string;
  players: Player[];
  created_at: string;
  updated_at: string;
}

export interface MatchState {
  minute: number;
  userScore: number;
  cpuScore: number;
  possession: number;
  shots: number;
  shotsOnTarget: number;
  corners: number;
  commentary: { minute: number; text: string }[];
  finished: boolean;
}

export interface MatchEvent {
  minute: number;
  eventType: 'goal' | 'miss' | 'defense' | 'possession';
  commentary: string;
  player: Player;
  team: 'USER' | 'CPU';
}

export function useTeamBattle() {
  const [selectedFormation, setSelectedFormation] = useState<string>('4-3-3');
  const [selectedPlayStyle, setSelectedPlayStyle] = useState<string>('TIKI_TAKA');
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);
  const [teamName, setTeamName] = useState<string>('My Team');
  const [matchState, setMatchState] = useState<MatchState | null>(null);
  const [matchEvents, setMatchEvents] = useState<MatchEvent[]>([]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [userTeam, setUserTeam] = useState<Team | null>(null);
  const [cpuTeam, setCpuTeam] = useState<any | null>(null);
  
  const socketRef = useRef<WebSocket | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get user's teams
  const { data: teams, isLoading: isLoadingTeams } = useQuery({
    queryKey: ['/api/teams'],
    queryFn: async () => {
      const res = await fetch('/api/teams');
      if (!res.ok) throw new Error('Failed to fetch teams');
      const data = await res.json();
      return data.teams as Team[];
    },
  });

  // Create team mutation
  const createTeamMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/teams', {
        name: teamName,
        formation: selectedFormation,
        playStyle: selectedPlayStyle,
        players: selectedPlayers,
      });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/teams'] });
      toast({
        title: 'Team created',
        description: `Your team "${data.team.name}" has been created successfully`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Team creation failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    },
  });

  // Start match mutation
  const startMatchMutation = useMutation({
    mutationFn: async (teamId: number) => {
      const res = await apiRequest('POST', '/api/matches/start', { teamId });
      return res.json();
    },
    onSuccess: (data) => {
      // After verifying the team, connect with WebSocket
      connectMatchWebSocket(data.teamId);
    },
    onError: (error) => {
      toast({
        title: 'Failed to start match',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    },
  });

  // Connect to WebSocket for match simulation
  const connectMatchWebSocket = useCallback((teamId: number) => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.close();
    }
    
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;
    
    socket.onopen = () => {
      console.log('WebSocket connected');
      
      // Start the match simulation
      socket.send(JSON.stringify({
        type: 'start_match',
        userId: userTeam?.user_id,
        teamId
      }));
      
      setIsSimulating(true);
      setMatchState(null);
      setMatchEvents([]);
    };
    
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'match_start':
          setUserTeam(data.userTeam);
          setCpuTeam(data.cpuTeam);
          toast({
            title: 'Match started',
            description: `${data.userTeam.name} vs ${data.cpuTeam.name}`,
          });
          break;
          
        case 'match_update':
          setMatchState(data.state);
          break;
          
        case 'match_event':
          setMatchState(data.state);
          setMatchEvents(prev => [data.event, ...prev.slice(0, 9)]);
          break;
          
        case 'match_end':
          setMatchState(data.state);
          setIsSimulating(false);
          
          const result = data.state.userScore > data.state.cpuScore
            ? 'Victory!'
            : data.state.userScore < data.state.cpuScore
              ? 'Defeat!'
              : 'Draw!';
              
          toast({
            title: `Match ended: ${result}`,
            description: `Final score: ${data.state.userScore} - ${data.state.cpuScore}`,
          });
          
          queryClient.invalidateQueries({ queryKey: ['/api/matches'] });
          break;
          
        case 'error':
          toast({
            title: 'Match simulation error',
            description: data.message,
            variant: 'destructive',
          });
          setIsSimulating(false);
          break;
      }
    };
    
    socket.onclose = () => {
      console.log('WebSocket disconnected');
      if (isSimulating) {
        setIsSimulating(false);
      }
    };
    
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast({
        title: 'Connection error',
        description: 'Failed to connect to the match server',
        variant: 'destructive',
      });
      setIsSimulating(false);
    };
  }, [toast, userTeam, isSimulating, queryClient]);

  // Cleanup WebSocket on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  // Create a team
  const createTeam = () => {
    createTeamMutation.mutate();
  };

  // Start a match with a specific team
  const startMatch = (teamId: number) => {
    startMatchMutation.mutate(teamId);
  };

  // End a match simulation
  const endMatch = () => {
    if (socketRef.current) {
      socketRef.current.close();
      setIsSimulating(false);
    }
  };

  return {
    teams,
    selectedFormation,
    setSelectedFormation,
    selectedPlayStyle,
    setSelectedPlayStyle,
    selectedPlayers,
    setSelectedPlayers,
    teamName,
    setTeamName,
    matchState,
    matchEvents,
    isSimulating,
    userTeam,
    cpuTeam,
    isLoading: isLoadingTeams || createTeamMutation.isPending || startMatchMutation.isPending,
    createTeam,
    startMatch,
    endMatch,
  };
}
