import fs from 'node:fs/promises';
import path from 'node:path';
import dayjs from 'dayjs';
import type { DayStats } from '~/types/analytics';
import { ANALYTICS_LOGS_DIR, ANALYTICS_STATS_DIR } from './constants.server';
import { computeDailyStats } from './stats-computer.server';

/**
 * 일별 통계 조회
 * - 캐시 있으면 반환, 없으면 계산 후 저장 (오늘 제외)
 */
export async function getDailyStats(date: string): Promise<DayStats | null> {
  const yearMonth = date.slice(0, 7);
  const statsFile = path.join(ANALYTICS_STATS_DIR, yearMonth, `${date}.json`);

  try {
    const content = await fs.readFile(statsFile, 'utf8');
    return JSON.parse(content) as DayStats;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      const stats = await computeDailyStats(date);
      if (!stats) return null;

      // 오늘이 아닌 경우만 캐시에 저장
      const today = dayjs().format('YYYY-MM-DD');
      if (date !== today) {
        await saveDailyStats(date, stats);
      }

      return stats;
    }
    throw error;
  }
}

async function saveDailyStats(date: string, stats: DayStats): Promise<void> {
  const yearMonth = date.slice(0, 7);
  const dir = path.join(ANALYTICS_STATS_DIR, yearMonth);
  await fs.mkdir(dir, { recursive: true });

  const file = path.join(dir, `${date}.json`);
  await fs.writeFile(file, JSON.stringify(stats, null, 2), 'utf8');
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
