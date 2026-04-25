import { revalidatePath } from "next/cache";
import { AdminShell } from "@/components/partner/PartnerShell";
import { requireOwnedStore, requireOwner } from "@/lib/admin";
import { db } from "@/lib/db";
import { ProfileEditor } from "./ProfileEditor";

export const dynamic = "force-dynamic";

const MAX_IMAGES = 5;

async function saveProfile(id: string, formData: FormData) {
  "use server";
  const { requireOwnedStore: guard } = await import("@/lib/admin");
  await guard(id);

  const name = String(formData.get("name") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const promo = String(formData.get("promo") ?? "").trim() || null;
  const open = formData.get("open") === "on";

  const latRaw = String(formData.get("lat") ?? "").trim();
  const lngRaw = String(formData.get("lng") ?? "").trim();
  const lat = latRaw === "" ? null : Number(latRaw);
  const lng = lngRaw === "" ? null : Number(lngRaw);

  const coverImages = formData
    .getAll("coverUrls")
    .map((v) => String(v).trim())
    .filter((v) => v.length > 0)
    .slice(0, MAX_IMAGES);

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
      coverImages,
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
  const coverImages = Array.isArray(store.coverImages)
    ? (store.coverImages as string[]).filter((u) => typeof u === "string")
    : [];
  const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID ?? null;

  return (
    <AdminShell
      userName={user.name || user.email}
      storeName={store.name}
      storeId={store.id}
    >
      <h1 className="ww-disp text-[24px] tracking-[-0.02em] mb-6">매장 정보</h1>
      <ProfileEditor
        action={saveProfile.bind(null, store.id)}
        clientId={clientId}
        defaults={{
          name: store.name,
          address: store.address,
          phone: store.phone ?? "",
          promo: store.promo ?? "",
          open: store.open,
          lat: store.lat,
          lng: store.lng,
          coverImages,
          rating: store.rating,
          reviewCount: store.reviewCount,
          services: store.services,
        }}
        maxImages={MAX_IMAGES}
      />
    </AdminShell>
  );
}
