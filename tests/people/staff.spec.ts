import { expect, test } from '@playwright/test';
import { loginAsStaff } from '../helpers/auth';
import {
  deleteItem,
  fillTextInput,
  fillTextList,
  submitForm,
  switchEditorLanguage,
  uploadImage,
} from '../helpers/form-components';
import { switchPageLanguage } from '../helpers/navigation';
import { createTestImage } from '../helpers/test-assets';
import { getKoreanDateTime } from '../helpers/utils';

test('행정직원 추가→편집→삭제 플로우 검증', async ({ page }, testInfo) => {
  // === 테스트 데이터 준비 ===
  const dateTimeString = getKoreanDateTime();
  const koName = `테스트직원 ${dateTimeString}`;
  const enName = `Test Staff ${dateTimeString}`;
  const koRole = `교원인사, 일반서무 ${dateTimeString}`;
  const enRole = `Faculty Personnel, General Affairs ${dateTimeString}`;
  const koOffice = '301동 316호';
  const enOffice = 'Bldg. 301, Room 316';
  const koPhone = '(02) 880-7302';
  const enPhone = '+82-2-880-7302';
  const koEmail = `staff${Date.now()}@snu.ac.kr`;
  const enEmail = koEmail; // 이메일은 동일

  const koTasks = [
    `학부생 수료, 졸업사정 및 논문 관리 ${dateTimeString}`,
    `교원인사 관련 업무 ${dateTimeString}`,
  ];
  const enTasks = [
    `Undergraduate completion, graduation review and thesis management ${dateTimeString}`,
    `Faculty personnel related tasks ${dateTimeString}`,
  ];

  const { imagePath } = await createTestImage(
    testInfo,
    dateTimeString,
    'portrait',
  );

  // === 1단계: 행정직원 추가 ===
  await page.goto('/people/staff');
  await loginAsStaff(page);
  await page.getByRole('link', { name: '추가하기' }).click();
  await page.waitForURL('**/people/staff/create');

  // 한글 입력
  await fillTextInput(page, 'ko.name', koName);
  await fillTextInput(page, 'ko.role', koRole);
  await uploadImage(page, imagePath);
  await fillTextInput(page, 'ko.office', koOffice);
  await fillTextInput(page, 'ko.phone', koPhone);
  await fillTextInput(page, 'ko.email', koEmail);
  await fillTextList(page, '주요 업무', koTasks);

  // 영문 입력
  await switchEditorLanguage(page, 'en');
  await fillTextInput(page, 'en.name', enName);
  await fillTextInput(page, 'en.role', enRole);
  await uploadImage(page, imagePath);
  await fillTextInput(page, 'en.office', enOffice);
  await fillTextInput(page, 'en.phone', enPhone);
  await fillTextInput(page, 'en.email', enEmail);
  await fillTextList(page, '주요 업무', enTasks);

  // 제출
  await submitForm(page);
  await page.waitForURL(/\/people\/staff\/\d+$/);

  // URL에서 생성된 ID 추출
  const url = page.url();
  const staffId = url.match(/\/people\/staff\/(\d+)$/)?.[1];
  expect(staffId).toBeDefined();

  // === 2단계: 추가된 행정직원 검증 - 한글 ===
  await expect(page.locator('body')).toContainText(koName);
  await expect(page.locator('body')).toContainText(koRole);
  await expect(page.locator('body')).toContainText(koTasks[0]);
  await expect(page.locator('body')).toContainText(koOffice);
  await expect(page.locator('body')).toContainText(koPhone);

  // === 3단계: 추가된 행정직원 검증 - 영문 ===
  await switchPageLanguage(page, 'en', `/people/staff/${staffId}`);
  await expect(page.locator('body')).toContainText(enName);
  await expect(page.locator('body')).toContainText(enRole);
  await expect(page.locator('body')).toContainText(enTasks[0]);
  await expect(page.locator('body')).toContainText(enOffice);
  await expect(page.locator('body')).toContainText(enPhone);

  // 한글로 다시 전환
  await switchPageLanguage(page, 'ko', `/people/staff/${staffId}`);

  // === 4단계: 편집 ===
  await page.getByRole('link', { name: '편집' }).click();
  await page.waitForURL('**/edit');

  const editedKoName = `${koName} (수정됨)`;
  const editedEnName = `${enName} (Edited)`;
  const editedKoRole = `학생지원, 일반서무 ${dateTimeString}`;
  const editedEnRole = `Student Support, General Affairs ${dateTimeString}`;
  const editedKoOffice = `${koOffice} (수정)`;
  const editedEnOffice = `${enOffice} (Edited)`;

  // 한글 수정
  await fillTextInput(page, 'ko.name', editedKoName);
  await fillTextInput(page, 'ko.role', editedKoRole);
  await fillTextInput(page, 'ko.office', editedKoOffice);

  // 영문 수정
  await switchEditorLanguage(page, 'en');
  await fillTextInput(page, 'en.name', editedEnName);
  await fillTextInput(page, 'en.role', editedEnRole);
  await fillTextInput(page, 'en.office', editedEnOffice);

  // 제출
  await submitForm(page);
  await page.waitForURL(/\/people\/staff\/\d+$/);

  // === 5단계: 편집된 내용 검증 - 한글 ===
  await expect(page.locator('body')).toContainText(editedKoName);
  await expect(page.locator('body')).toContainText(editedKoRole);
  await expect(page.locator('body')).toContainText(editedKoOffice);
  // 수정되지 않은 필드들도 확인
  await expect(page.locator('body')).toContainText(koTasks[0]);
  await expect(page.locator('body')).toContainText(koPhone);
  await expect(page.locator('body')).toContainText(koEmail);

  // === 6단계: 편집된 내용 검증 - 영문 ===
  await switchPageLanguage(page, 'en', `/people/staff/${staffId}`);
  await expect(page.locator('body')).toContainText(editedEnName);
  await expect(page.locator('body')).toContainText(editedEnRole);
  await expect(page.locator('body')).toContainText(editedEnOffice);
  // 수정되지 않은 필드들도 확인
  await expect(page.locator('body')).toContainText(enTasks[0]);
  await expect(page.locator('body')).toContainText(enPhone);
  await expect(page.locator('body')).toContainText(enEmail);

  // 한글로 다시 전환
  await switchPageLanguage(page, 'ko', `/people/staff/${staffId}`);

  // === 7단계: 삭제 ===
  await page.getByRole('link', { name: '편집' }).click();
  await page.waitForURL('**/edit');
  await deleteItem(page);
  await page.waitForURL('**/people/staff');

  // === 8단계: 삭제 검증 ===
  // 목록 페이지에서 삭제된 직원이 없는지 확인
  await expect(page.locator('body')).not.toContainText(editedKoName);

  // 영문 페이지에서도 확인
  await switchPageLanguage(page, 'en', '/people/staff');
  await expect(page.locator('body')).not.toContainText(editedEnName);
});
