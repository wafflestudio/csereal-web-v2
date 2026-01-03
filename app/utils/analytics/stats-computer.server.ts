import fs from 'node:fs/promises';
import path from 'node:path';
import dayjs from 'dayjs';
import type { DayStats, LogEntry, PageStats } from '~/types/analytics';
import { ANALYTICS_LOGS_DIR, ANALYTICS_STATS_DIR } from './constants.server';

/**
 * 일별 통계 계산
 */
export async function computeDailyStats(
  date: string,
): Promise<DayStats | null> {
  // 로그 파일 읽기
  const yearMonth = date.slice(0, 7);
  const logFile = path.join(ANALYTICS_LOGS_DIR, yearMonth, `${date}.jsonl`);

  let entries: LogEntry[] = [];
  try {
    const content = await fs.readFile(logFile, 'utf8');
    const lines = content.trim().split('\n');
    entries = lines.filter((line) => line).map((line) => JSON.parse(line));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw error;
  }

  const realUserEntries = entries.filter((e) => !e.isBot);

  const stats: DayStats = {
    date,
    total: entries.length,
    realUsers: realUserEntries.length,
    bots: entries.length - realUserEntries.length,
    pages: aggregatePages(entries),
    browsers: aggregateStats(
      entries,
      (e) => e.userAgent?.browser?.name || 'Unknown',
    ),
    os: aggregateStats(entries, (e) => e.userAgent?.os?.name || 'Unknown'),
    platforms: aggregateStats(
      entries,
      (e) => e.userAgent?.platform?.type || 'unknown',
    ),
    referers: aggregateStats(entries, (e) => {
      if (!e.referer) return 'Direct';
      try {
        return new URL(e.referer).hostname;
      } catch {
        return 'Invalid';
      }
    }),
  };

  // 오늘이 아닌 경우만 캐시에 저장
  const today = dayjs().format('YYYY-MM-DD');
  if (date !== today) {
    await saveDailyStats(date, stats);
  }

  return stats;
}

function aggregatePages(entries: LogEntry[]): PageStats[] {
  const noBotEntries = entries.filter((e) => !e.isBot);
  const grouped = Object.groupBy(noBotEntries, (e) => e.pathname);
  return Object.entries(grouped).map(([path, items = []]) => ({
    path,
    views: items.length,
  }));
}

function aggregateStats(
  entries: LogEntry[],
  keyExtractor: (entry: LogEntry) => string,
) {
  const grouped = Object.groupBy(entries, keyExtractor);
  const total = entries.length;

  return Object.entries(grouped)
    .map(([name, items = []]) => ({
      name,
      count: items.length,
      percentage: (items.length / total) * 100,
    }))
    .sort((a, b) => b.count - a.count);
}

async function saveDailyStats(date: string, stats: DayStats) {
  const yearMonth = date.slice(0, 7);
  const dir = path.join(ANALYTICS_STATS_DIR, yearMonth);
  await fs.mkdir(dir, { recursive: true });

  const file = path.join(dir, `${date}.json`);
  await fs.writeFile(file, JSON.stringify(stats, null, 2), 'utf8');
}
