import { revalidatePath } from "next/cache";
import { AdminShell } from "@/components/partner/PartnerShell";
import { requireOwnedStore, requireOwner } from "@/lib/admin";
import { db } from "@/lib/db";
import {
  type SaveActionState,
  withSaveResult,
} from "@/components/admin/save-action";
import { ScheduleEditor } from "./ScheduleEditor";
import { ClosedCalendar, type ClosedDayItem } from "./ClosedCalendar";
import { normalizeHours, parseScheduleForm } from "./types";

export const dynamic = "force-dynamic";

async function saveSchedule(
  storeId: string,
  _prev: SaveActionState,
  formData: FormData,
): Promise<SaveActionState> {
  "use server";
  return withSaveResult(async () => {
    await requireOwnedStore(storeId);
    const hours = parseScheduleForm(formData);
    await db.store.update({
      where: { id: storeId },
      data: { hours: hours as unknown as object },
    });
    revalidatePath(`/partner/stores/${storeId}/schedule`);
    revalidatePath(`/app/stores/${storeId}`);
  });
}

async function addClosedDay(
  storeId: string,
  _prev: SaveActionState,
  formData: FormData,
): Promise<SaveActionState> {
  "use server";
  return withSaveResult(async () => {
    await requireOwnedStore(storeId);
    const dateStr = String(formData.get("date") ?? "");
    const reason = String(formData.get("reason") ?? "").trim() || null;
    if (!dateStr) throw new Error("날짜를 선택해주세요.");
    await db.storeClosedDay.upsert({
      where: { storeId_date: { storeId, date: new Date(dateStr) } },
      update: { reason },
      create: { storeId, date: new Date(dateStr), reason },
    });
    revalidatePath(`/partner/stores/${storeId}/schedule`);
  });
}

async function removeClosedDay(storeId: string, dayId: string) {
  "use server";
  await requireOwnedStore(storeId);
  await db.storeClosedDay.delete({ where: { id: dayId } });
  revalidatePath(`/partner/stores/${storeId}/schedule`);
}

export default async function SchedulePage({
  params,
}: {
  params: { id: string };
}) {
  const user = await requireOwner();
  const store = await requireOwnedStore(params.id);
  const closed = await db.storeClosedDay.findMany({
    where: { storeId: store.id },
    orderBy: { date: "asc" },
  });

  const hours = normalizeHours(store.hours);
  const closedDays: ClosedDayItem[] = closed.map((d) => ({
    id: d.id,
    date: d.date.toISOString(),
    reason: d.reason,
  }));

  return (
    <AdminShell
      userName={user.name || user.email}
      storeName={store.name}
      storeId={store.id}
    >
      <h1 className="ww-disp text-[24px] tracking-[-0.02em] mb-6">
        영업시간 · 휴무일
      </h1>

      <section className="flex flex-col gap-6 max-w-[960px]">
        <ScheduleEditor
          defaults={hours}
          action={saveSchedule.bind(null, store.id)}
        />
        <ClosedCalendar
          closedDays={closedDays}
          weeklyClosedDays={hours.weeklyClosedDays}
          addAction={addClosedDay.bind(null, store.id)}
          removeAction={removeClosedDay.bind(null, store.id)}
        />
      </section>
    </AdminShell>
  );
}
