# 노션 견적서 웹 뷰어 & PDF 다운로드 MVP 개발 로드맵

노션에서 작성한 견적서를 클라이언트가 보기 좋은 웹 화면으로 확인하고, 동일한 형식의 PDF로 즉시 받을 수 있게 한다.

| 항목 | 내용 |
|------|------|
| **기술 스택** | Next.js 15+ (App Router, 현재 저장소 16.3.8), React 19, TypeScript, TailwindCSS v4, shadcn/ui(base-ui), Supabase, Notion API |
| **테스트** | Playwright MCP (정상/오류/엣지/권한 4가지 시나리오 필수) |
| **작성일** | 2026-10-05 |
| **기준 문서** | `docs/PRD.md` v1.0 (2026-10-03) |
| **대상 코드베이스** | `claude-nextjs-starters/` |
| **전체 기간** | 27-33 영업일 (2026-10-06 ~ 2026-11-20, 한글날 10-09 제외) |

---

## 개요

노션 견적서 웹 뷰어는 **노션으로 견적서를 작성하는 프리랜서와 소규모 에이전시, 그리고 견적서를 받는 클라이언트**를 위한 **노션 견적서 웹 열람 및 PDF 전달 도구**로 다음 기능을 제공합니다.

- **Notion API 연동 (F001)**: 노션 데이터베이스의 견적서를 서버에서 조회해 앱 데이터로 변환
- **견적서 웹 뷰어 (F002)**: 헤더, 클라이언트 정보, 항목 테이블, 합계, 조건을 문서 레이아웃으로 표시
- **PDF 다운로드 (F003)**: 웹 뷰어와 동일한 형식의 PDF를 한 번의 클릭으로 생성
- **견적서 목록 (F004)**: 견적번호, 클라이언트명, 금액, 상태, 발행일 테이블과 상세 링크
- **지원 기능**: 상태 필터(F005), 반응형 표시(F006), 이메일 인증(F007), 로그아웃(F008), 공유 링크 복사(F009), 목록 새로고침(F010)

### 기능 진행 현황

| ID | 기능 | 담당 Phase | 담당 Task | 상태 |
|----|------|-----------|-----------|------|
| F001 | Notion API 연동 | Phase 2 | 006, 007, 008 | 대기 |
| F002 | 견적서 웹 뷰어 | Phase 3 | 015 | 대기 |
| F003 | PDF 다운로드 | Phase 4 | 023 | 대기 |
| F004 | 견적서 목록 조회 | Phase 3 | 014 | 대기 |
| F005 | 상태 필터 | Phase 4 | 019 | 대기 |
| F006 | 반응형 견적서 표시 | Phase 3 | 016 | 대기 |
| F007 | 이메일 인증 | 완료 | 000 | ✅ 완료 |
| F008 | 로그아웃 | 완료 | 000 | ✅ 완료 |
| F009 | 공유 링크 복사 | Phase 4 | 022 | 대기 |
| F010 | 목록 새로고침 | Phase 4 | 021 | 대기 |

---

## 현재 코드베이스 진단 (2026-10-05 기준)

로드맵은 "빈 프로젝트"가 아니라 아래 상태에서 출발한다. Phase 1의 Task는 이 진단 결과를 해소하도록 설계되었다.

### 이미 존재하는 것

- Supabase 이메일 인증(`components/auth/LoginForm.tsx`, `SignupForm.tsx`, `lib/supabase.ts`, `lib/auth.ts`) — F007 완료
- 로그아웃 Route Handler(`app/api/auth/logout/route.ts`) — F008 완료
- 라우트 골격: `app/auth/login`, `app/auth/signup`, `app/(app)/quotes`, `app/quotes/[id]`
- 전역 `error.tsx`, `loading.tsx`, `not-found.tsx`, 다크모드(`next-themes`)
- shadcn/ui(base-ui) 컴포넌트: badge, button, card, dropdown-menu, field, input, label, separator, sheet
- 기본 타입(`types/index.ts`: User, Quote, QuoteItem, ApiResponse)
- `.env.local.example` (Supabase, `NOTION_TOKEN`, `NOTION_DATABASE_ID`)

### Phase 1에서 반드시 해소할 구조적 결함

| # | 문제 | 영향 | 해소 Task |
|---|------|------|-----------|
| 1 | 미들웨어와 로그아웃이 `/login`으로 리다이렉트하지만 실제 페이지는 `/auth/login`에만 존재 | 비로그인 접근, 로그아웃 후 404 발생 가능 | Task 002 |
| 2 | Next.js 16에서 `middleware.ts` 파일 규칙 폐기(`proxy.ts`로 변경) | 향후 버전에서 인증 가드 동작 중단 위험 | Task 002 |
| 3 | `app/quotes/[id]`가 `(app)` 그룹 밖에 있고, 미들웨어가 `/quotes/*` 전체를 보호 | 공유 링크로 들어온 클라이언트가 로그인 화면으로 튕김 (PRD 위반) | Task 001, 002 |
| 4 | 상세 페이지(Server Component)에서 `Button`에 `onClick` 함수 전달 | 렌더링 시 런타임 오류 | Task 001 |
| 5 | `types/index.ts`가 DB 행 형태(snake_case)만 정의, Notion 원본/DTO/뷰 모델 구분 없음 | API와 UI 간 타입 불일치 | Task 003 |
| 6 | `config/site.ts`가 스타터킷 기본값(Home/About/Docs) | 헤더 메뉴가 PRD 메뉴 구조와 불일치 | Task 005 |
| 7 | `zustand` 미설치 | 공통 상태 관리 불가 | Task 010 |

---

## 개발 워크플로우

1. **작업 계획**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
   - 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - `/tasks` 디렉토리에 새 작업 파일 생성 (현재 디렉토리가 없으므로 Task 001 착수 시 `tasks/000-sample.md`와 함께 생성)
   - 명명 형식: `XXX-description.md` (예: `001-project-structure.md`)
   - 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
   - **API/비즈니스 로직 작업 시 `## 테스트 체크리스트` 섹션 필수 포함**
     - 정상 케이스: 예상하는 입력 → 예상 결과
     - 오류 케이스: API 실패/리소스 없음 → 적절한 오류 처리
     - 엣지 케이스: 빈 목록/긴 문자열/경계값 → 안정적 처리
     - 권한 케이스: 비로그인/공유 링크 → 권한 제어 확인
     - 각 시나리오는 Playwright MCP로 검증할 수 있도록 작성
   - 직전 완료 작업 파일(예: 현재 `012`라면 `011`, `010`)을 예시로 참조. 완료 작업은 체크된 박스와 변경 사항 요약이 있는 최종 상태이므로, 새 작업은 `000-sample.md`처럼 빈 박스와 요약 없는 초기 상태로 작성

3. **작업 구현**
   - 작업 파일의 명세서를 따라 기능 구현
   - 코드 검증 순서: `npm run lint` → `npm run typecheck` → `npm run build`
   - **Playwright MCP를 사용한 테스트 실행**
     - 4가지 시나리오(정상/오류/엣지/권한) 검증
     - `browser_console_messages`, `browser_network_requests`로 디버깅
     - 실패 시 원인 분석 → 코드 수정 → 재테스트 반복
   - 각 단계 후 작업 파일의 진행 상황 및 테스트 결과 업데이트
   - 모든 테스트 시나리오 통과 확인 후 다음 단계로 진행
   - 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**
   - 로드맵에서 완료된 작업을 ✅로 표시하고 `See: /tasks/XXX-xxx.md` 참조 추가
   - Phase 내 모든 Task가 ✅이면 Phase 제목에 ✅ 추가

---

## 강화된 테스트 규칙 (필수)

### 핵심 규칙

- **구현 후 테스트는 필수 단계**이며, 테스트 통과 전에는 Task를 완료(✅)로 표시할 수 없다.
- 적용 대상: API 연동, 인증/권한, 데이터 변환, 캐싱, 비즈니스 로직을 다루는 **모든 Task**
- 테스트 미통과 Task는 `⚠️ 테스트 미통과`로 표시하고, 통과할 때까지 수정과 재테스트를 반복한다. 후속 Task는 착수하지 않는다.
- UI/구조 전용 Task는 4분류 테이블 대신 **검증 기준**(Playwright 스냅샷, typecheck 등)을 따른다.

### 테스트 시나리오 4분류

| 분류 | 검증 내용 |
|------|-----------|
| **정상** | 기대하는 입력과 출력이 정상 작동하는가 |
| **오류** | Notion/Supabase API 실패, 존재하지 않는 리소스, 네트워크 오류를 적절히 처리하는가 |
| **엣지** | 빈 목록, 긴 문자열, 경계값(0, 최대치), 특수 문자, 누락 필드를 처리하는가 |
| **권한** | 비로그인 접근, 타인 견적서 접근, 공유 링크 접근 등 권한 제어가 정상 작동하는가 |

### Playwright MCP 도구

| 도구 | 용도 |
|------|------|
| `browser_navigate` | 페이지 접근 |
| `browser_fill_form` / `browser_type` | 폼 입력 |
| `browser_click` | 동작 실행 |
| `browser_snapshot` / `browser_take_screenshot` | UI 검증 |
| `browser_resize` | 반응형 뷰포트 전환 (375 / 768 / 1440px) |
| `browser_console_messages` | 콘솔 오류 추적 |
| `browser_network_requests` | API 호출, 상태 코드, 재시도 횟수 검증 |
| `browser_evaluate` | 클립보드, DOM 상태 확인 |

### 오류 상황 재현 방법 (공통)

- **Notion 장애**: 테스트 전용 환경 변수 `NOTION_FAULT_INJECTION=timeout|500|429|401`(개발 모드 전용)로 Repository 계층에서 오류 주입
- **존재하지 않는 리소스**: 임의 UUID, 삭제된 Notion 페이지 ID 사용
- **세션 만료**: Supabase 쿠키 삭제 후 요청
- **타인 데이터**: 테스트 계정 A, B 두 개를 준비하고 교차 접근

---

## 개발 단계 흐름

```
Phase 1: 프로젝트 골격 (4-5일)      구조, 라우팅, 타입, 환경 설정
   │  "무엇을 어디에 둘지"가 정해져야 누구든 작업을 시작할 수 있다
   ▼
Phase 2: 공통 모듈 (6-7일)          Notion 클라이언트, 훅, UI 라이브러리, 상태, 캐싱
   │  모든 기능이 공유하는 부품을 한 번만 만든다
   ▼
Phase 3: 핵심 기능 (8-10일)         목록(F004), 상세(F002), 반응형(F006), 통합 테스트
   │  사용자가 실제로 가치를 얻는 최소 경로를 완성한다
   ▼
Phase 4: 추가 기능 (5-6일)          필터(F005), 정렬, 새로고침(F010), 공유(F009), PDF(F003)
   │  핵심 경로 위에 독립적인 기능을 얹는다
   ▼
Phase 5: 최적화 및 배포 (4-5일)     성능, 보안, SEO, 모니터링, CI/CD, 프로덕션 E2E
```

**구조 → 공통 → 기능 → 추가 → 배포** 순서는 기능 단위가 아니라 **개발 단계 단위**로 Phase를 나눈다. 각 Phase의 산출물은 다음 Phase의 "입력 계약"이 되며, Phase 내부 Task는 프론트엔드/백엔드 트랙으로 병렬 진행할 수 있도록 의존성을 최소화했다.

---

## 완료된 기반 작업

- **Task 000: Supabase 이메일 인증 및 로그아웃 구현** ✅ - 완료
  - See: 커밋 `e64d49f` (Supabase 인증 구현 (F007, F008))
  - ✅ React Hook Form + Zod 기반 로그인/회원가입 폼 (F007)
  - ✅ Supabase SSR 클라이언트 및 세션 유틸리티 (`lib/supabase.ts`, `lib/auth.ts`)
  - ✅ 로그아웃 Route Handler (F008)
  - ✅ 비로그인 보호 라우트 리다이렉트 미들웨어
  - 참고: 리다이렉트 대상 경로(`/login`) 불일치는 Task 002에서 수정하고 회귀 테스트를 수행한다.

---

## 개발 단계

### Phase 1: 프로젝트 골격 (4-5일)

**기간**: 2026-10-06 ~ 2026-10-13 | **완료 조건**: 모든 라우트가 빈 화면이라도 올바른 권한 규칙으로 열리고, 타입과 환경 변수 계약이 확정되어 `lint` → `typecheck` → `build`가 통과한다.

#### 왜 이 순서인가?

- **모든 개발의 기초가 되는 구조를 먼저 완성해야 다른 팀이 동시에 작업할 수 있다.** 라우트와 디렉토리 위치가 정해지지 않으면 프론트엔드와 백엔드가 같은 파일을 서로 다르게 만들게 된다.
- **라우팅과 디렉토리 구조가 없으면 기능 구현이 불가능하다.** 특히 이 프로젝트는 "작성자 전용 목록"과 "로그인 없이 열람하는 공유 상세"라는 상반된 권한 규칙을 갖기 때문에, 라우트 그룹과 인증 가드를 처음에 확정하지 않으면 이후 모든 페이지가 재작업 대상이 된다. (현재 공유 링크가 미들웨어에 막히는 결함이 그 예다.)
- **타입 정의가 먼저 되어야 API와 컴포넌트가 안정적으로 개발된다.** Notion 원본 → DTO → 뷰 모델의 타입 계약이 있으면 Phase 2의 API 개발자와 UI 개발자가 서로를 기다리지 않고 같은 인터페이스를 기준으로 작업한다.
- **환경 설정이 명확해야 Notion API와 Supabase 연동이 가능하다.** 서버 전용 비밀 키와 공개 키의 경계를 먼저 정해 두어야 토큰이 클라이언트 번들에 노출되는 사고를 구조적으로 막을 수 있다.

#### 병렬 트랙

| 트랙 | Task |
|------|------|
| 공통(선행) | 001 |
| 백엔드 | 002, 004 |
| 프론트엔드 | 005 |
| 공통 | 003 (001 이후 누구나) |

---

- **Task 001: 디렉토리 구조 및 라우트 골격 재정비** - 우선순위
  - **기능**: 구조 기반 | **기간**: 1일 | **의존성**: 없음
  - 레이어드 아키텍처 디렉토리 확립
    - `app/` 라우트, `components/{ui,layout,quote,common}/`, `lib/{notion,repositories,services,mappers,hooks,stores,utils}/`, `types/`, `styles/`(인쇄용 CSS)
    - 계층 규칙: Route Handler/Server Action(Controller) → `lib/services` → `lib/repositories`(Notion, Supabase), 계층 간 데이터는 DTO로만 전달
  - 라우트 구조 확정 (빈 페이지 포함)
    - `/` → 로그인 상태에 따라 `/quotes` 또는 `/login`으로 이동
    - `/login`, `/signup` (기존 `app/auth/*` 이전 또는 리다이렉트 정리)
    - `/quotes` (작성자 전용, `(app)` 그룹)
    - `/quotes/[id]` (작성자 전용 상세, `(app)` 그룹 안으로 이동)
    - `/share/[token]` (공개 상세, `(public)` 그룹, 로그인 불필요)
    - `/api/quotes`, `/api/quotes/[id]`, `/api/share/[token]`, `/api/quotes/[id]/pdf` (빈 Route Handler, `501` 응답)
  - 상세 화면 컴포넌트를 `components/quote/quote-document.tsx`(Server Component)와 `components/quote/quote-actions.tsx`(`"use client"`)로 분리하여 Server Component `onClick` 런타임 오류 제거
  - `tasks/000-sample.md` 작업 템플릿 생성
  - **검증 기준**
    - 모든 라우트가 `browser_navigate`로 열리고 `browser_console_messages`에 오류 0건
    - `/invalid-route` 접근 시 `not-found.tsx` 렌더링
    - `lint` → `typecheck` → `build` 통과

- **Task 002: 인증 가드 마이그레이션 및 라우트 권한 규칙 확정**
  - **기능**: F007/F008 보완 | **기간**: 1일 | **의존성**: Task 001
  - `middleware.ts` → `proxy.ts` 마이그레이션 (Next.js 16 규칙, 함수명 `proxy`)
  - 권한 규칙을 상수 테이블로 선언: 보호(`/quotes/**`), 게스트 전용(`/login`, `/signup`), 공개(`/share/**`, `/api/share/**`)
  - 리다이렉트 경로 일원화 (`/login`), 로그인 후 원래 경로 복귀용 `?next=` 파라미터 지원 (외부 URL 차단)
  - 로그아웃 Route Handler의 리다이렉트 경로 및 `NEXT_PUBLIC_APP_URL` 의존 제거(요청 URL 기준)
  - `(app)/layout.tsx`에서 `requireAuth()` 2차 방어 (proxy 우회 대비)

  ##### 테스트 체크리스트

  | 시나리오 | 입력/조건 | 기대 결과 | Playwright MCP 검증 |
  |---------|-----------|-----------|---------------------|
  | **정상** | 로그인 후 `/quotes`, `/quotes/{id}` 접근 | 200 응답, 페이지 렌더링 | `browser_navigate` 후 `browser_snapshot`, `browser_network_requests`에서 리다이렉트 없음 확인 |
  | **정상** | 로그아웃 버튼 클릭 | 세션 쿠키 삭제, `/login`으로 이동 (404 아님) | `browser_click` 후 URL과 로그인 폼 존재 확인 |
  | **오류** | Supabase 장애(잘못된 URL 환경 변수) 상태에서 보호 라우트 접근 | 무한 리다이렉트 없이 `/login` 표시, 콘솔에 처리된 오류 1건 | `browser_network_requests`에서 302 횟수 1회 이하 확인 |
  | **엣지** | `/login?next=https://evil.com` 로그인 | 외부 URL 무시, `/quotes`로 이동 | 로그인 후 최종 URL 호스트 확인 |
  | **엣지** | `/quotes/` (트레일링 슬래시), `/QUOTES` 대소문자 | 보호 규칙 일관 적용 | 각 경로 접근 후 리다이렉트 결과 확인 |
  | **권한** | 비로그인으로 `/quotes`, `/quotes/{id}` 접근 | `/login?next=...`로 리다이렉트 | 비로그인 컨텍스트에서 `browser_navigate` |
  | **권한** | 비로그인으로 `/share/{token}` 접근 | 로그인 없이 200 (빈 페이지라도 리다이렉트 없음) | `browser_network_requests`에서 302 없음 확인 |
  | **권한** | 로그인 상태로 `/login`, `/signup` 접근 | `/quotes`로 리다이렉트 | 로그인 컨텍스트에서 확인 |

- **Task 003: 도메인 타입 및 데이터 계약 정의**
  - **기능**: 타입 기반 | **기간**: 1일 | **의존성**: Task 001
  - `types/quote.ts`: `QuoteStatus = "draft" | "sent" | "approved" | "rejected"` 및 한국어 라벨 매핑(작성중/발송됨/승인됨/거절됨) 상수
  - 계층별 타입 분리 (any 금지)
    - `NotionQuotePage`(원본 속성), `QuoteRow`(Supabase 행, snake_case)
    - `QuoteSummaryDto`(목록: id, quoteNumber, clientName, totalAmount, status, issuedAt)
    - `QuoteDetailDto`(상세: 발행자, 클라이언트 정보, items, subtotal, total, terms, issuedAt, validUntil)
    - `QuoteItemDto`(name, quantity, unitPrice, amount — amount는 계산값)
  - API 응답 형식 통일: `ApiResponse<T> = { ok: true; data: T } | { ok: false; error: { code: ApiErrorCode; message: string } }`
  - `ApiErrorCode` 열거: `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `NOTION_UNAVAILABLE`, `RATE_LIMITED`, `VALIDATION_FAILED`, `INTERNAL`
  - Notion 데이터베이스 속성 매핑 명세 문서화 (`docs/notion-schema.md`): 견적번호(title), 클라이언트명, 클라이언트 이메일, 상태(select), 발행일(date), 유효기간, 조건(rich_text), 작성자 이메일, 항목(하위 DB relation 또는 페이지 내 테이블 블록) — 항목 저장 방식은 이 Task에서 확정
  - **검증 기준**
    - `npm run typecheck` 통과, 의도적 필수 필드 누락 시 컴파일 오류 발생 확인
    - 기존 `types/index.ts` 사용처가 새 타입으로 이전됨

- **Task 004: 환경 변수 및 데이터베이스 스키마 설계**
  - **기능**: 환경 기반 | **기간**: 1일 | **의존성**: Task 001
  - `lib/env.ts`: Zod로 환경 변수 검증, 서버 전용(`NOTION_TOKEN`, `NOTION_DATABASE_ID`, `SUPABASE_SERVICE_ROLE_KEY`)과 공개(`NEXT_PUBLIC_*`) 분리, 서버 전용 모듈에 `import "server-only"` 적용
  - `.env.local.example` 갱신, `.env.production` 항목 목록 문서화 (실제 값은 Vercel 환경 변수에만 저장, 커밋 금지)
  - Supabase 스키마 설계 (SQL 마이그레이션 파일 작성, 적용은 Task 008)
    - `quotes`: id(uuid), user_id(fk auth.users), notion_page_id(unique), client_name, status, share_token(unique, nullable), share_enabled(bool), created_at, updated_at
    - RLS 정책: 소유자만 select/update, 공유 조회는 `security definer` RPC `get_quote_by_share_token(token)`으로만 허용
  - 작성자-견적서 소유권 결정: Notion "작성자 이메일" 속성과 Supabase 사용자 이메일 매칭 방식 (대안 비교 후 문서화)
  - **검증 기준**
    - 필수 환경 변수 누락 시 서버 기동 단계에서 명확한 오류 메시지 출력
    - `next build` 결과물 클라이언트 번들에서 `NOTION_TOKEN` 문자열 검색 결과 0건

- **Task 005: 공통 레이아웃, 헤더 골격, 에러/로딩 경계**
  - **기능**: UI 골격 | **기간**: 1일 | **의존성**: Task 001
  - `config/site.ts`를 PRD 메뉴 구조로 교체 (서비스명, 로그인 사용자 메뉴: 견적서 목록 / 로그아웃)
  - 헤더 3가지 변형 골격: 비로그인(로고→로그인), 로그인(로고→목록, 목록, 로그아웃), 공유 링크(로고만, 이동 없음)
  - 라우트 그룹별 레이아웃: `(app)/layout.tsx`(작성자 헤더), `(public)/layout.tsx`(공유용 최소 헤더)
  - 세그먼트별 `loading.tsx`(스켈레톤 자리), `error.tsx`(재시도 버튼), `quotes/[id]/not-found.tsx`(목록 이동 버튼)
  - **검증 기준**
    - 비로그인/로그인/공유 3가지 컨텍스트에서 `browser_snapshot`으로 헤더 메뉴가 PRD 메뉴 구조와 일치
    - 의도적으로 throw하는 테스트 컴포넌트로 `error.tsx` 표시 및 재시도 동작 확인

---

### Phase 2: 공통 모듈 (6-7일)

**기간**: 2026-10-14 ~ 2026-10-22 | **완료 조건**: 화면 없이도 Notion 견적서를 DTO로 받아오는 API가 4가지 시나리오를 통과하고, 기능 개발에 필요한 UI 부품과 훅이 모두 준비된다.

#### 왜 이 순서인가?

- **Phase 1 골격이 완성되면 공통으로 쓸 모듈을 만들어야 한다.** 목록, 상세, 공유, PDF는 모두 "Notion에서 견적서를 가져와 DTO로 변환"하는 같은 경로를 쓴다. 이 경로를 기능마다 따로 만들면 변환 규칙이 4벌이 되고 금액 계산이 화면마다 달라지는 버그가 생긴다.
- **API 클라이언트가 준비되어야 개별 기능 개발팀이 독립적으로 작업할 수 있다.** Route Handler와 데이터 훅이 확정되면 Phase 3의 목록 담당과 상세 담당이 서로를 기다리지 않는다.
- **UI 컴포넌트 라이브러리가 있어야 일관된 디자인이 유지된다.** 상태 배지, 금액 표기, 빈 상태, 오류 상태를 한 곳에서 정의해야 목록과 상세, PDF의 표현이 어긋나지 않는다.
- **상태 관리, 데이터 페칭, 에러 처리 같은 공통 로직이 먼저 안정화되어야 버그가 줄어든다.** Notion API의 요청 제한(평균 초당 3회)과 일시 장애는 모든 기능에 영향을 주므로, 재시도와 캐싱을 공통 계층에서 한 번 해결해야 한다.

#### 병렬 트랙

| 트랙 | Task |
|------|------|
| 백엔드 | 006 → 007 → 008 → 012 |
| 프론트엔드 | 009, 010 |
| 공통 | 011 (006과 동시 착수 가능) |

---

- **Task 006: Notion API 클라이언트 및 Repository 구현** - 우선순위
  - **기능**: F001 기초 | **기간**: 1.5일 | **의존성**: Task 003, 004
  - `@notionhq/client` 설치, `lib/notion/client.ts` 싱글턴 (서버 전용)
  - `lib/repositories/notion-quote-repository.ts`
    - `queryQuotes({ ownerEmail, cursor })`: 데이터베이스 쿼리, `has_more`/`next_cursor` 기반 전체 페이지 수집
    - `getQuotePage(pageId)`: 단건 페이지 + 항목(relation 또는 블록) 조회
  - 요청 타임아웃(10초) 및 `NOTION_FAULT_INJECTION` 개발용 오류 주입 훅
  - Notion 오류를 `ApiErrorCode`로 변환 (401 → `NOTION_UNAVAILABLE`, 404 → `NOT_FOUND`, 429 → `RATE_LIMITED`)

  ##### 테스트 체크리스트

  | 시나리오 | 입력/조건 | 기대 결과 | Playwright MCP 검증 |
  |---------|-----------|-----------|---------------------|
  | **정상** | 견적서 5건이 있는 테스트 DB 조회 | 5건 원본 데이터 반환, 2초 이내 | 임시 진단 Route(`/api/_dev/notion-ping`, 개발 모드 전용)에 `browser_navigate`, `browser_network_requests`로 응답 시간 확인 |
  | **오류** | 잘못된 `NOTION_TOKEN` | `NOTION_UNAVAILABLE` 오류 객체, 토큰 값은 로그에 미노출 | 응답 JSON과 `browser_console_messages`에서 토큰 문자열 부재 확인 |
  | **오류** | 존재하지 않는 페이지 ID | `NOT_FOUND` | 응답 코드 404 확인 |
  | **엣지** | 견적서 0건 DB | 빈 배열, 오류 아님 | 응답 `data: []` 확인 |
  | **엣지** | 견적서 150건(페이지네이션 2회) | 150건 모두 수집 | 반환 건수 확인, 서버 로그의 Notion 호출 2회 확인 |
  | **권한** | Integration이 공유되지 않은 데이터베이스 ID | `FORBIDDEN`/`NOT_FOUND` 오류, 앱은 죽지 않음 | 응답 코드와 콘솔 오류 확인 |

- **Task 007: 데이터 변환 유틸리티 및 Quote Service 구현**
  - **기능**: F001 | **기간**: 1.5일 | **의존성**: Task 006
  - `lib/mappers/notion-to-quote.ts`: Notion 속성 → `QuoteSummaryDto`/`QuoteDetailDto` 변환, Zod 스키마로 런타임 검증
  - 금액 계산 규칙: 항목 금액 = 수량 × 단가, 합계 = 항목 금액 합 (정수 원 단위, 부동소수 오차 방지)
  - 누락/비정상 속성 처리: 필수 필드(견적번호, 클라이언트명) 누락 시 해당 견적서를 목록에서 제외하고 경고 로그, 선택 필드는 `null`
  - 포맷 유틸: `formatKRW`, `formatDate`(Asia/Seoul), 상태 라벨
  - `lib/services/quote-service.ts`: `listQuotes(user)`, `getQuoteForOwner(user, id)`, `getQuoteByShareToken(token)` — 소유권 검사는 Service 계층에서 수행
  - Service 단위 검증용 Vitest 도입(변환/계산 함수 한정)

  ##### 테스트 체크리스트

  | 시나리오 | 입력/조건 | 기대 결과 | Playwright MCP 검증 |
  |---------|-----------|-----------|---------------------|
  | **정상** | 항목 3개(1×500,000 / 2×250,000 / 1×500,000) | 합계 1,500,000원, 상태 라벨 한국어 | `/api/quotes/{id}` 응답 JSON의 `total` 값 확인 |
  | **오류** | 상태 select 값이 정의되지 않은 값("보류") | 변환 실패 견적서는 제외, 경고 로그, 나머지는 정상 반환 | `browser_network_requests` 응답 건수와 서버 로그 확인 |
  | **엣지** | 수량 0, 단가 0, 항목 0개, 단가 999,999,999 | 합계 0 또는 정확한 대수 값, 오버플로 없음 | 테스트 견적서 상세 응답 값 확인 |
  | **엣지** | 클라이언트명 200자, 이모지/특수문자(`<script>`) 포함 | 문자열 그대로 보존, 렌더 시 이스케이프 | 응답 원문 확인 후 화면에서 스크립트 미실행 확인 |
  | **권한** | 사용자 A가 사용자 B 소유 견적서 ID로 `getQuoteForOwner` 호출 | `FORBIDDEN`(외부 응답은 정보 노출 방지를 위해 404) | 계정 A 세션으로 B의 `/api/quotes/{id}` 요청, 404 확인 |

- **Task 008: 견적서 API Route Handler 및 Supabase 동기화 구현**
  - **기능**: F001 | **기간**: 1.5일 | **의존성**: Task 007
  - Supabase 마이그레이션 적용 (Task 004 설계), `lib/repositories/supabase-quote-repository.ts`
  - 목록 조회 시 Notion 결과를 `quotes` 테이블에 upsert (notion_page_id 기준, 트랜잭션 처리 — 실패 시 부분 반영 없음)
  - Route Handler(Controller): `GET /api/quotes`, `GET /api/quotes/[id]`, `GET /api/share/[token]` — 모두 `ApiResponse<T>` 형식
  - 공통 `handleApiError(e)`로 HTTP 상태 매핑 (401/403→404/404/429/503/500)
  - `Cache-Control: private, no-store`(작성자 API), 공유 API는 Task 012의 캐시 정책 적용

  ##### 테스트 체크리스트

  | 시나리오 | 입력/조건 | 기대 결과 | Playwright MCP 검증 |
  |---------|-----------|-----------|---------------------|
  | **정상** | 로그인 후 `GET /api/quotes` | `{ ok: true, data: QuoteSummaryDto[] }`, Supabase에 upsert 반영 | `browser_navigate`로 API 접근, 응답 구조 확인, Supabase 대시보드 행 수 확인 |
  | **오류** | `NOTION_FAULT_INJECTION=500` | 503 + `NOTION_UNAVAILABLE`, Supabase 데이터 변경 없음 | `browser_network_requests` 상태 코드 확인 |
  | **오류** | `GET /api/quotes/{없는-uuid}` | 404 + `NOT_FOUND` | 응답 확인 |
  | **엣지** | 같은 요청 동시 5회 | upsert 중복 행 없음 (unique 제약) | `browser_evaluate`로 `Promise.all` fetch 5회 후 행 수 확인 |
  | **엣지** | `id`에 SQL/경로 특수문자(`..%2F`, `' OR 1=1`) | 400 `VALIDATION_FAILED` | 응답 코드 확인 |
  | **권한** | 비로그인 `GET /api/quotes` | 401 JSON (HTML 리다이렉트 아님) | 쿠키 없는 컨텍스트에서 응답 확인 |
  | **권한** | 비로그인 `GET /api/share/{유효-token}` | 200, 공유 가능 필드만 반환 (user_id, notion_page_id 미포함) | 응답 필드 목록 확인 |

- **Task 009: 공통 UI 컴포넌트 라이브러리 구축**
  - **기능**: UI 공통 | **기간**: 1.5일 | **의존성**: Task 005 (Phase 2 API와 병렬)
  - shadcn/ui(base-ui) 추가: `table`, `dialog`, `skeleton`, `sonner`(토스트), `tooltip`, `select`, `toggle-group`
  - 프로젝트 컴포넌트 (`components/common`, `components/quote`)
    - `QuoteStatusBadge` (상태별 색상, 다크모드 대응, 색상 외 텍스트 라벨 병기)
    - `MoneyText`, `DateText` (포맷 유틸 사용)
    - `EmptyState`, `ErrorState`(재시도 버튼), `TableSkeleton`, `DocumentSkeleton`
    - `ResponsiveTable` (데스크톱 테이블 / 모바일 카드 전환 프리미티브)
  - 개발 모드 전용 미리보기 페이지 `/_dev/components`에서 모든 상태(기본/비활성/로딩/긴 텍스트) 렌더링
  - **검증 기준**
    - `/_dev/components`를 375px, 1440px에서 `browser_take_screenshot`, 라이트/다크 모드 모두 확인
    - 키보드 Tab 이동 시 모든 인터랙티브 요소에 포커스 링 표시
    - 프로덕션 빌드에서 `/_dev/*` 접근 시 404

- **Task 010: 상태 관리 및 데이터 페칭 훅 구현**
  - **기능**: 공통 로직 | **기간**: 1일 | **의존성**: Task 003, 008
  - `zustand` 설치, `lib/stores/quote-list-store.ts`: UI 상태만 보관 (statusFilter, sort, 검색어) — 서버 데이터는 스토어에 복제하지 않음
  - 필터/정렬 상태와 URL 쿼리(`?status=sent&sort=issuedAt.desc`) 동기화 유틸
  - `lib/hooks/use-fetch.ts`: `AbortController` 기반, 로딩/오류/데이터 상태, 언마운트 시 요청 취소, `ApiResponse` 해석
  - `lib/hooks/use-quotes.ts`: 서버에서 받은 초기 데이터로 시작하고 `refresh()` 제공 (Task 021에서 사용)
  - `lib/hooks/use-clipboard.ts`: Clipboard API + 폴백 (Task 022에서 사용)

  ##### 테스트 체크리스트

  | 시나리오 | 입력/조건 | 기대 결과 | Playwright MCP 검증 |
  |---------|-----------|-----------|---------------------|
  | **정상** | 훅 테스트 페이지에서 `refresh()` 호출 | 로딩 → 데이터 갱신, API 1회 호출 | `/_dev/hooks`에서 `browser_click`, `browser_network_requests` 호출 수 확인 |
  | **오류** | API가 503 반환 | `error.code === "NOTION_UNAVAILABLE"`, 이전 데이터 유지 | 오류 주입 후 화면 상태 `browser_snapshot` |
  | **엣지** | 요청 중 페이지 이탈 / 연속 3회 호출 | 이전 요청 abort, 마지막 응답만 반영, 콘솔 경고 없음 | `browser_network_requests`에서 canceled 상태 확인, `browser_console_messages` 0건 |
  | **엣지** | URL에 잘못된 쿼리(`?status=unknown`) | 기본값(전체)으로 복원 | URL 진입 후 필터 상태 확인 |
  | **권한** | 세션 만료 상태에서 `refresh()` | 401 감지 시 `/login?next=` 이동 | 쿠키 삭제 후 `browser_click`, 최종 URL 확인 |

- **Task 011: API 에러 핸들링 및 재시도 로직 구현**
  - **기능**: 공통 로직 | **기간**: 1일 | **의존성**: Task 003 (Task 006과 병렬 착수, 008 전에 통합)
  - `lib/utils/retry.ts`: 지수 백오프 + 지터 (최대 3회, 기본 300ms → 600ms → 1200ms)
  - 재시도 정책: 429/5xx/네트워크 오류만 재시도, 429는 `Retry-After` 헤더 존중, 4xx(401/403/404/400)는 재시도 금지
  - Notion 요청 직렬화 큐: 동시 요청 수 제한으로 초당 3회 평균 준수
  - 오류 메시지 사전: `ApiErrorCode` → 사용자 친화 한국어 문구 (`lib/utils/error-messages.ts`)
  - 서버 로그 구조화 (`level`, `code`, `route`, `durationMs`), 민감 정보(토큰, 이메일) 마스킹

  ##### 테스트 체크리스트

  | 시나리오 | 입력/조건 | 기대 결과 | Playwright MCP 검증 |
  |---------|-----------|-----------|---------------------|
  | **정상** | 첫 시도 500, 두 번째 성공(`NOTION_FAULT_INJECTION=500:once`) | 사용자는 정상 데이터 수신 | `/quotes` 응답 성공, 서버 로그에 재시도 1회 |
  | **오류** | 계속 500 | 3회 재시도 후 503 + 한국어 안내 문구 | `browser_snapshot`으로 `ErrorState` 문구 확인 |
  | **엣지** | 429 + `Retry-After: 2` | 2초 이상 대기 후 재시도 | 서버 로그 타임스탬프 간격 확인 |
  | **엣지** | 동시 10건 상세 요청 | Notion 호출이 큐로 분산, 429 미발생 | 서버 로그의 호출 간격 확인 |
  | **권한** | 401/403 응답 | 재시도 없이 즉시 실패, 작성자 API는 로그인 이동 | 서버 로그 재시도 0회, 최종 URL 확인 |

- **Task 012: 캐싱 전략 수립 및 적용**
  - **기능**: 공통 로직 | **기간**: 1일 | **의존성**: Task 008, 011
  - Next.js 16 캐시 API 적용: Service 조회 함수에 캐시 태그 부여 (`quotes:{userId}`, `quote:{id}`)
  - 목록: 사용자별 짧은 캐시(60초), 상세/공유: 300초, 갱신은 태그 무효화로 처리
  - 새로고침(F010)용 Server Action에서 `updateTag`로 즉시 무효화하는 계약 정의 (구현은 Task 021)
  - 사용자 간 캐시 혼입 방지: 캐시 키에 반드시 userId 포함, 공유 캐시는 share_token 기준
  - 캐시 정책 문서화 (`docs/caching.md`)

  ##### 테스트 체크리스트

  | 시나리오 | 입력/조건 | 기대 결과 | Playwright MCP 검증 |
  |---------|-----------|-----------|---------------------|
  | **정상** | `/quotes` 60초 내 2회 접근 | 두 번째는 Notion 미호출, 응답 시간 단축 | 서버 로그 Notion 호출 수, `browser_network_requests` 응답 시간 비교 |
  | **오류** | 캐시 만료 후 Notion 장애 | 오류 상태 표시 (만료된 데이터를 최신처럼 표시하지 않음) | 오류 주입 후 `browser_snapshot` |
  | **엣지** | 캐시 태그 무효화 직후 접근 | 최신 데이터 반영 | 노션에서 값 수정 → 무효화 → 화면 값 확인 |
  | **권한** | 사용자 A 접근 직후 사용자 B 접근 | B에게 A의 목록이 절대 보이지 않음 | 두 브라우저 컨텍스트(`browser_tabs`)로 교차 확인 |

---

### Phase 3: 핵심 기능 (8-10일)

**기간**: 2026-10-23 ~ 2026-11-05 | **완료 조건**: 작성자가 로그인 → 목록 → 상세로 이동하며 실제 Notion 데이터를 모든 화면 크기에서 확인할 수 있고, 통합 테스트(Task 018)가 통과한다.

#### 왜 이 순서인가?

- **Phase 2의 공통 모듈을 활용하면 개발 속도가 빨라진다.** 데이터 경로, 상태 배지, 금액 표기, 오류 상태가 이미 있으므로 이 Phase의 Task는 "조립"에 집중하며, 새 로직을 만드는 일이 거의 없다.
- **견적서 목록과 상세가 가장 핵심 기능이다.** PRD의 사용자 여정은 작성자와 클라이언트 모두 "상세 화면"을 종착지로 하며, 목록은 작성자의 유일한 진입점이다. 사용자가 가장 자주 쓰는 두 화면이다.
- **이 두 페이지가 동작해야 다른 기능도 의미가 있다.** 필터와 새로고침은 목록 위에서, PDF와 공유 링크는 상세 위에서 동작한다. 기반 화면 없이 부가 기능을 만들면 테스트할 대상조차 없다.
- **반응형 디자인을 여기서 완성하면 Phase 4 기능도 자동으로 반응형이 된다.** 레이아웃 브레이크포인트와 모바일 카드형 항목 표시를 핵심 화면에서 확립하면, 이후 추가되는 필터 바, 액션 버튼은 같은 그리드 규칙을 따르기만 하면 된다. 특히 PDF(F003)는 상세 레이아웃을 그대로 출력하므로 상세 레이아웃이 먼저 확정되어야 한다.

#### 병렬 트랙

| 트랙 | Task |
|------|------|
| 목록 담당 | 013 → 014 |
| 상세 담당 | 015 |
| 공통 | 016, 017 (014·015 진행 중 병행) → 018 |

---

- **Task 013: 페이지 간 네비게이션 및 헤더 동작 완성** - 우선순위
  - **기능**: F004/F008 연결 | **기간**: 1일 | **의존성**: Task 005, 010
  - 헤더 골격에 실제 세션 상태 연결 (Server Component에서 사용자 조회)
  - 로고/견적서 목록/로그아웃 링크 동작, 현재 위치 강조(`aria-current="page"`)
  - 모바일 헤더: `sheet` 기반 메뉴
  - 상세 → 목록 복귀 시 필터/정렬 쿼리 유지

  ##### 테스트 체크리스트

  | 시나리오 | 입력/조건 | 기대 결과 | Playwright MCP 검증 |
  |---------|-----------|-----------|---------------------|
  | **정상** | 로그인 사용자가 로고 클릭 | `/quotes` 이동 | `browser_click` 후 URL 확인 |
  | **오류** | 사용자 프로필 조회 실패(`users` 행 없음) | 헤더는 이메일로 대체 표시, 페이지 정상 | `browser_snapshot` |
  | **엣지** | `/quotes?status=sent` → 상세 → 목록으로 | 필터 쿼리 유지 | URL 쿼리 확인 |
  | **권한** | 공유 페이지 헤더 | 로고만 표시, 목록/로그아웃 링크 없음, 로고 클릭해도 이동 없음 | `/share/{token}`에서 `browser_snapshot` |

- **Task 014: 견적서 목록 페이지 데이터 연동 (F004)**
  - **기능**: F004 | **기간**: 2일 | **의존성**: Task 009, 010, 012
  - `(app)/quotes/page.tsx`에서 목업 데이터 제거, `quoteService.listQuotes(user)` 서버 조회
  - 컬럼: 견적번호, 클라이언트명, 금액(`MoneyText`), 상태(`QuoteStatusBadge`), 발행일, 행 전체 클릭으로 상세 이동 (링크는 `<a>`로 유지하여 새 탭 열기 지원)
  - 기본 정렬: 발행일 내림차순
  - 상태별 UI: `loading.tsx`(TableSkeleton), 빈 목록(`EmptyState`: "노션 데이터베이스에 견적서를 추가하세요"), 조회 실패(`ErrorState` + 재시도)
  - PRD에 없는 "새 견적서" 버튼 제거 (MVP 범위 외: 편집 기능)

  ##### 테스트 체크리스트

  | 시나리오 | 입력/조건 | 기대 결과 | Playwright MCP 검증 |
  |---------|-----------|-----------|---------------------|
  | **정상** | 견적서 5건 보유 계정 로그인 | 5행 표시, 금액 `1,500,000원` 형식, 발행일 내림차순 | `browser_navigate('/quotes')`, `browser_snapshot`으로 행 수와 순서 확인 |
  | **정상** | 행 클릭 | `/quotes/{id}` 이동 | `browser_click` 후 URL 확인 |
  | **오류** | Notion 장애 주입 | `ErrorState`와 재시도 버튼, 콘솔에 처리되지 않은 오류 없음 | `browser_console_messages`, 재시도 `browser_click` 후 복구 확인 |
  | **엣지** | 견적서 0건 계정 | `EmptyState` 표시 | `browser_snapshot` |
  | **엣지** | 클라이언트명 200자, 금액 0원, 발행일 누락 | 말줄임 + `title` 툴팁, `0원`, `-` 표시, 레이아웃 깨짐 없음 | 375px/1440px 스크린샷 |
  | **엣지** | 견적서 150건 | 2초 이내 렌더링 | `browser_network_requests` 문서 응답 시간 |
  | **권한** | 계정 A, B 각각 로그인 | 각자 소유 견적서만 표시 | 두 컨텍스트에서 행 목록 비교 |
  | **권한** | 비로그인 `/quotes` | `/login?next=/quotes` | 리다이렉트 확인 |

- **Task 015: 견적서 상세 페이지 데이터 연동 (F002)**
  - **기능**: F002 | **기간**: 2.5일 | **의존성**: Task 009, 012
  - `QuoteDocument`(Server Component) 섹션 구성: 문서 헤더(견적번호, 발행일, 유효기간, 상태), 발행자 정보, 클라이언트 정보, 항목 테이블, 합계, 조건
  - 작성자 상세(`/quotes/[id]`)와 공유 상세(`/share/[token]`)가 **같은 `QuoteDocument`를 재사용**, 액션 영역만 다르게 주입 (작성자: 목록 이동, PDF, 공유 / 클라이언트: PDF)
  - 인쇄/PDF 대비 시맨틱 구조와 `@media print` 기본 스타일 (`styles/print.css`)
  - 존재하지 않는 견적서·조회 실패: 상세 내 오류 안내 + "견적서 목록으로" 버튼 (PRD 분기 조건)
  - `generateMetadata`로 문서 제목 설정 (공유 페이지는 클라이언트명 노출 최소화)

  ##### 테스트 체크리스트

  | 시나리오 | 입력/조건 | 기대 결과 | Playwright MCP 검증 |
  |---------|-----------|-----------|---------------------|
  | **정상** | 본인 견적서 `/quotes/{id}` | 6개 섹션 모두 표시, 합계가 항목 합과 일치 | `browser_snapshot`으로 섹션과 합계 값 확인 |
  | **오류** | 존재하지 않는 id | 오류 안내 + 목록 이동 버튼, 버튼 클릭 시 `/quotes` | `browser_click` 후 URL 확인 |
  | **오류** | 상세 조회 중 Notion 타임아웃 | 오류 안내, 콘솔에 미처리 예외 없음 | `browser_console_messages` |
  | **엣지** | 항목 0개 / 항목 50개 / 조건 텍스트 2,000자 / 특수문자 | 빈 항목 안내, 긴 표 정상 렌더, 줄바꿈 보존, XSS 없음 | 스크린샷과 `browser_evaluate`로 스크립트 미실행 확인 |
  | **권한** | 계정 B가 A의 `/quotes/{id}` 접근 | 404 화면 (존재 여부 비노출) | B 컨텍스트에서 확인 |
  | **권한** | 비로그인 `/share/{token}` | 로그인 없이 동일 문서 표시, 목록 이동 버튼 없음 | 비로그인 컨텍스트 `browser_snapshot` |

- **Task 016: 반응형 레이아웃 완성 (F006)**
  - **기능**: F006 | **기간**: 1.5일 | **의존성**: Task 014, 015
  - 브레이크포인트: 모바일 `< 768px`, 태블릿 `768-1023px`, 데스크톱 `>= 1024px` (Tailwind `md`, `lg`)
  - 목록: 모바일은 카드 리스트, 태블릿 이상은 테이블
  - 상세: 모바일은 항목 테이블을 카드형(항목명 / 수량 × 단가 / 금액)으로, 정보 그리드는 1열로 전환
  - 터치 타깃 최소 44×44px, 가로 스크롤 금지, 본문 최소 16px
  - **검증 기준** (UI Task — 4분류는 Task 018 통합 테스트에서 화면 크기별로 재검증)
    - `browser_resize`로 320 / 375 / 768 / 1024 / 1440 / 2560px 각각 스크린샷, 가로 스크롤 0 (`browser_evaluate`: `document.documentElement.scrollWidth <= innerWidth`)
    - 모바일에서 항목 카드형 표시, 데스크톱에서 테이블 표시 확인

- **Task 017: 로딩/에러 상태 정교화 및 접근성 준수**
  - **기능**: 품질 | **기간**: 1일 | **의존성**: Task 014, 015
  - 스켈레톤 크기를 실제 레이아웃과 일치시켜 레이아웃 이동(CLS) 최소화
  - 시맨틱 마크업: 테이블 `<caption>`, `scope`, 상태 배지에 텍스트 라벨, 금액에 `aria-label`
  - 키보드 네비게이션: 목록 행 Enter로 상세 이동, 포커스 순서 검증, 스킵 링크
  - 오류/완료 알림에 `role="status"`/`aria-live`
  - WCAG 2.1 AA 대비율(라이트/다크 모두)
  - **검증 기준**
    - `browser_press_key`(Tab/Enter)만으로 로그인 → 목록 → 상세 → 목록 복귀 완료
    - `browser_snapshot` 접근성 트리에서 모든 버튼/링크에 이름 존재
    - axe 검사(`browser_evaluate`로 axe-core 주입) 심각(critical) 위반 0건

- **Task 018: 핵심 기능 통합 테스트**
  - **기능**: F001, F002, F004, F006, F007, F008 통합 | **기간**: 1.5일 | **의존성**: Task 013-017
  - Playwright MCP로 PRD 사용자 여정 전체 E2E 실행 및 결과를 `tasks/018-core-integration-test.md`에 기록
  - 테스트 데이터 셋업: 테스트 Notion DB(정상 5건, 이상치 3건), 테스트 계정 A/B
  - 실패 항목은 원 Task로 되돌려 수정 후 재테스트 (원 Task는 `⚠️ 테스트 미통과`로 전환)

  ##### 테스트 체크리스트

  | 시나리오 | 플로우 | 기대 결과 | Playwright MCP 검증 |
  |---------|--------|-----------|---------------------|
  | **정상** | 회원가입 → 로그인 → 목록 → 상세 → 목록 → 로그아웃 | 모든 단계 성공, 콘솔 오류 0건 | 단계별 `browser_snapshot`, 종료 시 `browser_console_messages` |
  | **정상** | 같은 플로우를 375px에서 반복 | 모바일 레이아웃으로 동일하게 성공 | `browser_resize(375, 812)` 후 반복 |
  | **오류** | 목록 진입 중 Notion 장애 → 복구 → 재시도 | 오류 안내 후 재시도로 복구 | 오류 주입 토글 후 `browser_click` |
  | **오류** | 오프라인 상태에서 상세 이동 | `error.tsx` 또는 오류 안내, 앱 크래시 없음 | `browser_evaluate`로 네트워크 차단 시뮬레이션 |
  | **엣지** | 이상치 견적서(필드 누락, 긴 문자열, 0원) 열람 | 모든 화면 크기에서 깨짐 없음 | 3개 뷰포트 스크린샷 |
  | **권한** | 비로그인 → `/quotes/{id}` 직접 접근 → 로그인 → 원래 상세로 복귀 | `next` 파라미터로 복귀 | 최종 URL 확인 |
  | **권한** | 계정 B로 A의 견적서 상세/API 직접 접근 | 화면 404, API 404 | 페이지와 API 각각 확인 |

---

### Phase 4: 추가 기능 (5-6일)

**기간**: 2026-11-06 ~ 2026-11-13 | **완료 조건**: F003, F005, F009, F010 및 정렬이 구현되어 각 4가지 시나리오를 통과하고, MVP 기능(F001-F010) 전체가 동작한다.

#### 왜 이 순서인가?

- **Phase 3에서 핵심 기능이 동작하므로 추가 기능은 독립적으로 개발할 수 있다.** 각 기능은 완성된 화면에 "끼워 넣는" 형태라 서로 의존하지 않으며, 일정이 부족하면 개별 기능 단위로 범위를 조정해도 핵심 가치가 훼손되지 않는다.
- **필터, 정렬, 검색은 목록에서만 필요하므로 목록 완성 후 추가할 수 있다.** Phase 2에서 만든 URL 동기화 스토어와 Phase 3의 목록 위에 얹기만 하면 된다.
- **PDF 다운로드와 공유는 상세 페이지가 완성되면 추가할 수 있다.** 특히 PDF는 "웹 뷰어와 동일한 형식"이 요구사항이므로, 상세 레이아웃과 인쇄 스타일이 확정된 뒤에 만들어야 재작업이 없다. 공유 링크 역시 Phase 1에서 확보한 `/share/[token]` 공개 라우트와 Phase 3의 재사용 문서 컴포넌트 위에서 동작한다.
- **우선순위가 낮은 기능을 나중에 추가해도 사용자 만족도는 높다.** 사용자는 먼저 "견적서가 제대로 보이는가"를 판단하며, 부가 기능은 그 신뢰 위에서 편의를 더한다. 단, PDF(F003)는 PRD의 MVP 핵심 기능이므로 이 Phase에서 가장 큰 기간을 배정하고 리스크를 선제 검증한다.

#### 병렬 트랙

| 트랙 | Task |
|------|------|
| 목록 담당 | 019 → 020 → 021, 024(선택) |
| 상세 담당 | 022 |
| 백엔드 | 023 (Phase 4 시작일에 기술 검증 스파이크 우선 수행) |

---

- **Task 019: 상태 필터 구현 (F005)**
  - **기능**: F005 | **기간**: 0.5일 | **의존성**: Task 014
  - `QuoteStatusFilter`: 전체 / 작성중 / 발송됨 / 승인됨 / 거절됨 (`toggle-group`, 모바일은 `select`)
  - 상태별 건수 표시, URL 쿼리와 동기화(`?status=`), 뒤로가기 시 상태 복원
  - 필터는 이미 받은 목록에서 클라이언트 측 적용 (추가 Notion 호출 없음)

  ##### 테스트 체크리스트

  | 시나리오 | 입력/조건 | 기대 결과 | Playwright MCP 검증 |
  |---------|-----------|-----------|---------------------|
  | **정상** | "발송됨" 선택 | 발송됨 견적서만 표시, URL `?status=sent` | `browser_click` 후 행 상태 배지와 URL 확인 |
  | **오류** | `?status=invalid`로 직접 진입 | 전체로 폴백, 오류 없음 | `browser_navigate` 후 `browser_snapshot` |
  | **엣지** | 일치 0건 상태 선택 | "해당 상태의 견적서가 없습니다" + 필터 초기화 버튼 | `browser_snapshot` |
  | **엣지** | 필터 변경 후 브라우저 뒤로가기 | 직전 필터 상태 복원 | `browser_navigate_back` |
  | **권한** | 비로그인으로 `/quotes?status=sent` | 로그인 후 필터 유지된 목록으로 복귀 | 리다이렉트 체인 확인 |

- **Task 020: 목록 정렬 구현**
  - **기능**: F004 보완 | **기간**: 0.5일 | **의존성**: Task 019
  - 정렬 옵션: 발행일(최신/오래된), 금액(높은/낮은), 클라이언트명(가나다)
  - 테이블 헤더 클릭 정렬(`aria-sort`), 모바일은 정렬 `select`
  - 안정 정렬: 동일 값은 견적번호로 2차 정렬, 값 누락 항목은 항상 마지막
  - 필터와 정렬 조합, URL 쿼리(`?sort=amount.desc`) 동기화

  ##### 테스트 체크리스트

  | 시나리오 | 입력/조건 | 기대 결과 | Playwright MCP 검증 |
  |---------|-----------|-----------|---------------------|
  | **정상** | 금액 높은순 | 첫 행이 최대 금액 | `browser_click` 후 행 순서 확인 |
  | **오류** | `?sort=foo.bar` 진입 | 기본 정렬(발행일 최신)로 폴백 | `browser_snapshot` |
  | **엣지** | 동일 발행일 3건, 발행일 누락 1건 | 견적번호 순 2차 정렬, 누락 건 마지막 | 행 순서 확인 |
  | **엣지** | "승인됨" 필터 + 금액 낮은순 | 필터 결과 내에서만 정렬 | 행 상태와 순서 확인 |
  | **권한** | 계정 전환 후 정렬 상태 | 이전 사용자 정렬 상태가 남지 않음(URL 기준) | 로그아웃 → 다른 계정 로그인 후 확인 |

- **Task 021: 목록 새로고침 구현 (F010)**
  - **기능**: F010 | **기간**: 0.5일 | **의존성**: Task 012, 014
  - 새로고침 버튼 → Server Action `refreshQuotes()`에서 `updateTag("quotes:{userId}")` 후 목록 재조회
  - 진행 중 버튼 비활성화 + 회전 아이콘, 완료/실패 토스트, 마지막 동기화 시각 표시
  - 연속 클릭 방지(진행 중 무시) 및 최소 간격(5초) 제한으로 Notion 요청 제한 보호

  ##### 테스트 체크리스트

  | 시나리오 | 입력/조건 | 기대 결과 | Playwright MCP 검증 |
  |---------|-----------|-----------|---------------------|
  | **정상** | 노션에서 상태를 "승인됨"으로 수정 후 새로고침 | 캐시 무효화, 변경된 상태 즉시 반영, 완료 토스트 | `browser_click` 후 배지 값 확인, `browser_network_requests`에서 Server Action 1회 |
  | **오류** | 새로고침 중 Notion 장애 | 실패 토스트, 기존 목록 유지 | `browser_snapshot` |
  | **엣지** | 1초 내 5회 연속 클릭 | 요청 1회만 발생 | `browser_network_requests` 호출 수 |
  | **엣지** | 노션에서 견적서 삭제 후 새로고침 | 목록에서 제거, 해당 상세는 404 | 행 수와 상세 접근 결과 확인 |
  | **권한** | 세션 만료 후 새로고침 | `/login?next=/quotes` 이동 | 쿠키 삭제 후 `browser_click` |

- **Task 022: 공유 링크 생성 및 복사 구현 (F009)**
  - **기능**: F009 | **기간**: 1일 | **의존성**: Task 008, 015
  - Server Action `createShareLink(quoteId)`: 소유권 검사 후 `crypto.randomBytes(32)` 기반 URL-safe 토큰 발급, 이미 있으면 재사용 (멱등)
  - 링크 형식: `{APP_URL}/share/{token}` — 내부 id/notion_page_id 비노출
  - `useClipboard`로 복사, 성공 토스트 "공유 링크가 복사되었습니다", 실패 시 링크를 선택 가능한 입력창으로 표시(수동 복사 폴백)
  - 공유 페이지: `noindex` 메타, 읽기 전용, PDF 다운로드만 노출
  - `share_enabled=false` 또는 토큰 불일치 시 404

  ##### 테스트 체크리스트

  | 시나리오 | 입력/조건 | 기대 결과 | Playwright MCP 검증 |
  |---------|-----------|-----------|---------------------|
  | **정상** | 상세에서 "공유 링크 복사" 클릭 | 클립보드에 `/share/{token}` 저장, 토스트 표시 | `browser_click` 후 `browser_evaluate('navigator.clipboard.readText()')` |
  | **정상** | 복사한 링크를 비로그인 컨텍스트에서 열기 | 로그인 없이 견적서 표시 | 새 컨텍스트 `browser_navigate` |
  | **오류** | 클립보드 권한 거부 | 수동 복사용 입력창 표시, 오류 토스트 | 권한 거부 상태에서 `browser_click`, `browser_snapshot` |
  | **오류** | 토큰 생성 중 Supabase 오류 | 실패 토스트, 잘못된 링크 미복사 | 오류 주입 후 확인 |
  | **엣지** | 같은 견적서에서 3회 복사 | 3회 모두 동일 토큰 | 클립보드 값 비교 |
  | **엣지** | 토큰 1글자 변경, 빈 토큰, 매우 긴 토큰 | 모두 404, 응답 시간 차이로 존재 여부 추론 불가 | `browser_network_requests` 상태 코드 |
  | **권한** | 계정 B가 A의 견적서로 `createShareLink` 호출 | 거부(404), 토큰 미발급 | `browser_evaluate`로 Action 직접 호출 시도 |
  | **권한** | 공유 페이지에서 목록/다른 견적서 이동 시도 | 내비게이션 없음, `/quotes` 직접 접근 시 로그인 요구 | `browser_snapshot`, `browser_navigate` |

- **Task 023: PDF 다운로드 구현 (F003)**
  - **기능**: F003 | **기간**: 2.5일 | **의존성**: Task 015, 022
  - **기술 검증 스파이크(0.5일, Phase 4 첫날)**: PRD 요구("웹 뷰어와 동일 레이아웃, 서버 사이드")에 따라 헤드리스 Chromium(`puppeteer-core` + `@sparticuz/chromium`)으로 인쇄 전용 라우트를 렌더링하는 방식을 1순위로 검증. Vercel 함수 크기/실행 시간 제한을 넘으면 `@react-pdf/renderer` 별도 템플릿으로 전환하고 결정을 작업 파일에 기록
  - 인쇄 전용 라우트 `/share/[token]/print` (헤더/버튼 제외, A4 레이아웃, `@media print`)
  - `GET /api/quotes/[id]/pdf`(작성자), `GET /api/share/[token]/pdf`(클라이언트) → `Content-Type: application/pdf`, `Content-Disposition: attachment; filename="견적서_{견적번호}_{발행일}.pdf"`(RFC 5987 인코딩)
  - 한글 폰트(Pretendard 또는 Noto Sans KR) 임베딩, 긴 항목 표의 페이지 나누기(`break-inside: avoid`, 표 헤더 반복)
  - 버튼: 생성 중 비활성화 + "PDF 생성 중...", 실패 시 재시도 토스트

  ##### 테스트 체크리스트

  | 시나리오 | 입력/조건 | 기대 결과 | Playwright MCP 검증 |
  |---------|-----------|-----------|---------------------|
  | **정상** | 작성자 상세에서 "PDF 다운로드" | 5초 이내 PDF 다운로드, 파일명 규칙 준수, 내용이 웹 뷰어와 동일 | `browser_click`, `browser_network_requests`에서 200 + `application/pdf` + 파일명 헤더 확인, PDF를 열어 스크린샷 비교 |
  | **정상** | 공유 페이지에서 비로그인 다운로드 | 동일 PDF 수신 | 비로그인 컨텍스트에서 동일 검증 |
  | **오류** | PDF 생성 중 렌더러 오류/타임아웃 | 500 대신 503 + 한국어 안내, 버튼 재활성화 | 오류 주입 후 토스트와 버튼 상태 `browser_snapshot` |
  | **오류** | 존재하지 않는 견적서 PDF 요청 | 404 JSON | API 직접 `browser_navigate` |
  | **엣지** | 항목 50개(3페이지 이상), 한글/특수문자/긴 조건 문구 | 페이지 나누기 정상, 표 헤더 반복, 글자 깨짐 없음 | 생성된 PDF 페이지별 스크린샷 |
  | **엣지** | 버튼 연속 3회 클릭 | 요청 1회 | `browser_network_requests` 호출 수 |
  | **권한** | 비로그인으로 `/api/quotes/{id}/pdf` | 401 | 쿠키 없는 컨텍스트 |
  | **권한** | 계정 B로 A의 `/api/quotes/{id}/pdf` | 404 | B 컨텍스트 |

- **Task 024: 목록 검색 구현 (선택)**
  - **기능**: 옵션 (PRD 범위 외, 일정 여유 시) | **기간**: 0.5일 | **의존성**: Task 019
  - 견적번호/클라이언트명 부분 일치 검색, 300ms 디바운스, URL `?q=` 동기화
  - 필터·정렬과 조합, 결과 0건 시 빈 상태

  ##### 테스트 체크리스트

  | 시나리오 | 입력/조건 | 기대 결과 | Playwright MCP 검증 |
  |---------|-----------|-----------|---------------------|
  | **정상** | "Q-00" 입력 | 견적번호 일치 행만 표시 | `browser_type` 후 행 확인 |
  | **오류** | 정규식 특수문자(`(`, `*`) 입력 | 예외 없이 리터럴 검색 | `browser_console_messages` 0건 |
  | **엣지** | 공백만 입력 / 100자 입력 / 대소문자 혼합 | 전체 목록 / 0건 안내 / 대소문자 무시 | 각 입력 후 `browser_snapshot` |
  | **권한** | 타인 견적번호 검색 | 결과 0건 (타인 데이터 비노출) | 계정 B에서 A의 번호 검색 |

---

### Phase 5: 최적화 및 배포 (4-5일)

**기간**: 2026-11-16 ~ 2026-11-20 | **완료 조건**: Vercel 프로덕션에서 전체 사용자 여정 E2E가 4가지 시나리오로 통과하고, 성능/보안 기준을 충족하며, 오류 추적과 CI가 동작한다.

#### 왜 이 순서인가?

- **모든 기능이 완성되어야 성능 최적화가 의미 있다.** 번들 크기, 렌더링 비용, 캐시 적중률은 기능 전체가 모였을 때 비로소 측정 가능하다. 특히 PDF 렌더러와 Notion 호출 패턴은 개별 기능 단계에서는 실제 병목을 알 수 없다.
- **프로덕션 배포 전에 보안, 성능, 모니터링 준비가 필수다.** 공유 링크는 인터넷에 노출되는 공개 URL이며, Notion 토큰과 Supabase 서비스 키는 유출 시 전체 데이터가 노출된다. 배포 전에 헤더, 키 관리, 레이트 리밋을 점검해야 한다.
- **사용자 피드백을 받으려면 배포가 필요하다.** 실제 프리랜서와 클라이언트가 링크를 주고받아야 MVP 가설(노션 견적서를 보기 좋게 전달)을 검증할 수 있다.
- **배포 후 실제 성능 데이터를 기반으로 최적화를 진행한다.** Vercel Analytics와 오류 추적으로 수집한 실측치를 기준으로 다음 개선 우선순위를 정한다. 이 Phase의 최적화는 "출시 기준 충족"까지이며, 그 이상의 튜닝은 실측 데이터 이후로 미룬다.

#### 병렬 트랙

| 트랙 | Task |
|------|------|
| 프론트엔드 | 025, 027 |
| 백엔드/보안 | 026 |
| DevOps | 028 → 029 → 030 |

---

- **Task 025: 성능 최적화 (번들, 렌더링)** - 우선순위
  - **기능**: 성능 | **기간**: 1일 | **의존성**: Phase 4 완료
  - `next build` 번들 분석, `"use client"` 경계 최소화 (상세 문서는 Server Component 유지)
  - PDF 렌더러와 Notion SDK가 클라이언트 번들에 포함되지 않음을 확인
  - 폰트 `next/font` 서브셋, 이미지 `next/image`, 동적 import(토스트, 다이얼로그)
  - 목록 150건 이상 시 렌더 비용 측정, 필요 시 가상화
  - **목표**: 목록 LCP < 2.0초, 상세 LCP < 1.5초, CLS < 0.1, 초기 JS < 150KB(gzip), PDF 생성 < 5초
  - **검증 기준**
    - Lighthouse 모바일 성능 90+ (목록, 상세, 공유)
    - `browser_network_requests`로 JS 전송량 측정, 개선 전후 수치를 작업 파일에 기록

- **Task 026: 보안 검토 및 강화**
  - **기능**: 보안 | **기간**: 1일 | **의존성**: Phase 4 완료
  - 보안 헤더(`next.config.ts` headers): CSP(nonce 기반), `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`(공유 토큰 유출 방지), `Permissions-Policy`
  - CORS: API Route는 동일 출처만 허용, 외부 출처 요청 거부
  - 비밀 키 관리 점검: `NOTION_TOKEN`, `SUPABASE_SERVICE_ROLE_KEY` 서버 전용, `.env*` 커밋 여부 검사
  - Supabase RLS 정책 재검증, 공유 RPC가 공유 필드만 반환하는지 확인
  - 공개 엔드포인트(`/api/share/*`, PDF) 레이트 리밋 (IP 기준)
  - Server Action 출처 검증, 로그인 `next` 파라미터 오픈 리다이렉트 재점검

  ##### 테스트 체크리스트

  | 시나리오 | 입력/조건 | 기대 결과 | Playwright MCP 검증 |
  |---------|-----------|-----------|---------------------|
  | **정상** | 모든 페이지 접근 | 보안 헤더 존재, CSP 위반 콘솔 오류 0건 | `browser_network_requests` 응답 헤더, `browser_console_messages` |
  | **오류** | 외부 출처에서 `/api/quotes` fetch | CORS 차단 | 다른 출처 페이지에서 `browser_evaluate` fetch |
  | **엣지** | 공유 PDF 엔드포인트 1분 내 30회 요청 | 한도 초과 시 429 + 안내 | `browser_evaluate` 반복 요청 후 상태 코드 |
  | **엣지** | 프로덕션 번들 전체에서 비밀 키 문자열 검색 | 0건 | 빌드 산출물 grep 결과 기록 |
  | **권한** | anon 키로 Supabase `quotes` 테이블 직접 조회 | RLS로 0행 | `browser_evaluate`로 supabase-js 직접 쿼리 |
  | **권한** | 공유 페이지를 외부 사이트 iframe에 삽입 | 차단 | iframe 테스트 페이지에서 확인 |

- **Task 027: SEO 및 메타데이터 최적화**
  - **기능**: SEO | **기간**: 0.5일 | **의존성**: Task 025
  - 전역 메타데이터(서비스명, 설명), 파비콘, Open Graph 기본 이미지
  - 공유 페이지: `noindex, nofollow`, OG 제목은 "견적서" 수준으로 일반화(클라이언트명, 금액 비노출)
  - `robots.ts`: `/quotes`, `/share`, `/api` 크롤링 차단, `sitemap.ts`는 공개 랜딩만
  - **검증 기준**
    - `browser_evaluate`로 각 페이지 `<meta>` 수집, 공유 페이지에 민감 정보 미포함 확인
    - `/robots.txt` 내용 확인

- **Task 028: 모니터링 및 에러 추적 구성**
  - **기능**: 운영 | **기간**: 0.5일 | **의존성**: Task 011
  - Sentry(`@sentry/nextjs`) 서버/클라이언트 연동, 소스맵 업로드, PII 스크러빙(이메일, 토큰, 공유 URL)
  - Vercel Analytics / Speed Insights 활성화
  - 알림 규칙: Notion 오류율 5% 초과, PDF 실패 연속 3회
  - 구조화 로그에 요청 ID 부여

  ##### 테스트 체크리스트

  | 시나리오 | 입력/조건 | 기대 결과 | Playwright MCP 검증 |
  |---------|-----------|-----------|---------------------|
  | **정상** | 프리뷰 배포에서 의도적 오류 발생 | Sentry에 이벤트 1건, 소스맵으로 원본 위치 표시 | 테스트 버튼 `browser_click` 후 Sentry 대시보드 확인 |
  | **오류** | Sentry DSN 누락 | 앱은 정상 동작, 경고 로그만 | 페이지 정상 렌더 확인 |
  | **엣지** | 동일 오류 100회 | 이벤트 그룹핑 1건, 샘플링 동작 | 대시보드 확인 |
  | **권한** | 공유 페이지에서 오류 발생 | 이벤트에 토큰/이메일 미포함 | 이벤트 페이로드 확인 |

- **Task 029: CI/CD 파이프라인 구축**
  - **기능**: DevOps | **기간**: 0.5일 | **의존성**: Task 025
  - GitHub Actions: PR마다 `lint` → `typecheck` → `build` → Vitest(변환/계산 유틸)
  - Playwright 회귀 스위트: Task 018 시나리오를 `@playwright/test` 스크립트로 이식하여 프리뷰 배포 URL 대상 실행 (MCP 수동 검증과 병행)
  - Vercel 프리뷰 배포 자동화, `main` 머지 시 프로덕션 배포
  - 환경 분리: Preview는 테스트 Notion DB/Supabase 프로젝트, Production은 실서비스
  - **검증 기준**
    - 의도적으로 타입 오류를 넣은 PR에서 파이프라인 실패 확인
    - 정상 PR에서 전체 단계 통과 및 프리뷰 URL 코멘트 생성

- **Task 030: 프로덕션 배포 및 최종 E2E 검증**
  - **기능**: 배포 | **기간**: 1일 | **의존성**: Task 025-029
  - Vercel 프로덕션 환경 변수 설정, Supabase 프로덕션 마이그레이션 적용, Notion Integration 프로덕션 DB 공유
  - Supabase Auth 리다이렉트 URL과 이메일 템플릿을 프로덕션 도메인으로 설정
  - 프로덕션 스모크 테스트 및 롤백 절차 문서화(`docs/deploy.md`)
  - 사용자 수용 테스트(UAT): 작성자 1명 + 클라이언트 1명 실사용 시나리오

  ##### 테스트 체크리스트

  | 시나리오 | 플로우 | 기대 결과 | Playwright MCP 검증 |
  |---------|--------|-----------|---------------------|
  | **정상** | 프로덕션에서 가입 → 로그인 → 목록 → 필터 → 새로고침 → 상세 → PDF → 공유 링크 복사 → 로그아웃 | 전 단계 성공, 콘솔 오류 0건 | 프로덕션 URL로 전체 플로우, 단계별 스크린샷 |
  | **정상** | 공유 링크를 비로그인 모바일(375px)에서 열고 PDF 다운로드 | 성공 | `browser_resize` 후 비로그인 컨텍스트 |
  | **오류** | 프로덕션에서 존재하지 않는 견적서/공유 토큰 | 오류 안내 페이지, Sentry 이벤트 미발생(정상 처리 오류) | 페이지와 Sentry 확인 |
  | **엣지** | 견적서 150건 계정, 항목 50개 견적서 | 성능 목표 충족 | `browser_network_requests` 응답 시간 |
  | **권한** | 프로덕션에서 계정 B의 교차 접근, 비로그인 보호 라우트 접근, 만료 세션 | 모두 차단 또는 로그인 이동 | 각 컨텍스트에서 확인 |

---

## 의존성 다이어그램

```
[완료] Task 000 인증(F007, F008)
          │
Phase 1   001 구조 ──┬── 002 인증 가드 ──────────────────────────┐
                    ├── 003 타입 ──┐                           │
                    ├── 004 환경/스키마 ┐                        │
                    └── 005 레이아웃 ───┼────────────┐           │
                                      │            │           │
Phase 2   011 재시도 ◀─(003)          │            │           │
          006 Notion 클라이언트 ◀─(003, 004)          │           │
             └─ 007 변환/Service                    │           │
                  └─ 008 API Route ── 012 캐싱       │           │
          009 UI 라이브러리 ◀──────────────────────── 005          │
          010 상태/훅 ◀─(003, 008)                                │
                                                               │
Phase 3   013 네비게이션 ◀─(005, 010) ◀──────────────────────────┘
          014 목록(F004) ◀─(009, 010, 012)
          015 상세(F002) ◀─(009, 012)
          016 반응형(F006) ◀─(014, 015)
          017 접근성 ◀─(014, 015)
          018 통합 테스트 ◀─(013-017)

Phase 4   019 필터(F005) → 020 정렬 → 024 검색(선택)
          021 새로고침(F010) ◀─(012, 014)
          022 공유(F009) ◀─(008, 015) → 023 PDF(F003)

Phase 5   025 성능 → 027 SEO
          026 보안
          028 모니터링 ─┐
          029 CI/CD ────┴→ 030 프로덕션 배포
```

---

## 타임라인

| Phase | 기간 | 시작 | 완료 | Task 수 | 포함 기능 |
|-------|------|------|------|---------|-----------|
| Phase 1: 프로젝트 골격 | 4-5일 | 2026-10-06 | 2026-10-13 | 5 | 구조, F007/F008 보완 |
| Phase 2: 공통 모듈 | 6-7일 | 2026-10-14 | 2026-10-22 | 7 | F001 |
| Phase 3: 핵심 기능 | 8-10일 | 2026-10-23 | 2026-11-05 | 6 | F002, F004, F006 |
| Phase 4: 추가 기능 | 5-6일 | 2026-11-06 | 2026-11-13 | 6 (1 선택) | F003, F005, F009, F010 |
| Phase 5: 최적화 및 배포 | 4-5일 | 2026-11-16 | 2026-11-20 | 6 | 출시 |
| **전체** | **27-33일** | **2026-10-06** | **2026-11-20** | **30** | **F001-F010** |

> 완료일은 상한 기준(영업일, 한글날 제외)이며, 병렬 트랙을 활용하면 Phase별 하한 기간으로 단축할 수 있다.

---

## 리스크 및 대응

| 리스크 | 영향 | 발생 가능성 | 대응 |
|--------|------|------------|------|
| PDF 서버 렌더링이 Vercel 함수 크기/시간 제한 초과 | F003 지연 | 중 | Phase 4 첫날 스파이크로 조기 검증, `@react-pdf/renderer` 대안 준비 |
| Notion 데이터베이스 구조가 PRD 데이터 모델과 불일치(항목 저장 방식 등) | Phase 2 지연 | 중 | Task 003에서 실제 DB로 매핑 확정, 불일치 시 노션 템플릿 표준안 제시 |
| Notion API 요청 제한(평균 초당 3회) | 목록 지연, 429 | 중 | Task 011 요청 큐 + Task 012 캐싱 + 새로고침 최소 간격 |
| 작성자-견적서 소유권 매핑 방식 미확정 | 권한 결함 | 중 | Task 004에서 결정 문서화, Task 007 Service 계층에서 일괄 검사 |
| 공유 토큰 유출 | 견적서 외부 노출 | 낮음 | 추측 불가 토큰, `Referrer-Policy`, `noindex`, `share_enabled` 비활성화 수단 |
| Next.js 16 API 변경(proxy, 캐시 API) | 재작업 | 중 | 구현 전 `node_modules/next/dist/docs/` 확인 의무화 |
| 테스트 실패로 인한 재작업 | 일정 지연 | 중 | 각 Task 직후 4분류 테스트, 실패 Task는 후속 착수 금지 |

---

## 성공 기준

### MVP 기능

- [x] F007 이메일 인증
- [x] F008 로그아웃
- [ ] F001 Notion API 연동
- [ ] F002 견적서 웹 뷰어
- [ ] F003 PDF 다운로드
- [ ] F004 견적서 목록 조회
- [ ] F005 상태 필터
- [ ] F006 반응형 견적서 표시
- [ ] F009 공유 링크 복사
- [ ] F010 목록 새로고침

### 성능

- 목록 LCP < 2.0초, 상세 LCP < 1.5초, CLS < 0.1
- PDF 생성 < 5초 (항목 50개 기준)
- Lighthouse 모바일 성능 90+

### 품질

- WCAG 2.1 AA 준수 (axe critical 위반 0건)
- 모든 API/로직 Task의 4가지 시나리오(정상/오류/엣지/권한) Playwright MCP 검증 통과율 100%
- `lint` / `typecheck` / `build` 경고 및 오류 0건, `any` 타입 0건

---

## Phase별 완료 체크리스트

### Phase 1: 프로젝트 골격
- [ ] 라우트 그룹 `(app)` / `(public)` 분리 및 `/share/[token]` 공개 라우트 확보
- [ ] `proxy.ts` 마이그레이션 및 `/login` 리다이렉트 결함 해소 (**4가지 시나리오**)
- [ ] 계층별 타입과 `ApiResponse` 계약 확정
- [ ] 환경 변수 검증 및 Supabase 스키마/RLS 설계
- [ ] 헤더 3변형 골격, 세그먼트별 에러/로딩 경계

### Phase 2: 공통 모듈
- [ ] Notion 클라이언트/Repository (**4가지 시나리오**)
- [ ] 변환 유틸/Service (**4가지 시나리오**)
- [ ] API Route Handler 및 Supabase 동기화 (**4가지 시나리오**)
- [ ] 공통 UI 컴포넌트 라이브러리
- [ ] 상태 관리/데이터 훅 (**4가지 시나리오**)
- [ ] 에러 핸들링/재시도 (**4가지 시나리오**)
- [ ] 캐싱 전략 (**4가지 시나리오**)

### Phase 3: 핵심 기능
- [ ] 네비게이션 (**4가지 시나리오**)
- [ ] 견적서 목록 F004 (**4가지 시나리오**)
- [ ] 견적서 상세 F002 (**4가지 시나리오**)
- [ ] 반응형 F006
- [ ] 접근성
- [ ] 핵심 기능 통합 테스트 (**4가지 시나리오**)

### Phase 4: 추가 기능
- [ ] 상태 필터 F005 (**4가지 시나리오**)
- [ ] 정렬 (**4가지 시나리오**)
- [ ] 새로고침 F010 (**4가지 시나리오**)
- [ ] 공유 링크 F009 (**4가지 시나리오**)
- [ ] PDF 다운로드 F003 (**4가지 시나리오**)
- [ ] 검색 (선택, **4가지 시나리오**)

### Phase 5: 최적화 및 배포
- [ ] 성능 최적화 목표 달성
- [ ] 보안 검토 (**4가지 시나리오**)
- [ ] SEO/메타데이터
- [ ] 모니터링 (**4가지 시나리오**)
- [ ] CI/CD 파이프라인
- [ ] 프로덕션 배포 및 최종 E2E (**4가지 시나리오**)

---

## 상태 표시 규칙

- **Phase**: 완료 시 제목 끝에 ✅ (예: `### Phase 1: 프로젝트 골격 (4-5일) ✅`)
- **Task**
  - `✅ - 완료`: 구현 완료 **및 모든 테스트 시나리오 통과 확인됨**, `See: /tasks/XXX-xxx.md` 추가
  - `- 우선순위`: 즉시 시작해야 할 작업
  - 표시 없음: 대기 중
  - `⚠️ 테스트 미통과`: 구현은 되었으나 테스트를 통과하지 못함 (✅ 표시 금지)
- **구현 사항**: 완료 항목은 `✅`, 미완료 항목은 `-`

---

## 참고 자료

- PRD: `docs/PRD.md`
- Next.js 16 문서: `claude-nextjs-starters/node_modules/next/dist/docs/` (proxy, 캐시 API 등 변경 사항 확인 필수)
- [Notion API](https://developers.notion.com/)
- [Supabase Auth (SSR)](https://supabase.com/docs/guides/auth/server-side)
- [shadcn/ui](https://ui.shadcn.com/) (이 프로젝트는 base-ui 기반 `base-nova` 스타일)
- [Vercel 배포](https://vercel.com/docs)

---

**마지막 업데이트**: 2026-10-05
**주요 변경**: 5단계 구조(구조 → 공통 → 기능 → 추가 → 배포)로 전면 재작성, Phase별 "왜 이 순서인가?" 추가, 현재 코드베이스 진단 반영, Task 000-030 재편
