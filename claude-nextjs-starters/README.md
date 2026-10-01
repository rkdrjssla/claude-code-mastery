# Next.js 스타터킷

최신 기술로 빠르게 시작하는 웹 개발 프로젝트입니다.

## 📦 기술 스택

- **Next.js 16** - App Router 기반 모던 프레임워크
- **React 19** - 최신 리액트
- **TypeScript 5** - 타입 안정성
- **Tailwind CSS v4** - 유틸리티 기반 CSS
- **shadcn/ui** - 고품질 컴포넌트
- **lucide-react** - 아이콘 라이브러리
- **next-themes** - 다크모드 지원
- **Prettier** - 코드 포맷팅

## 🚀 시작하기

### 1. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)을 브라우저에서 열어 확인하세요.

### 2. 사이트 정보 업데이트

`config/site.ts`에서 다음을 수정하세요:

```typescript
export const siteConfig = {
  name: "당신의 사이트명",
  description: "당신의 사이트 설명",
  url: "https://example.com",
  nav: [
    // 네비게이션 항목 추가
  ],
};
```

### 3. 스타일 커스터마이징

`app/globals.css`에서 색상 테마를 수정하세요:

```css
:root {
  --primary: oklch(...); /* 주 색상 */
  --background: oklch(...); /* 배경색 */
  /* ... 다른 색상들 ... */
}
```

### 4. 페이지 추가하기

`app/` 디렉토리에 새로운 폴더를 만들고 `page.tsx` 파일을 추가하세요:

```
app/
  my-page/
    page.tsx    # /my-page 라우트가 됩니다
```

## 📁 프로젝트 구조

```
├── app/                    # 페이지와 라우트
│   ├── page.tsx           # 홈 페이지
│   ├── layout.tsx         # 루트 레이아웃
│   ├── globals.css        # 전역 스타일
│   └── about/             # About 페이지
├── components/            # 재사용 컴포넌트
│   ├── layout/            # 레이아웃 컴포넌트
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── container.tsx
│   │   └── site-nav.tsx
│   ├── theme/             # 테마 관련 컴포넌트
│   │   ├── theme-provider.tsx
│   │   └── theme-toggle.tsx
│   └── ui/                # shadcn 컴포넌트
├── config/                # 설정 파일
│   └── site.ts            # 사이트 설정
├── lib/                   # 유틸리티 함수
│   └── utils.ts           # cn() 등의 헬퍼
├── public/                # 정적 자산
├── .prettierrc            # Prettier 설정
└── tsconfig.json          # TypeScript 설정
```

## 🎯 주요 기능

### 다크모드
`next-themes`가 자동으로 시스템 테마를 감지하고 저장합니다. 헤더의 테마 토글을 클릭하세요.

### 반응형 디자인
Tailwind의 반응형 유틸리티로 모든 기기에 최적화됩니다.

### shadcn/ui 컴포넌트 추가
```bash
npx shadcn@latest add [component-name]
```

기본 포함 컴포넌트:
- `button`
- `card`
- `input`
- `badge`
- `dropdown-menu`
- `sheet` (모바일 메뉴)
- `separator`

## 📝 주요 명령어

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 빌드된 앱 실행 |
| `npm run lint` | ESLint 실행 |
| `npm run format` | Prettier 포맷팅 |
| `npm run typecheck` | TypeScript 타입 확인 |

## 🎨 색상 커스터마이징

Tailwind의 `@theme` 지시어로 색상을 정의합니다:

```css
:root {
  --primary: oklch(0.205 0 0); /* 검정 */
  --background: oklch(1 0 0);  /* 흰색 */
  /* ... */
}

.dark {
  --primary: oklch(0.922 0 0); /* 밝은 회색 */
  --background: oklch(0.145 0 0); /* 어두운 회색 */
  /* ... */
}
```

## 📚 학습 자료

- [Next.js 공식 문서](https://nextjs.org/docs)
- [React 공식 문서](https://react.dev)
- [Tailwind CSS 문서](https://tailwindcss.com)
- [shadcn/ui 컴포넌트](https://ui.shadcn.com)

## 🚢 배포

### Vercel (권장)
Vercel에서 배포하는 것이 가장 쉽습니다:

1. GitHub에 저장소 푸시
2. [Vercel](https://vercel.com)에서 프로젝트 import
3. 자동 배포됩니다

### 다른 플랫폼
```bash
npm run build
npm run start
```

## 📖 더 알아보기

- [Next.js 배포 가이드](https://nextjs.org/docs/app/building-your-application/deploying)
- [TypeScript in Next.js](https://nextjs.org/docs/app/building-your-application/configuring/typescript)

## 📄 라이선스

MIT License
