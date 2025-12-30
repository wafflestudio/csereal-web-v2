// Environment configuration
export const PHASE = import.meta.env.MODE;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Phase flags
export const IS_DEV = PHASE === 'development';
export const IS_BETA = PHASE === 'beta';
export const IS_PROD = PHASE === 'production';

// In dev mode, route API calls through Vite's proxy to avoid CORS.
export const BASE_URL = IS_DEV
  ? 'http://localhost:3000/api'
  : `${API_BASE_URL}/api`;
