"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { sendCustomerMessage } from "../actions";

type Message = {
  id: string;
  sender: "CUSTOMER" | "ADMIN" | "SYSTEM";
  body: string;
  createdAt: string;
};

export function ChatThread({
  ticketId,
  initial,
}: {
  ticketId: string;
  initial: Message[];
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initial);
  const [input, setInput] = useState("");
  const [pending, startTransition] = useTransition();
  const listRef = useRef<HTMLDivElement>(null);

  // initial 이 갱신되면 동기화
  useEffect(() => {
    setMessages(initial);
  }, [initial]);

  // 새 메시지 오면 스크롤 하단으로
  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length]);

  // 5초마다 서버 상태 갱신 (관리자 답변 폴링)
  useEffect(() => {
    const id = window.setInterval(() => {
      router.refresh();
    }, 5000);
    return () => window.clearInterval(id);
  }, [router]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    // Optimistic
    const tempId = `temp-${Date.now()}`;
    setMessages((cur) => [
      ...cur,
      {
        id: tempId,
        sender: "CUSTOMER",
        body: text,
        createdAt: new Date().toISOString(),
      },
    ]);
    startTransition(async () => {
      const r = await sendCustomerMessage(ticketId, text);
      if (r?.error) {
        // 실패 시 롤백 + 입력 복구
        setMessages((cur) => cur.filter((m) => m.id !== tempId));
        setInput(text);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <>
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto ww-no-scrollbar px-4 py-4 flex flex-col gap-3"
      >
        {messages.map((m, i) => {
          if (m.sender === "SYSTEM") {
            return (
              <div key={m.id} className="my-2 text-center">
                <span className="text-[11px] text-slate bg-cloud rounded-full px-3 py-[4px]">
                  {m.body}
                </span>
              </div>
            );
          }
          const mine = m.sender === "CUSTOMER";
          const prev = messages[i - 1];
          const showTime =
            !prev ||
            prev.sender !== m.sender ||
            new Date(m.createdAt).getTime() -
              new Date(prev.createdAt).getTime() >
              60_000;
          return (
            <div
              key={m.id}
              className={`flex flex-col ${mine ? "items-end" : "items-start"}`}
            >
              {!mine && showTime && (
                <div className="text-[11px] text-slate font-semibold mb-1 px-1">
                  상담사
                </div>
              )}
              <div className="flex items-end gap-2 max-w-[82%]">
                {!mine && (
                  <div
                    className={`w-[24px] h-[24px] rounded-full bg-ink text-white text-[10px] font-bold flex items-center justify-center shrink-0 ${
                      showTime ? "" : "invisible"
                    }`}
                  >
                    WW
                  </div>
                )}
                <div
                  className={`px-[14px] py-[10px] rounded-[16px] text-[14px] leading-[1.55] whitespace-pre-wrap ${
                    mine
                      ? "bg-accent text-white rounded-br-[4px]"
                      : "bg-white border border-fog rounded-bl-[4px]"
                  }`}
                >
                  {m.body}
                </div>
              </div>
              <div
                className={`text-[10px] text-slate mt-1 ww-num px-1 ${mine ? "" : "ml-[32px]"}`}
              >
                {format(new Date(m.createdAt), "a h:mm", { locale: ko })}
              </div>
            </div>
          );
        })}
      </div>

      <form
        onSubmit={onSubmit}
        className="shrink-0 bg-white border-t border-fog p-3 flex gap-2 items-end"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={1}
          placeholder="문의 내용을 입력하세요"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit(e as unknown as React.FormEvent);
            }
          }}
          className="flex-1 min-h-[44px] max-h-[120px] p-3 bg-paper border border-fog rounded-[14px] text-[14px] outline-none focus:border-ink resize-none"
        />
        <button
          type="submit"
          disabled={pending || !input.trim()}
          className="w-11 h-11 rounded-full bg-accent text-white font-bold text-[18px] disabled:opacity-40 flex items-center justify-center shrink-0"
          aria-label="전송"
        >
          ↑
        </button>
      </form>
    </>
  );
}
