# Development Guidelines

AI Agents를 위한 claude-code-mastery 프로젝트 개발 규칙입니다. 이 문서는 AI가 프로젝트에서 작업할 때 참조해야 할 필수 규칙들을 명시합니다.

---

## Project Overview

모노레포 구조의 프로젝트로 4개 독립 서브프로젝트로 구성됩니다.

| 프로젝트 | 용도 | 기술 스택 | 상태 |
|---------|------|---------|------|
| `claude-nextjs-starters/` | Next.js 메인 프레임워크 | Next.js 16, React 19, TypeScript, Tailwind v4, @base-ui/react | 활성 |
| `mcp-shrimp-task-manager/` | MCP 서버 (작업 추적 시스템) | TypeScript, Node.js MCP SDK | 활성 |
| `new-workspace/invoice-web/` | 노션 견적서 웹 뷰어 & PDF | Next.js, Supabase 인증 | 개발 중 |
| `docs/` | 프로젝트 문서 | PRD.md, ROADMAP.md | 유지 |

---

## Project Architecture

### 디렉토리 구조

```
claude-code-mastery/
├── claude-nextjs-starters/
│   ├── app/                    # Next.js App Router
│   ├── components/             # React 컴포넌트 (@base-ui/react 기반)
│   ├── lib/                    # 유틸리티 (cn() 재export)
│   ├── public/                 # 정적 파일
│   └── CLAUDE.md               # 프로젝트 규칙
│
├── mcp-shrimp-task-manager/
│   ├── src/                    # TypeScript 소스 코드
│   ├── dist/                   # 컴파일된 JavaScript
│   ├── tools/                  # MCP 도구 정의
│   └── CLAUDE.md               # 프로젝트 규칙
│
├── new-workspace/invoice-web/
│   ├── .claude/CLAUDE.md       # 프로젝트 규칙
│   ├── app/                    # Next.js 앱
│   ├── components/             # React 컴포넌트
│   └── lib/                    # Supabase 클라이언트 등
│
├── docs/
│   ├── PRD.md                  # 제품 요구사항 문서
│   └── ROADMAP.md              # 개발 단계 및 작업 추적
│
├── .claude/
│   ├── CLAUDE.md               # 루트 프로젝트 규칙
│   ├── agents/                 # 커스텀 에이전트 규칙
│   ├── hooks/                  # 자동 실행 훅
│   └── .env                    # 시크릿 (커밋 금지)
│
└── .mcp.json                   # MCP 서버 설정

```

### 모듈 분할 규칙

- **claude-nextjs-starters**: 웹 UI 및 프론트엔드 로직
- **mcp-shrimp-task-manager**: 백그라운드 작업 및 작업 추적 MCP 서버
- **new-workspace/invoice-web**: 웹 뷰어 및 인증 기능
- **docs**: 프로젝트 전체 문서 및 로드맵

---

## Code Standards

### 언어 및 주석

- **응답 언어**: 한국어
- **코드 주석**: 한국어 (비즈니스 로직만, 과도한 주석 금지)
- **변수/함수명**: 영어 (camelCase, PascalCase)
- **커밋 메시지**: 한국어
- **문서화**: 한국어

### 들여쓰기 및 포맷

- **들여쓰기**: 2칸 (스페이스)
- **네이밍**: camelCase (함수/변수), PascalCase (컴포넌트)
- **세미콜론**: 필수
- **큰따옴표**: 필수 (Prettier 설정)
- **포맷팅 도구**: Prettier (npm run format)
- **린팅**: ESLint (npm run lint)

### TypeScript 규칙

- **MUST**: 모든 프로젝트에서 TypeScript 사용
- **MUST NOT**: `any` 타입 절대 사용 금지
- **MUST**: 엄격한 타입 검사 활성화
- **DO**: 함수는 명시적 반환 타입 명시
- **DO**: Generic 타입 활용하여 재사용성 높이기

예제:
```typescript
// ✅ Good
function processData<T>(data: T[]): Promise<T[]> {
  return Promise.resolve(data);
}

// ❌ Bad
function processData(data: any) {
  return Promise.resolve(data);
}
```

---

## Functionality Implementation Standards

### claude-nextjs-starters에서 기능 추가

1. **컴포넌트 추가**: `components/` 디렉토리에 추가
   - @base-ui/react 컴포넌트만 사용 (shadcn/ui 금지)
   - Server Component를 기본으로, 필요시 `"use client"` 지시어 사용
   
2. **라우트 추가**: `app/*/page.tsx` 형식
   - 예: `app/feature/page.tsx` → `/feature`
   
3. **스타일**: Tailwind CSS v4 유틸리티 사용
   - `app/globals.css`에서 OKLCH 색상 변수 정의
   - 라이트/다크 모드 자동 지원
   
4. **설정 수정**: `config/site.ts`만 수정
   - 네비게이션, 메타데이터 등 중앙 관리
   - 모든 페이지에 영향을 미치는 변경 시 주의

### mcp-shrimp-task-manager에서 기능 추가

1. **도구 정의**: `tools/` 디렉토리에 JSON 형식 추가
2. **핸들러 구현**: `src/` 디렉토리에 TypeScript로 구현
3. **빌드**: `npm run build`로 TypeScript 컴파일
4. **테스트**: 수동으로 MCP 서버 실행 후 검증

### new-workspace/invoice-web에서 기능 추가

1. **인증 필수**: Supabase 인증 구현
2. **보호된 라우트**: `(protected)/` 그룹 내 구현
3. **환경 변수**: `.env.local`에서 Supabase 설정 필수
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Framework Usage Standards

### @base-ui/react 사용 규칙

- **MUST**: shadcn/ui 대신 @base-ui/react 사용
- **DO**: base-nova 스타일링 활용
- **DO**: Radix 문서는 참고하되, @base-ui/react API 확인 필수

### Tailwind CSS v4

- **MUST**: `@theme inline` 지시어로 커스텀 색상 정의
- **DO**: OKLCH 색상 공간 사용 (`app/globals.css`)
- **MUST**: 반응형 디자인 필수 (320px, 768px, 1024px 테스트)

### TypeScript/Next.js 16

- **MUST**: `npm run typecheck` 통과
- **MUST**: `npm run lint` 통과
- **MUST**: `npm run build` 성공
- **DO**: Server Components를 기본으로 사용
- **DO**: 필요한 의존성만 `npm install` (zustand, react-hook-form, zod 등)

---

## Workflow Standards

### 개발 프로세스

1. **로컬 개발**: `npm run dev` (http://localhost:3000)
2. **코드 수정**: TypeScript 파일 또는 Tailwind 클래스 변경
3. **포맷팅**: `npm run format` (Prettier 자동 정렬)
4. **검증 순서**: lint → typecheck → build

```bash
# claude-nextjs-starters에서
npm run lint
npm run typecheck
npm run build

# mcp-shrimp-task-manager에서
npm run build
npm run start (선택적 검증)
```

### Git 워크플로우

1. **브랜치**: main 브랜치에서 직접 작업 (monorepo 특성)
2. **커밋**: 한국어 커밋 메시지, atomic 커밋 지향
3. **금지**: 시크릿 (.env) 파일 커밋 금지

### 배포 전 체크리스트

- [ ] 모든 TypeScript 파일 타입 검사 통과
- [ ] ESLint 경고/오류 없음
- [ ] Prettier 포맷팅 완료
- [ ] 프로덕션 빌드 성공 (npm run build)
- [ ] 환경 변수 설정 검증

---

## Key File Interaction Standards

### config/site.ts

**규칙**: 네비게이션, 사이트 메타데이터는 반드시 이 파일에서만 수정
- 이 파일의 변경은 모든 페이지에 영향
- 부주의한 수정 금지

**상호작용**: app/layout.tsx에서 참조됨

### 환경 변수 파일

**위치**: 프로젝트 루트에 `.env.local`
**규칙**:
- MUST NOT: `.env` 파일 git에 커밋
- MUST: `.env.example` 파일로 템플릿 제공
- DO: 공개 변수는 `NEXT_PUBLIC_` 접두사 사용

### CLAUDE.md 위계

```
~/.claude/CLAUDE.md (전역 규칙)
  ↓
/Users/kang-geon/workspace/claude-code-mastery/.claude/CLAUDE.md (루트)
  ↓
./claude-nextjs-starters/CLAUDE.md (서브프로젝트)
./mcp-shrimp-task-manager/CLAUDE.md (서브프로젝트)
./new-workspace/invoice-web/.claude/CLAUDE.md (서브프로젝트)
```

**규칙**: 서브프로젝트별 CLAUDE.md는 루트 규칙을 override할 수 있음

### 다중 파일 조정

- **config/site.ts 수정 시**: 모든 페이지 테스트 필수
- **globals.css 색상 변경 시**: 라이트/다크 모드 양쪽 검증
- **타입 파일 추가 시**: types/ 디렉토리 내 정리

---

## AI Decision-Making Standards

### 기능 추가 판단 기준

**질문 1: 이 기능은 어느 프로젝트에 속하는가?**

| 기능 유형 | 대상 프로젝트 |
|---------|---------|
| 웹 UI 컴포넌트, 페이지, 라우트 | claude-nextjs-starters |
| 작업 추적, MCP 도구 | mcp-shrimp-task-manager |
| 견적서 뷰어, Supabase 인증 | new-workspace/invoice-web |
| 문서, 요구사항, 로드맵 | docs/ |

**질문 2: 기술 스택이 일치하는가?**

- claude-nextjs-starters → @base-ui/react, Tailwind, TypeScript 필수
- mcp-shrimp-task-manager → MCP SDK, TypeScript, src→dist 구조
- invoice-web → Next.js, Supabase, TypeScript

**질문 3: 다른 프로젝트에 영향을 미치는가?**

- YES → config/site.ts, .mcp.json, .claude/CLAUDE.md 검토
- NO → 해당 프로젝트 내에서만 수정

### 버전 관리 및 의존성 결정

- **기존 버전 유지**: Next.js 16, React 19, Tailwind v4 (upgrade 금지)
- **새 의존성**: package.json에 명시된 것만 사용
- **미설치 의존성**: zustand, react-hook-form, zod는 필요시 `npm install` 후 사용

### 오류 발생 시 대응

1. **TypeScript 오류**: `npm run typecheck` 출력 검토 후 타입 명시
2. **빌드 오류**: `npm run build` 전체 로그 검토
3. **런타임 오류**: 브라우저 DevTools 콘솔 확인

---

## Prohibited Actions

### MUST NOT

- `any` 타입 사용 금지 (TypeScript)
- `.env`, `.env.local` 파일 git에 커밋 금지
- shadcn/ui 사용 금지 (@base-ui/react 사용)
- workspaces/bucket-list-main, workspaces/output-style-test 참조 금지 (삭제됨)
- Radix 문서만 참고 금지 (@base-ui/react 공식 문서 확인)
- 과도한 주석 작성 금지 (필요한 경우만 한국어 주석)
- 불필요한 추상화 금지 (Simple is better)
- 패턴 매칭 없이 유틸리티 함수 중복 작성 금지

### DO NOT (권장하지 않음)

- Prettier 설정 변경하지 말 것 (프로젝트 전체 포맷팅 영향)
- CLAUDE.md 파일 직접 수정하지 말 것 (사용자가 관리)
- package.json에 불필요한 의존성 추가하지 말 것
- 미사용 파일이 git에 남지 않도록 주의
- 에러 핸들링 없이 Promise 사용하지 말 것
- CSS in JS 도구 추가하지 말 것 (Tailwind만 사용)

---

## Implementation Quick Reference

### 일일 개발 체크리스트

```bash
# 프로젝트 진입
cd /Users/kang-geon/workspace/claude-code-mastery/claude-nextjs-starters

# 개발 서버 시작
npm run dev

# 변경 후 검증
npm run format
npm run lint
npm run typecheck
npm run build

# 완료 시 git 상태 확인
git status
```

### 자주 하는 작업

| 작업 | 명령어 |
|------|--------|
| 컴포넌트 추가 | components/ 디렉토리에 .tsx 작성 |
| 라우트 추가 | app/*/page.tsx 생성 |
| 색상 변경 | app/globals.css의 OKLCH 변수 수정 |
| 다크모드 추가 | .dark 클래스 Tailwind 활용 |
| TypeScript 오류 확인 | npm run typecheck |
| 포맷팅 | npm run format |

---

**마지막 업데이트**: 2026-10-05
**버전**: 1.0
