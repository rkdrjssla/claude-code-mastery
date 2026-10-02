import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Container from "@/components/layout/container";
import Link from "next/link";
import { Code2, BookOpen, Zap, Package } from "lucide-react";

export const metadata = {
  title: "Docs - Next.js 스타터킷",
  description: "스타터킷 사용 가이드, 설정 방법, 컴포넌트 추가 방법을 알아보세요.",
};

export default function Docs() {
  return (
    <div className="space-y-12 py-12">
      <Container>
        <div className="space-y-4">
          <Badge variant="outline">Documentation</Badge>
          <h1 className="text-4xl font-bold tracking-tight">
            개발 가이드
          </h1>
          <p className="text-xl text-muted-foreground">
            스타터킷을 최대한 활용하기 위한 모든 것을 알아보세요.
          </p>
        </div>
      </Container>

      <Container>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Code2 className="h-8 w-8 text-primary mb-2" />
              <CardTitle>시작하기</CardTitle>
              <CardDescription>프로젝트 설치 및 실행</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <h4 className="font-semibold text-foreground mb-1">설치</h4>
                <code className="block bg-muted px-3 py-2 rounded text-xs font-mono break-all">
                  npm install
                </code>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">개발 서버 실행</h4>
                <code className="block bg-muted px-3 py-2 rounded text-xs font-mono break-all">
                  npm run dev
                </code>
              </div>
              <p className="text-muted-foreground">
                <a href="http://localhost:3000" className="text-primary hover:underline">
                  http://localhost:3000
                </a>
                에서 애플리케이션을 확인할 수 있습니다.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Package className="h-8 w-8 text-primary mb-2" />
              <CardTitle>컴포넌트 추가</CardTitle>
              <CardDescription>shadcn/ui 컴포넌트 설치</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <h4 className="font-semibold text-foreground mb-1">추가 명령어</h4>
                <code className="block bg-muted px-3 py-2 rounded text-xs font-mono break-all">
                  npx shadcn@latest add [component]
                </code>
              </div>
              <p className="text-muted-foreground">
                예시: dialog, form, table, select, tabs 등 다양한 컴포넌트를 추가할 수 있습니다.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 text-primary mb-2" />
              <CardTitle>다크모드</CardTitle>
              <CardDescription>테마 전환 기능</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                next-themes가 자동으로 사용자의 시스템 테마를 감지합니다.
              </p>
              <div>
                <h4 className="font-semibold text-foreground mb-1">사용하기</h4>
                <code className="block bg-muted px-3 py-2 rounded text-xs font-mono break-all">
                  import {"{"}useTheme{"}"} from &quot;next-themes&quot;
                </code>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BookOpen className="h-8 w-8 text-primary mb-2" />
              <CardTitle>빌드 & 배포</CardTitle>
              <CardDescription>프로덕션 준비</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <h4 className="font-semibold text-foreground mb-1">빌드</h4>
                <code className="block bg-muted px-3 py-2 rounded text-xs font-mono break-all">
                  npm run build
                </code>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">프로덕션 실행</h4>
                <code className="block bg-muted px-3 py-2 rounded text-xs font-mono break-all">
                  npm run start
                </code>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>

      <Container>
        <Card>
          <CardHeader>
            <CardTitle>프로젝트 구조</CardTitle>
            <CardDescription>디렉토리 레이아웃 이해하기</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <span className="text-primary font-mono font-semibold">📁</span>
                <div>
                  <p className="font-semibold">app/</p>
                  <p className="text-sm text-muted-foreground">
                    페이지 및 라우트 정의 (App Router 사용)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary font-mono font-semibold">📁</span>
                <div>
                  <p className="font-semibold">components/</p>
                  <p className="text-sm text-muted-foreground">
                    재사용 가능한 React 컴포넌트 (layout, theme, ui)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary font-mono font-semibold">📁</span>
                <div>
                  <p className="font-semibold">lib/</p>
                  <p className="text-sm text-muted-foreground">
                    유틸리티 함수 및 헬퍼 (cn 등)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary font-mono font-semibold">📁</span>
                <div>
                  <p className="font-semibold">config/</p>
                  <p className="text-sm text-muted-foreground">
                    사이트 설정 및 상수 정의
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary font-mono font-semibold">📁</span>
                <div>
                  <p className="font-semibold">public/</p>
                  <p className="text-sm text-muted-foreground">
                    정적 자산 (이미지, 폰트 등)
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Container>

      <Container>
        <Card>
          <CardHeader>
            <CardTitle>주요 명령어</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-start gap-4">
                <code className="font-mono text-primary">npm run dev</code>
                <span className="text-muted-foreground">개발 서버 실행</span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <code className="font-mono text-primary">npm run build</code>
                <span className="text-muted-foreground">프로덕션 빌드</span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <code className="font-mono text-primary">npm run start</code>
                <span className="text-muted-foreground">빌드된 앱 실행</span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <code className="font-mono text-primary">npm run lint</code>
                <span className="text-muted-foreground">ESLint 실행</span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <code className="font-mono text-primary">npm run format</code>
                <span className="text-muted-foreground">Prettier 포맷팅</span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <code className="font-mono text-primary">npm run typecheck</code>
                <span className="text-muted-foreground">TypeScript 체크</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Container>

      <Container>
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            더 많은 정보가 필요하신가요?
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
