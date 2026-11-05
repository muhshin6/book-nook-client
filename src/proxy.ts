import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE_NAMES = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
];

export function proxy(request: NextRequest) {
  const hasSessionCookie = SESSION_COOKIE_NAMES.some(
    (name) => request.cookies.get(name)?.value
  );

  if (hasSessionCookie) {
    return NextResponse.next();
  }

  const SingInUrl = new URL("/sign-in", request.url);
  SingInUrl.searchParams.set(
    "next",
    `${request.nextUrl.pathname}${request.nextUrl.search}`
  );

  return NextResponse.redirect(SingInUrl);
}

export const config = {
  matcher: [
    "/add-book",
    "/add-book/:path*",
    "/books/:id",
    "/my-books",
    "/my-books/:path*",
    "/my-borrows",
    "/my-borrows/:path*",
  ],
};
