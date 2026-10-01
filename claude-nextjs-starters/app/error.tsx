"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Container from "@/components/layout/container";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    // 에러 로깅 서비스에 보내기
    console.error(error);
  }, [error]);

  return (
    <Container>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">오류가 발생했습니다</h2>
            <p className="text-sm text-muted-foreground mt-1">
              예기치 않은 문제가 발생했습니다. 다시 시도해주세요.
            </p>
          </div>
          {error.digest && (
            <p className="text-xs text-muted-foreground">
              오류 ID: {error.digest}
            </p>
          )}
          <Button onClick={retry} className="mt-4">
            다시 시도
          </Button>
        </div>
      </div>
    </Container>
  );
}
