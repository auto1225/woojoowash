"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { IconClose } from "@/components/icons";
import {
  DAY_KEYS,
  type DayHours,
  type DayKey,
  type StoreHoursV2,
} from "@/app/partner/stores/[id]/schedule/types";

const HOURS_AM = [8, 9, 10, 11];
const HOURS_PM = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
const MINUTES = [0, 10, 20, 30, 40, 50];
const DATE_RANGE = 14;

type Reservation = { startAt: string; durationMin: number };

export function DatePickerClient({
  hours: storeHours,
  closedDates,
  reservations,
  productDuration,
}: {
  hours: StoreHoursV2;
  closedDates: string[]; // ISO yyyy-mm-dd
  reservations: Reservation[];
  productDuration: number;
}) {
  const router = useRouter();
  const params = useParams<{ id: string; pid: string }>();
  const search = useSearchParams();
  const mode = search.get("mode");

  const closedDateSet = useMemo(() => new Set(closedDates), [closedDates]);

  // 오늘부터 N일치 날짜 strip (휴무 여부 표시)
  const dates = useMemo(() => {
    const out: Array<{
      key: number;
      date: Date;
      dateKey: string;
      day: number;
      weekday: string;
      dayKey: DayKey;
      closed: boolean;
    }> = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < DATE_RANGE; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dateKey = toDateKey(d);
      const weekday = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
      const dayKey = DAY_KEYS[(d.getDay() + 6) % 7]; // 0=일 → 6, 1=월 → 0 ...
      const weeklyClosed = storeHours.weeklyClosedDays.includes(dayKey);
      const specificClosed = closedDateSet.has(dateKey);
      out.push({
        key: i,
        date: d,
        dateKey,
        day: d.getDate(),
        weekday,
        dayKey,
        closed: weeklyClosed || specificClosed,
      });
    }
    return out;
  }, [storeHours.weeklyClosedDays, closedDateSet]);

  // 첫 영업일을 기본 선택
  const firstOpenIdx = dates.findIndex((d) => !d.closed);
  const initialDateIdx = firstOpenIdx >= 0 ? firstOpenIdx : 0;
  const [dateIdx, setDateIdx] = useState(initialDateIdx);
  const [hour, setHour] = useState<number | null>(null);
  const [minute, setMinute] = useState<number | null>(null);

  const selected = dates[dateIdx];

  // 선택일의 영업시간 (전체 vs 요일별)
  const dayHours: DayHours | null = useMemo(() => {
    if (selected.closed) return null;
    if (storeHours.mode === "all") return storeHours.all;
    return storeHours.perDay[selected.dayKey];
  }, [selected, storeHours]);

  // 선택일에 잡힌 예약 시작/종료 (날짜 같은 것만)
  const dayReservations = useMemo(() => {
    return reservations
      .map((r) => ({
        start: new Date(r.startAt),
        durationMin: r.durationMin,
      }))
      .filter((r) => toDateKey(r.start) === selected.dateKey)
      .map((r) => ({
        start: r.start.getTime(),
        end: r.start.getTime() + r.durationMin * 60_000,
      }));
  }, [reservations, selected.dateKey]);

  function isSlotAvailable(h: number, m: number): {
    ok: boolean;
    reason?: "past" | "outOfHours" | "break" | "reserved" | "noClose";
  } {
    if (!dayHours) return { ok: false, reason: "outOfHours" };
    const start = new Date(selected.date);
    start.setHours(h, m, 0, 0);
    const end = new Date(start.getTime() + productDuration * 60_000);

    // 과거
    if (start.getTime() <= Date.now()) return { ok: false, reason: "past" };

    // 영업시간 안
    const openMin = parseHM(dayHours.open);
    const closeMin = parseHM(dayHours.close);
    if (openMin === null || closeMin === null)
      return { ok: false, reason: "noClose" };
    const slotStartMin = h * 60 + m;
    const slotEndMin = slotStartMin + productDuration;
    if (slotStartMin < openMin) return { ok: false, reason: "outOfHours" };
    if (slotEndMin > closeMin) return { ok: false, reason: "outOfHours" };

    // 브레이크 (선택)
    if (dayHours.breakStart && dayHours.breakEnd) {
      const bs = parseHM(dayHours.breakStart);
      const be = parseHM(dayHours.breakEnd);
      if (bs !== null && be !== null && bs < be) {
        // [slotStart, slotEnd) ∩ [bs, be) ≠ ∅
        if (slotStartMin < be && slotEndMin > bs)
          return { ok: false, reason: "break" };
      }
    }

    // 기존 예약 충돌
    for (const r of dayReservations) {
      if (start.getTime() < r.end && end.getTime() > r.start)
        return { ok: false, reason: "reserved" };
    }
    return { ok: true };
  }

  // 선택한 시간이 새 날짜에서 invalid 면 reset
  // (간단 처리 — 사용자가 다시 시간 선택)

  const label = (() => {
    if (hour === null || minute === null) return "";
    const ampm = hour < 12 ? "오전" : "오후";
    const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const mStr = String(minute).padStart(2, "0");
    return `${selected.date.getMonth() + 1}월 ${selected.day}일 ${ampm} ${h12}시 ${mStr}분`;
  })();

  function onSelect() {
    if (hour === null || minute === null) return;
    if (!isSlotAvailable(hour, minute).ok) return;
    const d = new Date(selected.date);
    d.setHours(hour, minute, 0, 0);
    const iso = d.toISOString();
    if (mode === "book") {
      router.replace(
        `/app/booking/payment?store=${params.id}&product=${params.pid}&startAt=${encodeURIComponent(iso)}`,
      );
    } else {
      const next = new URLSearchParams(search.toString());
      next.delete("mode");
      next.set("startAt", iso);
      router.replace(
        `/app/stores/${params.id}/products/${params.pid}?${next.toString()}`,
      );
    }
  }

  return (
    <div className="pb-[120px] min-h-screen bg-cloud">
      <div className="h-[52px] flex items-center justify-between px-4 bg-cloud sticky top-0 z-30">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="닫기"
        >
          <IconClose size={24} stroke={2} />
        </button>
        <div className="text-[17px] font-semibold">예약일시 선택</div>
        <div className="w-6" />
      </div>

      {/* 날짜 strip */}
      <section className="px-4 pt-4">
        <div className="bg-white rounded-[14px] p-5">
          <div className="text-[16px] font-extrabold mb-4">
            {selected.date.getMonth() + 1}월 {selected.day}일{" "}
            {["일", "월", "화", "수", "목", "금", "토"][selected.date.getDay()]}요일
            {selected.closed && (
              <span className="ml-2 text-[12px] text-danger font-bold">
                휴무
              </span>
            )}
          </div>
          <div className="flex gap-[10px] overflow-x-auto ww-scroll-x pb-1">
            {dates.map((d) => {
              const isToday = d.dateKey === toDateKey(new Date());
              const isSelected = d.key === dateIdx;
              return (
                <button
                  key={d.key}
                  type="button"
                  onClick={() => !d.closed && setDateIdx(d.key)}
                  disabled={d.closed}
                  className="flex flex-col items-center justify-center shrink-0"
                >
                  <span
                    className={`w-[54px] h-[54px] rounded-full flex items-center justify-center text-[16px] font-bold ww-num transition ${
                      d.closed
                        ? "bg-[#C8C8CC] text-white"
                        : isSelected
                          ? "bg-accent text-white"
                          : isToday
                            ? "border-[1.5px] border-accent text-accent"
                            : "bg-white border border-fog text-ink"
                    }`}
                  >
                    {d.day}
                  </span>
                  <span
                    className={`text-[11px] mt-1 font-semibold ${
                      d.closed
                        ? "text-[#A8A8AD]"
                        : isSelected
                          ? "text-accent"
                          : "text-ink"
                    }`}
                  >
                    {d.closed ? "휴무" : isToday ? "오늘" : d.weekday}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 시간 */}
      <section className="px-4 pt-3">
        <div className="bg-white rounded-[14px] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[15px] font-bold">시작 시간</div>
            <div className="flex items-center gap-3 text-[11px] text-slate">
              <span className="flex items-center gap-1">
                <span className="w-[10px] h-[10px] rounded-full border border-fog" />
                선택 가능
              </span>
              <span className="flex items-center gap-1">
                <span className="w-[10px] h-[10px] rounded-full bg-[#D4D4D9]" />
                선택 불가
              </span>
            </div>
          </div>

          {dayHours && !selected.closed && (
            <div className="text-[12px] text-slate mb-3 ww-num">
              영업 {dayHours.open} – {dayHours.close}
              {dayHours.breakStart && dayHours.breakEnd && (
                <span className="ml-2 text-danger">
                  · 브레이크 {dayHours.breakStart} – {dayHours.breakEnd}
                </span>
              )}
              <span className="ml-2 text-graphite">
                · 소요 {productDuration}분
              </span>
            </div>
          )}

          {selected.closed ? (
            <div className="py-6 text-center text-danger text-[13px] font-bold">
              이 날짜는 휴무일이에요. 다른 날짜를 선택해 주세요.
            </div>
          ) : (
            <>
              <div className="text-[13px] font-extrabold text-graphite mb-2">
                오전
              </div>
              <div className="grid grid-cols-5 gap-[10px] mb-5">
                {HOURS_AM.map((h) => (
                  <HourBtn
                    key={h}
                    hour={h}
                    selected={h === hour}
                    onSelect={() => {
                      if (isAnyMinuteAvailable(h)) setHour(h);
                    }}
                    disabled={!isAnyMinuteAvailable(h)}
                  />
                ))}
              </div>

              <div className="text-[13px] font-extrabold text-graphite mb-2">
                오후
              </div>
              <div className="grid grid-cols-5 gap-[10px]">
                {HOURS_PM.map((h) => (
                  <HourBtn
                    key={h}
                    hour={h}
                    selected={h === hour}
                    onSelect={() => {
                      if (isAnyMinuteAvailable(h)) setHour(h);
                    }}
                    disabled={!isAnyMinuteAvailable(h)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* 분 */}
      {!selected.closed && hour !== null && (
        <section className="px-4 pt-3">
          <div className="bg-white rounded-[14px] p-5">
            <div className="text-[14px] font-bold mb-4">
              시작하실 분을 선택해주세요
            </div>
            <div className="grid grid-cols-6 gap-2">
              {MINUTES.map((m) => {
                const result = isSlotAvailable(hour, m);
                const disabled = !result.ok;
                const isSelected = m === minute;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => !disabled && setMinute(m)}
                    disabled={disabled}
                    className={`aspect-square rounded-full text-[13px] font-bold transition ${
                      isSelected
                        ? "bg-accent text-white"
                        : disabled
                          ? "bg-[#D4D4D9] text-[#98989C]"
                          : "bg-white border border-fog text-ink"
                    }`}
                    title={
                      disabled
                        ? result.reason === "past"
                          ? "지난 시간"
                          : result.reason === "break"
                            ? "브레이크 타임"
                            : result.reason === "reserved"
                              ? "이미 예약됨"
                              : result.reason === "outOfHours"
                                ? "영업시간 외"
                                : ""
                        : ""
                    }
                  >
                    {m}분
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <div className="fixed left-0 right-0 bottom-0 flex justify-center">
        <div className="w-full max-w-app bg-cloud px-4 py-3 flex gap-2 items-center">
          <div className="flex-1 h-14 rounded-full bg-white border border-fog flex items-center justify-center text-[14px] font-bold">
            {label || "날짜·시간을 선택해 주세요"}
          </div>
          <button
            type="button"
            onClick={onSelect}
            disabled={
              hour === null ||
              minute === null ||
              !isSlotAvailable(hour, minute).ok
            }
            className="h-14 px-7 rounded-full bg-accent text-white font-bold text-[15px] disabled:opacity-50"
          >
            선택
          </button>
        </div>
      </div>
    </div>
  );

  function isAnyMinuteAvailable(h: number): boolean {
    return MINUTES.some((m) => isSlotAvailable(h, m).ok);
  }
}

function HourBtn({
  hour,
  selected,
  onSelect,
  disabled,
}: {
  hour: number;
  selected: boolean;
  onSelect: () => void;
  disabled: boolean;
}) {
  const display =
    hour === 0
      ? "12시"
      : hour === 12
        ? "12시"
        : `${hour > 12 ? hour - 12 : hour}시`;
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={`h-11 rounded-full text-[14px] font-bold transition ${
        selected
          ? "bg-accent text-white"
          : disabled
            ? "bg-[#D4D4D9] text-[#98989C]"
            : "bg-white border border-fog text-ink"
      }`}
    >
      {display}
    </button>
  );
}

function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseHM(s: string): number | null {
  if (!s) return null;
  const m = /^(\d{1,2}):(\d{2})$/.exec(s);
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h < 0 || h > 24 || min < 0 || min >= 60) return null;
  return h * 60 + min;
}
