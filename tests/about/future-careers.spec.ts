import { expect, test } from '@playwright/test';
import { loginAsStaff } from '../helpers/auth';
import {
  fillHTMLEditor,
  submitForm,
  switchEditorLanguage,
} from '../helpers/form-components';
import { getKoreanDateTime } from '../helpers/utils';

test('졸업생 진로 본문 편집 및 한/영 내용 검증', async ({ page }) => {
  const dateTimeString = getKoreanDateTime();
  const koText = `Playwright KO ${dateTimeString}`;
  const enText = `Playwright EN ${dateTimeString}`;

  // 1. 로그인
  await page.goto('/about/future-careers');
  await loginAsStaff(page);

  // 2. 편집 페이지로 이동 (첫 번째 편집 버튼: description 편집)
  await page.getByRole('link', { name: '편집' }).first().click();
  await page.waitForURL('**/about/future-careers/description/edit');

  // 3. 폼 입력 (HTML 에디터만 사용)
  await fillHTMLEditor(page, koText);
  await switchEditorLanguage(page, 'en');
  await fillHTMLEditor(page, enText);
  await switchEditorLanguage(page, 'ko');

  // 4. 제출
  await submitForm(page);
  await page.waitForURL('**/about/future-careers');

  // 5. 검증 - 한글 페이지
  await expect(page.getByText(koText)).toBeVisible();

  // 6. 검증 - 영문 페이지
  await page.goto('/en/about/future-careers');
  await expect(page.getByText(enText)).toBeVisible();
});

test('졸업생 진로 현황 편집 및 검증', async ({ page }) => {
  // 고유한 테스트 값 생성 (10-99 사이의 랜덤 숫자)
  const randomValue = Math.floor(Math.random() * 90) + 10;
  const testValue = randomValue.toString();

  // 1. 로그인
  await page.goto('/about/future-careers');
  await loginAsStaff(page);

  // 2. 진로 현황 편집 페이지로 이동 (두 번째 편집 버튼)
  await page.getByRole('link', { name: '편집' }).nth(1).click();
  await page.waitForURL('**/about/future-careers/stat/edit**');

  // 3. 통계 데이터 수정 (학부-삼성에 랜덤값 입력)
  const samsungBachelorInput = page.locator(
    'input[name="statList.0.bachelor"]',
  );
  await samsungBachelorInput.fill(testValue);

  // 4. 제출
  await submitForm(page);
  await page.waitForURL('**/about/future-careers');

  // 5. 검증 - 변경된 값이 표시되는지 확인
  // 페이지 새로고침하여 변경사항 확인
  await page.reload();
  // 삼성 행에서 테스트값 찾기 (stat 테이블의 특정 클래스 사용)
  const statTable = page.locator('div.border-y.border-neutral-300').first();
  await expect(statTable.getByText(testValue)).toBeVisible();
});

test('졸업생 창업 기업 추가->편집->삭제 플로우 검증', async ({ page }) => {
  const dateTimeString = getKoreanDateTime();
  const companyName = `Playwright Company ${dateTimeString}`;
  const companyUrl = `https://playwright-${Date.now()}.com`;
  const companyYear = '2024';

  const companyNameEdited = `${companyName} (편집됨)`;
  const companyUrlEdited = `${companyUrl}/edited`;

  // === 1단계: 추가 ===
  await page.goto('/about/future-careers');
  await loginAsStaff(page);

  // 기업 추가 버튼 클릭
  await page.getByRole('button', { name: '기업 추가' }).click();

  // 폼이 나타날 때까지 대기
  await page.waitForTimeout(500);

  // 추가 폼의 입력 필드 직접 선택 (폼이 첫 번째로 렌더링됨)
  await page.locator('input[name="name"]').first().fill(companyName);
  await page.locator('input[name="url"]').first().fill(companyUrl);
  await page.locator('input[name="year"]').first().fill(companyYear);

  // 저장 버튼 클릭 (추가 폼의 저장 버튼이 첫 번째)
  await page.getByRole('button', { name: '저장' }).first().click();
  await page.waitForTimeout(1000); // revalidate 대기

  // === 2단계: 추가된 기업 검증 ===
  await expect(page.getByText(companyName)).toBeVisible();
  // 추가된 기업의 행에서 URL과 연도 확인
  const addedCompanyRow = page.locator(`li:has-text("${companyName}")`);
  await expect(addedCompanyRow.getByText(companyUrl)).toBeVisible();
  await expect(addedCompanyRow.getByText(companyYear)).toBeVisible();

  // === 3단계: 편집 ===
  // 추가된 기업의 편집 버튼 찾기 (회사명이 포함된 행에서 편집 버튼 클릭)
  const companyRow = page.locator(`li:has-text("${companyName}")`);
  await companyRow.getByRole('button', { name: '편집' }).click();

  // 편집 모드로 전환될 때까지 대기
  await page
    .locator('input[name="name"]')
    .first()
    .waitFor({ state: 'visible' });

  // 편집 폼에 새로운 데이터 입력 (첫 번째 입력 필드들 사용)
  await page.locator('input[name="name"]').first().fill(companyNameEdited);
  await page.locator('input[name="url"]').first().fill(companyUrlEdited);

  // 저장 버튼 클릭
  await page.getByRole('button', { name: '저장' }).first().click();
  await page.waitForTimeout(1000); // revalidate 대기

  // === 4단계: 편집된 기업 검증 ===
  await expect(page.getByText(companyNameEdited)).toBeVisible();
  await expect(page.getByText(companyUrlEdited)).toBeVisible();

  // === 5단계: 삭제 ===
  const editedCompanyRow = page.locator(`li:has-text("${companyNameEdited}")`);
  await editedCompanyRow.getByRole('button', { name: '삭제' }).click();
  // AlertDialog의 확인 버튼 클릭
  await page.getByRole('button', { name: '삭제' }).last().click();
  await page.waitForTimeout(1000); // revalidate 대기

  // === 6단계: 삭제 검증 ===
  await expect(page.getByText(companyNameEdited)).not.toBeVisible();
});
