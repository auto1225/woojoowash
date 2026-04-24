import { revalidatePath } from "next/cache";
import { AdminShell } from "@/components/partner/PartnerShell";
import { StoreLocationPicker } from "@/components/partner/StoreLocationPicker";
import { requireOwnedStore, requireOwner } from "@/lib/admin";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

async function saveProfile(id: string, formData: FormData) {
  "use server";
  const { requireOwnedStore: guard } = await import("@/lib/admin");
  await guard(id);

  const name = String(formData.get("name") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const coverUrl = String(formData.get("coverUrl") ?? "").trim();
  const promo = String(formData.get("promo") ?? "").trim() || null;
  const open = formData.get("open") === "on";

  const latRaw = String(formData.get("lat") ?? "").trim();
  const lngRaw = String(formData.get("lng") ?? "").trim();
  const lat = latRaw === "" ? null : Number(latRaw);
  const lng = lngRaw === "" ? null : Number(lngRaw);

  await db.store.update({
    where: { id },
    data: {
      name,
      address,
      phone,
      promo,
      open,
      lat: Number.isFinite(lat as number) ? lat : null,
      lng: Number.isFinite(lng as number) ? lng : null,
      coverImages: coverUrl ? [coverUrl] : [],
    },
  });
  revalidatePath(`/partner/stores/${id}`);
  revalidatePath(`/partner/stores/${id}/profile`);
  revalidatePath(`/app/stores/${id}`);
  revalidatePath(`/app/stores`);
  revalidatePath(`/stores`);
}

export default async function ProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const user = await requireOwner();
  const store = await requireOwnedStore(params.id);
  const coverUrl = Array.isArray(store.coverImages)
    ? ((store.coverImages as string[])[0] ?? "")
    : "";
  const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID ?? null;

  return (
    <AdminShell
      userName={user.name || user.email}
      storeName={store.name}
      storeId={store.id}
    >
      <h1 className="ww-disp text-[24px] tracking-[-0.02em] mb-6">
        매장 정보
      </h1>
      <form
        action={saveProfile.bind(null, store.id)}
        className="bg-white border border-fog rounded-[20px] p-8 max-w-[760px] flex flex-col gap-5"
      >
        <Field label="매장 이름" name="name" defaultValue={store.name} required />
        <Field
          label="주소"
          name="address"
          defaultValue={store.address}
          required
          hint="앱 매장 상세·리스트에 표시됩니다."
        />
        <Field
          label="전화번호"
          name="phone"
          defaultValue={store.phone ?? ""}
          placeholder="02-000-0000"
        />
        <Field
          label="커버 이미지 URL"
          name="coverUrl"
          defaultValue={coverUrl}
          placeholder="https://…"
          hint="앱과 홈페이지 매장 카드 커버에 노출됩니다."
        />

        <label className="block">
          <span className="text-[12px] font-bold mb-[6px] block">
            홍보 문구 (앱 매장 상세 상단에 표시)
          </span>
          <textarea
            name="promo"
            defaultValue={store.promo ?? ""}
            rows={3}
            className="w-full p-4 bg-paper border border-fog rounded-[12px] text-[14px] outline-none focus:border-ink resize-none"
            placeholder="예: 주말 할인 진행중! 프리미엄 코스 10% 할인"
          />
        </label>

        <div>
          <div className="text-[12px] font-bold mb-[6px]">
            매장 위치 <span className="text-danger">*</span>
          </div>
          <div className="text-[11px] text-slate mb-3 leading-[1.6]">
            지도를 클릭해 매장 위치를 핀으로 고정하세요. 앱의 매장 찾기
            지도에서 이 좌표로 마커가 표시됩니다.
          </div>
          <StoreLocationPicker
            clientId={clientId}
            initialLat={store.lat}
            initialLng={store.lng}
          />
        </div>

        <label className="flex items-center gap-2 text-[13px]">
          <input
            type="checkbox"
            name="open"
            defaultChecked={store.open}
            className="w-4 h-4 accent-accent"
          />
          현재 영업 중 (체크 해제 시 앱에 "영업종료"로 표시)
        </label>

        <button
          type="submit"
          className="self-start h-11 px-6 rounded-full bg-ink text-white font-bold text-[14px]"
        >
          저장
        </button>
      </form>
    </AdminShell>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  required,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-[12px] font-bold mb-[6px] block">
        {label}
        {required && <span className="text-danger ml-1">*</span>}
      </span>
      <input
        type="text"
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="w-full h-12 px-4 bg-paper border border-fog rounded-[12px] text-[14px] outline-none focus:border-ink"
      />
      {hint && <span className="text-[11px] text-slate mt-1 block">{hint}</span>}
    </label>
  );
}
