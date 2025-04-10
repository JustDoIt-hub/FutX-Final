import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export interface SpinOptions {
  positions: string[];
  events: string[];
  ovrRanges: string[];
}

export interface Player {
  id: number;
  name: string;
  position: string;
  event: string;
  overall: number;
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defense: number;
  physical: number;
  image_url?: string;
}

export interface SpinResult {
  type: 'position' | 'event' | 'ovr' | 'all';
  positionResult?: string;
  eventResult?: string;
  ovrResult?: string;
  player?: Player;
}

export interface RecentSpin {
  id: number;
  user_id: number;
  player_id: number;
  position_result: string;
  event_result: string;
  ovr_result: string;
  spun_at: string;
  player: Player;
}

export function useSpin() {
  const [spinningType, setSpinningType] = useState<string | null>(null);
  const [spinResult, setSpinResult] = useState<SpinResult | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get spin options (positions, events, OVR ranges)
  const { data: spinOptions, isLoading: isLoadingOptions } = useQuery({
    queryKey: ['/api/spin/options'],
    queryFn: async () => {
      const res = await fetch('/api/spin/options');
      if (!res.ok) throw new Error('Failed to fetch spin options');
      return res.json() as Promise<SpinOptions>;
    },
  });

  // Get recent spins
  const { data: recentSpins, isLoading: isLoadingRecent } = useQuery({
    queryKey: ['/api/spin/recent'],
    queryFn: async () => {
      const res = await fetch('/api/spin/recent');
      if (!res.ok) throw new Error('Failed to fetch recent spins');
      const data = await res.json();
      return data.recentSpins as RecentSpin[];
    },
  });

  // Get user's player collection
  const { data: userPlayers, isLoading: isLoadingPlayers } = useQuery({
    queryKey: ['/api/players'],
    queryFn: async () => {
      const res = await fetch('/api/players');
      if (!res.ok) throw new Error('Failed to fetch player collection');
      const data = await res.json();
      return data.players as Player[];
    },
  });

  // Spin mutation
  const spinMutation = useMutation({
    mutationFn: async (type: 'position' | 'event' | 'ovr' | 'all') => {
      setSpinningType(type);
      const res = await apiRequest('POST', '/api/spin', { type });
      return res.json() as Promise<SpinResult>;
    },
    onSuccess: (data) => {
      setSpinResult(data);
      queryClient.invalidateQueries({ queryKey: ['/api/spin/recent'] });
      
      if (data.player) {
        queryClient.invalidateQueries({ queryKey: ['/api/players'] });
        toast({
          title: 'New player acquired!',
          description: `You got ${data.player.name} (${data.player.overall} OVR)`,
        });
      }
    },
    onError: (error) => {
      toast({
        title: 'Spin failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      setSpinningType(null);
    },
  });

  // Perform a spin
  const spin = (type: 'position' | 'event' | 'ovr' | 'all') => {
    spinMutation.mutate(type);
  };

  // Reset the spin result
  const resetSpinResult = () => {
    setSpinResult(null);
  };

  return {
    spinOptions,
    recentSpins,
    userPlayers,
    spinResult,
    isSpinning: spinMutation.isPending,
    spinningType,
    isLoading: isLoadingOptions || isLoadingRecent || isLoadingPlayers,
    spin,
    resetSpinResult,
  };
}
