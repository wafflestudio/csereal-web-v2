서울대학교 컴퓨터공학부 홈페이지의 프론트엔드 소스코드입니다.

![](https://github.com/user-attachments/assets/39a28dbf-8ce8-4c3c-9222-abdddd22b934)

![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 연혁

- 2023.07: CSEREAL 프로젝트 시작
- 2024.04: [cse.snu.ac.kr](https://cse.snu.ac.kr) 배포
- 2024.08: 기술/디자인 발표
- 2025.12: React Router 마이그레이션

## Getting Started

```sh
git clone https://github.com/wafflestudio/csereal-web-v2
cd csereal-web-v2
pnpm install
```

### 환경 변수 설정

```sh
cp env/.env.example env/.env
```

`env/.env` 파일을 열어 다음 값들을 채워넣습니다:

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

- 개발 중 백엔드 서버 변경: `env/.env.development` 수정
- ⚠️ 학교 외부에서 프로덕션 서버 첫 연결 시 실패 가능 (재시도 필요)
- 테스트 작성 가이드: [CLAUDE.md](./CLAUDE.md)

## 관련 레포지토리

- [wafflestudio/csereal-server](https://github.com/wafflestudio/csereal-server)
