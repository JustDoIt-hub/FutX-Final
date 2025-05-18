const BASE_URL = import.meta.env.VITE_API_URL || "https://futx-api-url.com"; // update as needed

// export async function getCurrentUser() {
//   const res = await fetch(`${BASE_URL}/api/auth/me`, {
//     credentials: "include",
//   });
//   if (!res.ok) throw new Error("Not authenticated");
//   return res.json(); // returns { user: {...} }
// }

// export async function login(userId: number) {
//   const res = await fetch(`${BASE_URL}/api/auth/login?userId=${userId}`, {
//     credentials: "include",
//   });
//   return res.json();
// }

// export async function logout() {
//   const res = await fetch(`${BASE_URL}/api/auth/logout`, {
//     method: "POST",
//     credentials: "include",
//   });
//   return res.json();
// }
export async function getUserPlayers() {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/players`, {
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch user players');
  }

  return res.json(); // or res.json().players if your response is wrapped
}

