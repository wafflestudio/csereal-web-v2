import { expect, test } from '@playwright/test';
import { switchPageLanguage } from 'tests/helpers/navigation';
import { loginAsStaff } from '../helpers/auth';
import {
  fillHTMLEditor,
  submitForm,
  switchEditorLanguage,
} from '../helpers/form-components';
import { getKoreanDateTime } from '../helpers/utils';

test('찾아오는 길 편집 및 한/영 내용 검증', async ({ page }) => {
  const dateTimeString = getKoreanDateTime();
  const koText = `Playwright KO ${dateTimeString}`;
  const enText = `Playwright EN ${dateTimeString}`;

  // 1. 로그인
  await page.goto('/about/directions');
  await loginAsStaff(page);

  // 2. 첫 번째 항목의 편집 버튼 클릭
  await page.getByRole('link', { name: '편집' }).click();
  await page.waitForURL('**/about/directions/edit**');

  // 3. 폼 입력 (HTML 에디터만 사용, 이미지/파일 첨부 없음)
  await fillHTMLEditor(page, koText);
  await switchEditorLanguage(page, 'en');
  await fillHTMLEditor(page, enText);
  await switchEditorLanguage(page, 'ko');

  // 4. 제출
  await submitForm(page);
  await page.waitForURL('**/about/directions');

  // 5. 검증 - 한글 페이지
  await expect(page.getByText(koText)).toBeVisible();

  // 6. 검증 - 영문 페이지
  await switchPageLanguage(page, 'en');
  await expect(page.getByText(enText)).toBeVisible();
});
