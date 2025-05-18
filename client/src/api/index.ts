// import { API_URL } from '../config';
// import { apiRequest } from '@/lib/queryClient';

// // Authentication API
// export const telegramAuth = async (code: string) => {
//   const res = await apiRequest('POST', `${API_URL}/api/auth/telegram`, { code });
//   return res.json();
// };

// export const getCurrentUser = async () => {
//   const res = await fetch(`${API_URL}/api/auth/me`, { credentials: 'include' });
//   if (!res.ok) throw new Error('Failed to get current user');
//   return res.json();
// };

// export const logout = async () => {
//   const res = await apiRequest('POST', `${API_URL}/api/auth/logout`);
//   return res.json();
// };

// // Spin API
// export const getSpinOptions = async () => {
//   console.log("🔄 Calling GET /api/spin/options...");
//   const res = await fetch(`${API_URL}/api/spin/options`, {
//     credentials: 'include',
//   });
//   console.log("📦 Response:", res.status);
//   if (!res.ok) throw new Error('Failed to get spin options');
//   const data = await res.json();
//   console.log("✅ Spin Options Data:", data);
//   return data;
// };
// export const performSpin = async (type: 'position' | 'event' | 'ovr' | 'all') => {
//   const res = await apiRequest('POST', `${API_URL}/api/spin`, { type });
//   return res.json();
// };

// export const getRecentSpins = async () => {
//   const res = await fetch(`${API_URL}/api/spin/recent`);
//   if (!res.ok) throw new Error('Failed to get recent spins');
//   return res.json();
// };

// // Player API
// export const getUserPlayers = async () => {
//   const res = await fetch(`${API_URL}/api/players`);
//   if (!res.ok) throw new Error('Failed to get player collection');
//   return res.json();
// };

// // Team API
// export const getUserTeams = async () => {
//   const res = await fetch(`${API_URL}/api/teams`);
//   if (!res.ok) throw new Error('Failed to get teams');
//   return res.json();
// };

// export const createTeam = async (team: {
//   name: string;
//   formation: string;
//   playStyle: string;
//   players: number[];
// }) => {
//   const res = await apiRequest('POST', `${API_URL}/api/teams`, team);
//   return res.json();
// };

// export const getTeamDetails = async (id: number) => {
//   const res = await fetch(`${API_URL}/api/teams/${id}`);
//   if (!res.ok) throw new Error('Failed to get team details');
//   return res.json();
// };

// export const updateTeam = async (id: number, team: {
//   name: string;
//   formation: string;
//   playStyle: string;
//   players: number[];
// }) => {
//   const res = await apiRequest('PUT', `${API_URL}/api/teams/${id}`, team);
//   return res.json();
// };

// export const deleteTeam = async (id: number) => {
//   const res = await apiRequest('DELETE', `${API_URL}/api/teams/${id}`);
//   return res.json();
// };

// // Match API
// export const startMatch = async (teamId: number) => {
//   const res = await apiRequest('POST', `${API_URL}/api/matches/start`, { teamId });
//   return res.json();
// };

// export const getMatchHistory = async () => {
//   const res = await fetch(`${API_URL}/api/matches`);
//   if (!res.ok) throw new Error('Failed to get match history');
//   return res.json();
// };

// export const getMatchDetails = async (id: number) => {
//   const res = await fetch(`${API_URL}/api/matches/${id}`);
//   if (!res.ok) throw new Error('Failed to get match details');
//   return res.json();
// };


import { API_URL } from '../config';
import { apiRequest } from '@/lib/queryClient';

// Authentication API
export const telegramAuth = async (code: string) => {
  const res = await apiRequest('POST', `${API_URL}/api/auth/telegram`, { code });
  return res.json();
};

export const getCurrentUser = async () => {
  const res = await fetch(`${API_URL}/api/auth/me`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to get current user');
  return res.json();
};

export const logout = async () => {
  const res = await fetch(`${API_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.json();
};

// Spin API
export const getSpinOptions = async () => {
  console.log("🔄 Calling GET /api/spin/options...");
  const res = await fetch(`${API_URL}/api/spin/options`, {
    credentials: 'include',
  });
  console.log("📦 Response:", res.status);
  if (!res.ok) throw new Error('Failed to get spin options');
  const data = await res.json();
  console.log("✅ Spin Options Data:", data);
  return data;
};

export const performSpin = async (type: 'position' | 'event' | 'ovr' | 'all') => {
  const res = await apiRequest('POST', `${API_URL}/api/spin`, { type });
  return res.json();
};

export const getRecentSpins = async () => {
  const res = await fetch(`${API_URL}/api/spin/recent`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to get recent spins');
  return res.json();
};

// Player API
export const getUserPlayers = async () => {
  const res = await fetch(`${API_URL}/api/players`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to get player collection');
  return res.json();
};

// Team API
export const getUserTeams = async () => {
  const res = await fetch(`${API_URL}/api/teams`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to get teams');
  return res.json();
};

export const createTeam = async (team: {
  name: string;
  formation: string;
  playStyle: string;
  players: number[];
}) => {
  const res = await apiRequest('POST', `${API_URL}/api/teams`, team);
  return res.json();
};

export const getTeamDetails = async (id: number) => {
  const res = await fetch(`${API_URL}/api/teams/${id}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to get team details');
  return res.json();
};

export const updateTeam = async (id: number, team: {
  name: string;
  formation: string;
  playStyle: string;
  players: number[];
}) => {
  const res = await apiRequest('PUT', `${API_URL}/api/teams/${id}`, team);
  return res.json();
};

export const deleteTeam = async (id: number) => {
  const res = await apiRequest('DELETE', `${API_URL}/api/teams/${id}`);
  return res.json();
};

// Match API
export const startMatch = async (teamId: number) => {
  const res = await apiRequest('POST', `${API_URL}/api/matches/start`, { teamId });
  return res.json();
};

export const getMatchHistory = async () => {
  const res = await fetch(`${API_URL}/api/matches`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to get match history');
  return res.json();
};

export const getMatchDetails = async (id: number) => {
  const res = await fetch(`${API_URL}/api/matches/${id}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to get match details');
  return res.json();
};

