// bowser 파싱 결과
export interface ParsedUA {
  browser: { name?: string; version?: string };
  os: { name?: string; version?: string; versionName?: string };
  platform: { type?: string }; // mobile, tablet, desktop, tv
  engine: { name?: string };
}

export interface LogEntry {
  timestamp: string;
  pathname: string;
  userAgent: ParsedUA | null;
  referer: string | null;
  isBot: boolean;
}

export interface PageStats {
  path: string;
  views: number;
}

export interface DayStats {
  date: string; // YYYY-MM-DD
  total: number;
  realUsers: number;
  bots: number;
  pages: PageStats[];
  browsers: Array<{ name: string; count: number; percentage: number }>;
  os: Array<{ name: string; count: number; percentage: number }>;
  platforms: Array<{ name: string; count: number; percentage: number }>;
  referers: Array<{ name: string; count: number; percentage: number }>;
}
