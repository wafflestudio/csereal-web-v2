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

test('시설 추가->편집->삭제 플로우 검증', async ({ page }, testInfo) => {
  const dateTimeString = getKoreanDateTime();
  const koName = `Playwright 시설 KO ${dateTimeString}`;
  const enName = `Playwright Facility EN ${dateTimeString}`;
  const koDescription = `Playwright KO 설명 ${dateTimeString}`;
  const enDescription = `Playwright EN Description ${dateTimeString}`;
  const koLocation = `301동 ${dateTimeString}`;
  const enLocation = `Building 301 ${dateTimeString}`;

  // 편집용 텍스트
  const koNameEdited = `${koName} (편집됨)`;
  const enNameEdited = `${enName} (Edited)`;
  const koDescriptionEdited = `${koDescription} [수정]`;
  const enDescriptionEdited = `${enDescription} [Modified]`;

  // 테스트용 이미지 생성
  const { imagePath } = await createTestImage(testInfo, dateTimeString);

  // === 1단계: 추가 ===
  await page.goto('/about/facilities');
  await loginAsStaff(page);

  await page.getByRole('link', { name: '시설 추가' }).click();
  await page.waitForURL('**/about/facilities/create');

  // 한글 입력
  await fillTextInput(page, 'ko.name', koName);
  await fillHTMLEditor(page, koDescription);
  // TextList: 위치 추가
  await fillTextInput(page, 'ko.locations_new', koLocation);
  await page.getByRole('button', { name: '추가' }).click();

  await switchEditorLanguage(page, 'en');

  // 영문 입력
  await fillTextInput(page, 'en.name', enName);
  await fillHTMLEditor(page, enDescription);
  // TextList: 위치 추가
  await fillTextInput(page, 'en.locations_new', enLocation);
  await page.getByRole('button', { name: '추가' }).click();

  await switchEditorLanguage(page, 'ko');
  await uploadImage(page, imagePath);

  await submitForm(page);
  await page.waitForURL('**/about/facilities');

  // === 2단계: 추가된 시설 검증 (한글) ===
  await expect(page.getByText(koName)).toBeVisible();
  await expect(page.getByText(koDescription)).toBeVisible();
  await expect(page.getByText(koLocation)).toBeVisible();

  // === 3단계: 추가된 시설 검증 (영문) ===
  await switchPageLanguage(page, 'en', '/about/facilities');
  await expect(page.getByText(enName)).toBeVisible();
  await expect(page.getByText(enDescription)).toBeVisible();
  await expect(page.getByText(enLocation)).toBeVisible();

  // === 4단계: 편집 ===
  // 첫 번째 시설의 편집 버튼 클릭
  await page.getByRole('link', { name: '편집' }).first().click();
  await page.waitForURL('**/about/facilities/edit**');

  await fillTextInput(page, 'ko.name', koNameEdited);
  await fillHTMLEditor(page, koDescriptionEdited);
  await switchEditorLanguage(page, 'en');
  await fillTextInput(page, 'en.name', enNameEdited);
  await fillHTMLEditor(page, enDescriptionEdited);
  await switchEditorLanguage(page, 'ko');

  await submitForm(page);
  await page.waitForURL('**/about/facilities');

  // === 5단계: 편집된 시설 검증 (한글) ===
  await page.goto('/about/facilities');
  await expect(page.getByText(koNameEdited)).toBeVisible();
  await expect(page.getByText(koDescriptionEdited)).toBeVisible();

  // === 6단계: 편집된 시설 검증 (영문) ===
  await switchPageLanguage(page, 'en', '/about/facilities');
  await expect(page.getByText(enNameEdited)).toBeVisible();
  await expect(page.getByText(enDescriptionEdited)).toBeVisible();

  // === 7단계: 삭제 ===
  await page.getByRole('button', { name: '삭제' }).first().click();
  // AlertDialog의 확인 버튼 클릭
  await page.getByRole('button', { name: '삭제' }).last().click();

  // === 8단계: 삭제 검증 ===
  // 삭제된 시설이 목록에 없는지 확인
  await expect(page.getByText(enNameEdited)).not.toBeVisible();
});
