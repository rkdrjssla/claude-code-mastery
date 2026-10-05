# CLAUDE.md

프로젝트 규칙 및 명령어. 실제 코드로 알 수 있는 내용(디렉터리 구조, 아키텍처, 메서드 목록)은 제외하고, 각 서브프로젝트 고유의 불변 규칙과 함정만 기록.

## 프로젝트 구조

모노레포: `workspaces/bucket-list-main`(바닐라 JS, 빌드 도구 없음), `claude-nextjs-starters`(Next.js 16), `workspaces/output-style-test`(실험용). 각 디렉터리 작업 시 해당 CLAUDE.md가 로드됨.

## Project Context

- **PRD 문서**: @docs/PRD.md
- **개발 로드맵**: @docs/ROADMAP.md

## 명령어

### Next.js 프로젝트 (`cd claude-nextjs-starters`)

| 명령어 | 용도 |
|--------|------|
| `npm run dev` | 개발 서버 (`localhost:3000`) |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 빌드 앱 실행 |
| `npm run lint` | ESLint 검사 |
| `npm run typecheck` | TypeScript 검사 |
| `npm run format` | Prettier 포맷팅 |

**변경 후 검증 순서**: `lint` → `typecheck` → `build`

### bucket-list-main

빌드 도구 없음. `index.html` 직접 열기 또는 `python -m http.server 8000`.

## Claude Code 설정

- `.claude/agents/test-runner.md`: 코드 변경 후 호출(테스트 실패 시 수정)
- Slack 알림(Stop/Notification 훅) → `.claude/.env`에서 웹훅 URL 설정
- `.mcp.json`: sequential-thinking 서버 활성화
- **⚠️ `.claude/.env` 커밋 금지** (시크릿, .gitignore 등재)

## 프로젝트별 규칙 참조

각 서브프로젝트의 CLAUDE.md를 읽으면 더 상세한 불변성(예: bucket-list의 BucketStorage 경유 원칙, Next.js의 base-ui 컴포넌트 구조) 파악 가능.

---

**참고**: 한국어 응답, any 타입 금지, 2칸 들여쓰기, TypeScript는 `~/.claude/CLAUDE.md`(전역 설정)에 정의됨.
