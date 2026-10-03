#!/usr/bin/env bash

# Claude Code → Slack 모바일 푸시 알림 스크립트
# 권한 요청 및 작업 완료 이벤트를 모바일 Slack으로 알림
# 사용: echo '{"message":"..."}' | slack-notify.sh [permission|done]

set -o pipefail

# 1. 이벤트 종류 확인 (인자)
EVENT_TYPE="${1:-done}"

# 2. 웹훅 URL 가져오기 (우선순위: 환경변수 → .claude/.env → ~/.claude/slack-webhook-url)
WEBHOOK_URL="${SLACK_WEBHOOK_URL}"

# .claude/.env 파일에서 읽기 (스크립트 위치로부터 상대경로)
if [ -z "$WEBHOOK_URL" ]; then
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  ENV_FILE="$SCRIPT_DIR/../.env"
  if [ -f "$ENV_FILE" ]; then
    WEBHOOK_URL=$(grep "^SLACK_WEBHOOK_URL=" "$ENV_FILE" 2>/dev/null | cut -d'=' -f2-)
  fi
fi

# 홈 디렉토리의 파일에서 읽기 (마지막 폴백)
if [ -z "$WEBHOOK_URL" ] && [ -f ~/.claude/slack-webhook-url ]; then
  WEBHOOK_URL=$(cat ~/.claude/slack-webhook-url 2>/dev/null)
fi

# 웹훅 URL 없으면 조용히 종료 (에러 아님)
if [ -z "$WEBHOOK_URL" ]; then
  exit 0
fi

# 3. stdin에서 hook JSON 읽기
HOOK_DATA=$(cat)
if [ -z "$HOOK_DATA" ]; then
  exit 0
fi

# 4. jq로 필드 파싱 (오류 무시 — 일부 필드는 선택사항)
MESSAGE=$(echo "$HOOK_DATA" | jq -r '.message // .error_message // "알림"' 2>/dev/null || echo "알림")
CWD=$(echo "$HOOK_DATA" | jq -r '.cwd // ""' 2>/dev/null)
PROJECT_NAME=$(basename "$CWD" 2>/dev/null || echo "claude-code")

# 5. 이벤트별 메시지 구성
case "$EVENT_TYPE" in
  permission)
    EMOJI="🔐"
    TITLE="권한 승인 필요"
    TEXT="요청: $MESSAGE"
    ;;
  done)
    EMOJI="✅"
    TITLE="작업 완료"
    TEXT=""
    ;;
  *)
    EMOJI="📢"
    TITLE="Claude Code 알림"
    TEXT="$MESSAGE"
    ;;
esac

# 6. Slack 메시지 페이로드 구성 (jq로 JSON 안전 이스케이프)
FULL_TEXT="${EMOJI} ${TITLE}"
if [ -n "$TEXT" ]; then
  FULL_TEXT="${FULL_TEXT} — ${TEXT}"
fi
FULL_TEXT="${FULL_TEXT} (프로젝트: ${PROJECT_NAME})"

PAYLOAD=$(jq -n \
  --arg text "$FULL_TEXT" \
  --arg project "$PROJECT_NAME" \
  '{
    "text": $text,
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": $text
        }
      }
    ]
  }')

# 7. Slack 웹훅으로 전송 (타임아웃 5초, 에러 무시)
curl -s -X POST \
  -H 'Content-type: application/json' \
  --data "$PAYLOAD" \
  --max-time 5 \
  "$WEBHOOK_URL" \
  >/dev/null 2>&1

# 8. 항상 성공으로 종료 (Claude Code 블로킹 금지)
exit 0
