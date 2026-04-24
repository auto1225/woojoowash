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
