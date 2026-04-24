import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email ?? "").toLowerCase().trim();
  const password = String(body.password ?? "");
  const name = body.name ? String(body.name).trim() : null;

  if (!email || !password) {
    return NextResponse.json(
      { error: "이메일과 비밀번호를 입력해 주세요." },
      { status: 400 },
    );
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "비밀번호는 8자 이상이어야 해요." },
      { status: 400 },
    );
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "이미 가입된 이메일이에요." },
      { status: 409 },
    );
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: { email, password: hashed, name },
    select: { id: true, email: true, name: true },
  });

  return NextResponse.json(user, { status: 201 });
}
