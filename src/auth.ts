import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import {
  issueRefreshToken,
  REFRESH_COOKIE_NAME,
  REFRESH_TOKEN_TTL_MS,
  revokeRefreshToken,
} from "@/lib/refresh-token";

// 세션 만료 = 비활성 자동 로그아웃 시간 (30분)
export const SESSION_MAX_AGE_SECONDS = 30 * 60;

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt", maxAge: SESSION_MAX_AGE_SECONDS },
  trustHost: true,
  pages: {
    signIn: "/app/login",
  },
  providers: [
    Credentials({
      name: "이메일 로그인",
      credentials: {
        email: { label: "이메일", type: "email" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").toLowerCase().trim();
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;

        const user = await db.user.findUnique({ where: { email } });
        if (!user?.password) return null;

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id: string }).id;
        token.role = (user as { role?: string }).role ?? "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = String(token.id);
        session.user.role = String(token.role ?? "USER");
      }
      return session;
    },
  },
  events: {
    // 로그인 성공 직후 — 30일 refresh token 발급 + HTTP-only cookie 설정
    async signIn({ user }) {
      if (!user?.id) return;
      try {
        const { raw, expiresAt } = await issueRefreshToken(user.id);
        cookies().set({
          name: REFRESH_COOKIE_NAME,
          value: raw,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/api/auth", // refresh 엔드포인트에만 전송
          expires: expiresAt,
          maxAge: REFRESH_TOKEN_TTL_MS / 1000,
        });
      } catch {
        // 발급 실패해도 세션 자체는 유효 — silent fallback
      }
    },
    // 로그아웃 시 refresh token 폐기 + cookie 삭제
    async signOut() {
      try {
        const cookie = cookies().get(REFRESH_COOKIE_NAME);
        if (cookie?.value) {
          await revokeRefreshToken(cookie.value);
        }
        cookies().delete({ name: REFRESH_COOKIE_NAME, path: "/api/auth" });
      } catch {
        // ignore
      }
    },
  },
});
