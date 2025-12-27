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
