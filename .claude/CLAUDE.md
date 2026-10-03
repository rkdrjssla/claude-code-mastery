# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

이 저장소는 두 개의 독립적인 프로젝트를 포함하는 모노레포 구조입니다:

1. **bucket-list-main** - 바닐라 JavaScript 기반 버킷리스트 앱 (빌드 도구 없음)
2. **claude-nextjs-starters** - Next.js 16 + React 19 모던 웹 스타터킷

## 저장소 구조

```
claude-code-mastery/
├── workspaces/
│   └── bucket-list-main/           # 바닐라 JS 프로젝트
│       ├── index.html               # HTML 진입점
│       ├── css/styles.css           # 커스텀 스타일 + Tailwind CDN
│       ├── js/
│       │   ├── storage.js           # LocalStorage 관리 (싱글톤)
│       │   └── app.js               # BucketListApp 클래스
│       └── README.md
│
├── claude-nextjs-starters/         # Next.js 프로젝트
│   ├── app/                         # Next.js App Router
│   │   ├── layout.tsx               # 루트 레이아웃
│   │   ├── page.tsx                 # 홈 페이지
│   │   ├── globals.css              # 전역 스타일
│   │   ├── about/page.tsx           # About 페이지
│   │   └── docs/page.tsx            # Docs 페이지
│   ├── components/
│   │   ├── layout/                  # Header, Footer, Navigation
│   │   ├── theme/                   # 다크모드 관련
│   │   └── ui/                      # shadcn/ui 컴포넌트
│   ├── config/site.ts               # 사이트 설정
│   ├── lib/utils.ts                 # 유틸리티 (cn(), etc)
│   ├── package.json
│   └── tsconfig.json
│
└── .claude/                         # Claude Code 설정
    ├── CLAUDE.md                    # 이 파일
    └── settings.local.json          # 로컬 설정
```

## 개발 환경 및 실행 방법

### bucket-list-main (바닐라 JavaScript)

**실행 옵션:**

1. **직접 브라우저에서 열기 (가장 빠름)**
   ```bash
   # File → Open File → ./workspaces/bucket-list-main/index.html
   # 또는 드래그앤드롭으로 브라우저에 열기
   ```

2. **Python HTTP Server**
   ```bash
   cd workspaces/bucket-list-main
   python -m http.server 8000
   # http://localhost:8000 방문
   ```

3. **Node.js HTTP Server**
   ```bash
   cd workspaces/bucket-list-main
   npx http-server
   ```

4. **VS Code Live Server**
   - `index.html` 우클릭 → "Open with Live Server"

### claude-nextjs-starters (Next.js 프로젝트)

**필수 설정:**
```bash
cd claude-nextjs-starters
npm install  # node_modules 설치
```

**주요 명령어:**

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 (http://localhost:3000) |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 빌드된 앱 실행 |
| `npm run lint` | ESLint로 코드 품질 검사 |
| `npm run format` | Prettier로 코드 포맷팅 |
| `npm run typecheck` | TypeScript 타입 검사 |

## 아키텍처

### bucket-list-main 아키텍처

**데이터 계층: `js/storage.js`**

싱글톤 객체 `BucketStorage`가 모든 LocalStorage 작업을 관리합니다:

- **load()**: localStorage에서 버킷 읽기
- **save(bucketList)**: 배열을 localStorage에 저장
- **addItem(title)**: 새 버킷 생성 (ID: timestamp, createdAt, completedAt)
- **updateItem(id, newTitle)**: 버킷 제목 수정
- **deleteItem(id)**: 버킷 삭제
- **toggleComplete(id)**: 완료 여부 토글 및 completedAt 설정
- **getStats()**: {total, completed, progress, completionRate} 반환
- **getFilteredList(filter)**: 'all', 'active', 'completed'로 필터링된 버킷 반환

**중요**: 모든 변경사항은 `save()`를 자동으로 호출하며, 읽기 작업은 `load()`를 호출해 최신 데이터를 보장합니다.

**UI 계층: `js/app.js`**

`BucketListApp` 클래스가 렌더링과 사용자 상호작용을 관리합니다:

- **init()** → cacheElements() → bindEvents() → render()
- **render()**: BucketStorage에서 필터링된 데이터를 가져와 통계 업데이트 및 DOM 재생성
- 이벤트 핸들러 (handleAdd, handleFilter, handleToggle, handleDelete, handleEditSubmit): 스토리지 변경 후 render() 호출
- **createBucketItemHTML(item)**: 아이템 마크업 생성, **escapeHtml()** 호출로 XSS 방지
- 모달 상태는 `editingId`로 추적, 가시성은 `hidden`/`flex` 클래스로 제어

**핵심 불변성**: 모든 변경은 BucketStorage를 통해서만 수행되며, UI는 데이터를 직접 수정하지 않습니다.

**HTML 구조: `index.html`**
- 통계 섹션: 4개의 span (totalCount, completedCount, progressCount, completionRate)
- 폼: bucketForm with bucketInput 및 submit 버튼
- 필터: 3개의 .filter-btn 요소 with data-filter 속성
- 컨테이너: bucketListContainer (render()로 채워짐)
- 모달: #editModal with editForm, editInput, 취소/저장 버튼
- 빈 상태: #emptyState (버킷이 없을 때만 표시)

**스타일: `css/styles.css` + Tailwind CDN**
- Tailwind: 모든 유틸리티 클래스 CDN으로 제공 (빌드 단계 불필요)
- 커스텀 CSS: 애니메이션 (slideIn, fadeIn, scaleIn), 필터 버튼 상태, 다크모드
- 모바일: max-width 640px에서 레이아웃 조정

### claude-nextjs-starters 아키텍처

**기술 스택:**
- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS v4
- shadcn/ui (고품질 컴포넌트)
- lucide-react (아이콘)
- next-themes (다크모드)

**주요 파일 및 역할:**

- **app/layout.tsx**: 루트 레이아웃, 테마 프로바이더 포함
- **app/page.tsx**: 홈 페이지
- **app/globals.css**: 전역 스타일 (OKLCH 색상 변수)
- **components/layout/**: Header, Footer, Navigation, Container
- **components/theme/**: ThemeProvider, ThemeToggle
- **components/ui/**: shadcn/ui 컴포넌트 (button, card, input, badge 등)
- **config/site.ts**: 사이트 메타데이터 및 네비게이션 설정
- **lib/utils.ts**: cn() 유틸리티 (Tailwind 클래스 병합)

**라우팅:**
- Next.js App Router 사용 (app 디렉토리 기반)
- 각 폴더의 page.tsx가 라우트가 됨
- 예: app/about/page.tsx → /about

**스타일링:**
- Tailwind CSS v4의 @theme 지시어로 색상 정의
- OKLCH 색상 공간 사용 (app/globals.css)
- 라이트/다크 모드 자동 지원 (next-themes)

## 데이터 모델

### bucket-list-main 데이터 모델

```javascript
// localStorage['bucketList']에 JSON 배열로 저장됨
{
  id: "1730880000000",           // Date.now().toString()
  title: "Learn Spanish",        // 사용자 입력 (trim 처리)
  completed: false,              // 체크박스로 토글
  createdAt: "2025-11-06T...",  // ISO 문자열 (생성 시)
  completedAt: null              // ISO 문자열 (완료 시), 미완료 시 null
}
```

## 개발 작업 가이드

### bucket-list-main에서 새 기능 추가

1. **데이터 변경 필요 시**: BucketStorage에 메서드 추가 (예: `addCategory(id, cat)`)
2. **UI 변경 필요 시**: BucketListApp에 핸들러 추가 및 bindEvents()에서 이벤트 연결
3. **변경 후**: render() 호출
4. **테스트**: 브라우저에서 테스트 후 새로고침으로 데이터 지속성 확인

### 디버깅

**bucket-list-main (브라우저 DevTools Console):**
```javascript
BucketStorage.load()          // 모든 버킷 확인
localStorage.clear()          // 데이터 초기화 (새로 시작)
```

**claude-nextjs-starters (개발 서버 콘솔):**
```bash
# 터미널 출력에서 빌드 오류 확인
# 브라우저 DevTools에서 네트워크 및 콘솔 로그 확인
```

### 색상 커스터마이징

**bucket-list-main:**
- index.html에서 Tailwind 클래스명 수정 (예: bg-blue-600 → bg-purple-600)
- 또는 css/styles.css에 규칙 추가

**claude-nextjs-starters:**
- app/globals.css에서 OKLCH 색상 변수 수정
- :root 및 .dark 섹션에서 각각 라이트/다크 모드 색상 정의

### 애니메이션 추가

**bucket-list-main:**
css/styles.css에 @keyframes 추가 후 클래스명에서 참조

**claude-nextjs-starters:**
- Tailwind CSS v4 애니메이션 유틸리티 사용 (예: animate-pulse)
- 커스텀 애니메이션은 globals.css의 @keyframes에 추가

## 중요 주의사항

### bucket-list-main

**빌드 단계 없음**
- 바닐라 JavaScript 유지 (Tailwind CDN 사용)
- 향후 트랜스파일이 필요하면 번들러 추가 (Vite, Parcel)

**XSS 보안**
- 사용자 텍스트를 HTML 문자열에 삽입할 때 반드시 escapeHtml() 호출
- createBucketItemHTML()에서 이미 구현됨

**LocalStorage 제한**
- 도메인당 약 5-10 MB
- 10,000개 버킷: ~1 MB (충분한 여유)

**반응형 디자인**
- 320px 너비에서 테스트 필수
- Tailwind의 반응형 유틸리티로 큰 화면 처리

**모달 상태 관리**
- editingId: 현재 편집 중인 버킷 ID, 모달 닫혀있으면 null

**필터 상태**
- currentFilter: 활성 필터 버튼 추적
- 현재는 localStorage에 지속되지 않음 (필요시 구현 가능)

### claude-nextjs-starters

**Next.js 16 주의사항**
- AGENTS.md 참고: Next.js 16은 이전 버전과 주요 API가 다름
- node_modules/next/dist/docs/ 참조 (변경사항 및 마이그레이션 가이드)

**TypeScript 필수**
- any 타입 사용 금지 (사용자 설정 참고)
- 엄격한 타입 검사 활성화

**컴포넌트 구조**
- Server Components를 기본으로 사용 (필요시 "use client" 지시어)
- shadcn/ui 컴포넌트는 이미 최적화됨

**환경 변수**
- .env.local 파일 생성 후 필요한 변수 추가
- 공개 변수는 NEXT_PUBLIC_ 접두사 사용

**빌드 및 배포**
- `npm run build`로 최적화된 프로덕션 빌드 생성
- Vercel 배포 권장 (원클릭 배포)

## 테스트

### bucket-list-main (수동 테스트)

테스트 프레임워크가 없으므로 브라우저에서 직접 검증:
1. index.html을 브라우저에서 열기
2. 아이템 추가/편집/삭제/토글 기능 확인
3. 페이지 새로고침 → 데이터 지속성 확인
4. 필터 기능 (all/active/completed) 확인
5. 통계 실시간 업데이트 확인
6. 반응형 디자인 테스트 (320px, 768px, 1024px 너비)

### claude-nextjs-starters (자동 테스트)

```bash
# ESLint 검사
npm run lint

# TypeScript 타입 검사
npm run typecheck

# 코드 포맷팅 (검사 모드)
npm run format -- --check

# 빌드 검사
npm run build
```

## 각 프로젝트별 확장 아이디어

### bucket-list-main
- 카테고리/태그 지원
- 이미지 첨부
- 아이템별 상세 노트
- 목표 완료 날짜 설정
- 우선순위 레벨
- JSON 데이터 내보내기/가져오기
- 다크모드 토글
- 드래그앤드롭 재정렬

### claude-nextjs-starters
- 사용자 인증 시스템 추가
- 데이터베이스 연동 (Supabase, Firebase 등)
- API 라우트 구현 (app/api/)
- 이미지 최적화 (next/image)
- SEO 메타데이터 추가
- 다국어 지원 (i18n)
- 블로그 시스템
- 동적 라우팅 패턴
