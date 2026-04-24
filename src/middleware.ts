import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

const USER_PROTECTED = [
  "/app/me",
  "/app/reservations",
  "/app/favorites",
  "/app/booking",
];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await auth();

  // /admin → OWNER 또는 ADMIN 만 허용 (단 /admin/login 제외)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!session?.user) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    const role = session.user.role;
    if (role !== "OWNER" && role !== "ADMIN") {
      const url = req.nextUrl.clone();
      url.pathname = "/app";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const userProtected = USER_PROTECTED.some((p) => pathname.startsWith(p));
  if (!userProtected) return NextResponse.next();

  if (session?.user) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/app/login";
  url.searchParams.set("callbackUrl", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/app/me/:path*",
    "/app/reservations/:path*",
    "/app/favorites/:path*",
    "/app/booking/:path*",
    "/admin/:path*",
  ],
};
