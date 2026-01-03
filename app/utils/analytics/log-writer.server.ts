import fs from 'node:fs/promises';
import path from 'node:path';
import Bowser from 'bowser';
import dayjs from 'dayjs';
import { isbot } from 'isbot';
import type { LogEntry, ParsedUA } from '~/types/analytics';
import { ANALYTICS_LOGS_DIR } from './constants.server';

/**
 * 페이지 조회를 JSONL 파일에 기록
 * - 월별 폴더로 구분 (YYYY-MM/)
 * - 일별 파일로 저장 (YYYY-MM-DD.jsonl)
 * - 한 줄당 하나의 JSON 객체 (JSONL 형식)
 */
export async function logPageView(request: Request): Promise<void> {
  const now = dayjs();
  const yearMonth = now.format('YYYY-MM');
  const date = now.format('YYYY-MM-DD');

  // User-Agent 파싱
  const uaString = request.headers.get('user-agent');
  let parsedUA: ParsedUA | null = null;
  if (uaString) {
    const result = Bowser.parse(uaString);
    parsedUA = {
      browser: result.browser,
      os: result.os,
      platform: result.platform,
      engine: result.engine,
    };
  }

  const log: LogEntry = {
    timestamp: now.toISOString(),
    pathname: new URL(request.url).pathname,
    userAgent: parsedUA,
    referer: request.headers.get('referer'),
    isBot: uaString ? isbot(uaString) : false,
  };

  // 월별 폴더 생성
  const monthDir = path.join(ANALYTICS_LOGS_DIR, yearMonth);
  await fs.mkdir(monthDir, { recursive: true });

  // 일별 파일에 JSONL 추가
  const logFile = path.join(monthDir, `${date}.jsonl`);
  await fs.appendFile(logFile, `${JSON.stringify(log)}\n`, 'utf8');
}
