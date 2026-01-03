import fs from 'node:fs/promises';
import path from 'node:path';
import { isbot } from 'isbot';
import type { LogEntry } from '~/types/analytics';

const ANALYTICS_DIR = import.meta.env.DEV
  ? path.join(process.cwd(), '.cache', 'analytics')
  : '/frontend-data/analytics';

/**
 * 페이지 조회를 JSONL 파일에 기록
 * - 월별 폴더로 구분 (YYYY-MM/)
 * - 일별 파일로 저장 (YYYY-MM-DD.jsonl)
 * - 한 줄당 하나의 JSON 객체 (JSONL 형식)
 */
export async function logPageView(request: Request): Promise<void> {
  const now = new Date();
  const yearMonth = now.toISOString().slice(0, 7); // "2026-01"
  const date = now.toISOString().slice(0, 10); // "2026-01-03"

  const userAgent = request.headers.get('user-agent');

  const log: LogEntry = {
    timestamp: now.toISOString(),
    url: request.url,
    method: request.method,
    userAgent,
    referer: request.headers.get('referer'),
    ip:
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip'),
    isBot: userAgent ? isbot(userAgent) : false,
  };

  // 월별 폴더 생성
  const monthDir = path.join(ANALYTICS_DIR, yearMonth);
  await fs.mkdir(monthDir, { recursive: true });

  // 일별 파일에 JSONL 추가
  const logFile = path.join(monthDir, `${date}.jsonl`);
  await fs.appendFile(logFile, `${JSON.stringify(log)}\n`, 'utf8');
}
