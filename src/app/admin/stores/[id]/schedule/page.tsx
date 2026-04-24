import { revalidatePath } from "next/cache";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireOwnedStore, requireOwner } from "@/lib/admin";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

async function addClosedDay(storeId: string, formData: FormData) {
  "use server";
  await requireOwnedStore(storeId);
  const dateStr = String(formData.get("date") ?? "");
  const reason = String(formData.get("reason") ?? "").trim() || null;
  if (!dateStr) return;
  await db.storeClosedDay.upsert({
    where: { storeId_date: { storeId, date: new Date(dateStr) } },
    update: { reason },
    create: { storeId, date: new Date(dateStr), reason },
  });
  revalidatePath(`/admin/stores/${storeId}/schedule`);
}

async function removeClosedDay(storeId: string, dayId: string) {
  "use server";
  await requireOwnedStore(storeId);
  await db.storeClosedDay.delete({ where: { id: dayId } });
  revalidatePath(`/admin/stores/${storeId}/schedule`);
}

async function saveHours(storeId: string, formData: FormData) {
  "use server";
  await requireOwnedStore(storeId);
  const open = String(formData.get("open") ?? "10:00");
  const close = String(formData.get("close") ?? "22:00");
  const breakStart = String(formData.get("breakStart") ?? "");
  const breakEnd = String(formData.get("breakEnd") ?? "");
  await db.store.update({
    where: { id: storeId },
    data: {
      hours: {
        open,
        close,
        breakStart: breakStart || null,
        breakEnd: breakEnd || null,
      },
    },
  });
  revalidatePath(`/admin/stores/${storeId}/schedule`);
  revalidatePath(`/app/stores/${storeId}`);
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
  const h = (store.hours as {
    open?: string;
    close?: string;
    breakStart?: string | null;
    breakEnd?: string | null;
  }) || {};

  return (
    <AdminShell
      userName={user.name || user.email}
      storeName={store.name}
      storeId={store.id}
    >
      <h1 className="ww-disp text-[24px] tracking-[-0.02em] mb-6">
        영업시간 · 휴무일
      </h1>

      <section className="grid gap-6 md:grid-cols-2">
        <form
          action={saveHours.bind(null, store.id)}
          className="bg-white border border-fog rounded-[20px] p-8 flex flex-col gap-4"
        >
          <div className="text-[15px] font-extrabold">영업 시간</div>
          <div className="grid grid-cols-2 gap-3">
            <TimeField label="오픈" name="open" defaultValue={h.open ?? "10:00"} />
            <TimeField label="마감" name="close" defaultValue={h.close ?? "22:00"} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <TimeField
              label="브레이크 시작"
              name="breakStart"
              defaultValue={h.breakStart ?? ""}
              optional
            />
            <TimeField
              label="브레이크 종료"
              name="breakEnd"
              defaultValue={h.breakEnd ?? ""}
              optional
            />
          </div>
          <button
            type="submit"
            className="self-start h-11 px-5 rounded-full bg-ink text-white text-[13px] font-bold"
          >
            저장
          </button>
        </form>

        <div className="bg-white border border-fog rounded-[20px] p-8">
          <div className="text-[15px] font-extrabold mb-4">휴무일 추가</div>
          <form
            action={addClosedDay.bind(null, store.id)}
            className="flex gap-2 flex-wrap"
          >
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
              className="flex-1 min-w-[140px] h-11 px-3 bg-paper border border-fog rounded-[10px] text-[14px]"
            />
            <button
              type="submit"
              className="h-11 px-5 rounded-full bg-ink text-white text-[13px] font-bold"
            >
              추가
            </button>
          </form>

          <div className="text-[12px] font-semibold text-slate mt-6 mb-3">
            등록된 휴무일
          </div>
          {closed.length === 0 ? (
            <div className="text-[13px] text-slate">없음</div>
          ) : (
            <ul className="flex flex-col divide-y divide-fog">
              {closed.map((d) => (
                <li
                  key={d.id}
                  className="py-3 flex items-center justify-between"
                >
                  <div>
                    <span className="ww-num font-bold">
                      {format(d.date, "yyyy-MM-dd (EEE)", { locale: ko })}
                    </span>
                    {d.reason && (
                      <span className="text-[12px] text-slate ml-2">
                        · {d.reason}
                      </span>
                    )}
                  </div>
                  <form action={removeClosedDay.bind(null, store.id, d.id)}>
                    <button
                      type="submit"
                      className="text-[12px] font-semibold text-danger hover:underline"
                    >
                      삭제
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </AdminShell>
  );
}

function TimeField({
  label,
  name,
  defaultValue,
  optional,
}: {
  label: string;
  name: string;
  defaultValue: string;
  optional?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[12px] font-bold mb-[6px] block">
        {label}
        {optional && <span className="text-slate font-normal ml-1">(선택)</span>}
      </span>
      <input
        type="time"
        name={name}
        defaultValue={defaultValue}
        className="w-full h-11 px-3 bg-paper border border-fog rounded-[10px] text-[14px] outline-none focus:border-ink"
      />
    </label>
  );
}
