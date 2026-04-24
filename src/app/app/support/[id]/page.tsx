import { notFound, redirect } from "next/navigation";
import { AppBar } from "@/components/app/AppBar";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { markCustomerRead } from "../actions";
import { ChatThread } from "./ChatThread";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SupportChatPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session?.user) redirect("/app/login");

  const ticket = await db.supportTicket.findFirst({
    where: { id: params.id, userId: session.user.id },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!ticket) return notFound();

  // 고객이 열면 읽음 처리 (서버 액션 호출은 useEffect 로 client 에서 하는게 더 정확하지만
  // 단순화 차원에서 서버에서 직접 반영)
  if (ticket.customerUnread > 0) {
    await markCustomerRead(ticket.id);
  }

  return (
    <div className="h-[100dvh] flex flex-col bg-paper">
      <AppBar title="1:1 문의" />
      <ChatThread
        ticketId={ticket.id}
        initial={ticket.messages.map((m) => ({
          id: m.id,
          sender: m.sender,
          body: m.body,
          createdAt: m.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
