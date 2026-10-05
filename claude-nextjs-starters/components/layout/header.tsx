'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/theme/theme-toggle';
import Container from './container';

type HeaderProps = {
  isAuthenticated?: boolean;
};

export default function Header({ isAuthenticated = false }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            견적서 뷰어
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {isAuthenticated && (
              <Link
                href="/quotes"
                className="text-sm font-medium transition-colors hover:text-foreground/70"
              >
                견적서 목록
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <form action="/api/auth/logout" method="post">
                <Button type="submit" variant="outline">
                  로그아웃
                </Button>
              </form>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 h-9"
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
}
