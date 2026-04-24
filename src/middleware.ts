import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

const PROTECTED = ["/app/me", "/app/reservations", "/app/favorites", "/app/booking"];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const requiresAuth = PROTECTED.some((p) => pathname.startsWith(p));
  if (!requiresAuth) return NextResponse.next();

  const session = await auth();
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
  ],
};
