"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/console";
import { db } from "@/lib/db";

export async function toggleUserStatus(userId: string, next: "ACTIVE" | "SUSPENDED") {
  await requireAdmin();
  await db.user.update({
    where: { id: userId },
    data: { status: next },
  });
  revalidatePath("/admin/users");
}

export async function changeUserRole(
  userId: string,
  role: "USER" | "OWNER" | "ADMIN",
) {
  await requireAdmin();
  await db.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/users");
}

export async function updateUser(
  userId: string,
  data: {
    name: string | null;
    phone: string | null;
    role: "USER" | "OWNER" | "ADMIN";
  },
): Promise<{ ok?: true; error?: string }> {
  await requireAdmin();
  if (data.phone) {
    const dup = await db.user.findFirst({
      where: { phone: data.phone, NOT: { id: userId } },
      select: { id: true },
    });
    if (dup) return { error: "이미 다른 회원이 사용 중인 전화번호예요." };
  }
  await db.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      phone: data.phone,
      role: data.role,
    },
  });
  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${userId}`);
  return { ok: true };
}
