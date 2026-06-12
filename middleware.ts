import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("cvenix_token");

  const isLoggedIn = !!token;

  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register";

  const isDashboardPage =
    pathname.startsWith("/dashboard");

  // Logged user tries to access login/register
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  // Not logged user tries to access dashboard
  if (!isLoggedIn && isDashboardPage) {
    return NextResponse.redirect(
      new URL("/", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
  ],
};