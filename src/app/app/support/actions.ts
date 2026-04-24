"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function startOrResumeTicket(_formData?: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/app/login?callbackUrl=/app/support");

  // 열린 티켓이 있으면 재사용
  const open = await db.supportTicket.findFirst({
    where: { userId: session.user.id, status: { not: "CLOSED" } },
    orderBy: { lastMessageAt: "desc" },
  });
  if (open) {
    redirect(`/app/support/${open.id}`);
  }

  const ticket = await db.supportTicket.create({
    data: {
      userId: session.user.id,
      status: "OPEN",
      messages: {
        create: {
          sender: "SYSTEM",
          body:
            "안녕하세요, 우주워시 고객센터입니다. 문의 내용을 남겨주시면 빠르게 도와드릴게요.",
        },
      },
    },
  });
  redirect(`/app/support/${ticket.id}`);
}

export async function sendCustomerMessage(ticketId: string, body: string) {
  const session = await auth();
  if (!session?.user) return { error: "로그인이 필요해요." };
  const text = body.trim();
  if (!text) return { error: "메시지를 입력해 주세요." };

  const ticket = await db.supportTicket.findFirst({
    where: { id: ticketId, userId: session.user.id },
  });
  if (!ticket) return { error: "문의를 찾을 수 없어요." };

  await db.$transaction([
    db.supportMessage.create({
      data: { ticketId, sender: "CUSTOMER", body: text },
    }),
    db.supportTicket.update({
      where: { id: ticketId },
      data: {
        lastMessageAt: new Date(),
        status: "OPEN",
        adminUnread: { increment: 1 },
      },
    }),
  ]);

  revalidatePath(`/app/support/${ticketId}`);
  revalidatePath("/app/support");
  revalidatePath("/admin/support");
  revalidatePath(`/admin/support/${ticketId}`);
  return { ok: true };
}

export async function markCustomerRead(ticketId: string) {
  const session = await auth();
  if (!session?.user) return;
  await db.supportTicket.updateMany({
    where: { id: ticketId, userId: session.user.id },
    data: { customerUnread: 0 },
  });
  revalidatePath(`/app/support/${ticketId}`);
  revalidatePath("/app/support");
}
