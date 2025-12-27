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

test('교수진 추가→편집→삭제 플로우 검증', async ({ page }, testInfo) => {
  // === 테스트 데이터 준비 ===
  const dateTimeString = getKoreanDateTime();
  const koName = `테스트교수 ${dateTimeString}`;
  const enName = `Test Professor ${dateTimeString}`;
  const koRank = `교수 ${dateTimeString}`;
  const enRank = `Professor ${dateTimeString}`;
  const koDept = `컴퓨터공학부 ${dateTimeString}`;
  const enDept = `Department of Computer Science and Engineering ${dateTimeString}`;
  const koOffice = '301동 504호';
  const enOffice = 'Bldg. 301, Room 504';
  const koPhone = '(02) 880-7300';
  const enPhone = '+82-2-880-7300';
  const koEmail = `test${Date.now()}@snu.ac.kr`;
  const enEmail = koEmail; // 이메일은 동일
  const koWebsite = 'https://cse.snu.ac.kr/test';
  const enWebsite = koWebsite;

  const koEducations = [
    `서울대학교 컴퓨터공학 박사 (2010) ${dateTimeString}`,
    `서울대학교 컴퓨터공학 석사 (2005) ${dateTimeString}`,
  ];
  const enEducations = [
    `Ph.D. in Computer Science, Seoul National University (2010) ${dateTimeString}`,
    `M.S. in Computer Science, Seoul National University (2005) ${dateTimeString}`,
  ];

  const koResearchAreas = [
    `인공지능 ${dateTimeString}`,
    `기계학습 ${dateTimeString}`,
  ];
  const enResearchAreas = [
    `Artificial Intelligence ${dateTimeString}`,
    `Machine Learning ${dateTimeString}`,
  ];

  const koCareers = [
    `2015.09. - 현재: 전임교수, 서울대학교 컴퓨터공학부 ${dateTimeString}`,
    `2010.09. - 2015.08.: 조교수, 서울대학교 컴퓨터공학부 ${dateTimeString}`,
  ];
  const enCareers = [
    `2015.09. - Present: Professor, Seoul National University ${dateTimeString}`,
    `2010.09. - 2015.08.: Assistant Professor, Seoul National University ${dateTimeString}`,
  ];

  const { imagePath } = await createTestImage(
    testInfo,
    dateTimeString,
    'portrait',
  );

  // === 1단계: 교수진 추가 ===
  await page.goto('/people/faculty');
  await loginAsStaff(page);
  await page.getByRole('link', { name: '추가하기' }).click();
  await page.waitForURL('**/people/faculty/create');

  // 한글 입력
  await fillTextInput(page, 'ko.name', koName);
  await fillTextInput(page, 'ko.academicRank', koRank);
  await fillTextInput(page, 'ko.department', koDept);
  await uploadImage(page, imagePath);
  await fillTextList(page, '학력', koEducations);
  await fillTextList(page, '연구 분야', koResearchAreas);
  await fillTextList(page, '경력', koCareers);
  await fillTextInput(page, 'ko.office', koOffice);
  await fillTextInput(page, 'ko.phone', koPhone);
  await fillTextInput(page, 'ko.email', koEmail);
  await fillTextInput(page, 'ko.website', koWebsite);

  // 영문 입력
  await switchEditorLanguage(page, 'en');
  await fillTextInput(page, 'en.name', enName);
  await fillTextInput(page, 'en.academicRank', enRank);
  await fillTextInput(page, 'en.department', enDept);
  await uploadImage(page, imagePath);
  await fillTextList(page, '학력', enEducations);
  await fillTextList(page, '연구 분야', enResearchAreas);
  await fillTextList(page, '경력', enCareers);
  await fillTextInput(page, 'en.office', enOffice);
  await fillTextInput(page, 'en.phone', enPhone);
  await fillTextInput(page, 'en.email', enEmail);
  await fillTextInput(page, 'en.website', enWebsite);

  // 제출
  await submitForm(page);
  await page.waitForURL(/\/people\/faculty\/\d+$/);

  // URL에서 생성된 ID 추출
  const url = page.url();
  const facultyId = url.match(/\/people\/faculty\/(\d+)$/)?.[1];
  expect(facultyId).toBeDefined();

  // === 2단계: 추가된 교수진 검증 - 한글 ===
  await expect(page.locator('body')).toContainText(koName);
  await expect(page.locator('body')).toContainText(koRank);
  await expect(page.locator('body')).toContainText(koEducations[0]);
  await expect(page.locator('body')).toContainText(koResearchAreas[0]);
  await expect(page.locator('body')).toContainText(koCareers[0]);
  await expect(page.locator('body')).toContainText(koOffice);
  await expect(page.locator('body')).toContainText(koPhone);

  // === 3단계: 추가된 교수진 검증 - 영문 ===
  await switchPageLanguage(page, 'en', `/people/faculty/${facultyId}`);
  await expect(page.locator('body')).toContainText(enName);
  await expect(page.locator('body')).toContainText(enRank);
  await expect(page.locator('body')).toContainText(enEducations[0]);
  await expect(page.locator('body')).toContainText(enResearchAreas[0]);
  await expect(page.locator('body')).toContainText(enCareers[0]);
  await expect(page.locator('body')).toContainText(enOffice);
  await expect(page.locator('body')).toContainText(enPhone);

  // 한글로 다시 전환
  await switchPageLanguage(page, 'ko', `/people/faculty/${facultyId}`);

  // === 4단계: 편집 ===
  await page.getByRole('link', { name: '편집' }).click();
  await page.waitForURL('**/edit');

  const editedKoName = `${koName} (수정됨)`;
  const editedEnName = `${enName} (Edited)`;
  const editedKoRank = `부교수 ${dateTimeString}`;
  const editedEnRank = `Associate Professor ${dateTimeString}`;
  const editedKoOffice = `${koOffice} (수정)`;
  const editedEnOffice = `${enOffice} (Edited)`;

  // 한글 수정
  await fillTextInput(page, 'ko.name', editedKoName);
  await fillTextInput(page, 'ko.academicRank', editedKoRank);
  await fillTextInput(page, 'ko.office', editedKoOffice);

  // 영문 수정
  await switchEditorLanguage(page, 'en');
  await fillTextInput(page, 'en.name', editedEnName);
  await fillTextInput(page, 'en.academicRank', editedEnRank);
  await fillTextInput(page, 'en.office', editedEnOffice);

  // 제출
  await submitForm(page);
  await page.waitForURL(/\/people\/faculty\/\d+$/);

  // === 5단계: 편집된 내용 검증 - 한글 ===
  await expect(page.locator('body')).toContainText(editedKoName);
  await expect(page.locator('body')).toContainText(editedKoRank);
  await expect(page.locator('body')).toContainText(editedKoOffice);
  // 수정되지 않은 필드들도 확인
  await expect(page.locator('body')).toContainText(koEducations[0]);
  await expect(page.locator('body')).toContainText(koResearchAreas[0]);
  await expect(page.locator('body')).toContainText(koCareers[0]);
  await expect(page.locator('body')).toContainText(koPhone);
  await expect(page.locator('body')).toContainText(koEmail);

  // === 6단계: 편집된 내용 검증 - 영문 ===
  await switchPageLanguage(page, 'en', `/people/faculty/${facultyId}`);
  await expect(page.locator('body')).toContainText(editedEnName);
  await expect(page.locator('body')).toContainText(editedEnRank);
  await expect(page.locator('body')).toContainText(editedEnOffice);
  // 수정되지 않은 필드들도 확인
  await expect(page.locator('body')).toContainText(enEducations[0]);
  await expect(page.locator('body')).toContainText(enResearchAreas[0]);
  await expect(page.locator('body')).toContainText(enCareers[0]);
  await expect(page.locator('body')).toContainText(enPhone);
  await expect(page.locator('body')).toContainText(enEmail);

  // 한글로 다시 전환
  await switchPageLanguage(page, 'ko', `/people/faculty/${facultyId}`);

  // === 7단계: 삭제 ===
  await page.getByRole('link', { name: '편집' }).click();
  await page.waitForURL('**/edit');
  await deleteItem(page);
  await page.waitForURL('**/people/faculty');

  // === 8단계: 삭제 검증 ===
  // 목록 페이지에서 삭제된 교수가 없는지 확인
  await expect(page.locator('body')).not.toContainText(editedKoName);

  // 영문 페이지에서도 확인
  await switchPageLanguage(page, 'en', '/people/faculty');
  await expect(page.locator('body')).not.toContainText(editedEnName);
});
