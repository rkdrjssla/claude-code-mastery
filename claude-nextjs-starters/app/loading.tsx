import Container from "@/components/layout/container";

export default function Loading() {
  return (
    <Container>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
          </div>
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    </Container>
  );
}
