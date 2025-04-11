export const API_URL =
  import.meta.env.MODE === 'production'
    ? 'https://futx-api.onrender.com'
    : 'http://localhost:5000';
