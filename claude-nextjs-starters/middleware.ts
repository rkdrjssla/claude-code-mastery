import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 비로그인 사용자가 보호된 라우트에 접근
  if (!user && requestUrl.pathname.startsWith("/quotes")) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 로그인한 사용자가 인증 페이지에 접근
  if (user && (requestUrl.pathname === "/login" || requestUrl.pathname === "/auth/login")) {
    const quotesUrl = new URL("/quotes", request.url);
    return NextResponse.redirect(quotesUrl);
  }

  if (user && (requestUrl.pathname === "/signup" || requestUrl.pathname === "/auth/signup")) {
    const quotesUrl = new URL("/quotes", request.url);
    return NextResponse.redirect(quotesUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
