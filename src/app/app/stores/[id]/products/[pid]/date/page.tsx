"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppBar } from "@/components/app/AppBar";
import { Chip, CircleChip } from "@/components/ui/Chip";

const DATES = Array.from({ length: 14 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  return {
    key: i,
    date: d,
    label: `${d.getMonth() + 1}/${d.getDate()}`,
    weekday: ["일", "월", "화", "수", "목", "금", "토"][d.getDay()],
    off: d.getDay() === 0,
  };
});

const HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const MINUTES = [0, 10, 20, 30, 40, 50];

export default function DatePickerPage() {
  const router = useRouter();
  const [dateIdx, setDateIdx] = useState(1);
  const [ampm, setAmPm] = useState<"am" | "pm">("pm");
  const [hour, setHour] = useState<number | null>(14);
  const [minute, setMinute] = useState<number | null>(30);

  const displayHours = HOURS.filter((h) => (ampm === "am" ? h < 12 : h >= 12));

  return (
    <div className="pb-[120px] min-h-screen bg-white">
      <AppBar title="예약 일시 선택" />

      <section className="px-4 pt-3">
        <div className="flex gap-[6px] overflow-x-auto ww-scroll-x pb-3">
          {DATES.map((d, i) => (
            <button
              key={d.key}
              type="button"
              onClick={() => !d.off && setDateIdx(i)}
              disabled={d.off}
              className={`flex flex-col items-center justify-center min-w-[54px] h-[66px] rounded-[14px] border ${
                d.off
                  ? "border-fog text-ash"
                  : i === dateIdx
                    ? "bg-ink text-white border-ink"
                    : "border-fog text-ink"
              }`}
            >
              <div className="text-[11px] font-semibold opacity-70">
                {d.weekday}
              </div>
              <div className="text-[15px] font-extrabold ww-num">
                {d.label}
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="px-4 mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => setAmPm("am")}
          className={`flex-1 h-12 rounded-full font-bold text-[14px] ${
            ampm === "am" ? "bg-ink text-white" : "bg-cloud text-graphite"
          }`}
        >
          오전
        </button>
        <button
          type="button"
          onClick={() => setAmPm("pm")}
          className={`flex-1 h-12 rounded-full font-bold text-[14px] ${
            ampm === "pm" ? "bg-ink text-white" : "bg-cloud text-graphite"
          }`}
        >
          오후
        </button>
      </section>

      <section className="px-4 pt-5">
        <div className="text-[12px] text-slate mb-2 font-semibold">시</div>
        <div className="grid grid-cols-5 gap-[6px]">
          {displayHours.map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => setHour(h)}
              className={`h-[50px] rounded-full text-[14px] font-bold ${
                h === hour ? "bg-ink text-white" : "bg-white border border-fog"
              }`}
            >
              {h < 10 ? `0${h}` : h}
            </button>
          ))}
        </div>
      </section>

      <section className="px-4 pt-5">
        <div className="text-[12px] text-slate mb-2 font-semibold">분</div>
        <div className="grid grid-cols-6 gap-[6px]">
          {MINUTES.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMinute(m)}
              className={`h-[46px] rounded-full text-[13px] font-bold ${
                m === minute
                  ? "bg-ink text-white"
                  : "bg-white border border-fog"
              }`}
            >
              {m < 10 ? `0${m}` : m}
            </button>
          ))}
        </div>
      </section>

      <div className="fixed left-0 right-0 bottom-0 flex justify-center">
        <div className="w-full max-w-app bg-white border-t border-fog px-4 py-3 flex gap-2 items-center">
          <div className="flex-1 text-[13px]">
            {hour !== null && minute !== null ? (
              <>
                <div className="text-[11px] text-slate mb-[2px]">선택한 일시</div>
                <div className="ww-num font-bold text-[15px]">
                  {DATES[dateIdx].label} ({DATES[dateIdx].weekday}) ·{" "}
                  {hour < 10 ? `0${hour}` : hour}:
                  {minute < 10 ? `0${minute}` : minute}
                </div>
              </>
            ) : (
              <span className="text-slate">시간을 선택해 주세요</span>
            )}
          </div>
          <button
            type="button"
            onClick={() => router.back()}
            className="h-14 px-7 rounded-full bg-ink text-white font-bold text-[15px]"
          >
            선택
          </button>
        </div>
      </div>
      <div className="hidden">
        <Chip>x</Chip>
        <CircleChip>x</CircleChip>
      </div>
    </div>
  );
}
