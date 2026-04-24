import { revalidatePath } from "next/cache";
import { AdminConsoleShell } from "@/components/admin/AdminConsoleShell";
import { requireAdmin } from "@/lib/console";
import { FEATURES, getFlags, setFlag, type FeatureKey } from "@/lib/settings";

export const dynamic = "force-dynamic";

async function updateFlag(key: FeatureKey, formData: FormData) {
  "use server";
  await requireAdmin();
  const value = formData.get("value") === "on";
  await setFlag(key, value);
  revalidatePath("/admin/settings", "layout");
  revalidatePath("/", "layout");
}

export default async function SettingsPage() {
  const me = await requireAdmin();
  const flags = await getFlags();

  return (
    <AdminConsoleShell
      title="사이트 설정"
      subtitle="앱·홈페이지에 노출되는 주요 기능을 켜고 끌 수 있어요"
      userName={me.name || me.email}
    >
      <div className="bg-white border border-fog rounded-[20px] overflow-hidden max-w-[760px]">
        <div className="divide-y divide-fog">
          {(Object.keys(FEATURES) as FeatureKey[]).map((k) => {
            const def = FEATURES[k];
            const current = flags[k];
            return (
              <form
                key={k}
                action={updateFlag.bind(null, k)}
                className="p-6 flex items-center gap-5"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-extrabold">{def.label}</div>
                  <div className="text-[12px] text-slate leading-[1.6] mt-1">
                    {def.description}
                  </div>
                </div>
                <ToggleButton name="value" initial={current} />
              </form>
            );
          })}
        </div>
      </div>

      <div className="text-[12px] text-slate mt-4 max-w-[760px] leading-[1.6]">
        · 기능을 끄면 일반 고객에게는 해당 메뉴가 바로 숨겨집니다 (캐시는 재검증됨).
        <br />· 관리자는 기능이 꺼져 있어도 관리자 메뉴에서 내부 기록을 계속 확인할 수 있어요.
      </div>
    </AdminConsoleShell>
  );
}

function ToggleButton({ name, initial }: { name: string; initial: boolean }) {
  // 폼 제출 시 checkbox 값으로 처리하기 위해 hidden checkbox + 버튼 대신
  // 전통적인 checkbox 를 label 로 감싸 토글 UI 구성
  return (
    <label className="inline-flex items-center cursor-pointer shrink-0">
      <input
        type="checkbox"
        name={name}
        defaultChecked={initial}
        className="peer sr-only"
      />
      <span className="relative w-[48px] h-[28px] bg-fog rounded-full transition-colors peer-checked:bg-accent">
        <span className="absolute top-[3px] left-[3px] w-[22px] h-[22px] bg-white rounded-full shadow-ww-btn transition-transform peer-checked:translate-x-[20px]" />
      </span>
      <button
        type="submit"
        className="ml-3 text-[12px] font-bold text-slate hover:text-ink"
      >
        저장
      </button>
    </label>
  );
}
