"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { sendAdminMessage, updateTicketStatus } from "../actions";
import type { TicketStatus } from "@prisma/client";

type Message = {
  id: string;
  sender: "CUSTOMER" | "ADMIN" | "SYSTEM";
  body: string;
  createdAt: string;
};

export function AdminChat({
  ticketId,
  currentStatus,
  initial,
}: {
  ticketId: string;
  currentStatus: TicketStatus;
  initial: Message[];
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initial);
  const [input, setInput] = useState("");
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<TicketStatus>(currentStatus);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(initial);
  }, [initial]);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length]);

  useEffect(() => {
    const id = window.setInterval(() => router.refresh(), 5000);
    return () => window.clearInterval(id);
  }, [router]);

  function send() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    const tempId = `temp-${Date.now()}`;
    setMessages((cur) => [
      ...cur,
      {
        id: tempId,
        sender: "ADMIN",
        body: text,
        createdAt: new Date().toISOString(),
      },
    ]);
    startTransition(async () => {
      const r = await sendAdminMessage(ticketId, text);
      if (r?.error) {
        setMessages((cur) => cur.filter((m) => m.id !== tempId));
        setInput(text);
      } else {
        setStatus("ANSWERED");
        router.refresh();
      }
    });
  }

  function onStatusChange(next: TicketStatus) {
    setStatus(next);
    startTransition(async () => {
      await updateTicketStatus(ticketId, next);
    });
  }

  return (
    <div className="bg-white border border-fog rounded-[16px] flex flex-col h-[600px]">
      <div className="shrink-0 px-5 py-3 border-b border-fog flex items-center justify-between">
        <div className="text-[13px] font-bold">대화</div>
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as TicketStatus)}
          disabled={pending}
          className="h-9 px-3 bg-paper border border-fog rounded-[8px] text-[12px] font-semibold"
        >
          <option value="OPEN">상담중</option>
          <option value="ANSWERED">답변 완료</option>
          <option value="CLOSED">종료</option>
        </select>
      </div>

      <div
        ref={listRef}
        className="flex-1 overflow-y-auto ww-no-scrollbar px-5 py-4 flex flex-col gap-3 bg-paper"
      >
        {messages.map((m, i) => {
          if (m.sender === "SYSTEM") {
            return (
              <div key={m.id} className="my-2 text-center">
                <span className="text-[11px] text-slate bg-white border border-fog rounded-full px-3 py-[4px]">
                  {m.body}
                </span>
              </div>
            );
          }
          const mine = m.sender === "ADMIN";
          const prev = messages[i - 1];
          const showHeader = !prev || prev.sender !== m.sender;
          return (
            <div
              key={m.id}
              className={`flex flex-col ${mine ? "items-end" : "items-start"}`}
            >
              {showHeader && (
                <div
                  className={`text-[11px] text-slate font-semibold mb-1 px-1 ${mine ? "text-right" : ""}`}
                >
                  {mine ? "상담사 (나)" : "고객"}
                </div>
              )}
              <div
                className={`px-[14px] py-[10px] rounded-[14px] text-[14px] leading-[1.55] max-w-[70%] whitespace-pre-wrap ${
                  mine
                    ? "bg-accent text-white rounded-br-[4px]"
                    : "bg-white border border-fog rounded-bl-[4px]"
                }`}
              >
                {m.body}
              </div>
              <div
                className={`text-[10px] text-slate mt-1 ww-num px-1 ${mine ? "" : ""}`}
              >
                {format(new Date(m.createdAt), "M/d a h:mm", { locale: ko })}
              </div>
            </div>
          );
        })}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="shrink-0 p-3 flex gap-2 items-end border-t border-fog"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={2}
          placeholder="답변을 입력하세요 (Enter 전송, Shift+Enter 줄바꿈)"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          className="flex-1 p-3 bg-paper border border-fog rounded-[12px] text-[14px] outline-none focus:border-ink resize-none"
        />
        <button
          type="submit"
          disabled={pending || !input.trim()}
          className="h-12 px-5 rounded-full btn-brand text-[13px]"
        >
          전송
        </button>
      </form>
    </div>
  );
}
