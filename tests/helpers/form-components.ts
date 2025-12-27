import { expect, type Page } from '@playwright/test';

/**
 * 텍스트 입력 (Form.Text)
 * 현재 선택된 언어의 텍스트 필드에 내용을 입력합니다.
 */
export async function fillTextInput(
  page: Page,
  fieldName: string,
  content: string,
) {
  const input = page.locator(`input[name="${fieldName}"]`);
  await input.fill(content);
}

/**
 * HTML 에디터 (suneditor)에 내용 입력
 * 현재 선택된 언어의 에디터에 내용을 입력합니다.
 */
export async function fillHTMLEditor(page: Page, content: string) {
  const editor = page.locator('.sun-editor-editable').first();
  await editor.click();
  await editor.fill(content);
}

/**
 * 언어 전환
 */
export async function switchEditorLanguage(page: Page, lang: 'ko' | 'en') {
  await page.locator(`label[for="${lang}"]`).click();
  // 에디터 전환을 위한 짧은 대기
  await page.waitForTimeout(300);
}

/**
 * 이미지 업로드 (Form.Image)
 */
export async function uploadImage(page: Page, imagePath: string) {
  const imageInput = page.locator(
    'label:has-text("이미지") input[type="file"]',
  );
  await imageInput.setInputFiles(imagePath);
}

/**
 * 기존 첨부파일 모두 삭제 (Form.File)
 */
export async function clearAllFiles(page: Page, fieldsetName = '첨부파일') {
  const fileFieldset = page.getByRole('group', { name: fieldsetName });
  const existingFiles = fileFieldset.locator('ol li');
  const fileCount = await existingFiles.count();

  for (let i = 0; i < fileCount; i++) {
    const deleteButton = fileFieldset.locator('ol li button').first();
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
    }
  }

  await expect(fileFieldset.locator('ol li')).toHaveCount(0);
}

/**
 * 첨부파일 업로드 (Form.File)
 */
export async function uploadFiles(
  page: Page,
  filePaths: string | string[],
  fieldsetName = '첨부파일',
) {
  const fileFieldset = page.getByRole('group', { name: fieldsetName });
  const fileInput = fileFieldset.locator(
    'label:has-text("파일 선택") input[type="file"]',
  );

  await fileInput.setInputFiles(filePaths);
}

/**
 * 폼 제출
 * 제출 후 페이지 로드가 완전히 끝날 때까지 대기합니다.
 */
export async function submitForm(page: Page) {
  await page.getByRole('button', { name: '저장하기' }).click();
  // load: load 이벤트까지 대기 (domcontentloaded보다 완전한 로드)
  await page.waitForLoadState('load');
}

/**
 * 폼 취소
 */
export async function cancelForm(page: Page) {
  await page.getByRole('button', { name: '취소' }).click();
}

/**
 * TextList에 항목 추가 (Form.TextList)
 * @param page Playwright Page 객체
 * @param fieldsetName 필드셋 이름 (예: "학력", "연구 분야", "경력", "주요 업무")
 * @param values 추가할 값들의 배열
 */
export async function fillTextList(
  page: Page,
  fieldsetName: string,
  values: string[],
) {
  const fieldset = page.getByRole('group', { name: fieldsetName });

  for (const value of values) {
    // 입력 필드에 값 입력
    await fieldset.locator('input[type="text"]').first().fill(value);
    // 추가 버튼 클릭
    await fieldset.getByRole('button', { name: '추가' }).click();
  }
}

/**
 * Dropdown에서 옵션 선택 (Form.Dropdown)
 * @param page Playwright Page 객체
 * @param fieldsetName 필드셋 이름 (예: "연구실")
 * @param optionLabel 선택할 옵션의 라벨
 */
export async function selectDropdown(
  page: Page,
  fieldsetName: string,
  optionLabel: string,
) {
  const fieldset = page.getByRole('group', { name: fieldsetName });
  // 드롭다운 버튼 클릭
  await fieldset.locator('button').first().click();
  // 옵션 선택
  await page.getByRole('button', { name: optionLabel, exact: true }).click();
}

/**
 * Radio 버튼 선택 (Form.Radio)
 * @param page Playwright Page 객체
 * @param label 라디오 버튼의 라벨
 */
export async function selectRadio(page: Page, label: string) {
  await page.getByRole('radio', { name: label }).click();
}

/**
 * 날짜 선택 (Form.Date)
 * @param page Playwright Page 객체
 * @param fieldsetName 필드셋 이름 (예: "시작 날짜", "종료 날짜")
 * @param date 선택할 날짜 (Date 객체)
 */
export async function selectDate(page: Page, fieldsetName: string, date: Date) {
  const fieldset = page.getByRole('group', { name: fieldsetName });
  // 캘린더 버튼 클릭
  await fieldset.locator('button').first().click();
  // 날짜 선택 (일자 버튼 클릭)
  const day = date.getDate();
  await page.getByRole('button', { name: day.toString(), exact: true }).click();
}

/**
 * 항목 삭제
 * 삭제 버튼을 클릭하고 AlertDialog에서 확인 버튼을 클릭합니다.
 */
export async function deleteItem(page: Page) {
  // 폼 하단의 메인 삭제 버튼 클릭 (bg-neutral-700 클래스를 가진 버튼)
  await page
    .getByRole('button', { name: '삭제' })
    .filter({ hasText: '삭제' })
    .last()
    .click();
  // AlertDialog의 확인 버튼 클릭
  await page
    .getByRole('alertdialog')
    .getByRole('button', { name: '확인' })
    .click();
  // 페이지 로드 대기
  await page.waitForLoadState('load');
}
