// src/config.js
const configuredUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').trim();
const API_URL = configuredUrl.replace(/\/$/, '');

export default API_URL;