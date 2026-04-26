import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AdminShell } from "@/components/partner/PartnerShell";
import { requireOwnedStore, requireOwner } from "@/lib/admin";
import { db } from "@/lib/db";
import { uploadImage } from "@/lib/storage";
import {
  type SaveActionState,
  withSaveResult,
} from "@/components/admin/save-action";
import { ProductForm } from "../ProductForm";

export const dynamic = "force-dynamic";

const MAX_IMAGES = 5;

async function updateProduct(
  storeId: string,
  productId: string,
  _prev: SaveActionState,
  formData: FormData,
): Promise<SaveActionState> {
  "use server";
  return withSaveResult(async () => {
    await requireOwnedStore(storeId);
    const data = await parseForm(storeId, formData);
    await db.product.update({ where: { id: productId }, data });
    revalidatePath(`/partner/stores/${storeId}/products`);
    revalidatePath(`/partner/stores/${storeId}/products/${productId}`);
    revalidatePath(`/app/stores/${storeId}`);
    revalidatePath(`/app/stores/${storeId}/products/${productId}`);
  });
}

async function parseForm(storeId: string, fd: FormData) {
  const cautionsRaw = String(fd.get("cautions") ?? "").trim();

  // 다중 이미지
  const kinds = fd.getAll("productImageKind").map((v) => String(v));
  const urls = fd.getAll("productImageUrl").map((v) => String(v));
  const files = fd
    .getAll("productImageFile")
    .filter((v): v is File => v instanceof File);

  const images: string[] = [];
  let urlIdx = 0;
  let fileIdx = 0;
  for (const kind of kinds) {
    if (images.length >= MAX_IMAGES) break;
    if (kind === "url") {
      const u = urls[urlIdx++];
      if (u && u.trim()) images.push(u.trim());
    } else if (kind === "file") {
      const f = files[fileIdx++];
      if (f && f.size > 0) {
        const r = await uploadImage(f, { prefix: `stores/${storeId}/products` });
        if (r.ok) images.push(r.url);
      }
    }
  }

  // 추가 옵션 (최대 20개)
  const options = parseOptions(fd);

  return {
    type: String(fd.get("type") ?? "HAND") as
      | "SELF"
      | "HAND"
      | "PICKUP"
      | "VISIT",
    title: String(fd.get("title") ?? "").trim(),
    subtitle: String(fd.get("subtitle") ?? "").trim() || null,
    description: String(fd.get("description") ?? "").trim() || null,
    durationMin: Number(fd.get("durationMin") ?? 60),
    price: clampPriceServer(fd.get("price")),
    images,
    options,
    cautions: cautionsRaw
      ? cautionsRaw.split("\n").map((x) => x.trim()).filter(Boolean)
      : [],
  };
}

const MAX_OPTIONS = 20;
const MAX_PRICE = 99_999_999;

function clampPriceServer(raw: FormDataEntryValue | null): number {
  const digits = String(raw ?? "").replace(/[^\d]/g, "");
  if (!digits) return 0;
  const n = Number(digits);
  if (!Number.isFinite(n)) return 0;
  return Math.min(MAX_PRICE, Math.max(0, Math.floor(n)));
}

function parseOptions(fd: FormData) {
  const ids = fd.getAll("optionId").map((v) => String(v));
  const labels = fd.getAll("optionLabel").map((v) => String(v));
  const modes = fd.getAll("optionPriceMode").map((v) => String(v));
  const prices = fd.getAll("optionPrice").map((v) => String(v));
  const durations = fd.getAll("optionDurationMin").map((v) => String(v));

  const out: Array<{
    id: string;
    label: string;
    priceMode: "amount" | "ask";
    price: number;
    durationMin?: number;
  }> = [];
  for (let i = 0; i < labels.length && out.length < MAX_OPTIONS; i++) {
    const label = (labels[i] ?? "").trim();
    if (!label) continue;
    const m = modes[i];
    // "free" 는 폐기 — 금액 + price 0 으로 정규화 (앱에서 "무료" 로 표시)
    const priceMode: "amount" | "ask" = m === "ask" ? "ask" : "amount";
    let price = 0;
    if (priceMode === "amount") {
      price = clampPriceServer(prices[i] ?? "");
    }
    const dRaw = (durations[i] ?? "").trim();
    let durationMin: number | undefined;
    if (dRaw) {
      const dn = Number(dRaw);
      if (Number.isFinite(dn) && dn > 0) durationMin = Math.floor(dn);
    }
    const existingId = (ids[i] ?? "").trim();
    out.push({
      id:
        existingId ||
        `opt-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}`,
      label,
      priceMode,
      price,
      ...(durationMin ? { durationMin } : {}),
    });
  }
  return out;
}

export default async function EditProductPage({
  params,
}: {
  params: { id: string; pid: string };
}) {
  const user = await requireOwner();
  const store = await requireOwnedStore(params.id);
  const product = await db.product.findFirst({
    where: { id: params.pid, storeId: store.id },
  });
  if (!product) return notFound();

  const images = Array.isArray(product.images)
    ? (product.images as unknown[]).filter(
        (u): u is string => typeof u === "string",
      )
    : [];

  const optionsDefaults: Array<{
    id: string;
    label: string;
    price: number;
    priceMode?: "amount" | "ask";
    durationMin?: number | null;
  }> = Array.isArray(product.options)
    ? (product.options as Array<Record<string, unknown>>)
        .map((o) => {
          const label = typeof o?.label === "string" ? o.label : "";
          if (!label) return null;
          const priceRaw = typeof o?.price === "number" ? o.price : 0;
          const modeRaw = typeof o?.priceMode === "string" ? o.priceMode : "";
          // 레거시 "free" 는 amount + price 0 으로 정규화
          const priceMode: "amount" | "ask" =
            modeRaw === "ask" ? "ask" : "amount";
          const durationRaw =
            typeof o?.durationMin === "number" ? o.durationMin : null;
          return {
            id: typeof o?.id === "string" ? o.id : "",
            label,
            price: priceRaw,
            priceMode,
            durationMin:
              durationRaw && durationRaw > 0 ? durationRaw : null,
          };
        })
        .filter((x): x is NonNullable<typeof x> => x !== null)
    : [];

  return (
    <AdminShell
      userName={user.name || user.email}
      storeName={store.name}
      storeId={store.id}
    >
      <h1 className="ww-disp text-[24px] tracking-[-0.02em] mb-6">
        {product.title}
      </h1>
      <ProductForm
        action={updateProduct.bind(null, store.id, product.id)}
        defaults={{
          title: product.title,
          subtitle: product.subtitle ?? "",
          description: product.description ?? "",
          type: product.type,
          price: product.price,
          durationMin: product.durationMin,
          images,
          cautions: product.cautions.join("\n"),
          options: optionsDefaults,
        }}
      />
    </AdminShell>
  );
}
