import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppBar } from "@/components/app/AppBar";
import { IconCar, IconInfo } from "@/components/icons";
import { MOCK_PRODUCTS, MOCK_STORES } from "@/lib/mock/stores";

export default function ProductDetailPage({
  params,
}: {
  params: { id: string; pid: string };
}) {
  const store = MOCK_STORES.find((s) => s.id === params.id);
  const product = MOCK_PRODUCTS.find((p) => p.id === params.pid);
  if (!store || !product) return notFound();

  return (
    <div className="pb-[140px]">
      <div className="relative h-[280px]">
        <Image
          src={product.hero}
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
          {store.name}
        </div>
        <div className="ww-disp text-[24px] tracking-[-0.02em] leading-[1.25] mb-2">
          {product.title}
        </div>
        <div className="text-[13px] text-slate mb-4">
          {product.duration}분 소요 · {product.subtitle}
        </div>
        <p className="text-[14px] leading-[1.7] text-graphite">
          {product.description}
        </p>
      </div>

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

      <section className="px-5 mt-7">
        <div className="text-[14px] font-bold mb-3">내 차량</div>
        <div className="rounded-[14px] border border-fog bg-white p-4 flex items-center gap-3">
          <div className="w-11 h-11 rounded-[12px] bg-cloud flex items-center justify-center">
            <IconCar size={22} stroke={1.6} />
          </div>
          <div className="flex-1">
            <div className="text-[14px] font-bold">현대 그랜저 IG</div>
            <div className="text-[11px] text-slate font-medium">
              12가 3456 · 펄 화이트
            </div>
          </div>
          <div className="text-[12px] text-slate">변경</div>
        </div>
      </section>

      <section className="px-5 mt-7">
        <div className="text-[14px] font-bold mb-3">추가 옵션</div>
        <div className="flex flex-col rounded-[14px] border border-fog overflow-hidden">
          {product.options.map((o, i) => (
            <div
              key={o.id}
              className={`flex items-center justify-between px-4 py-4 bg-white ${
                i < product.options.length - 1 ? "border-b border-fog" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded border border-fog" />
                <span className="text-[14px]">{o.label}</span>
              </div>
              <div className="text-[13px] font-bold ww-num">
                +{o.price.toLocaleString("ko-KR")}원
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 mt-7">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[14px] font-bold">예약 일시</div>
          <span className="text-[12px] text-accent font-bold">선택해 주세요</span>
        </div>
        <Link
          href={`/app/stores/${store.id}/products/${product.id}/date`}
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

      <div className="fixed left-0 right-0 bottom-0 z-30 flex justify-center">
        <div className="w-full max-w-app bg-white border-t border-fog px-4 py-3 flex gap-2">
          <div className="flex-1 h-14 rounded-full bg-cloud flex items-center justify-between px-5">
            <span className="text-[12px] text-slate">총 결제금액</span>
            <span className="ww-disp text-[18px] ww-num">
              {product.price.toLocaleString("ko-KR")}원
            </span>
          </div>
          <Link
            href={`/app/booking/payment?store=${store.id}&product=${product.id}`}
            className="h-14 px-7 rounded-full bg-ink text-white font-bold text-[15px] flex items-center hover:bg-accent-deep transition"
          >
            예약하기
          </Link>
        </div>
      </div>
    </div>
  );
}
