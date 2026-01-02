#!/bin/bash

# 원격 서버에서 실행될 배포 스크립트
# 환경 변수로 전달되어야 할 값:
#   REMOTE_PATH, CONTAINER_NAME, IMAGE_NAME, BUILD_MODE, PORT

set -e

echo "📦 프로젝트 디렉토리로 이동 중..." >&2
eval cd $REMOTE_PATH

echo "🔄 Git 최신 변경사항 가져오는 중..." >&2
git pull --rebase

echo "📸 기존 컨테이너 이미지 백업 중..." >&2

# 현재 실행 중인 컨테이너의 이미지 확인
CURRENT_IMAGE=$(docker inspect $CONTAINER_NAME --format='{{.Image}}' 2>/dev/null || echo "")
# 기존 rollback 태그의 이미지 확인
ROLLBACK_IMAGE=$(docker inspect $IMAGE_NAME:rollback --format='{{.Image}}' 2>/dev/null || echo "")

# rollback 태그가 존재하고, 현재 실행 중인 이미지와 다른 경우에만 삭제
if [ -n "$ROLLBACK_IMAGE" ] && [ "$CURRENT_IMAGE" != "$ROLLBACK_IMAGE" ]; then
    docker rmi $IMAGE_NAME:rollback && echo "이전 rollback 태그 삭제 (이미지: ${ROLLBACK_IMAGE:0:12})" >&2
fi

if [ -n "$CURRENT_IMAGE" ]; then
    echo "현재 이미지 ID: ${CURRENT_IMAGE:0:12}..." >&2
    # 현재 이미지에 rollback 태그 붙여서 prune으로부터 보호
    docker tag $CURRENT_IMAGE $IMAGE_NAME:rollback >&2
    echo "현재 이미지를 $IMAGE_NAME:rollback으로 태그 지정" >&2
    echo "$CURRENT_IMAGE"
else
    echo "백업할 기존 컨테이너 없음" >&2
fi

echo "🏗️  Docker 이미지 빌드 중 ($BUILD_MODE 모드)..." >&2
docker build --build-arg BUILD_MODE=$BUILD_MODE -t $IMAGE_NAME:latest .

echo "🛑 기존 컨테이너 중지 중..." >&2
docker stop $CONTAINER_NAME 2>/dev/null || echo "실행 중인 컨테이너 없음" >&2
docker rm $CONTAINER_NAME 2>/dev/null || echo "삭제할 컨테이너 없음" >&2

echo "🚀 새 컨테이너 시작 중..." >&2

CACHE_DIR="/home/$(whoami)/img-optimized"
mkdir -p "$CACHE_DIR"

docker run -d \
  --name "$CONTAINER_NAME" \
  --restart unless-stopped \
  -p "$PORT:$PORT" \
  -v "$CACHE_DIR:/img-optimized" \
  $IMAGE_NAME:latest

echo "✅ 컨테이너 시작 완료" >&2

# 컨테이너 상태 확인
sleep 2
docker ps | grep $CONTAINER_NAME >&2

echo "🧹 사용하지 않는 이미지 정리 중..." >&2
docker image prune -f >&2
