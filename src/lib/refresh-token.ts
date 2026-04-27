import { createHash, randomBytes } from "node:crypto";
import { db } from "@/lib/db";

/** 30일 유효 리프레시 토큰 */
export const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;
export const REFRESH_COOKIE_NAME = "ww_rt";

/** 새 토큰(plain) 생성 — base64url, 충돌 가능성 ≪ 1/2^256 */
export function generateRefreshTokenRaw(): string {
  return randomBytes(32).toString("base64url");
}

/** 저장·조회 시 raw 가 아닌 SHA-256 해시로 비교 */
export function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

/** 발급 + DB 저장. 반환값은 client cookie 에 넣을 raw 토큰 */
export async function issueRefreshToken(
  userId: string,
  device?: string,
): Promise<{ raw: string; expiresAt: Date }> {
  const raw = generateRefreshTokenRaw();
  const tokenHash = hashToken(raw);
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
  await db.refreshToken.create({
    data: { userId, tokenHash, device, expiresAt },
  });
  return { raw, expiresAt };
}

/** 검증 — 유효한 토큰이면 user 반환, 아니면 null */
export async function verifyRefreshToken(raw: string): Promise<{
  userId: string;
  email: string | null;
  role: string;
  tokenId: string;
} | null> {
  if (!raw || typeof raw !== "string") return null;
  const tokenHash = hashToken(raw);
  const row = await db.refreshToken.findUnique({
    where: { tokenHash },
    include: {
      user: {
        select: { id: true, email: true, role: true, status: true },
      },
    },
  });
  if (!row) return null;
  if (row.revokedAt) return null;
  if (row.expiresAt.getTime() <= Date.now()) return null;
  if (row.user.status !== "ACTIVE") return null;
  // 마지막 사용 시각 업데이트 (선택, best-effort)
  void db.refreshToken
    .update({
      where: { id: row.id },
      data: { lastUsedAt: new Date() },
    })
    .catch(() => null);
  return {
    userId: row.user.id,
    email: row.user.email,
    role: row.user.role,
    tokenId: row.id,
  };
}

/** 단일 토큰 폐기 */
export async function revokeRefreshToken(raw: string): Promise<void> {
  if (!raw) return;
  const tokenHash = hashToken(raw);
  await db.refreshToken
    .updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    })
    .catch(() => null);
}

/** 사용자의 모든 토큰 폐기 (전체 로그아웃) */
export async function revokeAllUserTokens(userId: string): Promise<void> {
  await db.refreshToken
    .updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    })
    .catch(() => null);
}
