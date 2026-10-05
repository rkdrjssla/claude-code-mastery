"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Container from "@/components/layout/container";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <Container>
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl">로그인</CardTitle>
            <CardDescription>견적서를 관리하기 위해 로그인하세요</CardDescription>
          </CardHeader>

          <div className="space-y-4 p-6">
            <LoginForm />
          </div>
        </Card>
      </div>
    </Container>
  );
}
