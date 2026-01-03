import fs from 'node:fs/promises';
import path from 'node:path';
import type { DayStats } from '~/types/analytics';
import { ANALYTICS_LOGS_DIR, ANALYTICS_STATS_DIR } from './constants.server';
import { computeDailyStats } from './stats-computer.server';

/**
 * 일별 통계 조회
 * - 캐시 있으면 반환, 없으면 계산
 */
export async function getDailyStats(date: string): Promise<DayStats | null> {
  const yearMonth = date.slice(0, 7);
  const statsFile = path.join(ANALYTICS_STATS_DIR, yearMonth, `${date}.json`);

  try {
    const content = await fs.readFile(statsFile, 'utf8');
    return JSON.parse(content) as DayStats;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return await computeDailyStats(date);
    }
    throw error;
  }
}

/**
 * 사용 가능한 날짜 목록 반환 (오늘 포함)
 */
export async function getAvailableDates(): Promise<string[]> {
  try {
    const monthFolders = await fs.readdir(ANALYTICS_LOGS_DIR);

    const allDates = (
      await Promise.all(
        monthFolders.map(async (monthFolder) => {
          const monthPath = path.join(ANALYTICS_LOGS_DIR, monthFolder);
          const stat = await fs.stat(monthPath);

          if (!stat.isDirectory()) return [];

          const files = await fs.readdir(monthPath);
          return files
            .filter((file) => file.endsWith('.jsonl'))
            .map((file) => file.replace('.jsonl', ''));
        }),
      )
    ).flat();

    return allDates.sort().reverse(); // 최신순
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
}
