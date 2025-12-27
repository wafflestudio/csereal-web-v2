# Playwright 테스트 작성 가이드

이 문서는 csereal-web-v2 프로젝트의 Playwright E2E 테스트 작성 시 따라야 할 중요한 의사결정과 컨벤션을 담고 있습니다.

## 테스트 파일 구조

### 폴더 구조
테스트 파일은 **실제 라우트 구조를 따라** 구성합니다. `-edit` 같은 접미사는 사용하지 않습니다.

```
tests/
├── helpers/              # 재사용 가능한 헬퍼 함수들
│   ├── auth.ts          # 로그인/로그아웃
│   ├── form-components.ts  # Form 컴포넌트 조작
│   └── test-assets.ts   # 테스트용 이미지/파일 생성
├── about/               # /about/* 경로 테스트
│   ├── overview.spec.ts
│   ├── greetings.spec.ts
│   └── ...
├── academics/
│   ├── undergraduate/
│   └── graduate/
└── ...
```

**예시:**
- 라우트: `/about/overview` → 테스트: `tests/about/overview.spec.ts`
- 라우트: `/academics/undergraduate/guide` → 테스트: `tests/academics/undergraduate/guide.spec.ts`

## 아키텍처 패턴

### Helper 함수 방식 채택 (POM 미사용)
- **Page Object Model (POM)을 사용하지 않습니다**
- 대신 **함수형 헬퍼 패턴**을 사용합니다
- 이유: 간단하고 직관적이며, Form 컴포넌트 재사용에 적합

### Form 컴포넌트 헬퍼
`app/components/form`의 컴포넌트들이 여러 페이지에서 재사용되므로, 테스트도 동일하게 재사용 가능한 헬퍼 함수로 작성합니다.

**중요 원칙:**
- 각 Form 컴포넌트마다 대응하는 헬퍼 함수 제공
- 헬퍼 함수는 **단일 책임**만 수행
- 복합 동작(예: 언어 전환 + 입력)은 테스트 코드에서 조합

## 테스트용 데이터 생성

### 타임스탬프 사용 규칙
모든 테스트 데이터에는 **locale date time string**을 사용합니다.

**중요:** 타임스탬프는 **테스트 시작 시 한 번만 생성**하여 모든 데이터에서 공유합니다.

```typescript
// ✅ 좋은 예: 타임스탬프를 한 번만 생성하여 모든 데이터에서 공유
const dateTimeString = getKoreanDateTime();
const koText = `Playwright KO ${dateTimeString}`;
const { imagePath } = await createTestImage(testInfo, dateTimeString);
const { filePath } = createTestTextFile(testInfo, dateTimeString);

// ❌ 나쁜 예: 각 함수에서 개별 생성 (시점 차이로 불일치 발생)
const { imagePath } = await createTestImage(testInfo);  // 내부에서 생성
const { filePath } = createTestTextFile(testInfo);      // 내부에서 생성
```

**적용 위치:**
1. 본문 텍스트: `Playwright KO 2024. 12. 27. 15:30:45`
2. 파일명: `test-file-2024-12-27_15-30-45.txt`
3. 이미지: placehold.co URL의 텍스트
4. 첨부파일 내용

### 이미지 생성
**placehold.co를 사용**하여 매번 고유한 이미지를 동적으로 생성합니다.

```typescript
const randomColor = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
const imageUrl = `https://placehold.co/600x400/${randomColor}/white/png?text=${encodeURIComponent(dateTimeString)}`;
```

**장점:**
- 매번 다른 색상 + 타임스탬프로 확실한 고유성
- 실제 PNG 이미지 생성
- 뷰어에서 시각적으로 확인 가능

**단점:**
- 네트워크 요청 필요
- 오프라인 환경에서 작동 불가

## 헬퍼 함수 설계 원칙

### 1. `helpers/auth.ts`
인증 관련 동작을 담당합니다.

```typescript
loginAsStaff(page)  // STAFF 로그인
logout(page)         // 로그아웃
```

### 2. `helpers/form-components.ts`
Form 컴포넌트별 조작 함수를 제공합니다.

**중요: 각 함수는 하나의 책임만 가집니다**

```typescript
// ✅ 좋은 예: 단일 책임
fillHTMLEditor(page, content)  // 현재 언어 에디터에만 입력
switchLanguage(page, lang)     // 언어 전환만

// ❌ 나쁜 예: 복합 책임
fillHTMLEditor(page, { ko, en })  // 언어 전환 + 입력 동시 수행
```

**제공하는 함수들:**
- `fillTextInput(page, fieldName, content)` - 현재 언어의 텍스트 필드에 내용 입력
- `fillHTMLEditor(page, content)` - 현재 언어의 에디터에 내용 입력
- `switchEditorLanguage(page, lang)` - 폼 에디터의 한/영 언어 전환 (300ms 대기 포함)
- `uploadImage(page, imagePath)` - Form.Image 업로드
- `clearAllFiles(page, fieldsetName?)` - Form.File 모두 삭제
- `uploadFiles(page, paths, fieldsetName?)` - Form.File 업로드
- `submitForm(page)` - 저장하기 버튼 클릭 후 load 대기
- `cancelForm(page)` - 취소 버튼 클릭

### 3. `helpers/test-assets.ts`
테스트용 에셋 생성을 담당합니다.

```typescript
createTestImage(testInfo)     // placehold.co 이미지 생성
createTestTextFile(testInfo)  // 텍스트 파일 생성
```

### 4. `helpers/navigation.ts`
페이지 네비게이션 관련 헬퍼 함수를 제공합니다.

```typescript
switchPageLanguage(page, lang)  // 페이지 상단의 KO/ENG 버튼 클릭 후 load 대기
```

**주의:** `switchPageLanguage`는 폼 에디터의 언어 전환이 아닌, 페이지 전체의 언어를 전환합니다.

### 5. `helpers/utils.ts`
공통 유틸리티 함수를 제공합니다.

```typescript
getKoreanDateTime()      // "2024. 12. 27. 15:30:45" 형식 반환
getFileNameDateTime()    // "2024-12-27_15-30-45" 형식 반환
```

## 설정

### baseURL 사용
`playwright.config.ts`에 baseURL이 설정되어 있으므로, 테스트에서는 **상대 경로**만 사용합니다.

```typescript
// ✅ 좋은 예
await page.goto('/about/overview');

// ❌ 나쁜 예
await page.goto('http://localhost:3000/about/overview');
```

**장점:**
- vite.config.ts의 port와 자동 동기화
- 하드코딩 제거
- 환경별 baseURL 설정 가능

## 테스트 작성 패턴

### 테스트 설명 언어
**모든 테스트 설명(test description)은 한글로 작성합니다.**

```typescript
// ✅ 좋은 예: 한글 테스트 설명
test('학부 소개 편집 및 한/영 내용 검증', async ({ page }, testInfo) => {
  // ...
});

// ❌ 나쁜 예: 영문 테스트 설명
test('edit about overview and verify ko/en content', async ({ page }, testInfo) => {
  // ...
});
```

**이유:**
- 한국어 프로젝트이므로 테스트 리포트도 한글로 읽기 쉬워야 함
- 테스트 실패 시 에러 메시지를 바로 이해할 수 있음
- 팀원 간 커뮤니케이션 효율성 향상

### 테스트 플로우 규칙
페이지 기능에 따라 테스트 플로우를 다르게 작성합니다.

#### 1. 편집만 가능한 페이지
편집 기능만 테스트합니다.

```typescript
// 예: overview, greetings, history, contact 등
test('학부 소개 편집 및 한/영 내용 검증', async ({ page }, testInfo) => {
  // 1. 편집 페이지로 이동
  // 2. 폼 입력
  // 3. 제출
  // 4. 검증 - 한글/영문
});
```

#### 2. 추가 기능이 있는 페이지
**추가 → 검증 → 편집 → 검증 → 삭제 → 검증** 순서로 전체 플로우를 테스트합니다.

```typescript
// 예: student-clubs, facilities 등
test('학생 동아리 추가->편집->삭제 플로우 검증', async ({ page }, testInfo) => {
  // === 1단계: 추가 ===
  // 새 항목 생성

  // === 2단계: 추가된 항목 검증 ===
  // 한글/영문 페이지에서 내용 확인

  // === 3단계: 편집 ===
  // 추가한 항목 수정

  // === 4단계: 편집된 항목 검증 ===
  // 한글/영문 페이지에서 수정된 내용 확인

  // === 5단계: 삭제 ===
  // 항목 삭제 (AlertDialog 처리 포함)

  // === 6단계: 삭제 검증 ===
  // 삭제된 항목이 목록에 없는지 확인
});
```

**중요:**
- 추가 기능이 있으면 **반드시 편집과 삭제도 함께 테스트**해야 함
- 각 단계마다 한글/영문 페이지 모두 검증
- 삭제 시 AlertDialog가 있는 경우 확인 버튼 클릭까지 처리

### 복합 페이지의 모든 편집 기능 테스트하기

**하나의 페이지에 여러 편집 기능이 있는 경우, 모든 편집 기능을 별도 테스트로 작성해야 합니다.**

예: `/about/future-careers` 페이지는 3개의 독립적인 편집 기능이 있음
1. 졸업생 진로 본문 (description) - 별도 편집 페이지
2. 졸업생 진로 현황 (stat) - 별도 편집 페이지
3. 졸업생 창업 기업 (companies) - 인라인 편집 (추가/편집/삭제)

**올바른 테스트 작성 방법:**
```typescript
// future-careers.spec.ts 파일에 3개의 별도 테스트 작성
test('졸업생 진로 본문 편집 및 한/영 내용 검증', async ({ page }) => {
  // description 편집 테스트
});

test('졸업생 진로 현황 편집 및 검증', async ({ page }) => {
  // stat 편집 테스트
});

test('졸업생 창업 기업 추가->편집->삭제 플로우 검증', async ({ page }) => {
  // companies 추가/편집/삭제 테스트
});
```

**편집 기능 찾는 방법:**
1. 페이지에서 '편집' 버튼이 여러 개 있는지 확인
2. 컴포넌트 내부에 인라인 편집 기능이 있는지 확인 (예: 기업 추가, 항목 편집 버튼)
3. 별도 섹션마다 독립적인 데이터를 관리하는지 확인

**놓치기 쉬운 경우:**
- 같은 페이지에 여러 편집 버튼이 있는데 하나만 테스트하는 경우
- 테이블/리스트 형태의 인라인 편집 기능을 놓치는 경우
- 탭이나 섹션으로 나뉘어진 편집 기능을 놓치는 경우

### 기본 구조
모든 편집 테스트는 다음 흐름을 따릅니다:

```typescript
test('edit [페이지명] and verify ko/en content', async ({ page }, testInfo) => {
  // 1. 테스트 데이터 준비
  const dateTimeString = getKoreanDateTime();
  const koText = `Playwright KO ${dateTimeString}`;
  const enText = `Playwright EN ${dateTimeString}`;
  const { imagePath } = await createTestImage(testInfo);
  const { filePath, fileName } = createTestTextFile(testInfo);

  // 2. 로그인
  await page.goto('/...');  // baseURL 사용하므로 상대 경로만
  await loginAsStaff(page);

  // 3. 편집 페이지로 이동
  await page.getByRole('link', { name: '편집' }).click();
  await page.waitForURL('**/edit');

  // 4. 폼 입력 (헬퍼 함수 조합)
  await fillHTMLEditor(page, koText);
  await switchEditorLanguage(page, 'en');
  await fillHTMLEditor(page, enText);
  await switchEditorLanguage(page, 'ko');
  await uploadImage(page, imagePath);
  await clearAllFiles(page);
  await uploadFiles(page, filePath);

  // 5. 제출
  await submitForm(page);
  // 뷰어 페이지로 돌아왔는지 명시적으로 확인
  await page.waitForURL('**/about/overview');

  // 6. 검증 - 한글 페이지
  await expect(page.getByText(koText)).toBeVisible();
  await expect(page.getByText(fileName)).toBeVisible();

  // 7. 검증 - 영문 페이지
  await switchPageLanguage(page, 'en');
  // 영문 페이지로 이동했는지 명시적으로 확인
  await page.waitForURL('**/en/about/overview');
  await expect(page.getByText(enText)).toBeVisible();
});
```

## Suneditor 특이사항

프로젝트는 **suneditor**를 사용합니다 (toast-ui가 아님).

**에디터 선택자:**
```typescript
page.locator('.sun-editor-editable')
```

**언어 전환 방식:**
- 라디오 버튼은 `appearance-none`으로 숨겨져 있음
- **label을 클릭**해야 함:
```typescript
page.locator('label[for="ko"]').click()
page.locator('label[for="en"]').click()
```

## 파일 업로드 처리

### 기존 파일 삭제
Form.File의 기존 파일을 삭제할 때 주의사항:

```typescript
// ✅ 올바른 방법: 항상 첫 번째 항목 삭제 (삭제 시마다 리스트가 재정렬되므로)
for (let i = 0; i < fileCount; i++) {
  const deleteButton = fileFieldset.locator('ol li button').first();
  await deleteButton.click();
}

// ❌ 잘못된 방법: nth(i) 사용 시 인덱스 오류 발생
for (let i = 0; i < fileCount; i++) {
  await fileFieldset.locator('ol li button').nth(i).click(); // 동작 안 함
}
```

## 중요한 대기(wait) 처리

### 네비게이션 대기 원칙
**명시적으로 URL 확인**을 우선합니다. `waitForLoadState`보다 `waitForURL`이 더 안정적입니다.

```typescript
// ✅ 좋은 예: 명시적으로 URL 확인
await submitForm(page);
await page.waitForURL('**/about/overview');

await switchPageLanguage(page, 'en');
await page.waitForURL('**/en/about/overview');

// ❌ 나쁜 예: loadState만 의존
await submitForm(page);  // 내부에서 waitForLoadState만 수행
// 바로 다음 동작 수행 - 네비게이션이 완료되지 않았을 수 있음
```

### 필수 대기가 필요한 경우:
1. **에디터 언어 전환**: `switchEditorLanguage()` - 내부에서 300ms 대기
2. **페이지 이동**: `waitForURL('**/path')` - 네비게이션 완료 확인

### 대기가 불필요한 경우:
- **파일 업로드**: `setInputFiles()`는 await만으로 충분
- **폼 제출/페이지 언어 전환**: 헬퍼 함수가 `load` 상태까지 자동 대기
- **일반 요소 상호작용**: Playwright의 auto-waiting이 처리

### 헬퍼 함수의 자동 대기:
- `submitForm()`: `waitForLoadState('load')` 포함
- `switchPageLanguage()`: `waitForLoadState('load')` 포함
- `switchEditorLanguage()`: `waitForTimeout(300)` 포함 (에디터 전환용)

## 테스트 실행

```bash
# 단일 브라우저
npx playwright test tests/about/overview.spec.ts --project=chromium

# 모든 브라우저
npx playwright test tests/about/overview.spec.ts

# 헤드풀 모드 (디버깅용)
npx playwright test tests/about/overview.spec.ts --headed
```

## 향후 고려사항

현재는 Helper 함수 방식을 사용하지만, 프로젝트가 커지면 다음을 고려할 수 있습니다:

1. **하이브리드 방식**: Form 컴포넌트는 helper로, 페이지별 복잡한 로직은 POM으로
2. **Fixture 확장**: 공통 setup을 Playwright fixture로 추출
3. **데이터 분리**: 테스트 데이터를 별도 파일로 관리

---

**마지막 업데이트:** 2024-12-27
**작성자:** Claude (Sonnet 4.5)
