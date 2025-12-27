import { expect, test } from '@playwright/test';
import { switchPageLanguage } from 'tests/helpers/navigation';
import { loginAsStaff } from '../helpers/auth';
import {
  fillHTMLEditor,
  submitForm,
  switchEditorLanguage,
  uploadImage,
} from '../helpers/form-components';
import { createTestImage } from '../helpers/test-assets';
import { getKoreanDateTime } from '../helpers/utils';

test('연혁 편집 및 한/영 내용 검증', async ({ page }, testInfo) => {
  const dateTimeString = getKoreanDateTime();
  const koText = `Playwright KO ${dateTimeString}`;
  const enText = `Playwright EN ${dateTimeString}`;

  // 테스트용 이미지 생성
  const { imagePath } = await createTestImage(testInfo, dateTimeString);

  // 1. 로그인
  await page.goto('/about/history');
  await loginAsStaff(page);

  // 2. 편집 페이지로 이동
  await page.getByRole('link', { name: '편집' }).click();
  await page.waitForURL('**/about/history/edit');

  // 3. 폼 입력
  await fillHTMLEditor(page, koText);
  await switchEditorLanguage(page, 'en');
  await fillHTMLEditor(page, enText);
  await switchEditorLanguage(page, 'ko');
  await uploadImage(page, imagePath);

  // 4. 제출
  await submitForm(page);
  await page.waitForURL('**/about/history');

  // 5. 검증 - 한글 페이지
  await expect(page.getByText(koText)).toBeVisible();

  // 6. 검증 - 영문 페이지
  await switchPageLanguage(page, 'en', '/about/history');
  await expect(page.getByText(enText)).toBeVisible();
});
