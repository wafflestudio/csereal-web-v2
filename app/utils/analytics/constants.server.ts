import path from 'node:path';

export const ANALYTICS_BASE_DIR = import.meta.env.DEV
  ? path.join(process.cwd(), '.cache', 'analytics')
  : '/frontend-data/analytics';

export const ANALYTICS_LOGS_DIR = path.join(ANALYTICS_BASE_DIR, 'logs');
export const ANALYTICS_STATS_DIR = path.join(ANALYTICS_BASE_DIR, 'stats');
