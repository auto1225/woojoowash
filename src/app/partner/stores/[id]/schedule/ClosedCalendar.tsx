"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  INITIAL_SAVE_STATE,
  SaveButton,
  SaveToast,
  type SaveActionState,
} from "@/components/admin/SaveToast";
import { useFormState } from "react-dom";
import { DAY_KEYS, DAY_LABEL, type DayKey } from "./types";

export type ClosedDayItem = {
  id: string;
  date: string; // ISO yyyy-mm-dd
  reason: string | null;
};

const WEEKDAY_HEADERS: DayKey[] = [
  "sun",
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
];

export function ClosedCalendar({
  closedDays,
  weeklyClosedDays,
  onWeeklyClosedChange,
  addAction,
  removeAction,
}: {
  closedDays: ClosedDayItem[];
  weeklyClosedDays: DayKey[];
  onWeeklyClosedChange: (next: DayKey[]) => void;
  addAction: (
    prev: SaveActionState,
    formData: FormData,
  ) => Promise<SaveActionState>;
  removeAction: (id: string) => Promise<void>;
}) {
  function toggleWeekly(day: DayKey) {
    onWeeklyClosedChange(
      weeklyClosedDays.includes(day)
        ? weeklyClosedDays.filter((d) => d !== day)
        : [...weeklyClosedDays, day],
    );
  }
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [addState, addFormAction] = useFormState(addAction, INITIAL_SAVE_STATE);

  // 캘린더 시작 월 (this month)
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const [monthCursor, setMonthCursor] = useState<Date>(() => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  // 빠른 lookup 셋
  const closedDateMap = useMemo(() => {
    const m = new Map<string, ClosedDayItem>();
    for (const c of closedDays) {
      const iso = c.date.slice(0, 10);
      m.set(iso, c);
    }
    return m;
  }, [closedDays]);

  function shiftMonth(delta: number) {
    setMonthCursor((cur) => {
      const next = new Date(cur);
      next.setMonth(next.getMonth() + delta);
      return next;
    });
  }

  function onDeleteRow(id: string) {
    if (pending) return;
    startTransition(async () => {
      await removeAction(id);
      router.refresh();
    });
  }

  // 달력 셀 만들기 (해당 월의 첫 주 ~ 마지막 주)
  const cells = useMemo(() => {
    const firstOfMonth = new Date(
      monthCursor.getFullYear(),
      monthCursor.getMonth(),
      1,
    );
    const startWeekday = firstOfMonth.getDay(); // 0 = sun
    const start = new Date(firstOfMonth);
    start.setDate(firstOfMonth.getDate() - startWeekday);

    const lastOfMonth = new Date(
      monthCursor.getFullYear(),
      monthCursor.getMonth() + 1,
      0,
    );
    const endWeekday = lastOfMonth.getDay();
    const end = new Date(lastOfMonth);
    end.setDate(lastOfMonth.getDate() + (6 - endWeekday));

    const days: Date[] = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    return days;
  }, [monthCursor]);

  return (
    <div className="bg-white border border-fog rounded-[20px] p-8 flex flex-col gap-6">
      <div className="text-[15px] font-extrabold">휴무일 캘린더</div>

      {/* 주간 정기 휴무 (요일 토글) */}
      <div>
        <div className="text-[13px] font-extrabold mb-2">주간 정기 휴무</div>
        <div className="text-[12px] text-slate mb-3 leading-[1.6]">
          체크한 요일은 매주 휴무로 표시되고, 앱에서 예약을 받지 않아요.
        </div>
        <div className="flex flex-wrap gap-2">
          {DAY_KEYS.map((d) => {
            const checked = weeklyClosedDays.includes(d);
            return (
              <button
                key={d}
                type="button"
                onClick={() => toggleWeekly(d)}
                aria-pressed={checked}
                className={`h-11 min-w-[72px] px-4 rounded-full text-[13px] font-bold inline-flex items-center justify-center gap-2 transition border ${
                  checked
                    ? "bg-danger text-white border-danger shadow-[0_4px_12px_rgba(255,75,85,0.3)]"
                    : "bg-white text-graphite border-fog hover:border-ink hover:text-ink"
                }`}
              >
                {checked && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                )}
                {DAY_LABEL[d]}
                {checked && (
                  <span className="text-[10px] font-bold opacity-80">
                    휴무
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 캘린더 본체 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            className="w-9 h-9 inline-flex items-center justify-center rounded-full border border-fog hover:bg-paper transition"
            aria-label="이전 달"
          >
            ‹
          </button>
          <div className="text-[15px] font-extrabold ww-num">
            {format(monthCursor, "yyyy년 M월", { locale: ko })}
          </div>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            className="w-9 h-9 inline-flex items-center justify-center rounded-full border border-fog hover:bg-paper transition"
            aria-label="다음 달"
          >
            ›
          </button>
        </div>

        <div className="grid grid-cols-7 mb-1">
          {WEEKDAY_HEADERS.map((d) => (
            <div
              key={d}
              className={`text-center text-[11px] font-bold py-1 ${
                d === "sun"
                  ? "text-danger"
                  : d === "sat"
                    ? "text-accent"
                    : "text-graphite"
              }`}
            >
              {DAY_LABEL[d]}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-[3px]">
          {cells.map((d, i) => {
            const iso = format(d, "yyyy-MM-dd");
            const inMonth = d.getMonth() === monthCursor.getMonth();
            const isPast = d < today;
            const dayKey = WEEKDAY_HEADERS[d.getDay()];
            const weeklyClosed = weeklyClosedDays.includes(dayKey);
            const specificClosed = !!closedDateMap.get(iso);
            const isToday = d.getTime() === today.getTime();
            // 오늘부터의 휴무만 빨갛게 강조 — 과거 날짜는 그대로 둠
            const showAsClosed =
              inMonth && !isPast && (specificClosed || weeklyClosed);
            return (
              <div
                key={i}
                className={`relative aspect-[2/1] rounded-[8px] flex flex-row items-center justify-center gap-1 text-[12px] transition ${
                  !inMonth
                    ? "text-ash bg-paper/40"
                    : showAsClosed
                      ? "bg-danger/10 text-danger font-bold"
                      : isPast
                        ? "bg-paper text-slate"
                        : "bg-white border border-fog text-ink"
                } ${isToday ? "ring-2 ring-ink ring-offset-1" : ""}`}
              >
                <span
                  className={`ww-num ${
                    inMonth && !showAsClosed && !isPast && d.getDay() === 0
                      ? "text-danger"
                      : ""
                  } ${
                    inMonth && !showAsClosed && !isPast && d.getDay() === 6
                      ? "text-accent"
                      : ""
                  }`}
                >
                  {d.getDate()}
                </span>
                {showAsClosed && (
                  <span className="text-[9px] font-bold">휴무</span>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-slate">
          <span className="inline-flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-danger/30 border border-danger/40" />
            휴무 (정기 · 지정)
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-paper border border-fog" />
            지난 날짜
          </span>
        </div>
      </div>

      {/* 별도 휴무일 추가 */}
      <div>
        <div className="text-[13px] font-extrabold mb-2">별도 휴무일 추가</div>
        <form action={addFormAction} className="flex gap-2 flex-wrap">
          <input
            type="date"
            name="date"
            required
            className="flex-1 min-w-[160px] h-11 px-3 bg-paper border border-fog rounded-[10px] text-[14px]"
          />
          <input
            type="text"
            name="reason"
            placeholder="사유 (선택)"
            className="flex-[2] min-w-[160px] h-11 px-3 bg-paper border border-fog rounded-[10px] text-[14px]"
          />
          <SaveButton
            label="추가"
            pendingLabel="추가 중..."
            className="h-11 px-5 rounded-full bg-ink text-white text-[13px] font-bold disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
          />
        </form>
        <SaveToast state={addState} successMessage="휴무일을 추가했어요" />
      </div>

      {/* 등록된 별도 휴무일 */}
      <div>
        <div className="text-[13px] font-extrabold mb-2">
          등록된 별도 휴무일
        </div>
        {closedDays.length === 0 ? (
          <div className="text-[13px] text-slate py-4">
            등록된 별도 휴무일이 없어요.
          </div>
        ) : (
          <ul className="flex flex-col divide-y divide-fog border border-fog rounded-[12px]">
            {closedDays.map((d) => (
              <li
                key={d.id}
                className="py-3 px-4 flex items-center justify-between"
              >
                <div>
                  <span className="ww-num font-bold">
                    {format(new Date(d.date), "yyyy-MM-dd (EEE)", {
                      locale: ko,
                    })}
                  </span>
                  {d.reason && (
                    <span className="text-[12px] text-slate ml-2">
                      · {d.reason}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onDeleteRow(d.id)}
                  disabled={pending}
                  className="h-8 px-3 rounded-full border border-fog bg-white text-danger text-[11px] font-bold hover:bg-danger/5 hover:border-danger/30 transition disabled:opacity-50"
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
