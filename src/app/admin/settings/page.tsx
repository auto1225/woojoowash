import { revalidatePath } from "next/cache";
import { AdminConsoleShell } from "@/components/admin/AdminConsoleShell";
import { requireAdmin } from "@/lib/console";
import { FEATURES, getFlags, setFlag, type FeatureKey } from "@/lib/settings";
import {
  type SaveActionState,
  withSaveResult,
} from "@/components/admin/save-action";
import { SettingsRow } from "./SettingsRow";

export const dynamic = "force-dynamic";

async function updateFlag(
  key: FeatureKey,
  _prev: SaveActionState,
  formData: FormData,
): Promise<SaveActionState> {
  "use server";
  return withSaveResult(async () => {
    await requireAdmin();
    const value = formData.get("value") === "on";
    await setFlag(key, value);
    revalidatePath("/admin/settings", "layout");
    revalidatePath("/", "layout");
  });
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
              <SettingsRow
                key={k}
                label={def.label}
                description={def.description}
                initial={current}
                action={updateFlag.bind(null, k)}
              />
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
