import { expect, test } from '@playwright/test';
import { switchPageLanguage } from 'tests/helpers/navigation';
import { loginAsStaff } from '../helpers/auth';
import {
  fillHTMLEditor,
  fillTextInput,
  submitForm,
  switchEditorLanguage,
  uploadImage,
} from '../helpers/form-components';
import { createTestImage } from '../helpers/test-assets';
import { getKoreanDateTime } from '../helpers/utils';

test('학생 동아리 추가->편집->삭제 플로우 검증', async ({ page }, testInfo) => {
  const dateTimeString = getKoreanDateTime();
  const koTitle = `Playwright 동아리 KO ${dateTimeString}`;
  const enTitle = `Playwright Club EN ${dateTimeString}`;
  const koDescription = `Playwright KO 설명 ${dateTimeString}`;
  const enDescription = `Playwright EN Description ${dateTimeString}`;

  // 편집용 텍스트
  const koTitleEdited = `${koTitle} (편집됨)`;
  const enTitleEdited = `${enTitle} (Edited)`;
  const koDescriptionEdited = `${koDescription} [수정]`;
  const enDescriptionEdited = `${enDescription} [Modified]`;

  // 테스트용 이미지 생성
  const { imagePath } = await createTestImage(testInfo, dateTimeString);

  // === 1단계: 추가 ===
  await page.goto('/about/student-clubs');
  await loginAsStaff(page);

  await page.getByRole('link', { name: '동아리 추가' }).click();
  await page.waitForURL('**/about/student-clubs/create');

  await fillTextInput(page, 'ko.name', koTitle);
  await fillHTMLEditor(page, koDescription);
  await switchEditorLanguage(page, 'en');
  await fillTextInput(page, 'en.name', enTitle);
  await fillHTMLEditor(page, enDescription);
  await switchEditorLanguage(page, 'ko');
  await uploadImage(page, imagePath);

  await submitForm(page);
  await page.waitForURL('**/about/student-clubs');

  // === 2단계: 추가된 동아리 검증 (한글) ===
  await page.getByRole('link', { name: koTitle }).click();
  await expect(page.getByText(koDescription)).toBeVisible();

  // === 3단계: 추가된 동아리 검증 (영문) ===
  await switchPageLanguage(page, 'en');
  await page.getByRole('link', { name: enTitle }).click();
  await expect(page.getByText(enDescription)).toBeVisible();

  // === 4단계: 편집 ===
  await page.getByRole('link', { name: '편집' }).click();
  await page.waitForURL('**/about/student-clubs/edit**');

  await fillTextInput(page, 'ko.name', koTitleEdited);
  await fillHTMLEditor(page, koDescriptionEdited);
  await switchEditorLanguage(page, 'en');
  await fillTextInput(page, 'en.name', enTitleEdited);
  await fillHTMLEditor(page, enDescriptionEdited);
  await switchEditorLanguage(page, 'ko');

  await submitForm(page);
  await page.waitForURL('**/about/student-clubs');

  // === 5단계: 편집된 동아리 검증 (한글) ===
  // 편집 후 돌아온 페이지가 영문일 수 있으므로 명시적으로 한글 페이지로 이동
  await page.goto('/about/student-clubs');
  await page.getByRole('link', { name: koTitleEdited }).click();
  await expect(page.getByText(koDescriptionEdited)).toBeVisible();

  // === 6단계: 편집된 동아리 검증 (영문) ===
  await switchPageLanguage(page, 'en');
  await page.getByRole('link', { name: enTitleEdited }).click();
  await expect(page.getByText(enDescriptionEdited)).toBeVisible();

  // === 7단계: 삭제 ===
  await page.getByRole('button', { name: '삭제' }).click();
  // AlertDialog의 확인 버튼 클릭
  await page.getByRole('button', { name: '삭제' }).last().click();

  // === 8단계: 삭제 검증 ===
  // 삭제된 동아리가 목록에 없는지 확인
  await expect(
    page.getByRole('link', { name: enTitleEdited }),
  ).not.toBeVisible();
});
