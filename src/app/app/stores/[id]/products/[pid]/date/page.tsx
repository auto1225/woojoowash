"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { IconClose } from "@/components/icons";

const DATES = Array.from({ length: 14 }).map((_, i) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + i);
  return {
    key: i,
    date: d,
    day: d.getDate(),
    weekday: ["일", "월", "화", "수", "목", "금", "토"][d.getDay()],
    sunday: d.getDay() === 0,
  };
});

const HOURS_AM = [8, 9, 10, 11];
const HOURS_PM = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
const MINUTES = [0, 10, 20, 30, 40, 50];

type AmPm = "am" | "pm";

export default function DatePickerPage() {
  const router = useRouter();
  const params = useParams<{ id: string; pid: string }>();
  const search = useSearchParams();
  const mode = search.get("mode"); // 'book' → 결제로 바로

  const [dateIdx, setDateIdx] = useState(0);
  const [ampm, setAmPm] = useState<AmPm>("pm");
  const [hour, setHour] = useState<number | null>(14);
  const [minute, setMinute] = useState<number | null>(30);

  const hours = ampm === "am" ? HOURS_AM : HOURS_PM;
  const selected = DATES[dateIdx];

  const label = (() => {
    if (hour === null || minute === null) return "";
    const ampmLabel = ampm === "am" ? "오전" : "오후";
    const h = String(hour).padStart(2, "0");
    const m = String(minute).padStart(2, "0");
    return `${selected.date.getMonth() + 1}월 ${selected.day}일 ${ampmLabel} ${h}시 ${m}분`;
  })();

  function onSelect() {
    if (hour === null || minute === null) return;
    const d = new Date(selected.date);
    d.setHours(hour, minute, 0, 0);
    const iso = d.toISOString();
    if (mode === "book") {
      router.replace(
        `/app/booking/payment?store=${params.id}&product=${params.pid}&startAt=${encodeURIComponent(iso)}`,
      );
    } else {
      router.back();
    }
  }

  const now = new Date();

  return (
    <div className="pb-[120px] min-h-screen bg-cloud">
      <div className="h-[52px] flex items-center justify-between px-4 bg-cloud">
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

      <section className="px-4 pt-4">
        <div className="bg-white rounded-[14px] p-5">
          <div className="text-[16px] font-extrabold mb-4">
            {selected.date.getMonth() + 1}월 {selected.day}일{" "}
            {["일","월","화","수","목","금","토"][selected.date.getDay()]}요일
          </div>
          <div className="flex gap-[10px] overflow-x-auto ww-scroll-x pb-1">
            {DATES.map((d, i) => {
              const isToday = d.date.toDateString() === now.toDateString();
              const isSelected = i === dateIdx;
              const isOff = d.sunday;
              return (
                <button
                  key={d.key}
                  type="button"
                  onClick={() => !isOff && setDateIdx(i)}
                  disabled={isOff}
                  className="flex flex-col items-center justify-center shrink-0"
                >
                  <span
                    className={`w-[54px] h-[54px] rounded-full flex items-center justify-center text-[16px] font-bold ww-num transition ${
                      isOff
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
                      isOff
                        ? "text-[#A8A8AD]"
                        : isSelected
                          ? "text-accent"
                          : "text-ink"
                    }`}
                  >
                    {isOff ? "휴무" : isToday ? "오늘" : d.weekday}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 pt-3">
        <div className="bg-white rounded-[14px] p-5">
          <div className="flex items-center justify-between mb-4">
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

          <div className="flex gap-2 mb-5">
            {(["am", "pm"] as AmPm[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setAmPm(m)}
                className={`flex-1 h-11 rounded-full font-bold text-[14px] transition ${
                  ampm === m
                    ? "bg-accent text-white"
                    : "bg-white border border-fog text-ink"
                }`}
              >
                {m === "am" ? "오전" : "오후"}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-5 gap-[10px]">
            {hours.map((h) => {
              const isPast =
                selected.date.toDateString() === now.toDateString() &&
                h <= now.getHours();
              const isSelected = h === hour;
              return (
                <button
                  key={h}
                  type="button"
                  onClick={() => !isPast && setHour(h)}
                  disabled={isPast}
                  className={`h-11 rounded-full text-[14px] font-bold transition ${
                    isPast
                      ? "bg-[#D4D4D9] text-[#98989C]"
                      : isSelected
                        ? "bg-accent text-white"
                        : "bg-white border border-fog text-ink"
                  }`}
                >
                  {h}시
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 pt-3">
        <div className="bg-white rounded-[14px] p-5">
          <div className="text-[14px] font-bold mb-4">
            시작하실 분을 선택해주세요
          </div>
          <div className="grid grid-cols-6 gap-2">
            {MINUTES.map((m) => {
              const isSelected = m === minute;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMinute(m)}
                  className={`aspect-square rounded-full text-[13px] font-bold transition ${
                    isSelected
                      ? "bg-accent text-white"
                      : "bg-[#D4D4D9] text-[#98989C]"
                  }`}
                >
                  {m}분
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="fixed left-0 right-0 bottom-0 flex justify-center">
        <div className="w-full max-w-app bg-cloud px-4 py-3 flex gap-2 items-center">
          <div className="flex-1 h-14 rounded-full bg-white border border-fog flex items-center justify-center text-[14px] font-bold">
            {label || "날짜·시간을 선택해 주세요"}
          </div>
          <button
            type="button"
            onClick={onSelect}
            disabled={hour === null || minute === null}
            className="h-14 px-7 rounded-full bg-accent text-white font-bold text-[15px] disabled:opacity-50"
          >
            선택
          </button>
        </div>
      </div>
    </div>
  );
}
