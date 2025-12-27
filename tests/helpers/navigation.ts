import type { Page } from '@playwright/test';

/**
 * 페이지 상단의 언어 전환 버튼 클릭 (KO/ENG)
 * 페이지 로드를 자동으로 기다립니다.
 * 쿼리 파라미터는 무시하고 pathname만 비교합니다.
 *
 * @param page - Playwright Page 객체
 * @param lang - 목표 언어 ('ko' 또는 'en')
 * @param targetPath - 목표 경로 (예: '/people/faculty/123')
 *
 * 한국어: /people/faculty/123
 * 영문: /en/people/faculty/123
 */
export async function switchPageLanguage(
  page: Page,
  lang: 'ko' | 'en',
  targetPath: string,
) {
  const buttonName = lang === 'ko' ? '한국어' : 'ENG';
  await page.getByRole('button', { name: buttonName }).click();

  // 목표 경로 생성 (쿼리 파라미터는 무시)
  const expectedPath = lang === 'ko' ? targetPath : `/en${targetPath}`;

  // pathname만 비교 (쿼리 파라미터 무시)
  await page.waitForURL((url) => {
    const pathname = new URL(url).pathname;
    return pathname === expectedPath;
  });
  await page.waitForLoadState('load');
}
