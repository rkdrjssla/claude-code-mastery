import Link from "next/link";
import Container from "@/components/layout/container";

export default function NotFound() {
  return (
    <Container>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold">404</h1>
            <h2 className="text-2xl font-semibold">페이지를 찾을 수 없습니다</h2>
            <p className="text-muted-foreground">
              요청하신 페이지가 존재하지 않습니다.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-2.5 text-primary-foreground hover:bg-primary/80 h-9 gap-1.5 font-medium transition-all mt-6"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </Container>
  );
}
