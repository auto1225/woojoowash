"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateReservationStatus } from "./actions";

type ReservationRow = {
  id: string;
  startAt: string; // ISO string
  durationMin: number;
  price: number;
  status: "PENDING" | "CONFIRMED" | "DONE" | "CANCELED";
  productTitle: string;
  customerName: string;
  customerPhone: string | null;
  carLabel: string | null;
};

const STATUS_META = {
  PENDING: { label: "결제 대기", cls: "bg-fog text-slate" },
  CONFIRMED: { label: "예약 확정", cls: "bg-accent/10 text-accent-deep" },
  DONE: { label: "완료", cls: "bg-success/10 text-success" },
  CANCELED: { label: "취소", cls: "bg-danger/10 text-danger" },
} as const;

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const WEEKDAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;
type DayKey = (typeof WEEKDAY_KEYS)[number];

export function CalendarReservations({
  storeId,
  month, // "YYYY-MM"
  reservations,
  weeklyClosedDays = [],
  closedDates = [],
}: {
  storeId: string;
  month: string;
  reservations: ReservationRow[];
  weeklyClosedDays?: ReadonlyArray<string>;
  closedDates?: ReadonlyArray<string>;
}) {
  const closedDateSet = useMemo(
    () => new Set(closedDates),
    [closedDates],
  );
  const weeklyClosedSet = useMemo(
    () => new Set(weeklyClosedDays),
    [weeklyClosedDays],
  );
  const router = useRouter();
  const today = new Date();
  const todayKey = toDateKey(today);

  const [selectedKey, setSelectedKey] = useState<string>(() => {
    const inMonth = isSameYm(month, todayKey);
    return inMonth ? todayKey : `${month}-01`;
  });
  const [pending, startTransition] = useTransition();

  const byDay = useMemo(() => {
    const map = new Map<string, ReservationRow[]>();
    for (const r of reservations) {
      const key = toDateKey(new Date(r.startAt));
      const arr = map.get(key) ?? [];
      arr.push(r);
      map.set(key, arr);
    }
    // 각 배열을 시간 순 정렬
    map.forEach((arr) => {
      arr.sort(
        (a: ReservationRow, b: ReservationRow) =>
          new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
      );
    });
    return map;
  }, [reservations]);

  const cells = useMemo(() => buildMonthCells(month), [month]);

  const selected = byDay.get(selectedKey) ?? [];

  const monthStats = useMemo(() => {
    let count = 0;
    let revenue = 0;
    for (const r of reservations) {
      if (r.status === "CANCELED") continue;
      count++;
      if (r.status === "CONFIRMED" || r.status === "DONE") revenue += r.price;
    }
    return { count, revenue };
  }, [reservations]);

  function gotoMonth(delta: number) {
    const [y, m] = month.split("-").map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    const next = `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
    router.push(`?month=${next}`);
  }

  function gotoToday() {
    const ym = `${today.getFullYear()}-${pad(today.getMonth() + 1)}`;
    setSelectedKey(todayKey);
    if (ym !== month) router.push(`?month=${ym}`);
  }

  function changeStatus(reservationId: string, status: string) {
    startTransition(async () => {
      await updateReservationStatus(storeId, reservationId, status);
    });
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => gotoMonth(-1)}
            className="w-9 h-9 rounded-full border border-fog text-slate hover:text-ink"
            aria-label="이전 달"
          >
            ‹
          </button>
          <div className="ww-disp text-[22px] tracking-[-0.02em] min-w-[120px] text-center">
            {month.replace("-", ".")}
          </div>
          <button
            type="button"
            onClick={() => gotoMonth(1)}
            className="w-9 h-9 rounded-full border border-fog text-slate hover:text-ink"
            aria-label="다음 달"
          >
            ›
          </button>
          <button
            type="button"
            onClick={gotoToday}
            className="ml-2 h-9 px-4 rounded-full bg-ink text-white text-[12px] font-bold"
          >
            오늘
          </button>
        </div>
        <div className="flex items-center gap-4 text-[13px]">
          <Stat label="이번 달 예약" value={`${monthStats.count}건`} />
          <Stat
            label="예상 매출"
            value={`${monthStats.revenue.toLocaleString("ko-KR")}원`}
          />
        </div>
      </div>

      <div className="bg-white border border-fog rounded-[20px] overflow-hidden mb-6">
        <div className="grid grid-cols-7 bg-paper text-[11px] font-semibold text-slate">
          {WEEKDAYS.map((d, i) => (
            <div
              key={d}
              className={`py-3 text-center ${
                i === 0 ? "text-danger" : i === 6 ? "text-accent" : ""
              }`}
            >
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 border-t border-fog">
          {cells.map((c, i) => {
            const dayReservations = byDay.get(c.key) ?? [];
            const active = dayReservations.filter(
              (r) => r.status !== "CANCELED",
            ).length;
            const isSelected = c.key === selectedKey;
            const isToday = c.key === todayKey;
            const dow = i % 7;
            const isSun = dow === 0;
            const isSat = dow === 6;
            // 휴무 여부 — 별도 지정일 OR 주간 정기 휴무 요일
            const dayKey: DayKey = WEEKDAY_KEYS[dow];
            const isClosed =
              c.inMonth &&
              (closedDateSet.has(c.key) || weeklyClosedSet.has(dayKey));

            return (
              <button
                type="button"
                key={c.key + i}
                onClick={() => c.inMonth && setSelectedKey(c.key)}
                disabled={!c.inMonth}
                className={`relative min-h-[54px] md:min-h-[64px] p-2 text-left border-l first:border-l-0 border-t border-fog transition ${
                  !c.inMonth
                    ? "bg-paper text-ash cursor-default"
                    : isSelected
                      ? "bg-ink text-white"
                      : "bg-white hover:bg-paper"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[13px] font-bold ww-num ${
                      !c.inMonth
                        ? ""
                        : isSelected
                          ? "text-white"
                          : isSun
                            ? "text-danger"
                            : isSat
                              ? "text-accent"
                              : ""
                    }`}
                  >
                    {c.day}
                  </span>
                  {isToday && !isSelected && (
                    <span className="text-[9px] font-bold text-accent bg-accent/10 px-[6px] py-[1px] rounded-full">
                      오늘
                    </span>
                  )}
                </div>
                {c.inMonth && (isClosed || active > 0) && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {isClosed && (
                      <span
                        className={`text-[10px] font-bold px-[8px] py-[3px] rounded-full ${
                          isSelected
                            ? "bg-white text-danger"
                            : "bg-danger text-white"
                        }`}
                      >
                        휴무
                      </span>
                    )}
                    {active > 0 && (
                      <CountBadge count={active} selected={isSelected} />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <section>
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <div className="text-[11px] font-bold text-slate tracking-[0.1em] mb-1">
              SELECTED DAY
            </div>
            <h2 className="ww-disp text-[22px] tracking-[-0.02em]">
              {formatSelected(selectedKey)}
            </h2>
          </div>
          <div className="text-[13px] text-slate">
            {selected.length}건
            {selected.length > 0 && (
              <span className="ml-3 text-ink ww-num font-semibold">
                {selected
                  .filter(
                    (r) => r.status === "CONFIRMED" || r.status === "DONE",
                  )
                  .reduce((sum, r) => sum + r.price, 0)
                  .toLocaleString("ko-KR")}
                원
              </span>
            )}
          </div>
        </div>

        {selected.length === 0 ? (
          <div className="bg-white border border-fog rounded-[20px] py-16 text-center text-slate text-[14px]">
            이 날짜에는 예약이 없어요.
          </div>
        ) : (
          <div className="bg-white border border-fog rounded-[20px] overflow-hidden">
            <ul className="divide-y divide-fog">
              {selected.map((r) => {
                const t = new Date(r.startAt);
                const meta = STATUS_META[r.status];
                return (
                  <li
                    key={r.id}
                    className="p-5 flex flex-col md:flex-row md:items-center gap-4"
                  >
                    <div className="md:w-[90px] shrink-0 text-center md:text-left">
                      <div className="ww-disp text-[22px] ww-num">
                        {pad(t.getHours())}:{pad(t.getMinutes())}
                      </div>
                      <div className="text-[11px] text-slate">
                        {r.durationMin}분
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[15px] font-extrabold">
                          {r.productTitle}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-[3px] rounded-full ${meta.cls}`}
                        >
                          {meta.label}
                        </span>
                      </div>
                      <div className="text-[12px] text-slate mt-1">
                        {r.customerName}
                        {r.customerPhone ? ` · ${r.customerPhone}` : ""}
                        {r.carLabel ? ` · ${r.carLabel}` : ""}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="ww-num font-semibold text-[14px] min-w-[80px] text-right">
                        {r.price.toLocaleString("ko-KR")}원
                      </div>
                      <select
                        value={r.status}
                        onChange={(e) => changeStatus(r.id, e.target.value)}
                        disabled={pending}
                        className="h-9 px-2 bg-paper border border-fog rounded-[8px] text-[12px] font-semibold"
                      >
                        <option value="PENDING">결제 대기</option>
                        <option value="CONFIRMED">예약 확정</option>
                        <option value="DONE">완료</option>
                        <option value="CANCELED">취소</option>
                      </select>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-[11px] text-slate">{label}</span>
      <span className="ww-num font-bold">{value}</span>
    </div>
  );
}

function CountBadge({
  count,
  selected,
}: {
  count: number;
  selected: boolean;
}) {
  // 예약 수에 따른 시각적 강조
  const tone =
    count >= 6
      ? { bg: "bg-danger text-white", label: `${count}건` }
      : count >= 3
        ? { bg: "bg-warning text-white", label: `${count}건` }
        : { bg: "bg-accent text-white", label: `${count}건` };
  return (
    <span
      className={`text-[10px] font-bold px-[8px] py-[3px] rounded-full ${
        selected ? "bg-white text-ink" : tone.bg
      }`}
    >
      {tone.label}
    </span>
  );
}

// ---- date helpers ----

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function isSameYm(ym: string, key: string): boolean {
  return key.startsWith(ym);
}

function buildMonthCells(ym: string): Array<{
  key: string;
  day: number;
  inMonth: boolean;
}> {
  const [y, m] = ym.split("-").map(Number);
  const first = new Date(y, m - 1, 1);
  const last = new Date(y, m, 0);
  const startDow = first.getDay(); // 0~6 (일~토)
  const cells: Array<{ key: string; day: number; inMonth: boolean }> = [];

  // 이전 달 꼬리
  const prevLast = new Date(y, m - 1, 0);
  for (let i = startDow - 1; i >= 0; i--) {
    const day = prevLast.getDate() - i;
    const d = new Date(y, m - 2, day);
    cells.push({
      key: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(day)}`,
      day,
      inMonth: false,
    });
  }

  // 이번 달
  for (let d = 1; d <= last.getDate(); d++) {
    cells.push({
      key: `${y}-${pad(m)}-${pad(d)}`,
      day: d,
      inMonth: true,
    });
  }

  // 다음 달 머리 — 6주(42칸) 채움
  while (cells.length < 42) {
    const idx = cells.length - (startDow + last.getDate()) + 1;
    const d = new Date(y, m, idx);
    cells.push({
      key: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
      day: d.getDate(),
      inMonth: false,
    });
  }

  return cells;
}

function formatSelected(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const dow = WEEKDAYS[date.getDay()];
  return `${y}. ${pad(m)}. ${pad(d)} (${dow})`;
}
