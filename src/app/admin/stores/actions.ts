"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/console";
import { db } from "@/lib/db";

export async function setStoreOpen(storeId: string, open: boolean) {
  await requireAdmin();
  await db.store.update({ where: { id: storeId }, data: { open } });
  revalidatePath("/admin/stores");
  revalidatePath(`/app/stores/${storeId}`);
  revalidatePath("/stores");
}

export async function setStoreOwner(storeId: string, ownerId: string | null) {
  await requireAdmin();
  await db.store.update({
    where: { id: storeId },
    data: { ownerId },
  });
  revalidatePath("/admin/stores");
}
