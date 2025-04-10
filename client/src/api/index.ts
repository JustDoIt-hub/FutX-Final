import { apiRequest } from '@/lib/queryClient';

// Authentication API
export const telegramAuth = async (code: string) => {
  const res = await apiRequest('POST', '/api/auth/telegram', { code });
  return res.json();
};

export const getCurrentUser = async () => {
  const res = await fetch('/api/auth/me', { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to get current user');
  return res.json();
};

export const logout = async () => {
  const res = await apiRequest('POST', '/api/auth/logout');
  return res.json();
};

// Spin API
export const getSpinOptions = async () => {
  const res = await fetch('/api/spin/options');
  if (!res.ok) throw new Error('Failed to get spin options');
  return res.json();
};

export const performSpin = async (type: 'position' | 'event' | 'ovr' | 'all') => {
  const res = await apiRequest('POST', '/api/spin', { type });
  return res.json();
};

export const getRecentSpins = async () => {
  const res = await fetch('/api/spin/recent');
  if (!res.ok) throw new Error('Failed to get recent spins');
  return res.json();
};

// Player API
export const getUserPlayers = async () => {
  const res = await fetch('/api/players');
  if (!res.ok) throw new Error('Failed to get player collection');
  return res.json();
};

// Team API
export const getUserTeams = async () => {
  const res = await fetch('/api/teams');
  if (!res.ok) throw new Error('Failed to get teams');
  return res.json();
};

export const createTeam = async (team: {
  name: string;
  formation: string;
  playStyle: string;
  players: number[];
}) => {
  const res = await apiRequest('POST', '/api/teams', team);
  return res.json();
};

export const getTeamDetails = async (id: number) => {
  const res = await fetch(`/api/teams/${id}`);
  if (!res.ok) throw new Error('Failed to get team details');
  return res.json();
};

export const updateTeam = async (id: number, team: {
  name: string;
  formation: string;
  playStyle: string;
  players: number[];
}) => {
  const res = await apiRequest('PUT', `/api/teams/${id}`, team);
  return res.json();
};

export const deleteTeam = async (id: number) => {
  const res = await apiRequest('DELETE', `/api/teams/${id}`);
  return res.json();
};

// Match API
export const startMatch = async (teamId: number) => {
  const res = await apiRequest('POST', '/api/matches/start', { teamId });
  return res.json();
};

export const getMatchHistory = async () => {
  const res = await fetch('/api/matches');
  if (!res.ok) throw new Error('Failed to get match history');
  return res.json();
};

export const getMatchDetails = async (id: number) => {
  const res = await fetch(`/api/matches/${id}`);
  if (!res.ok) throw new Error('Failed to get match details');
  return res.json();
};
