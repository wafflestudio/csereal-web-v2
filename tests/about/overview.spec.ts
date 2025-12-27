import { expect, test } from '@playwright/test';
import { switchPageLanguage } from 'tests/helpers/navigation';
import { loginAsStaff } from '../helpers/auth';
import {
  clearAllFiles,
  fillHTMLEditor,
  submitForm,
  switchEditorLanguage,
  uploadFiles,
  uploadImage,
} from '../helpers/form-components';
import { createTestImage, createTestTextFile } from '../helpers/test-assets';
import { getKoreanDateTime } from '../helpers/utils';

test('학부 소개 편집 및 한/영 내용 검증', async ({ page }, testInfo) => {
  const dateTimeString = getKoreanDateTime();
  const koText = `Playwright KO ${dateTimeString}`;
  const enText = `Playwright EN ${dateTimeString}`;

  // 테스트용 이미지 및 파일 생성
  const { imagePath } = await createTestImage(testInfo, dateTimeString);
  const { filePath: attachmentPath, fileName: attachmentName } =
    createTestTextFile(testInfo, dateTimeString);

  // 1. 로그인
  await page.goto('/about/overview');
  await loginAsStaff(page);

  // 2. 편집 페이지로 이동
  await page.getByRole('link', { name: '편집' }).click();
  await page.waitForURL('**/about/overview/edit');

  // 3. 폼 입력
  await fillHTMLEditor(page, koText);
  await switchEditorLanguage(page, 'en');
  await fillHTMLEditor(page, enText);
  await switchEditorLanguage(page, 'ko');
  await uploadImage(page, imagePath);
  await clearAllFiles(page);
  await uploadFiles(page, attachmentPath);

  // 4. 제출
  await submitForm(page);
  await page.waitForURL('**/about/overview');

  // 5. 검증 - 한글 페이지
  await expect(page.getByText(koText)).toBeVisible();
  await expect(page.getByText(attachmentName)).toBeVisible();

  // 6. 검증 - 영문 페이지
  await switchPageLanguage(page, 'en', '/about/overview');
  await expect(page.getByText(enText)).toBeVisible();
});
