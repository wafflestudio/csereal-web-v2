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
}

export interface PageStats {
  path: string;
  views: number;
}

export interface TreeNode {
  segment: string;
  fullPath: string;
  koViews: number;
  enViews: number;
  totalKoViews: number;
  totalEnViews: number;
  children: Record<string, TreeNode>;
}

export interface DayStats {
  date: string; // YYYY-MM-DD
  total: number;
  tree: TreeNode;
  browsers: Array<{ name: string; count: number; percentage: number }>;
  os: Array<{ name: string; count: number; percentage: number }>;
  platforms: Array<{ name: string; count: number; percentage: number }>;
  referers: Array<{ name: string; count: number; percentage: number }>;
}
