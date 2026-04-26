// 영업시간·휴무 데이터 모델 (서버·클라 공용 — no "use client").

export const DAY_KEYS = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
] as const;
export type DayKey = (typeof DAY_KEYS)[number];

export const DAY_LABEL: Record<DayKey, string> = {
  mon: "월",
  tue: "화",
  wed: "수",
  thu: "목",
  fri: "금",
  sat: "토",
  sun: "일",
};

export type DayHours = {
  open: string; // "10:00"
  close: string; // "22:00"
  breakStart: string; // "" 이면 브레이크 없음
  breakEnd: string;
};

export type StoreHoursV2 = {
  mode: "all" | "perDay";
  all: DayHours;
  perDay: Record<DayKey, DayHours>;
  weeklyClosedDays: DayKey[];
};

export const DEFAULT_DAY_HOURS: DayHours = {
  open: "10:00",
  close: "22:00",
  breakStart: "",
  breakEnd: "",
};

function emptyPerDay(template: DayHours): Record<DayKey, DayHours> {
  return DAY_KEYS.reduce(
    (acc, k) => {
      acc[k] = { ...template };
      return acc;
    },
    {} as Record<DayKey, DayHours>,
  );
}

// 기존 데이터 ({ open, close, breakStart?, breakEnd? }) 와 호환.
export function normalizeHours(raw: unknown): StoreHoursV2 {
  if (!raw || typeof raw !== "object") {
    return {
      mode: "all",
      all: { ...DEFAULT_DAY_HOURS },
      perDay: emptyPerDay(DEFAULT_DAY_HOURS),
      weeklyClosedDays: [],
    };
  }
  const r = raw as Record<string, unknown>;

  // V2 형식
  if (r.mode === "all" || r.mode === "perDay") {
    const all = sanitizeDay(r.all) ?? { ...DEFAULT_DAY_HOURS };
    const perDayRaw =
      r.perDay && typeof r.perDay === "object"
        ? (r.perDay as Record<string, unknown>)
        : {};
    const perDay = DAY_KEYS.reduce(
      (acc, k) => {
        acc[k] = sanitizeDay(perDayRaw[k]) ?? { ...all };
        return acc;
      },
      {} as Record<DayKey, DayHours>,
    );
    const weekly = Array.isArray(r.weeklyClosedDays)
      ? (r.weeklyClosedDays as unknown[]).filter((x): x is DayKey =>
          DAY_KEYS.includes(x as DayKey),
        )
      : [];
    return {
      mode: r.mode as "all" | "perDay",
      all,
      perDay,
      weeklyClosedDays: weekly,
    };
  }

  // 레거시: { open, close, breakStart, breakEnd }
  const all: DayHours = sanitizeDay(r) ?? { ...DEFAULT_DAY_HOURS };
  return {
    mode: "all",
    all,
    perDay: emptyPerDay(all),
    weeklyClosedDays: [],
  };
}

function sanitizeDay(raw: unknown): DayHours | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  return {
    open: typeof r.open === "string" && r.open ? r.open : "10:00",
    close: typeof r.close === "string" && r.close ? r.close : "22:00",
    breakStart: typeof r.breakStart === "string" ? r.breakStart : "",
    breakEnd: typeof r.breakEnd === "string" ? r.breakEnd : "",
  };
}

// 서버 액션이 직렬화된 폼을 다시 StoreHoursV2 로 파싱.
export function parseScheduleForm(fd: FormData): StoreHoursV2 {
  const mode = fd.get("mode") === "perDay" ? "perDay" : "all";
  const all: DayHours = {
    open: String(fd.get("allOpen") ?? DEFAULT_DAY_HOURS.open),
    close: String(fd.get("allClose") ?? DEFAULT_DAY_HOURS.close),
    breakStart: String(fd.get("allBreakStart") ?? ""),
    breakEnd: String(fd.get("allBreakEnd") ?? ""),
  };
  const perDay = DAY_KEYS.reduce(
    (acc, d) => {
      acc[d] = {
        open: String(fd.get(`day_${d}_open`) ?? all.open),
        close: String(fd.get(`day_${d}_close`) ?? all.close),
        breakStart: String(fd.get(`day_${d}_breakStart`) ?? ""),
        breakEnd: String(fd.get(`day_${d}_breakEnd`) ?? ""),
      };
      return acc;
    },
    {} as Record<DayKey, DayHours>,
  );
  const weeklyClosed = fd
    .getAll("weeklyClosed")
    .map((v) => String(v))
    .filter((d): d is DayKey => DAY_KEYS.includes(d as DayKey));
  return { mode, all, perDay, weeklyClosedDays: weeklyClosed };
}
