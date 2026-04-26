"use client";

import { useState } from "react";
import type { SaveActionState } from "@/components/admin/SaveToast";
import { ScheduleEditor, ScheduleSaveButton } from "./ScheduleEditor";
import { ClosedCalendar, type ClosedDayItem } from "./ClosedCalendar";
import type { DayKey, StoreHoursV2 } from "./types";

/**
 * 영업시간 + 캘린더를 하나의 클라이언트 컴포넌트로 묶음.
 * 주간 정기 휴무(weeklyClosed) state 를 위로 끌어올려 캘린더가 실시간으로 반영되도록.
 */
export function ScheduleSection({
  defaults,
  closedDays,
  saveAction,
  addClosedAction,
  removeClosedAction,
}: {
  defaults: StoreHoursV2;
  closedDays: ClosedDayItem[];
  saveAction: (
    prev: SaveActionState,
    formData: FormData,
  ) => Promise<SaveActionState>;
  addClosedAction: (
    prev: SaveActionState,
    formData: FormData,
  ) => Promise<SaveActionState>;
  removeClosedAction: (id: string) => Promise<void>;
}) {
  const [weeklyClosed, setWeeklyClosed] = useState<DayKey[]>(
    defaults.weeklyClosedDays,
  );

  return (
    <>
      <ScheduleEditor
        defaults={defaults}
        action={saveAction}
        weeklyClosed={weeklyClosed}
      />
      <ClosedCalendar
        closedDays={closedDays}
        weeklyClosedDays={weeklyClosed}
        onWeeklyClosedChange={setWeeklyClosed}
        addAction={addClosedAction}
        removeAction={removeClosedAction}
      />
      <ScheduleSaveButton />
    </>
  );
}
