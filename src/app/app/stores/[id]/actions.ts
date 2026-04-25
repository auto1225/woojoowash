"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function toggleFavorite(
  storeId: string,
): Promise<
  | { ok: true; favorited: boolean }
  | { ok: false; error: string; needLogin?: boolean }
> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "로그인이 필요해요.", needLogin: true };
  }
  const exists = await db.favorite.findUnique({
    where: {
      userId_storeId: { userId: session.user.id, storeId },
    },
  });
  if (exists) {
    await db.favorite.delete({
      where: {
        userId_storeId: { userId: session.user.id, storeId },
      },
    });
    revalidatePath(`/app/stores/${storeId}`);
    revalidatePath("/app/favorites");
    return { ok: true, favorited: false };
  }
  await db.favorite.create({
    data: { userId: session.user.id, storeId },
  });
  revalidatePath(`/app/stores/${storeId}`);
  revalidatePath("/app/favorites");
  return { ok: true, favorited: true };
}
