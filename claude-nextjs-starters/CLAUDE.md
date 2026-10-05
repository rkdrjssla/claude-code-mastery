@AGENTS.md

## 스택 & 함정

Next.js 16.3.8, React 19.2.8, TypeScript 5.9.3, Tailwind v4.3.3.

**shadcn은 Radix가 아님**: `@base-ui/react` + `base-nova` 스타일 사용. Radix 문서는 무관함.

**`lib/utils.ts`**: `export { cn } from "cn"` (clsx/tailwind-merge 아님 — `cn` 패키지 재export).

**누락된 의존성**: `zustand`, `react-hook-form`, `zod`는 미설치. 필요 시 `npm install` 후 사용.

## 스타일 & 테마

- `app/globals.css`: OKLCH 변수 (`@theme inline`)로 라이트/다크 모드 정의 (`:root`, `.dark`)
- 다크모드: `next-themes` 패키지 (버튼은 `components/theme/theme-toggle.tsx`)
- 경로 alias `@/*`는 프로젝트 루트 기준 (src 없음)

## 컴포넌트 & 라우팅

- Server Component 기본 (필요 시 `"use client"`)
- 컴포넌트 추가: `npx shadcn@latest add <name>`
- 라우트: `app/*/page.tsx` (예: `about/page.tsx` → `/about`)
- `error.tsx`, `loading.tsx`, `not-found.tsx` 존재 (Next 16 기능)
- 사이트 메타/네비는 `config/site.ts`에서만 수정

## 코드 스타일

- Prettier: 큰따옴표, 세미콜론, 2칸, tailwind 플러그인
- `npm run format`로 자동 정렬
- `npm run lint`와 `npm run typecheck` 통과 필수

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
