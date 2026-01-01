#!/bin/bash

# CSEREAL 배포 스크립트
# 사용법: ./deploy.sh [dev|prod]

# 색상 코드
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 인자 확인
if [ -z "$1" ]; then
    echo -e "${RED}오류: 환경 인자가 필요합니다${NC}"
    echo "사용법: ./deploy.sh [dev|prod]"
    exit 1
fi

ENV="$1"

if [ "$ENV" != "dev" ] && [ "$ENV" != "prod" ]; then
    echo -e "${RED}오류: 잘못된 환경 '$ENV'${NC}"
    echo "사용법: ./deploy.sh [dev|prod]"
    exit 1
fi

# 환경 변수 파일 확인 및 로드
ENV_FILE="env/.env"
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}오류: $ENV_FILE 파일을 찾을 수 없습니다${NC}"
    echo "env/.env.example 파일을 복사하여 SSH 설정을 입력하세요."
    exit 1
fi
source "$ENV_FILE"

# 환경별 설정
if [ "$ENV" == "dev" ]; then
    SSH_KEY="${CSEREAL_DEV_SSH_KEY}"
    SSH_USER="${CSEREAL_DEV_SSH_USER}"
    SSH_HOST="${CSEREAL_DEV_SSH_HOST}"
    SSH_PORT="${CSEREAL_DEV_SSH_PORT}"
    REMOTE_PATH="~/cse.snu.ac.kr"
    CONTAINER_NAME="frontend"
    IMAGE_NAME="frontend"
    PORT="3000"
    BUILD_MODE="beta"
    TITLE="CSEREAL 개발 서버 배포"
else
    # PROD 환경
    SSH_KEY="${CSEREAL_PROD_SSH_KEY}"
    SSH_USER="${CSEREAL_PROD_SSH_USER}"
    SSH_HOST="${CSEREAL_PROD_SSH_HOST}"
    SSH_PORT="${CSEREAL_PROD_SSH_PORT}"
    REMOTE_PATH="~/cse.snu.ac.kr"
    CONTAINER_NAME="frontend"
    IMAGE_NAME="frontend"
    PORT="3000"
    BUILD_MODE="production"
    TITLE="🚀 CSEREAL 프로덕션 서버 배포"
fi

set -e  # 에러 발생 시 스크립트 중단

echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}  $TITLE${NC}"
echo -e "${GREEN}=====================================${NC}"
echo ""

# GitHub 원격 저장소 최신 커밋 확인
echo -e "${BLUE}GitHub 원격 저장소 최신 커밋 가져오는 중...${NC}"
git fetch origin --quiet
CURRENT_BRANCH=$(git branch --show-current)
REMOTE_BRANCH="origin/$CURRENT_BRANCH"

echo -e "${BLUE}배포될 커밋 (GitHub):${NC}"
echo "브랜치: $CURRENT_BRANCH"
echo "커밋: $(git log -1 $REMOTE_BRANCH --format='%h - %s')"
echo "작성자: $(git log -1 $REMOTE_BRANCH --format='%an <%ae>')"
echo "날짜:   $(git log -1 $REMOTE_BRANCH --format='%cd' --date=format:'%Y-%m-%d %H:%M:%S')"
echo ""

# 첫 번째 배포 확인 (dev/prod 공통)
if [ "$ENV" == "prod" ]; then
    echo -e "${YELLOW}프로덕션 서버에 배포합니다.${NC}"
else
    echo -e "${YELLOW}개발 서버에 배포합니다.${NC}"
fi
echo -e "${YELLOW}서버: $SSH_USER@$SSH_HOST:$SSH_PORT${NC}"
echo ""
read -p "이 배포를 계속 진행하시겠습니까? (yes/no): " -r
echo ""

if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo -e "${BLUE}배포가 취소되었습니다.${NC}"
    exit 0
fi

# 프로덕션일 경우 두 번째 확인
if [ "$ENV" == "prod" ]; then
    echo -e "${RED}⚠️  경고: 프로덕션 서버에 배포합니다!${NC}"
    echo -e "${RED}정말로 프로덕션 배포를 진행하시겠습니까?${NC}"
    echo ""
    read -p "최종 확인 (yes/no): " -r
    echo ""

    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        echo -e "${BLUE}배포가 취소되었습니다.${NC}"
        exit 0
    fi
fi

# SSH 키 파일 확인
if [ ! -f "$SSH_KEY" ]; then
    echo -e "${RED}오류: SSH 키를 찾을 수 없습니다: $SSH_KEY${NC}"
    exit 1
fi

echo -e "${YELLOW}[1/5] SSH 키 확인 완료: $SSH_KEY${NC}"

# SSH 접속 테스트
echo -e "${YELLOW}[2/5] SSH 연결 테스트 중...${NC}"
ssh -i "$SSH_KEY" -p "$SSH_PORT" -o ConnectTimeout=10 -o StrictHostKeyChecking=no "$SSH_USER@$SSH_HOST" "echo 'SSH 연결 성공'" || {
    echo -e "${RED}오류: $ENV 서버에 연결할 수 없습니다${NC}"
    exit 1
}

# Git pull 및 Docker 빌드/재시작
echo -e "${YELLOW}[3/5] $ENV 서버에 배포 중...${NC}"
ssh -i "$SSH_KEY" -p "$SSH_PORT" -o StrictHostKeyChecking=no "$SSH_USER@$SSH_HOST" << ENDSSH
set -e

echo "📦 프로젝트 디렉토리로 이동 중..."
cd $REMOTE_PATH

echo "🔄 Git 최신 변경사항 가져오는 중..."
git pull --rebase

echo "🏗️  Docker 이미지 빌드 중 ($BUILD_MODE 모드)..."
docker build --build-arg BUILD_MODE=$BUILD_MODE -t $IMAGE_NAME:latest .

echo "🛑 기존 컨테이너 중지 중..."
docker stop $CONTAINER_NAME 2>/dev/null || echo "실행 중인 컨테이너 없음"
docker rm $CONTAINER_NAME 2>/dev/null || echo "삭제할 컨테이너 없음"

echo "🚀 새 컨테이너 시작 중..."
docker run -d \
  --name $CONTAINER_NAME \
  --restart unless-stopped \
  -p $PORT:$PORT \
  $IMAGE_NAME:latest

echo "✅ 컨테이너 시작 완료"

# 컨테이너 상태 확인
sleep 2
docker ps | grep $CONTAINER_NAME
ENDSSH

echo -e "${YELLOW}[4/5] 배포 확인 중...${NC}"
ssh -i "$SSH_KEY" -p "$SSH_PORT" -o StrictHostKeyChecking=no "$SSH_USER@$SSH_HOST" << ENDSSH
# 컨테이너 로그 확인 (마지막 20줄)
echo "📋 컨테이너 로그 (최근 20줄):"
docker logs --tail 20 $CONTAINER_NAME
ENDSSH

echo ""
echo -e "${YELLOW}[5/5] 컨테이너 상태 확인 중...${NC}"
sleep 3
ssh -i "$SSH_KEY" -p "$SSH_PORT" -o StrictHostKeyChecking=no "$SSH_USER@$SSH_HOST" "docker ps --filter name=$CONTAINER_NAME --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'"

echo ""
echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}  ✅ 배포 완료!${NC}"
echo -e "${GREEN}=====================================${NC}"
echo ""

if [ "$ENV" == "dev" ]; then
    echo "🌐 개발 서버: http://$SSH_HOST:$PORT"
else
    echo "🌐 프로덕션 서버: https://cse.snu.ac.kr"
fi

echo ""
echo "유용한 명령어:"
echo "  로그 보기:    ssh -i \"$SSH_KEY\" -p $SSH_PORT $SSH_USER@$SSH_HOST 'docker logs -f $CONTAINER_NAME'"
echo "  재시작:       ssh -i \"$SSH_KEY\" -p $SSH_PORT $SSH_USER@$SSH_HOST 'docker restart $CONTAINER_NAME'"
echo "  중지:         ssh -i \"$SSH_KEY\" -p $SSH_PORT $SSH_USER@$SSH_HOST 'docker stop $CONTAINER_NAME'"
echo ""
