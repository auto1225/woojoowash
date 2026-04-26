import { revalidatePath } from "next/cache";
import { AdminShell } from "@/components/partner/PartnerShell";
import { requireOwnedStore, requireOwner } from "@/lib/admin";
import { db } from "@/lib/db";
import { uploadImage } from "@/lib/storage";
import { SELECTABLE_SERVICES } from "@/lib/services";
import {
  type SaveActionState,
  withSaveResult,
} from "@/components/admin/save-action";
import { ProfileEditor } from "./ProfileEditor";

export const dynamic = "force-dynamic";

const MAX_IMAGES = 5;

async function saveProfile(
  id: string,
  _prev: SaveActionState,
  formData: FormData,
): Promise<SaveActionState> {
  "use server";
  return withSaveResult(async () => {
  const { requireOwnedStore: guard } = await import("@/lib/admin");
  await guard(id);

  const name = String(formData.get("name") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const promo = String(formData.get("promo") ?? "").trim() || null;
  const open = formData.get("open") === "on";

  // 서비스 카테고리 (멀티)
  const validCodes = new Set(SELECTABLE_SERVICES.map((s) => s.code));
  const services = Array.from(
    new Set(
      formData
        .getAll("services")
        .map((v) => String(v).trim())
        .filter((c) => validCodes.has(c)),
    ),
  );

  // 정보 섹션 (최대 5) — title/subtitle/content + images (섹션별 최대 6)
  const titles = formData.getAll("infoTitle").map((v) => String(v));
  const subtitles = formData.getAll("infoSubtitle").map((v) => String(v));
  const contents = formData.getAll("infoContent").map((v) => String(v));

  // 평행 배열로 직렬화된 정보 섹션 이미지 메타
  const imgSecIdxs = formData
    .getAll("infoImageSectionIdx")
    .map((v) => Number(v));
  const imgKinds = formData.getAll("infoImageKind").map((v) => String(v));
  const imgUrls = formData.getAll("infoImageUrl").map((v) => String(v));
  const imgFiles = formData
    .getAll("infoImageFile")
    .filter((v): v is File => v instanceof File);

  // 섹션별 이미지 url 배열 (업로드 포함)
  const MAX_INFO_SECTIONS = 5;
  const MAX_INFO_IMAGES_PER_SECTION = 6;
  const sectionImages: string[][] = Array.from(
    { length: MAX_INFO_SECTIONS },
    () => [],
  );
  let infoUrlIdx = 0;
  let infoFileIdx = 0;
  for (let i = 0; i < imgKinds.length; i++) {
    const sec = imgSecIdxs[i];
    const kind = imgKinds[i];
    const valid =
      Number.isInteger(sec) && sec >= 0 && sec < MAX_INFO_SECTIONS;
    if (kind === "url") {
      const u = imgUrls[infoUrlIdx++];
      if (
        valid &&
        sectionImages[sec].length < MAX_INFO_IMAGES_PER_SECTION &&
        u &&
        u.trim()
      ) {
        sectionImages[sec].push(u.trim());
      }
    } else if (kind === "file") {
      const f = imgFiles[infoFileIdx++];
      if (
        valid &&
        sectionImages[sec].length < MAX_INFO_IMAGES_PER_SECTION &&
        f &&
        f.size > 0
      ) {
        const r = await uploadImage(f, { prefix: `stores/${id}/info` });
        if (r.ok) sectionImages[sec].push(r.url);
      }
    }
  }

  const infoSections: Array<{
    title: string;
    subtitle: string;
    content: string;
    images: string[];
  }> = [];
  for (let i = 0; i < titles.length && infoSections.length < MAX_INFO_SECTIONS; i++) {
    const title = (titles[i] ?? "").trim();
    const subtitle = (subtitles[i] ?? "").trim();
    const content = (contents[i] ?? "").trim();
    const images = sectionImages[i] ?? [];
    if (!title && !subtitle && !content && images.length === 0) continue;
    infoSections.push({ title, subtitle, content, images });
  }

  const latRaw = String(formData.get("lat") ?? "").trim();
  const lngRaw = String(formData.get("lng") ?? "").trim();
  const lat = latRaw === "" ? null : Number(latRaw);
  const lng = lngRaw === "" ? null : Number(lngRaw);

  // 다중 커버 이미지: kind 배열에 맞춰 url/file 을 슬롯별 처리
  const kinds = formData.getAll("coverItemKind").map((v) => String(v));
  const urls = formData.getAll("coverItemUrl").map((v) => String(v));
  const files = formData
    .getAll("coverItemFile")
    .filter((v): v is File => v instanceof File);

  const coverImages: string[] = [];
  let urlIdx = 0;
  let fileIdx = 0;
  for (const kind of kinds) {
    if (coverImages.length >= MAX_IMAGES) break;
    if (kind === "url") {
      const u = urls[urlIdx++];
      if (u && u.trim()) coverImages.push(u.trim());
    } else if (kind === "file") {
      const f = files[fileIdx++];
      if (f && f.size > 0) {
        const r = await uploadImage(f, { prefix: `stores/${id}` });
        if (r.ok) coverImages.push(r.url);
      }
    }
  }

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
      infoSections,
      services,
    },
  });
  revalidatePath(`/partner/stores/${id}`);
  revalidatePath(`/partner/stores/${id}/profile`);
  revalidatePath(`/app/stores/${id}`);
  revalidatePath(`/app/stores`);
  revalidatePath(`/stores`);
  });
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
  const infoSections: Array<{
    title: string;
    subtitle: string;
    content: string;
    images: string[];
  }> = Array.isArray(store.infoSections)
    ? (store.infoSections as Array<Record<string, unknown>>).map((s) => ({
        title: typeof s?.title === "string" ? s.title : "",
        subtitle: typeof s?.subtitle === "string" ? s.subtitle : "",
        content: typeof s?.content === "string" ? s.content : "",
        images: Array.isArray(s?.images)
          ? (s.images as unknown[]).filter(
              (u): u is string => typeof u === "string",
            )
          : [],
      }))
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
          infoSections,
          rating: store.rating,
          reviewCount: store.reviewCount,
          services: store.services,
        }}
        maxImages={MAX_IMAGES}
      />
    </AdminShell>
  );
}
