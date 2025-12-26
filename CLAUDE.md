../csereal-web에 있는 next.js 프로젝트를 현재 경로에 있는 react-router-v7 프로젝트로 마이그레이션 중.

마이그레이션하면서 한 의사결정은 모두 이 파일에 기록.
- store 마이그레이션 완료. 현재 store 구조를 존중

기본적으로 아래 순서로 마이그레이션.
- 요청된 기능에 연관된 기존 코드 탐색
- 기존 코드를 현재 프로젝트의 적합한 위치에 복사
- 현재 프로젝트의 컨벤션과 react-router에 맞게 기존 코드를 수정

className에서 string interpolation보다 clsx를 선호. 특히 조건부 스타일이 있을 때. 

현재는 create, edit 관련 기능은 따로 언급하지 않으면 마이그레이션하지 않음.

Use react 19.
Use react router v7.

Always use context7 when I need code generation, setup or configuration steps, or
library/API documentation. This means you should automatically use the Context7 MCP
tools to resolve library id and get library docs without me having to explicitly ask.

## 마이그레이션 패턴 (2024-12-20 홈페이지 마이그레이션으로부터)

### 파일 조직
1. **컴포넌트 위치**: `app/routes/[route]/components/` (전역 `app/components/`가 아닌)
2. **에셋 위치**: `app/routes/[route]/assets/` (`public/`이 아닌)
3. **타입 정의**:
   - **API 타입**: `app/types/api/` 하위에 API pathname과 동일한 폴더 구조로 관리
     - **컨벤션**: 경로의 각 세그먼트가 폴더가 되고, 최종 리소스는 `index.ts` 또는 `.ts` 파일로 둔다
     - 예: `https://cse.snu.ac.kr/api/v2` → `app/types/api/v2/index.ts`
     - 예: `https://cse.snu.ac.kr/api/v2/notice` → `app/types/api/v2/notice/index.ts`
     - 예: `https://cse.snu.ac.kr/api/v2/about/facilities` → `app/types/api/v2/about/facilities.ts`
     - **WithLanguage 타입을 별도로 정의하지 않음**: `ko/en` 구조는 각 타입/응답에서 직접 선언
   - **기타 공통 타입**: `app/types/`에 직접 배치
4. **편집 페이지가 있는 경우 폴더로 정리**:
   - 읽기 페이지와 편집 페이지가 모두 있는 경우, 폴더를 만들어 `index.tsx`와 `edit.tsx`로 구성
   - ❌ `app/routes/path/guide.tsx` (편집 페이지 추가 시 관리 어려움)
   - ✅ `app/routes/path/guide/index.tsx` + `app/routes/path/guide/edit.tsx`
   - 예시:
     ```
     app/routes/academics/undergraduate/guide/
     ├── index.tsx    # 읽기 페이지
     └── edit.tsx     # 편집 페이지
     ```
5. **중요**: route 파일명과 같은 이름의 폴더 사용 금지
   - ❌ `app/routes/index.tsx` + `app/routes/index/` (충돌 발생)
   - ✅ `app/routes/index.tsx` + `app/routes/main/` (정상 작동)

### 데이터 페칭
- React Router loader에서 직접 fetch 호출
- 별도의 API wrapper 파일 생성하지 않음
- **중요**: `useLoaderData<typeof loader>()` 사용 금지
- **반드시** `Route.ComponentProps`의 `loaderData` props로 데이터 전달받기
- Route 타입은 `.react-router/types/`에서 자동 생성됨

**패턴**:
```typescript
// 1. Route 타입 import (파일 경로에 맞게)
import type { Route } from '.react-router/types/app/routes/[경로]/+types/[파일명]';
import type { LoaderFunctionArgs } from 'react-router';

// 2. loader 함수
export async function loader({ request, params }: LoaderFunctionArgs) {
  const response = await fetch('https://cse.snu.ac.kr/api/v2');
  if (!response.ok) throw new Error('Failed to fetch');
  return (await response.json()) as MainResponse;
}

// 3. 컴포넌트에서 loaderData props로 받기
export default function MyPage({ loaderData }: Route.ComponentProps) {
  // loaderData 사용
  return <div>{loaderData.title}</div>;
}

// destructuring도 가능
export default function MyPage({
  loaderData: { title, description }
}: Route.ComponentProps) {
  return <div>{title}</div>;
}

// rename도 가능
export default function NewsDetailPage({
  loaderData: news
}: Route.ComponentProps) {
  return <div>{news.title}</div>;
}
```

**Route 타입 경로 규칙**:
- 일반 파일: `.react-router/types/app/routes/[경로]/+types/[파일명]`
  - 예: `app/routes/about/contact.tsx` → `'.react-router/types/app/routes/about/+types/contact'`
- index 파일: `.react-router/types/app/routes/[경로]/+types/index`
  - 예: `app/routes/community/news/index.tsx` → `'.react-router/types/app/routes/community/news/+types/index'`
- 동적 라우트: `.react-router/types/app/routes/[경로]/+types/$id`
  - 예: `app/routes/community/news/$id.tsx` → `'.react-router/types/app/routes/community/news/+types/$id'`

**중요: app/routes.ts에 라우트 추가**:
- 새 route 파일을 만든 후 **반드시** `app/routes.ts`에 라우트를 추가해야 타입이 생성됨
- React Router는 `routes.ts`에 명시된 라우트만 타입을 생성하므로, 파일만 만들고 routes.ts에 추가하지 않으면 타입 에러 발생
- Dynamic route는 specific routes 뒤에 선언해야 함 (specific routes가 먼저 매칭됨)
- 예시:
```typescript
...prefix('/about', [
  route('/overview', 'routes/about/overview/index.tsx'),
  route('/overview/edit', 'routes/about/overview/edit.tsx'), // specific route
  route('/:type/edit', 'routes/about/$type/edit.tsx'), // dynamic route는 마지막에
]),
```

### 번역 (i18n)
- next-intl → useLanguage 훅 사용
- 패턴:
```typescript
const { t, localizedPath } = useLanguage({
  '한글키': 'English Value',
});
// 사용: t('한글키'), localizedPath('/path')
```

### 네비게이션
- Next.js Link → React Router Link (import from 'react-router')
- `href` → `to` prop
- 경로에 `localizedPath()` 적용

### 하드코딩된 경로
모든 경로는 하드코딩 (SegmentNode 없음):
- `/community/news`
- `/community/notice`
- `/community/top-conference`
- `/about/faculty-recruitment`
- `/about/facilities`
- `/people/faculty`
- `/academics/undergraduate/general-studies`
- `/academics/undergraduate/degree-requirements`

### 이미지 & 에셋
- Next.js Image → 네이티브 `<img>` 태그
- ESM import 사용: `import img from './assets/image.png'`
- public URL이 아닌 상대 경로 import

### SVG 처리
- 인라인 SVG 금지: 별도 `assets/` 폴더에 `.svg`로 분리
- 필요하면 `?react`로 import하여 컴포넌트처럼 사용

### 폰트
- next/font/local → CSS @font-face
- 폰트 파일을 route assets에 포함
- app.css에 @font-face 선언
- Tailwind theme에 커스텀 font family 추가

### 번역 파일
- 번역은 모두 JSON 파일로 관리
- `app/translations.json`에는 홈페이지 전역에서 사용하는 번역만 포함

### 반응형 디자인
- @mui/material의 useMediaQuery → 커스텀 useResponsive 훅
- window.matchMedia 또는 resize 이벤트 리스너 사용
- 간결함 유지 - 실제 사용되는 값만 반환 (현재는 `isMobile` boolean만)

### 날짜 포맷팅
- 별도 훅 만들지 않고 dayjs 직접 사용
- 예시: `dayjs(date).locale(locale).format('YYYY/M/DD (ddd)')`
- 간결함 유지 - 불필요한 추상화 지양

### 동적 스타일
- useStyle 훅 사용하지 않음
- 동적 스타일은 인라인 style prop으로 직접 적용
- 예시: `style={{ gridTemplateColumns: \`repeat(auto-fill, minmax(\${width}px, auto))\` }}`

### 검색 및 필터링
- useCustomSearchParams 같은 커스텀 훅 사용하지 않음
- 컴포넌트에서 직접 `useSearchParams`, `useNavigate` 사용
- 태그 변경 시 즉시 query param 변경 (navigate 호출)
- 검색 버튼 클릭 시에만 keyword query param 변경

## Form 컴포넌트 시스템 (2025-12-23 마이그레이션)

### 파일 구조
```
app/components/common/form/
├── Form.tsx                  # 메인 복합 컴포넌트
├── Action.tsx                # 저장/취소/삭제 버튼 (Radix AlertDialog 사용)
├── Fieldset.tsx              # 필드셋 (+ HTML/Image/File/Title 프리셋)
├── Section.tsx               # 폼 섹션
├── LanguagePicker.tsx        # 언어 선택 (ko/en)
├── Text.tsx                  # 텍스트 입력
├── TextArea.tsx              # 여러 줄 입력
├── TextList.tsx              # 동적 텍스트 리스트
├── Radio.tsx                 # 라디오 버튼 (form 통합)
├── Checkbox.tsx              # 체크박스 (form 통합)
├── Dropdown.tsx              # 드롭다운 (form 통합)
├── Image.tsx                 # 이미지 업로드
├── File.tsx                  # 파일 업로드
└── html/
    ├── HTMLEditor.tsx        # Suneditor 에디터
    ├── HTMLEditorFallback.tsx
    └── LazyHTMLEditor.tsx

app/components/common/
└── AlertDialog.tsx           # Radix UI 기반 확인 모달

app/types/
└── form.ts                   # EditorFile, EditorImage 타입
```

### 기본 사용 패턴
```typescript
import { FormProvider, useForm } from 'react-hook-form';
import Form from '~/components/common/form/Form';
import Fieldset from '~/components/common/form/Fieldset';

export default function MyEditor() {
  const methods = useForm({
    defaultValues: {
      title: '',
      description: '',
      image: null,
      attachments: [],
    },
    shouldFocusError: false,
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <FormProvider {...methods}>
      <Form>
        <Fieldset.Title>
          <Form.Text
            name="title"
            options={{
              required: { value: true, message: '제목을 입력해주세요.' },
            }}
          />
        </Fieldset.Title>

        <Fieldset.HTML>
          <Form.HTML
            name="description"
            options={{
              required: { value: true, message: '내용을 입력해주세요.' },
            }}
          />
        </Fieldset.HTML>

        <Fieldset.Image>
          <Form.Image name="image" />
        </Fieldset.Image>

        <Fieldset.File>
          <Form.File name="attachments" />
        </Fieldset.File>

        <Form.Action
          onCancel={() => router.back()}
          onSubmit={methods.handleSubmit(onSubmit)}
        />
      </Form>
    </FormProvider>
  );
}
```

### 모달 시스템 (Radix UI)
```typescript
import { useState } from 'react';
import AlertDialog from '~/components/common/AlertDialog';

function MyComponent() {
  const [showDialog, setShowDialog] = useState(false);

  const handleConfirm = async () => {
    // 확인 로직
    setShowDialog(false);
  };

  return (
    <>
      <button onClick={() => setShowDialog(true)}>삭제</button>

      <AlertDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        description="삭제하시겠습니까?"
        confirmText="삭제"
        onConfirm={handleConfirm}
      />
    </>
  );
}
```

### 주요 타입
```typescript
// EditorFile: 로컬 파일 또는 업로드된 파일
type EditorFile = LocalFile | UploadedFile;

interface LocalFile {
  type: 'LOCAL_FILE';
  file: File;
}

interface UploadedFile {
  type: 'UPLOADED_FILE';
  file: { id: number; name: string; url: string; bytes: number };
}

// EditorImage: 로컬 이미지 또는 업로드된 이미지
type EditorImage = LocalImage | UploadedImage | null;

interface LocalImage {
  type: 'LOCAL_IMAGE';
  file: File;
}

interface UploadedImage {
  type: 'UPLOADED_IMAGE';
  url: string;
}
```

### Fieldset spacing 시스템
Fieldset은 spacing과 titleSpacing을 variant로 관리:

**spacing**: 필드셋 하단 여백
- '2.5': mb-2.5 (리스트 필드)
- '4': mb-4
- '5': mb-5
- '6': mb-6 (기본값)
- '8': mb-8 (제목 필드)
- '10': mb-10 (HTML 필드)
- '11': mb-11
- '12': mb-12 (이미지 필드)

**titleSpacing**: 타이틀 하단 여백
- '1': mb-1
- '2': mb-2 (기본값)
- '3': mb-3 (첨부파일, 태그)

**사용 예시**:
```typescript
<Fieldset title="시설명" spacing="8" required>
  <Form.Text name="name" />
</Fieldset>

<Fieldset title="시설 설명" spacing="10" titleSpacing="2" required>
  <Form.HTML name="description" />
</Fieldset>
```

**프리셋**: `Fieldset.HTML`, `Fieldset.Image`, `Fieldset.File`, `Fieldset.Title`은 기본 spacing이 설정되어 있음

### 주의사항
- **Standalone 컴포넌트 유지**: `app/components/common/Checkbox.tsx`, `Dropdown.tsx`는 form과 별개로 유지됨
- **모달**: Radix UI 기반으로 마이그레이션 완료
  - AlertDialog: 확인/취소가 필요한 경우 (`app/components/common/AlertDialog.tsx`)
  - Dialog: 일반 모달 (`app/components/common/Dialog.tsx`)
  - 각 컴포넌트에서 `useState`로 open 상태 관리 (zustand store 제거됨)
- **이미지 업로드**: Suneditor의 이미지 업로드는 `app/api/file.ts`의 `postImage` 사용
- **파일명 인코딩**: 기존 프로젝트의 `encodeFormDataFileName` 사용하지 않음. React Router v7에서는 한글 파일명 문제가 해결되어 불필요
- **Form validation**:
  - `useForm`에 항상 `shouldFocusError: false` 설정
  - required 필드는 반드시 `options={{ required: { value: true, message: '메시지' } }}` 형식으로 에러 메시지 포함

## 중요: 편집 페이지 마이그레이션 시 주의사항

**편집/생성 페이지를 마이그레이션할 때는 반드시 조회 페이지의 편집/삭제/생성 버튼도 함께 마이그레이션해야 함**

- 편집 페이지만 만들고 버튼을 빼먹으면 편집 페이지로 갈 수 없어서 사용 불가
- 기존 프로젝트의 조회 페이지에서 편집/삭제/추가 버튼 관련 코드를 찾아서 함께 마이그레이션
- `LoginVisible`로 권한 체크 (대부분 `allow="ROLE_STAFF"`)
- 삭제 기능이 있으면 `AlertDialog`로 확인 모달도 함께 구현

## 공용 컴포넌트 가이드 (기존 프로젝트 기준)

### 공용화 기준
- 공용 컴포넌트는 실제로 반복 사용되며 화면 구조에 핵심적인 것만 둔다
- 공용 컴포넌트는 `app/components/common/`에 둔다
- 사용처에서 `className`/`style`를 넘기지 않도록 `variant`/`tone`/`size`로 통제한다

### 새 공용 컴포넌트
- `app/components/common/Button.tsx`
  - props: `variant`, `tone`, `size`, `as`, `to/href`, `iconLeft/iconRight`, `selected`, `ariaLabel`
- `app/components/common/ContentSection.tsx`
  - props: `tone`, `padding`
- `app/components/common/LinkRow.tsx`
  - props: `to`, `title`, `subtitle`, `tone`, `size`
- `app/components/common/SectionHeader.tsx`
  - props: `title`, `size`, `action`, `actionVisibility`
- `app/components/common/ErrorState.tsx`
  - props: `title`, `message`, `action`
- `app/components/common/Pagination.tsx`
  - props: `page`, `totalPages`, `onChange`, `disabled`
- `app/components/common/selection/SelectionList.tsx`
- `app/components/common/selection/SelectionTitle.tsx`
- `app/components/common/CategoryPage.tsx`

### 기존 공용 컴포넌트 props 정리
- `app/components/common/HTMLViewer.tsx`
  - `html`, `image`, `variant`
- `app/components/common/Attachments.tsx`
  - `variant` (spacing 제어)
- `app/components/common/Nodes.tsx`
  - `variant`, `tone`, `direction`, `grow`
- `app/components/layout/PageLayout/index.tsx`
  - `titleSize`, `padding` (removePadding 계열 제거)

### 적용 패턴
- 헤더/모바일 네비 버튼 → `Button` 사용
- about 본문 영역 → `ContentSection`
- 섹션 타이틀 + 더보기 → `SectionHeader`
- 에러 화면 → `ErrorState`
- 노드 컴포넌트 → `Node` 하나로 통합 (`variant`로 제어)
