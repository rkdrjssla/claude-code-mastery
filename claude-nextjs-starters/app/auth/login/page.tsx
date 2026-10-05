'use client';

import Link from 'next/link';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Container from '@/components/layout/container';

export default function LoginPage() {
  return (
    <Container>
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl">로그인</CardTitle>
            <CardDescription>견적서를 관리하기 위해 로그인하세요</CardDescription>
          </CardHeader>

          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                이메일
              </label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>

            <button className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              로그인
            </button>

            <div className="text-center text-sm">
              계정이 없으신가요?{' '}
              <Link href="/auth/signup" className="text-primary hover:underline">
                회원가입
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </Container>
  );
}
