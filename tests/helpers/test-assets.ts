import fs from 'node:fs';
import path from 'node:path';
import type { TestInfo } from '@playwright/test';
import { getFileNameDateTime } from './utils';

/**
 * 테스트용 이미지 생성
 * @param testInfo - Playwright TestInfo 객체
 * @param dateTimeString - 이미지에 표시할 날짜/시간 문자열
 * @param type - 이미지 타입 ('landscape': 600x400, 'portrait': 450x600 3:4 비율)
 */
export async function createTestImage(
  testInfo: TestInfo,
  dateTimeString: string,
  type: 'landscape' | 'portrait' = 'landscape',
) {
  const fileNameDateTime = getFileNameDateTime();

  const randomColor = Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0');

  // 이미지 크기: landscape는 600x400, portrait는 450x600 (3:4 비율)
  const dimensions = type === 'portrait' ? '450x600' : '600x400';
  const imageUrl = `https://placehold.co/${dimensions}/${randomColor}/white/png?text=${encodeURIComponent(dateTimeString)}`;

  const imageName = `test-image-${fileNameDateTime}.png`;
  const imagePath = testInfo.outputPath(imageName);

  // 디렉토리 생성
  const dir = path.dirname(imagePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const response = await fetch(imageUrl);
  const buffer = await response.arrayBuffer();
  fs.writeFileSync(imagePath, Buffer.from(buffer));

  return { imagePath, imageName };
}

export function createTestTextFile(testInfo: TestInfo, dateTimeString: string) {
  const fileNameDateTime = getFileNameDateTime();

  const fileName = `test-file-${fileNameDateTime}.txt`;
  const filePath = testInfo.outputPath(fileName);

  // 디렉토리 생성
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(
    filePath,
    `Playwright 테스트 첨부파일
생성 시간: ${dateTimeString}
파일명: ${fileName}`,
  );

  return { filePath, fileName };
}
