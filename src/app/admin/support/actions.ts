"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/console";
import { db } from "@/lib/db";
import type { TicketStatus } from "@prisma/client";

export async function sendAdminMessage(ticketId: string, body: string) {
  await requireAdmin();
  const text = body.trim();
  if (!text) return { error: "메시지를 입력해 주세요." };

  await db.$transaction([
    db.supportMessage.create({
      data: { ticketId, sender: "ADMIN", body: text },
    }),
    db.supportTicket.update({
      where: { id: ticketId },
      data: {
        lastMessageAt: new Date(),
        status: "ANSWERED",
        customerUnread: { increment: 1 },
      },
    }),
  ]);

  revalidatePath(`/admin/support/${ticketId}`);
  revalidatePath("/admin/support");
  revalidatePath(`/app/support/${ticketId}`);
  revalidatePath("/app/support");
  return { ok: true };
}

export async function markAdminRead(ticketId: string) {
  await requireAdmin();
  await db.supportTicket.update({
    where: { id: ticketId },
    data: { adminUnread: 0 },
  });
  revalidatePath("/admin/support");
  revalidatePath(`/admin/support/${ticketId}`);
}

export async function updateTicketStatus(ticketId: string, status: string) {
  await requireAdmin();
  const valid: TicketStatus[] = ["OPEN", "ANSWERED", "CLOSED"];
  if (!valid.includes(status as TicketStatus)) return;
  await db.supportTicket.update({
    where: { id: ticketId },
    data: { status: status as TicketStatus },
  });
  revalidatePath("/admin/support");
  revalidatePath(`/admin/support/${ticketId}`);
}
