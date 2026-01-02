#!/bin/bash

# CSEREAL 배포 스크립트
# 사용법: ./deploy.sh [beta|prod]

# 색상 코드
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 인자 확인
if [ -z "$1" ]; then
    echo -e "${RED}오류: 환경 인자가 필요합니다${NC}"
    echo "사용법: ./deploy.sh [beta|prod]"
    exit 1
fi

ENV="$1"

if [ "$ENV" != "beta" ] && [ "$ENV" != "prod" ]; then
    echo -e "${RED}오류: 잘못된 환경 '$ENV'${NC}"
    echo "사용법: ./deploy.sh [beta|prod]"
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
REMOTE_PATH="~/cse.snu.ac.kr"
CONTAINER_NAME="frontend"
IMAGE_NAME="frontend"
PORT="3000"

if [ "$ENV" == "beta" ]; then
    SSH_KEY="${CSEREAL_BETA_SSH_KEY}"
    SSH_USER="${CSEREAL_BETA_SSH_USER}"
    SSH_HOST="${CSEREAL_BETA_SSH_HOST}"
    SSH_PORT="${CSEREAL_BETA_SSH_PORT}"
    BUILD_MODE="beta"
    TITLE="CSEREAL 베타 서버 배포"
else
    # PROD 환경
    SSH_KEY="${CSEREAL_PROD_SSH_KEY}"
    SSH_USER="${CSEREAL_PROD_SSH_USER}"
    SSH_HOST="${CSEREAL_PROD_SSH_HOST}"
    SSH_PORT="${CSEREAL_PROD_SSH_PORT}"
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

# 첫 번째 배포 확인 (beta/prod 공통)
if [ "$ENV" == "prod" ]; then
    echo -e "${YELLOW}프로덕션 서버에 배포합니다.${NC}"
else
    echo -e "${YELLOW}베타 서버에 배포합니다.${NC}"
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

# SSH ControlMaster 설정 (연결 재사용)
SSH_CONTROL_PATH="/tmp/ssh-control-$ENV-$$"
SSH_OPTS="-i $SSH_KEY -p $SSH_PORT -o StrictHostKeyChecking=no -o ControlMaster=auto -o ControlPath=$SSH_CONTROL_PATH -o ControlPersist=300"

# SSH 접속 테스트 및 마스터 연결 생성
echo -e "${YELLOW}[2/5] SSH 연결 테스트 중...${NC}"
ssh $SSH_OPTS -o ConnectTimeout=10 "$SSH_USER@$SSH_HOST" "echo 'SSH 연결 성공'" || {
    echo -e "${RED}오류: $ENV 서버에 연결할 수 없습니다${NC}"
    exit 1
}

# 스크립트 종료 시 SSH 연결 정리
trap "ssh -O exit -o ControlPath=$SSH_CONTROL_PATH $SSH_USER@$SSH_HOST 2>/dev/null" EXIT

# Git pull 및 Docker 빌드/재시작
echo -e "${YELLOW}[3/5] $ENV 서버에 배포 중...${NC}"

# 스크립트 파일 경로
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REMOTE_DEPLOY_SCRIPT="$SCRIPT_DIR/remote-deploy.sh"

if [ ! -f "$REMOTE_DEPLOY_SCRIPT" ]; then
    echo -e "${RED}오류: 배포 스크립트를 찾을 수 없습니다: $REMOTE_DEPLOY_SCRIPT${NC}"
    exit 1
fi

# 변수를 치환하여 원격 스크립트 실행
PREV_IMAGE=$(ssh $SSH_OPTS "$SSH_USER@$SSH_HOST" "REMOTE_PATH='$REMOTE_PATH' CONTAINER_NAME='$CONTAINER_NAME' IMAGE_NAME='$IMAGE_NAME' BUILD_MODE='$BUILD_MODE' PORT='$PORT' bash -s" < "$REMOTE_DEPLOY_SCRIPT")

echo -e "${YELLOW}[4/5] 배포 확인 중...${NC}"
ssh $SSH_OPTS "$SSH_USER@$SSH_HOST" << ENDSSH
# 컨테이너 로그 확인 (마지막 20줄)
echo "📋 컨테이너 로그 (최근 20줄):"
docker logs --tail 20 $CONTAINER_NAME
ENDSSH

echo ""
echo -e "${YELLOW}[5/5] 컨테이너 상태 확인 중...${NC}"
sleep 3
ssh $SSH_OPTS "$SSH_USER@$SSH_HOST" "docker ps --filter name=$CONTAINER_NAME --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'"

echo ""
echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}  ✅ 배포 완료!${NC}"
echo -e "${GREEN}=====================================${NC}"
echo ""

if [ "$ENV" == "beta" ]; then
    echo "🌐 베타 서버: http://$SSH_HOST:$PORT"
else
    echo "🌐 프로덕션 서버: https://cse.snu.ac.kr"
fi

# 롤백 명령어 안내
if [ -n "$PREV_IMAGE" ]; then
    echo ""
    echo -e "${BLUE}⏮️  롤백이 필요한 경우:${NC}"
    echo ""
    echo "ssh -i \"$SSH_KEY\" -p $SSH_PORT $SSH_USER@$SSH_HOST 'docker stop $CONTAINER_NAME && docker rm $CONTAINER_NAME && docker run -d --name $CONTAINER_NAME --restart unless-stopped -p $PORT:$PORT $IMAGE_NAME:rollback'"
    echo ""
fi
