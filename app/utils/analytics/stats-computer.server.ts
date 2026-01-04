import fs from 'node:fs/promises';
import path from 'node:path';
import type { DayStats, LogEntry } from '~/types/analytics';
import { ANALYTICS_LOGS_DIR } from './constants.server';
import { buildTree } from './tree-builder.server';

/**
 * 일별 통계 계산 (순수 계산 로직, 저장하지 않음)
 * @returns 통계 객체, 로그 파일이 없으면 null
 */
export async function computeDailyStats(date: string) {
  try {
    const entries = await readLogEntries(date);

    const stats: DayStats = {
      date,
      total: entries.length,
      tree: buildTree(entries),
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

    return stats;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw error;
  }
}

async function readLogEntries(date: string): Promise<LogEntry[]> {
  const yearMonth = date.slice(0, 7);
  const logFile = path.join(ANALYTICS_LOGS_DIR, yearMonth, `${date}.jsonl`);
  const content = await fs.readFile(logFile, 'utf8');
  const lines = content.trim().split('\n');
  return lines.filter((line) => line).map((line) => JSON.parse(line));
}

/**
 * 로그 항목들을 그룹화하여 통계 집계
 * @param entries 로그 항목 배열
 * @param keyExtractor 그룹화 키를 추출하는 함수
 * @returns 이름, 개수, 비율을 포함한 통계 배열 (개수 내림차순)
 */
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
