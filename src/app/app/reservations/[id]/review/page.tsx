import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { AppBar } from "@/components/app/AppBar";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { uploadImage } from "@/lib/storage";
import {
  type SaveActionState,
  withSaveResult,
} from "@/components/admin/save-action";
import { ReviewForm } from "./ReviewForm";

export const dynamic = "force-dynamic";

const MAX_PHOTOS = 5;

async function createReview(
  reservationId: string,
  userId: string,
  storeId: string,
  _prev: SaveActionState,
  formData: FormData,
): Promise<SaveActionState> {
  "use server";
  let createdId: string | null = null;
  const result = await withSaveResult(async () => {
    // 사진 업로드
    const photoFiles = formData
      .getAll("photo")
      .filter((v): v is File => v instanceof File && v.size > 0);
    const photos: string[] = [];
    for (const f of photoFiles.slice(0, MAX_PHOTOS)) {
      const r = await uploadImage(f, {
        prefix: `stores/${storeId}/reviews`,
      });
      if (r.ok) photos.push(r.url);
    }

    const ratingRaw = Number(formData.get("rating") ?? 5);
    const rating = Math.min(5, Math.max(1, Math.floor(ratingRaw)));
    const body = String(formData.get("body") ?? "").trim() || null;

    // 중복 방지 — 이미 리뷰가 있으면 에러
    const existing = await db.review.findUnique({ where: { reservationId } });
    if (existing) {
      throw new Error("이 예약에 대한 리뷰가 이미 등록되어 있어요.");
    }

    const created = await db.review.create({
      data: {
        reservationId,
        userId,
        storeId,
        rating,
        body,
        photos,
      },
    });
    createdId = created.id;

    // 매장 평점·리뷰 수 갱신
    const all = await db.review.findMany({
      where: { storeId },
      select: { rating: true },
    });
    const reviewCount = all.length;
    const avg =
      reviewCount === 0
        ? 0
        : all.reduce((s, r) => s + r.rating, 0) / reviewCount;
    await db.store.update({
      where: { id: storeId },
      data: {
        rating: Math.round(avg * 10) / 10,
        reviewCount,
      },
    });

    revalidatePath(`/app/reservations`);
    revalidatePath(`/app/stores/${storeId}`);
    revalidatePath(`/partner/stores/${storeId}/reviews`);
  });
  if (result.ok && createdId) {
    redirect(`/app/reservations`);
  }
  return result;
}

export default async function ReviewWritePage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session?.user) {
    redirect(
      `/app/login?callbackUrl=${encodeURIComponent(
        `/app/reservations/${params.id}/review`,
      )}`,
    );
  }

  const reservation = await db.reservation.findUnique({
    where: { id: params.id },
    include: {
      store: { select: { id: true, name: true } },
      product: { select: { title: true } },
      review: { select: { id: true } },
    },
  });
  if (!reservation || reservation.userId !== session.user.id) {
    return notFound();
  }
  if (reservation.status !== "DONE") {
    redirect(`/app/reservations`);
  }
  if (reservation.review) {
    redirect(`/app/reservations`);
  }

  const action = createReview.bind(
    null,
    reservation.id,
    session.user.id,
    reservation.store.id,
  );

  return (
    <div className="pb-24">
      <AppBar showBack title="리뷰 작성" />

      <div className="px-5 pt-5 pb-4">
        <div className="text-[12px] text-accent font-bold mb-1">
          {reservation.store.name}
        </div>
        <div className="ww-disp text-[20px] tracking-[-0.02em] mb-2">
          {reservation.product.title}
        </div>
        <div className="text-[12px] text-slate ww-num">
          {format(reservation.startAt, "yyyy-MM-dd (EEE) HH:mm", {
            locale: ko,
          })}{" "}
          이용
        </div>
      </div>

      <ReviewForm action={action} cancelHref="/app/reservations" />
    </div>
  );
}
