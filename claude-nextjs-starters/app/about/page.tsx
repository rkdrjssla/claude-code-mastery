import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Container from "@/components/layout/container";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "About - Next.js 스타터킷",
  description: "스타터킷에 포함된 기능과 사용 방법을 알아보세요.",
};

const stack = [
  "Next.js 16",
  "React 19",
  "TypeScript 5",
  "Tailwind CSS v4",
  "shadcn/ui",
  "lucide-react",
  "next-themes",
];

const features = [
  "완전히 구성된 프로젝트 구조",
  "다크모드 지원",
  "반응형 디자인",
  "TypeScript strict 모드",
  "ESLint 설정",
  "Prettier 포맷팅",
  "shadcn/ui 컴포넌트",
  "접근성 고려",
];

export default function About() {
  return (
    <div className="space-y-12 py-12">
      <Container>
        <div className="space-y-4">
          <Badge variant="outline">About</Badge>
          <h1 className="text-4xl font-bold tracking-tight">
            이 스타터킷에 대해
          </h1>
          <p className="text-xl text-muted-foreground">
            프로덕션 레디한 Next.js 프로젝트를 빠르게 시작할 수 있도록 설계했습니다.
          </p>
        </div>
      </Container>

      <Container>
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>기술 스택</CardTitle>
              <CardDescription>
                최신 기술로 구성된 견고한 기반
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {stack.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>포함 기능</CardTitle>
              <CardDescription>
                즉시 사용 가능한 기능들
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {features.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </Container>

      <Container>
        <Card>
          <CardHeader>
            <CardTitle>프로젝트 구조</CardTitle>
            <CardDescription>
              폴더 구성과 각 디렉토리의 용도
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 font-mono text-sm">
              <div>
                <span className="text-primary font-semibold">app/</span>
                <p className="text-muted-foreground text-xs ml-4">
                  페이지 및 라우트 정의 (App Router)
                </p>
              </div>
              <div>
                <span className="text-primary font-semibold">
                  components/
                </span>
                <p className="text-muted-foreground text-xs ml-4">
                  재사용 가능한 React 컴포넌트
                </p>
              </div>
              <div>
                <span className="text-primary font-semibold">lib/</span>
                <p className="text-muted-foreground text-xs ml-4">
                  유틸리티 함수 및 헬퍼
                </p>
              </div>
              <div>
                <span className="text-primary font-semibold">config/</span>
                <p className="text-muted-foreground text-xs ml-4">
                  사이트 설정 및 상수
                </p>
              </div>
              <div>
                <span className="text-primary font-semibold">public/</span>
                <p className="text-muted-foreground text-xs ml-4">
                  정적 자산 (이미지, 폰트 등)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Container>

      <Container>
        <Card>
          <CardHeader>
            <CardTitle>시작하기</CardTitle>
            <CardDescription>
              프로젝트를 시작하고 커스터마이징하는 방법
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-sm mb-2">1. 스타일 커스터마이징</h4>
                <p className="text-sm text-muted-foreground">
                  <code className="bg-muted px-2 py-1 rounded text-xs">
                    app/globals.css
                  </code>
                  에서 색상 테마를 수정하세요.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2">
                  2. 사이트 정보 업데이트
                </h4>
                <p className="text-sm text-muted-foreground">
                  <code className="bg-muted px-2 py-1 rounded text-xs">
                    config/site.ts
                  </code>
                  에서 사이트명과 네비게이션을 수정하세요.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2">
                  3. 페이지 추가하기
                </h4>
                <p className="text-sm text-muted-foreground">
                  <code className="bg-muted px-2 py-1 rounded text-xs">
                    app/
                  </code>
                  에 새로운 폴더와 page.tsx를 만들어 라우트를 추가하세요.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Container>

      <Container>
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            질문이 있으신가요?
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-background hover:bg-muted hover:text-foreground h-9 gap-1.5 px-2.5 font-medium transition-all"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </Container>
    </div>
  );
}
