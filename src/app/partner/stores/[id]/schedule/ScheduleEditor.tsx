"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import {
  INITIAL_SAVE_STATE,
  SaveToast,
  type SaveActionState,
} from "@/components/admin/SaveToast";
import {
  DAY_KEYS,
  DAY_LABEL,
  DEFAULT_DAY_HOURS,
  type DayHours,
  type DayKey,
  type StoreHoursV2,
} from "./types";

export function ScheduleEditor({
  defaults,
  action,
  weeklyClosed,
  onWeeklyClosedChange,
}: {
  defaults: StoreHoursV2;
  action: (
    prev: SaveActionState,
    formData: FormData,
  ) => Promise<SaveActionState>;
  weeklyClosed: DayKey[];
  onWeeklyClosedChange: (next: DayKey[]) => void;
}) {
  const [mode, setMode] = useState<"all" | "perDay">(defaults.mode);
  const [all, setAll] = useState<DayHours>(defaults.all);
  const [perDay, setPerDay] = useState<Record<DayKey, DayHours>>(
    defaults.perDay,
  );

  const [saveState, formAction] = useFormState(action, INITIAL_SAVE_STATE);

  function updateAll<K extends keyof DayHours>(k: K, v: DayHours[K]) {
    setAll((cur) => ({ ...cur, [k]: v }));
  }
  function updateDay<K extends keyof DayHours>(
    day: DayKey,
    k: K,
    v: DayHours[K],
  ) {
    setPerDay((cur) => ({ ...cur, [day]: { ...cur[day], [k]: v } }));
  }
  function toggleWeeklyClosed(day: DayKey) {
    onWeeklyClosedChange(
      weeklyClosed.includes(day)
        ? weeklyClosed.filter((d) => d !== day)
        : [...weeklyClosed, day],
    );
  }
  // "전체 → 요일별" 로 처음 전환할 때 비어있는 perDay 슬롯에 all 값을 시드
  function switchToPerDay() {
    setPerDay((cur) => {
      const next = { ...cur };
      for (const d of DAY_KEYS) {
        if (!next[d] || (!next[d].open && !next[d].close)) {
          next[d] = { ...all };
        }
      }
      return next;
    });
    setMode("perDay");
  }

  return (
    <>
    <form
      id="schedule-form"
      action={formAction}
      className="flex flex-col gap-6"
    >
      <div className="bg-white border border-fog rounded-[20px] p-8">
        <div className="text-[15px] font-extrabold mb-3">영업 시간</div>

        {/* 전체 / 요일별 탭 */}
        <div
          role="tablist"
          aria-label="영업시간 모드"
          className="grid grid-cols-2 gap-2 p-1 bg-paper border border-fog rounded-[14px] mb-4 max-w-[320px]"
        >
          <ModeTab
            active={mode === "all"}
            onClick={() => setMode("all")}
            label="전체"
            hint="모든 요일 동일"
          />
          <ModeTab
            active={mode === "perDay"}
            onClick={switchToPerDay}
            label="요일별"
            hint="요일마다 다르게"
          />
        </div>

        {mode === "all" ? (
          <DayHoursForm
            value={all}
            onChange={(k, v) => updateAll(k, v)}
            label="전체 요일"
          />
        ) : (
          <div className="flex flex-col gap-2">
            {DAY_KEYS.map((d) => {
              const isClosed = weeklyClosed.includes(d);
              return (
                <div
                  key={d}
                  className={`rounded-[12px] border p-3 transition ${
                    isClosed
                      ? "bg-cloud border-fog opacity-60"
                      : "bg-paper border-fog"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-[13px] font-extrabold ${
                        d === "sat"
                          ? "bg-accent/10 text-accent"
                          : d === "sun"
                            ? "bg-danger/10 text-danger"
                            : "bg-ink text-white"
                      }`}
                    >
                      {DAY_LABEL[d]}
                    </span>
                    <span className="text-[13px] font-bold flex-1">
                      {DAY_LABEL[d]}요일
                      {isClosed && (
                        <span className="ml-2 text-[11px] font-bold text-danger">
                          정기 휴무
                        </span>
                      )}
                    </span>
                  </div>
                  {!isClosed && (
                    <DayHoursForm
                      value={perDay[d]}
                      onChange={(k, v) => updateDay(d, k, v)}
                      compact
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 주간 정기 휴무 */}
      <div className="bg-white border border-fog rounded-[20px] p-8">
        <div className="text-[15px] font-extrabold mb-2">주간 정기 휴무</div>
        <div className="text-[12px] text-slate mb-3 leading-[1.6]">
          체크한 요일은 매주 휴무로 표시되고, 앱에서 예약을 받지 않아요.
        </div>
        <div className="flex flex-wrap gap-2">
          {DAY_KEYS.map((d) => {
            const checked = weeklyClosed.includes(d);
            return (
              <button
                key={d}
                type="button"
                onClick={() => toggleWeeklyClosed(d)}
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
                  <span className="text-[10px] font-bold opacity-80">휴무</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 폼 제출용 직렬화 */}
      <input type="hidden" name="mode" value={mode} />
      <input type="hidden" name="allOpen" value={all.open} />
      <input type="hidden" name="allClose" value={all.close} />
      <input type="hidden" name="allBreakStart" value={all.breakStart} />
      <input type="hidden" name="allBreakEnd" value={all.breakEnd} />
      {DAY_KEYS.map((d) => (
        <span key={d}>
          <input type="hidden" name={`day_${d}_open`} value={perDay[d].open} />
          <input
            type="hidden"
            name={`day_${d}_close`}
            value={perDay[d].close}
          />
          <input
            type="hidden"
            name={`day_${d}_breakStart`}
            value={perDay[d].breakStart}
          />
          <input
            type="hidden"
            name={`day_${d}_breakEnd`}
            value={perDay[d].breakEnd}
          />
        </span>
      ))}
      {weeklyClosed.map((d) => (
        <input key={d} type="hidden" name="weeklyClosed" value={d} />
      ))}

    </form>
    <SaveToast state={saveState} />
    </>
  );
}

/**
 * 폼 밖에 둘 수 있는 영업시간 저장 버튼.
 * `form="schedule-form"` 으로 ScheduleEditor 의 form 에 연결.
 */
export function ScheduleSaveButton() {
  return (
    <button
      type="submit"
      form="schedule-form"
      className="self-start h-12 px-6 rounded-full bg-ink text-white font-bold text-[14px] inline-flex items-center gap-2 hover:bg-graphite transition"
    >
      영업시간 · 휴무 저장
    </button>
  );
}

function ModeTab({
  active,
  onClick,
  label,
  hint,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  hint: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`h-12 rounded-[10px] flex flex-col items-center justify-center gap-[1px] transition ${
        active
          ? "bg-ink text-white shadow-[0_4px_14px_rgba(10,10,11,0.18)]"
          : "text-graphite hover:text-ink"
      }`}
    >
      <span className="text-[13px] font-bold leading-none">{label}</span>
      <span
        className={`text-[10px] leading-none ${
          active ? "text-white/70" : "text-slate"
        }`}
      >
        {hint}
      </span>
    </button>
  );
}

function DayHoursForm({
  value,
  onChange,
  label,
  compact,
}: {
  value: DayHours;
  onChange: <K extends keyof DayHours>(k: K, v: DayHours[K]) => void;
  label?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-4 gap-${compact ? "2" : "3"} ${
        label ? "p-3 bg-paper border border-fog rounded-[12px]" : ""
      }`}
    >
      {label && (
        <div className="col-span-2 sm:col-span-4 text-[11px] font-bold text-slate mb-1">
          {label}
        </div>
      )}
      <TimeInput
        label="오픈"
        value={value.open}
        onChange={(v) => onChange("open", v)}
      />
      <TimeInput
        label="마감"
        value={value.close}
        onChange={(v) => onChange("close", v)}
      />
      <TimeInput
        label="브레이크 시작"
        optional
        value={value.breakStart}
        onChange={(v) => onChange("breakStart", v)}
      />
      <TimeInput
        label="브레이크 종료"
        optional
        value={value.breakEnd}
        onChange={(v) => onChange("breakEnd", v)}
      />
    </div>
  );
}

function TimeInput({
  label,
  value,
  onChange,
  optional,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  optional?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold mb-[3px] block text-graphite">
        {label}
        {optional && (
          <span className="text-slate font-normal ml-1">(선택)</span>
        )}
      </span>
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 px-3 bg-white border border-fog rounded-[10px] text-[14px] outline-none focus:border-ink ww-num"
      />
    </label>
  );
}

