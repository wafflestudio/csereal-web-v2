import fs from 'node:fs/promises';
import path from 'node:path';
import type { DayStats, FileInfo, LogEntry } from '~/types/analytics';

const ANALYTICS_DIR = import.meta.env.DEV
  ? path.join(process.cwd(), '.cache', 'analytics')
  : '/frontend-data/analytics';

/**
 * 월별 폴더 목록 조회
 */
export async function getMonthFolders(): Promise<string[]> {
  const entries = await fs.readdir(ANALYTICS_DIR, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .reverse(); // 최신순
}

/**
 * 특정 월의 일별 파일 목록 조회
 */
export async function getDayFiles(month: string): Promise<FileInfo[]> {
  const monthDir = path.join(ANALYTICS_DIR, month);
  const entries = await fs.readdir(monthDir, { withFileTypes: true });
  const files = await Promise.all(
    entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.jsonl'))
      .map(async (entry) => {
        const filePath = path.join(monthDir, entry.name);
        const stats = await fs.stat(filePath);
        return {
          name: entry.name,
          path: filePath,
          size: stats.size,
        };
      }),
  );
  return files.sort((a, b) => b.name.localeCompare(a.name)); // 최신순
}

/**
 * 특정 파일의 통계 계산 (스트리밍)
 */
export async function calculateFileStats(filePath: string): Promise<DayStats> {
  const stats: DayStats = { total: 0, realUsers: 0, bots: 0 };
  const content = await fs.readFile(filePath, 'utf8');
  const lines = content.trim().split('\n');

  for (const line of lines) {
    if (!line) continue;
    const log: LogEntry = JSON.parse(line);
    stats.total++;
    if (log.isBot) {
      stats.bots++;
    } else {
      stats.realUsers++;
    }
  }

  return stats;
}

/**
 * 파일의 로그 엔트리 목록 읽기 (최대 1000개)
 */
export async function readLogEntries(filePath: string): Promise<LogEntry[]> {
  // 보안: ANALYTICS_DIR 외부 접근 차단
  if (!filePath.includes(ANALYTICS_DIR)) {
    return [];
  }

  const content = await fs.readFile(filePath, 'utf8');
  const lines = content.trim().split('\n');
  const entries: LogEntry[] = [];

  for (const line of lines) {
    if (!line) continue;
    entries.push(JSON.parse(line));
  }

  return entries.reverse(); // 최신순
}
