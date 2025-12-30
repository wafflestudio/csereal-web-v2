#!/bin/bash

# 데브 서버 배포 스크립트
# 사용법: ./deploy-dev.sh

ENV_FILE="env/.env.local"
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}ERROR: $ENV_FILE not found${NC}"
    echo "Create it from env/.env.example and set CSEREAL_DEV_SSH_KEY."
    exit 1
fi
source "$ENV_FILE"
set -e  # 에러 발생 시 스크립트 중단

# 색상 코드
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 환경 변수 설정
SSH_KEY="${CSEREAL_DEV_SSH_KEY}"
SSH_USER="ubuntu"
SSH_HOST="168.107.16.249"
REMOTE_PATH="~/csereal-web-v2"
CONTAINER_NAME="csereal-web-v2"
IMAGE_NAME="csereal-web-v2"
PORT="3000"

echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}  CSEREAL DEV Server Deployment${NC}"
echo -e "${GREEN}=====================================${NC}"
echo ""

# SSH 키 파일 확인
if [ ! -f "$SSH_KEY" ]; then
    echo -e "${RED}ERROR: SSH key not found at $SSH_KEY${NC}"
    echo "Please set CSEREAL_DEV_SSH_KEY environment variable or place key at ~/Developer/csereal-dev.key"
    exit 1
fi

echo -e "${YELLOW}[1/5] SSH Key validated: $SSH_KEY${NC}"

# SSH 접속 테스트
echo -e "${YELLOW}[2/5] Testing SSH connection...${NC}"
ssh -i "$SSH_KEY" -o ConnectTimeout=10 -o StrictHostKeyChecking=no "$SSH_USER@$SSH_HOST" "echo 'SSH connection successful'" || {
    echo -e "${RED}ERROR: Cannot connect to dev server${NC}"
    exit 1
}

# Git pull 및 Docker 빌드/재시작
echo -e "${YELLOW}[3/5] Deploying to dev server...${NC}"
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$SSH_USER@$SSH_HOST" << 'ENDSSH'
set -e

echo "📦 Navigating to project directory..."
cd ~/csereal-web-v2

echo "🔄 Pulling latest changes from git..."
git pull --rebase

echo "🛑 Stopping existing container (if running)..."
docker stop csereal-web-v2 2>/dev/null || echo "No running container found"
docker rm csereal-web-v2 2>/dev/null || echo "No container to remove"

echo "🏗️  Building Docker image (beta mode)..."
docker build --build-arg BUILD_MODE=beta -t csereal-web-v2:latest .

echo "🚀 Starting new container..."
docker run -d \
  --name csereal-web-v2 \
  --restart unless-stopped \
  -p 3000:3000 \
  csereal-web-v2:latest

echo "✅ Container started successfully"

# 컨테이너 상태 확인
sleep 2
docker ps | grep csereal-web-v2
ENDSSH

echo -e "${YELLOW}[4/5] Verifying deployment...${NC}"
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$SSH_USER@$SSH_HOST" << 'ENDSSH'
# 컨테이너 로그 확인 (마지막 20줄)
echo "📋 Container logs (last 20 lines):"
docker logs --tail 20 csereal-web-v2
ENDSSH

echo ""
echo -e "${YELLOW}[5/5] Checking container health...${NC}"
sleep 3
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$SSH_USER@$SSH_HOST" "docker ps --filter name=csereal-web-v2 --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'"

echo ""
echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}  ✅ Deployment completed!${NC}"
echo -e "${GREEN}=====================================${NC}"
echo ""
echo "🌐 Dev server: http://$SSH_HOST:$PORT"
echo ""
echo "Useful commands:"
echo "  View logs:    ssh -i \"$SSH_KEY\" $SSH_USER@$SSH_HOST 'docker logs -f csereal-web-v2'"
echo "  Restart:      ssh -i \"$SSH_KEY\" $SSH_USER@$SSH_HOST 'docker restart csereal-web-v2'"
echo "  Stop:         ssh -i \"$SSH_KEY\" $SSH_USER@$SSH_HOST 'docker stop csereal-web-v2'"
echo ""
