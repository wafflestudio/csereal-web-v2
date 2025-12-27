import { expect, test } from '@playwright/test';
import { loginAsStaff } from '../helpers/auth';
import {
  deleteItem,
  fillTextInput,
  fillTextList,
  selectRadio,
  submitForm,
  switchEditorLanguage,
  uploadImage,
} from '../helpers/form-components';
import { switchPageLanguage } from '../helpers/navigation';
import { createTestImage } from '../helpers/test-assets';
import { getKoreanDateTime } from '../helpers/utils';

test('역대 교수진 추가→편집→삭제 플로우 검증', async ({ page }, testInfo) => {
  // === 테스트 데이터 준비 ===
  const dateTimeString = getKoreanDateTime();
  const koName = `테스트명예교수 ${dateTimeString}`;
  const enName = `Test Emeritus Professor ${dateTimeString}`;
  const koRank = `명예교수 ${dateTimeString}`;
  const enRank = `Emeritus Professor ${dateTimeString}`;
  const koDept = `컴퓨터공학부 ${dateTimeString}`;
  const enDept = `Department of Computer Science and Engineering ${dateTimeString}`;
  const koEmail = `emeritus${Date.now()}@snu.ac.kr`;
  const enEmail = koEmail; // 이메일은 동일

  const koEducations = [
    `서울대학교 컴퓨터공학 박사 (1980) ${dateTimeString}`,
    `서울대학교 컴퓨터공학 석사 (1975) ${dateTimeString}`,
  ];
  const enEducations = [
    `Ph.D. in Computer Science, Seoul National University (1980) ${dateTimeString}`,
    `M.S. in Computer Science, Seoul National University (1975) ${dateTimeString}`,
  ];

  const koResearchAreas = [
    `운영체제 ${dateTimeString}`,
    `시스템 소프트웨어 ${dateTimeString}`,
  ];
  const enResearchAreas = [
    `Operating Systems ${dateTimeString}`,
    `System Software ${dateTimeString}`,
  ];

  const { imagePath } = await createTestImage(
    testInfo,
    dateTimeString,
    'portrait',
  );

  // === 1단계: 역대 교수진 추가 ===
  await page.goto('/people/emeritus-faculty');
  await loginAsStaff(page);
  await page.getByRole('link', { name: '추가하기' }).click();
  // status=INACTIVE 쿼리 파라미터와 함께 faculty/create로 리다이렉트됨
  await page.waitForURL('**/people/faculty/create?status=INACTIVE');

  // 구분을 "역대 교수"로 선택
  await selectRadio(page, '역대 교수');

  // 한글 입력
  await fillTextInput(page, 'ko.name', koName);
  await fillTextInput(page, 'ko.academicRank', koRank);
  await fillTextInput(page, 'ko.department', koDept);
  await uploadImage(page, imagePath);
  await fillTextList(page, '학력', koEducations);
  await fillTextList(page, '연구 분야', koResearchAreas);
  await fillTextInput(page, 'ko.email', koEmail);

  // 영문 입력
  await switchEditorLanguage(page, 'en');
  await fillTextInput(page, 'en.name', enName);
  await fillTextInput(page, 'en.academicRank', enRank);
  await fillTextInput(page, 'en.department', enDept);
  await uploadImage(page, imagePath);
  await fillTextList(page, '학력', enEducations);
  await fillTextList(page, '연구 분야', enResearchAreas);
  await fillTextInput(page, 'en.email', enEmail);

  // 제출
  await submitForm(page);
  // emeritus-faculty 상세 페이지로 리다이렉트됨
  await page.waitForURL(/\/people\/emeritus-faculty\/\d+$/);

  // URL에서 생성된 ID 추출
  const url = page.url();
  const facultyId = url.match(/\/people\/emeritus-faculty\/(\d+)$/)?.[1];
  expect(facultyId).toBeDefined();

  // === 2단계: 추가된 역대 교수진 검증 - 한글 ===
  await expect(page.locator('body')).toContainText(koName);
  await expect(page.locator('body')).toContainText(koRank);
  await expect(page.locator('body')).toContainText(koEducations[0]);
  await expect(page.locator('body')).toContainText(koResearchAreas[0]);

  // === 3단계: 추가된 역대 교수진 검증 - 영문 ===
  await switchPageLanguage(page, 'en', `/people/emeritus-faculty/${facultyId}`);
  await expect(page.locator('body')).toContainText(enName);
  await expect(page.locator('body')).toContainText(enRank);
  await expect(page.locator('body')).toContainText(enEducations[0]);
  await expect(page.locator('body')).toContainText(enResearchAreas[0]);

  // 한글로 다시 전환
  await switchPageLanguage(page, 'ko', `/people/emeritus-faculty/${facultyId}`);

  // === 4단계: 편집 ===
  await page.getByRole('link', { name: '편집' }).click();
  await page.waitForURL('**/edit');

  const editedKoName = `${koName} (수정됨)`;
  const editedEnName = `${enName} (Edited)`;
  const editedKoRank = `명예교수, 석좌교수 ${dateTimeString}`;
  const editedEnRank = `Emeritus Professor, Distinguished Professor ${dateTimeString}`;
  const editedKoDept = `${koDept} (수정)`;
  const editedEnDept = `${enDept} (Edited)`;

  // 한글 수정
  await fillTextInput(page, 'ko.name', editedKoName);
  await fillTextInput(page, 'ko.academicRank', editedKoRank);
  await fillTextInput(page, 'ko.department', editedKoDept);

  // 영문 수정
  await switchEditorLanguage(page, 'en');
  await fillTextInput(page, 'en.name', editedEnName);
  await fillTextInput(page, 'en.academicRank', editedEnRank);
  await fillTextInput(page, 'en.department', editedEnDept);

  // 제출
  await submitForm(page);
  await page.waitForURL(/\/people\/emeritus-faculty\/\d+$/);

  // === 5단계: 편집된 내용 검증 - 한글 ===
  await expect(page.locator('body')).toContainText(editedKoName);
  await expect(page.locator('body')).toContainText(editedKoRank);
  // 수정되지 않은 필드들도 확인
  await expect(page.locator('body')).toContainText(koEducations[0]);
  await expect(page.locator('body')).toContainText(koResearchAreas[0]);
  await expect(page.locator('body')).toContainText(koEmail);

  // === 6단계: 편집된 내용 검증 - 영문 ===
  await switchPageLanguage(page, 'en', `/people/emeritus-faculty/${facultyId}`);
  await expect(page.locator('body')).toContainText(editedEnName);
  await expect(page.locator('body')).toContainText(editedEnRank);
  // 수정되지 않은 필드들도 확인
  await expect(page.locator('body')).toContainText(enEducations[0]);
  await expect(page.locator('body')).toContainText(enResearchAreas[0]);
  await expect(page.locator('body')).toContainText(enEmail);

  // 한글로 다시 전환
  await switchPageLanguage(page, 'ko', `/people/emeritus-faculty/${facultyId}`);

  // === 7단계: 삭제 ===
  await page.getByRole('link', { name: '편집' }).click();
  await page.waitForURL('**/edit');
  await deleteItem(page);
  await page.waitForURL('**/people/emeritus-faculty');

  // === 8단계: 삭제 검증 ===
  // 목록 페이지에서 삭제된 교수가 없는지 확인
  await expect(page.locator('body')).not.toContainText(editedKoName);

  // 영문 페이지에서도 확인
  await switchPageLanguage(page, 'en', '/people/emeritus-faculty');
  await expect(page.locator('body')).not.toContainText(editedEnName);
});
