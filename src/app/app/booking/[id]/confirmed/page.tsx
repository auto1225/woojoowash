import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { AppBar } from "@/components/app/AppBar";
import { IconCal, IconCheck, IconMsg, IconPin } from "@/components/icons";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ConfirmedPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session?.user) redirect("/app/login");

  const reservation = await db.reservation.findFirst({
    where: { id: params.id, userId: session.user.id },
    include: {
      store: { select: { name: true, address: true } },
      product: { select: { title: true } },
    },
  });
  if (!reservation) return notFound();

  return (
    <div className="min-h-screen bg-paper pb-[100px]">
      <AppBar title="예약 완료" showBack={false} />

      <section className="px-5 pt-10 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-ink text-white flex items-center justify-center mb-6">
          <IconCheck size={32} stroke={2.5} />
        </div>
        <div className="ww-disp text-[26px] tracking-[-0.02em] mb-2">
          예약이 완료됐어요
        </div>
        <div className="text-[13px] text-slate">
          예약 15분 전 알림을 보내드릴게요.
        </div>
      </section>

      <section className="px-5 pt-8">
        <div className="bg-white rounded-[22px] border border-fog overflow-hidden">
          <div className="p-6">
            <div className="text-[11px] text-slate font-medium mb-1">
              {reservation.store.name}
            </div>
            <div className="text-[18px] font-extrabold tracking-[-0.3px] mb-5">
              {reservation.product.title}
            </div>
            <Row
              l="일시"
              v={format(reservation.startAt, "yyyy-MM-dd (EEE) HH:mm", {
                locale: ko,
              })}
            />
            <Row l="소요" v={`${reservation.durationMin}분`} />
            <Row
              l="결제"
              v={`${reservation.price.toLocaleString("ko-KR")}원`}
            />
            <Row l="주소" v={reservation.store.address} />
          </div>
          <div className="relative h-6">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-dashed border-fog" />
            <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-paper" />
            <span className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-paper" />
          </div>
          <div className="p-6 text-center">
            <div className="mx-auto w-36 h-36 bg-cloud rounded-[14px] flex items-center justify-center">
              <QRDots seed={reservation.id} />
            </div>
            <div className="text-[12px] text-slate mt-3">
              입장 시 이 QR을 보여주세요
            </div>
            <div className="text-[10px] text-ash ww-num mt-1">
              예약번호 {reservation.id.slice(-8).toUpperCase()}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pt-5 grid grid-cols-3 gap-2">
        {[
          { I: IconPin, l: "길찾기" },
          { I: IconMsg, l: "매장 문의" },
          { I: IconCal, l: "일정 추가" },
        ].map((a) => (
          <div
            key={a.l}
            className="bg-white rounded-[14px] border border-fog py-4 flex flex-col items-center gap-2"
          >
            <a.I size={22} stroke={1.6} />
            <span className="text-[12px] font-semibold">{a.l}</span>
          </div>
        ))}
      </section>

      <div className="fixed left-0 right-0 bottom-0 flex justify-center">
        <div className="w-full max-w-app bg-white border-t border-fog px-4 py-3 flex gap-2">
          <Link
            href="/app"
            className="flex-1 h-14 rounded-full bg-cloud text-ink font-bold text-[15px] flex items-center justify-center"
          >
            홈으로
          </Link>
          <Link
            href="/app/reservations"
            className="flex-1 h-14 rounded-full bg-ink text-white font-bold text-[15px] flex items-center justify-center"
          >
            예약 내역
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({ l, v }: { l: string; v: string }) {
  return (
    <div className="flex items-center justify-between py-[6px] gap-4">
      <div className="text-[12px] text-slate shrink-0">{l}</div>
      <div className="text-[13px] font-bold ww-num text-right">{v}</div>
    </div>
  );
}

function QRDots({ seed }: { seed: string }) {
  // 예약 id 기반 의사-QR 패턴 (실제 QR은 Sprint 4에서 qrcode 라이브러리로)
  const hash = Array.from(seed).reduce((a, c) => a + c.charCodeAt(0), 0);
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <rect width="120" height="120" fill="#F2F2F4" />
      {Array.from({ length: 18 }).map((_, r) =>
        Array.from({ length: 18 }).map((__, c) => {
          const bit = (r * 31 + c * 17 + hash) % 13 < 6;
          return (
            <rect
              key={`${r}-${c}`}
              x={c * 6 + 3}
              y={r * 6 + 3}
              width="5"
              height="5"
              fill={bit ? "#0A0A0B" : "transparent"}
            />
          );
        }),
      )}
      <rect x="4" y="4" width="22" height="22" fill="#0A0A0B" />
      <rect x="8" y="8" width="14" height="14" fill="#F2F2F4" />
      <rect x="11" y="11" width="8" height="8" fill="#0A0A0B" />
      <rect x="94" y="4" width="22" height="22" fill="#0A0A0B" />
      <rect x="98" y="8" width="14" height="14" fill="#F2F2F4" />
      <rect x="101" y="11" width="8" height="8" fill="#0A0A0B" />
      <rect x="4" y="94" width="22" height="22" fill="#0A0A0B" />
      <rect x="8" y="98" width="14" height="14" fill="#F2F2F4" />
      <rect x="11" y="101" width="8" height="8" fill="#0A0A0B" />
    </svg>
  );
}
