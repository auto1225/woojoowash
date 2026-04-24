"use server";

import { revalidatePath } from "next/cache";
import { requireOwnedStore } from "@/lib/admin";
import { db } from "@/lib/db";
import type { ReservationStatus } from "@prisma/client";

const VALID_STATUSES: ReservationStatus[] = [
  "PENDING",
  "CONFIRMED",
  "DONE",
  "CANCELED",
];

export async function updateReservationStatus(
  storeId: string,
  reservationId: string,
  status: string,
) {
  await requireOwnedStore(storeId);
  if (!VALID_STATUSES.includes(status as ReservationStatus)) return;
  await db.reservation.update({
    where: { id: reservationId },
    data: { status: status as ReservationStatus },
  });
  revalidatePath(`/admin/stores/${storeId}/reservations`);
  revalidatePath(`/admin/stores/${storeId}`);
}
