export const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://futx-api.onrender.com'  // Update this when deploying
  : 'http://localhost:5000';
