"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Container from "@/components/layout/container";
import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <Container>
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl">회원가입</CardTitle>
            <CardDescription>새 계정을 만들고 견적서를 관리하세요</CardDescription>
          </CardHeader>

          <div className="space-y-4 p-6">
            <SignupForm />
          </div>
        </Card>
      </div>
    </Container>
  );
}
