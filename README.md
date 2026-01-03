![](https://github.com/user-attachments/assets/39a28dbf-8ce8-4c3c-9222-abdddd22b934)

서울대학교 컴퓨터공학부 홈페이지의 프론트엔드 소스코드입니다.

## Getting Started

```sh
git clone https://github.com/wafflestudio/cse.snu.ac.kr
cd cse.snu.ac.kr
pnpm install
pnpm dev
```

필요시 환경 변수를 설정합니다.

```sh
cp env/.env.example env/.env
```

**1. 카카오 맵 API 키** 
- [소개 > 찾아오는 길](https://cse.snu.ac.kr/about/directions) 페이지에서 사용
- 없어도 지도 외 다른 기능은 정상 작동합니다

**2. SSH 설정**
- 베타/프로덕션 서버 배포 시 필요
- 관련자에게 전달받아 설정

## 스크립트

```sh
pnpm dev          # 개발 서버 (API: env/.env.development)
pnpm build        # 프로덕션 빌드
pnpm start        # 빌드된 웹사이트 실행

pnpm typecheck    # TypeScript 타입 체크
pnpm test         # E2E 테스트
pnpm test:ui      # E2E 테스트 (UI 모드)

pnpm deploy:beta  # 베타 서버 배포
pnpm deploy:prod  # 프로덕션 배포
```

## 참고사항

- ⚠️ 학외망에서 prod 서버 접속시 첫번쨰 시도는 실패할 수 있습니다.

## 관련 레포

- [wafflestudio/csereal-server](https://github.com/wafflestudio/csereal-server)
- [csereal-web](https://github.com/wafflestudio/csereal-web)
