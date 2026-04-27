import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { encode } from "next-auth/jwt";
import {
  REFRESH_COOKIE_NAME,
  REFRESH_TOKEN_TTL_MS,
  issueRefreshToken,
  revokeRefreshToken,
  verifyRefreshToken,
} from "@/lib/refresh-token";
import { SESSION_MAX_AGE_SECONDS } from "@/auth";

/**
 * Refresh Token → 새 NextAuth 세션 cookie 발급 (silent re-login).
 * 비밀번호·credential 필요 없음, refresh cookie 만 첨부되면 됨.
 *
 * 회전(rotation) 적용:
 * - 사용한 refresh token 은 즉시 폐기
 * - 새 refresh token 발급해서 cookie 갱신
 * - 탈취·재사용 감지 시점이 빠르고, 세션 만료 시점도 매번 30일 연장
 */
export async function POST(): Promise<NextResponse> {
  const c = cookies();
  const stored = c.get(REFRESH_COOKIE_NAME);
  if (!stored?.value) {
    return NextResponse.json(
      { ok: false, error: "no_refresh_token" },
      { status: 401 },
    );
  }

  const verified = await verifyRefreshToken(stored.value);
  if (!verified) {
    // 무효 토큰이면 cookie 정리
    c.delete({ name: REFRESH_COOKIE_NAME, path: "/api/auth" });
    return NextResponse.json(
      { ok: false, error: "invalid_refresh_token" },
      { status: 401 },
    );
  }

  // 토큰 회전 — 기존 토큰 폐기 + 새 토큰 발급
  await revokeRefreshToken(stored.value);
  const { raw: newRaw, expiresAt } = await issueRefreshToken(verified.userId);

  // 새 NextAuth 세션 JWT 발급 (cookie 로 직접 설정)
  const sessionToken = await encode({
    salt: getSessionCookieName(),
    secret: process.env.NEXTAUTH_SECRET ?? "",
    token: {
      id: verified.userId,
      sub: verified.userId,
      email: verified.email ?? undefined,
      role: verified.role,
    },
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  const res = NextResponse.json({ ok: true });
  // refresh token 갱신
  res.cookies.set({
    name: REFRESH_COOKIE_NAME,
    value: newRaw,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth",
    expires: expiresAt,
    maxAge: REFRESH_TOKEN_TTL_MS / 1000,
  });
  // NextAuth 세션 cookie
  res.cookies.set({
    name: getSessionCookieName(),
    value: sessionToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return res;
}

/** NextAuth v5 의 기본 session cookie 이름 (prod=Secure prefix) */
function getSessionCookieName(): string {
  return process.env.NODE_ENV === "production"
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";
}
