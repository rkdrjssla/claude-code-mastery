import type { ReactNode } from 'react';

type ProtectedLayoutProps = {
  children: ReactNode;
};

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  // TODO: 인증 확인 미들웨어 추가
  return <>{children}</>;
}
