import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Container from "@/components/layout/container";
import { Code2, Zap, Globe, Sparkles } from "lucide-react";

const features = [
  {
    icon: Code2,
    title: "최신 스택",
    description: "Next.js 16, React 19, TypeScript 5로 구축한 현대적 개발 환경",
  },
  {
    icon: Zap,
    title: "빠른 성능",
    description: "최적화된 번들 사이즈와 서버 컴포넌트로 초고속 로딩",
  },
  {
    icon: Globe,
    title: "접근성",
    description: "WCAG 표준을 준수하는 접근성 우선 디자인",
  },
  {
    icon: Sparkles,
    title: "다크모드",
    description: "next-themes로 무결한 다크모드 지원",
  },
];

export default function Home() {
  return (
    <div className="space-y-16 py-12">
      <Container>
        <div className="space-y-8 text-center">
          <div className="space-y-4">
            <Badge variant="outline" className="inline-block">
              Next.js 스타터킷
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              빠르게 시작하는
              <span className="block text-primary">웹 개발</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              최신 기술로 바로 개발을 시작하세요. 깔끔한 구조와
              프로덕션 레디한 설정으로 시간을 절약합니다.
            </p>
          </div>

          <div className="flex flex-col gap-3 justify-center sm:flex-row">
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-2.5 text-primary-foreground hover:bg-primary/80 h-9 gap-1.5 font-medium transition-all"
            >
              시작하기
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-lg border border-border bg-background hover:bg-muted hover:text-foreground h-9 gap-1.5 px-2.5 font-medium transition-all"
            >
              GitHub 보기
            </a>
          </div>
        </div>
      </Container>

      <Container>
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">주요 기능</h2>
            <p className="text-muted-foreground">
              프로덕션 환경에서 필요한 모든 것을 미리 준비했습니다
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <Icon className="h-8 w-8 text-primary mb-3" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </Container>

      <Container>
        <div className="rounded-lg border border-border/40 bg-muted/30 p-8 text-center space-y-4">
          <h3 className="text-2xl font-bold">준비되셨나요?</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            지금 바로 프로젝트를 시작하고 놀라운 결과를 만들어보세요.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-2.5 text-primary-foreground hover:bg-primary/80 h-9 gap-1.5 font-medium transition-all"
          >
            예제 페이지 탐색
          </Link>
        </div>
      </Container>
    </div>
  );
}
