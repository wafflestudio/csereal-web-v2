export interface LogEntry {
  timestamp: string;
  url: string;
  method: string;
  userAgent: string | null;
  referer: string | null;
  ip: string | null;
  isBot: boolean;
}

export interface DayStats {
  total: number;
  realUsers: number;
  bots: number;
}

export interface FileInfo {
  name: string;
  path: string;
  size: number;
}
