import { db } from "@/lib/db";

type SettingDef = {
  key: string;
  label: string;
  description: string;
  default: boolean;
};

export const FEATURES = {
  shopEnabled: {
    key: "feature.shop_enabled",
    label: "쇼핑 / 마켓",
    description:
      "앱 홈의 마켓 섹션, /app/market, 주문·배송 관련 기능 전체를 활성화합니다.",
    default: true,
  },
  passEnabled: {
    key: "feature.pass_enabled",
    label: "할인패스 (멤버십)",
    description: "홈페이지·앱의 할인패스 구독 배너를 노출합니다.",
    default: true,
  },
  communityEnabled: {
    key: "feature.community_enabled",
    label: "커뮤니티 게시판",
    description: "홈페이지에 게시판·후기 섹션을 노출합니다.",
    default: true,
  },
} satisfies Record<string, SettingDef>;

export type FeatureKey = keyof typeof FEATURES;

export async function getFlags(): Promise<Record<FeatureKey, boolean>> {
  const keys = Object.values(FEATURES).map((f) => f.key);
  const rows = await db.siteSetting.findMany({
    where: { key: { in: keys } },
  });
  const byKey = new Map(rows.map((r) => [r.key, r.value]));
  const out = {} as Record<FeatureKey, boolean>;
  (Object.keys(FEATURES) as FeatureKey[]).forEach((k) => {
    const def = FEATURES[k];
    const raw = byKey.get(def.key);
    out[k] = raw === undefined ? def.default : raw === "true";
  });
  return out;
}

export async function getFlag(key: FeatureKey): Promise<boolean> {
  const def = FEATURES[key];
  const row = await db.siteSetting.findUnique({ where: { key: def.key } });
  if (!row) return def.default;
  return row.value === "true";
}

export async function setFlag(key: FeatureKey, value: boolean): Promise<void> {
  const def = FEATURES[key];
  await db.siteSetting.upsert({
    where: { key: def.key },
    update: { value: String(value) },
    create: { key: def.key, value: String(value) },
  });
}
