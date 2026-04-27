import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppBar } from "@/components/app/AppBar";
import { IconCar, IconInfo } from "@/components/icons";
import { getProduct } from "@/lib/queries/stores";
import { IMG } from "@/lib/images";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { BookingControls } from "./BookingControls";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string; pid: string };
}) {
  const product = await getProduct(params.id, params.pid);
  if (!product) return notFound();

  const session = await auth();
  const myCar = session?.user
    ? await db.car.findFirst({
        where: { userId: session.user.id, isDefault: true },
      })
    : null;

  const heroImg = product.images[0] ?? IMG.svcHand;

  return (
    <div className="pb-[140px]">
      <div className="relative h-[280px]">
        <Image
          src={heroImg}
          alt={product.title}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 480px) 100vw, 480px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
        <AppBar dark border={false} showBack />
      </div>

      <div className="px-5 pt-5">
        <div className="text-[12px] text-accent font-bold mb-1">
          {product.store.name}
        </div>
        <div className="ww-disp text-[24px] tracking-[-0.02em] leading-[1.25] mb-2">
          {product.title}
        </div>
        <div className="text-[13px] text-slate mb-4">
          {product.durationMin}분 소요
          {product.subtitle ? ` · ${product.subtitle}` : ""}
        </div>
        {product.description && (
          <p className="text-[14px] leading-[1.7] text-graphite">
            {product.description}
          </p>
        )}
      </div>

      {product.cautions.length > 0 && (
        <div className="mx-5 mt-6 rounded-[14px] bg-cloud p-4">
          <div className="flex items-center gap-2 mb-2">
            <IconInfo size={16} stroke={1.8} />
            <div className="text-[12px] font-bold">이용 전 확인해 주세요</div>
          </div>
          <ul className="text-[12px] text-graphite flex flex-col gap-1">
            {product.cautions.map((c) => (
              <li key={c}>· {c}</li>
            ))}
          </ul>
        </div>
      )}

      <section className="px-5 mt-7">
        <div className="text-[14px] font-bold mb-3">내 차량</div>
        <div className="rounded-[14px] border border-fog bg-white p-4 flex items-center gap-3">
          <div className="w-11 h-11 rounded-[12px] bg-cloud flex items-center justify-center">
            <IconCar size={22} stroke={1.6} />
          </div>
          <div className="flex-1">
            {myCar ? (
              <>
                <div className="text-[14px] font-bold">
                  {myCar.brand} {myCar.model}
                </div>
                <div className="text-[11px] text-slate font-medium">
                  {myCar.plate}
                  {myCar.color ? ` · ${myCar.color}` : ""}
                </div>
              </>
            ) : (
              <div className="text-[13px] text-slate">
                로그인 후 차량을 선택할 수 있어요
              </div>
            )}
          </div>
          <Link href="/app/me/cars" className="text-[12px] text-slate">
            변경
          </Link>
        </div>
      </section>

      <BookingControls
        storeId={product.store.id}
        productId={product.id}
        basePrice={product.price}
        options={product.options.map((o) => ({
          id: o.id,
          label: o.label,
          price: o.price,
          priceMode: o.priceMode,
          durationMin: o.durationMin,
        }))}
      />

      <section className="px-5 mt-7">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[14px] font-bold">예약 일시</div>
          <span className="text-[12px] text-accent font-bold">선택해 주세요</span>
        </div>
        <Link
          href={`/app/stores/${product.store.id}/products/${product.id}/date`}
          className="block h-14 rounded-[14px] border border-fog bg-white px-4 flex items-center justify-between"
        >
          <span className="text-[14px] text-slate">원하는 날짜·시간 선택</span>
          <span className="text-[12px] font-bold text-ink">변경</span>
        </Link>
      </section>

      <section className="px-5 mt-7">
        <div className="text-[14px] font-bold mb-3">요청사항 (선택)</div>
        <textarea
          placeholder="요청사항을 100자 이내로 남겨주세요."
          maxLength={100}
          className="w-full min-h-[100px] rounded-[14px] border border-fog bg-white p-4 text-[14px] outline-none resize-none"
        />
      </section>
    </div>
  );
}
