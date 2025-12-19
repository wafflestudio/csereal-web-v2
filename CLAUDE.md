../csereal-web에 있는 next.js 프로젝트를 현재 경로에 있는 react-router-v7 프로젝트로 마이그레이션 중.

마이그레이션하면서 한 의사결정은 모두 이 파일에 기록.
- store 마이그레이션 완료. 현재 store 구조를 존중

기본적으로 아래 순서로 마이그레이션. 
- 요청된 기능에 연관된 기존 코드 탐색
- 기존 코드를 현재 프로젝트의 적합한 위치에 복사
- 현재 프로젝트의 컨벤션과 react-router에 맞게 기존 코드를 수정 

Use react 19.
Use react router v7.
Prefer shadcn component. Install if required. pnpm dlx shadcn@latest add [component]

Always use context7 when I need code generation, setup or configuration steps, or
library/API documentation. This means you should automatically use the Context7 MCP
tools to resolve library id and get library docs without me having to explicitly ask.

## 마이그레이션 패턴 (2024-12-20 홈페이지 마이그레이션으로부터)

### 파일 조직
1. **컴포넌트 위치**: `app/routes/[route]/components/` (전역 `app/components/`가 아닌)
2. **에셋 위치**: `app/routes/[route]/assets/` (`public/`이 아닌)
3. **타입 정의**:
   - **API 타입**: `app/types/api/` 하위에 API pathname과 동일한 폴더 구조로 관리
     - 예: `https://cse.snu.ac.kr/api/v2` → `app/types/api/v2.ts`
     - 예: `https://cse.snu.ac.kr/api/news/123` → `app/types/api/news.ts`
   - **기타 공통 타입**: `app/types/`에 직접 배치
4. **중요**: route 파일명과 같은 이름의 폴더 사용 금지
   - ❌ `app/routes/index.tsx` + `app/routes/index/` (충돌 발생)
   - ✅ `app/routes/index.tsx` + `app/routes/main/` (정상 작동)

### 데이터 페칭
- React Router loader에서 직접 fetch 호출
- 별도의 API wrapper 파일 생성하지 않음
- 예시:
```typescript
export async function loader() {
  const response = await fetch('https://cse.snu.ac.kr/api/v2');
  if (!response.ok) throw new Error('Failed to fetch');
  return (await response.json()) as MainResponse;
}
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
- `/people/faculty`
- `/academics/undergraduate/general-studies`
- `/academics/undergraduate/degree-requirements`

### 이미지 & 에셋
- Next.js Image → 네이티브 `<img>` 태그
- ESM import 사용: `import img from './assets/image.png'`
- public URL이 아닌 상대 경로 import

### SVG 처리
- 컴포넌트 내에 인라인으로 포함 (간결함 추구)
- Vite SVG 플러그인 사용하지 않음

### 폰트
- next/font/local → CSS @font-face
- 폰트 파일을 route assets에 포함
- app.css에 @font-face 선언
- Tailwind theme에 커스텀 font family 추가

### 반응형 디자인
- @mui/material의 useMediaQuery → 커스텀 useResponsive 훅
- window.matchMedia 또는 resize 이벤트 리스너 사용
- 간결함 유지 - 실제 사용되는 값만 반환 (현재는 `isMobile` boolean만)

### 날짜 포맷팅
- 별도 훅 만들지 않고 dayjs 직접 사용
- 예시: `dayjs(date).locale(locale).format('YYYY/M/DD (ddd)')`
- 간결함 유지 - 불필요한 추상화 지양
