import { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "로그인",
  description: "계정에 로그인하여 시작하세요",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100svh-13rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
