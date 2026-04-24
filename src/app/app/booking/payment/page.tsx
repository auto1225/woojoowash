import Link from "next/link";
import { AppBar } from "@/components/app/AppBar";
import { Card } from "@/components/ui/Card";
import { IconCard, IconChev, IconTicket } from "@/components/icons";
import { MOCK_PRODUCTS, MOCK_STORES } from "@/lib/mock/stores";

export default function PaymentPage({
  searchParams,
}: {
  searchParams: { store?: string; product?: string };
}) {
  const storeId = searchParams.store ?? "gangnam";
  const productId = searchParams.product ?? "basic";
  const store = MOCK_STORES.find((s) => s.id === storeId) ?? MOCK_STORES[0];
  const product = MOCK_PRODUCTS.find((p) => p.id === productId) ?? MOCK_PRODUCTS[0];

  const discount = 5000;
  const total = product.price - discount;

  return (
    <div className="pb-[120px] bg-paper min-h-screen">
      <AppBar title="결제" />

      <section className="px-5 pt-5">
        <Card>
          <div className="text-[11px] text-slate font-medium mb-[4px]">
            예약 정보
          </div>
          <div className="text-[16px] font-extrabold mb-1">{store.name}</div>
          <div className="text-[13px] text-graphite">{product.title}</div>
          <div className="text-[12px] text-slate ww-num mt-3 pt-3 border-t border-fog">
            2026-04-25 (토) · 14:30 · {product.duration}분
          </div>
        </Card>
      </section>

      <section className="px-5 pt-4">
        <Card>
          <div className="text-[11px] text-slate font-medium mb-3">
            총 상품 가격
          </div>
          <Row l="기본 상품" v={product.price} />
          <Row l="추가 옵션" v={0} />
          <Row l="쿠폰 할인" v={-discount} />
          <div className="h-px bg-fog my-3" />
          <div className="flex items-center justify-between">
            <div className="text-[14px] font-bold">최종 결제금액</div>
            <div className="ww-disp text-[22px] ww-num">
              {total.toLocaleString("ko-KR")}원
            </div>
          </div>
        </Card>
      </section>

      <section className="px-5 pt-4">
        <Card padded={false}>
          <div className="flex items-center gap-3 p-5">
            <IconTicket size={22} stroke={1.6} />
            <div className="flex-1 text-[14px] font-semibold">쿠폰함</div>
            <span className="text-[13px] font-bold text-accent">3,000원 할인 적용</span>
            <IconChev size={18} stroke={1.8} className="text-ash ml-1" />
          </div>
        </Card>
      </section>

      <section className="px-5 pt-4">
        <div className="text-[14px] font-bold mb-3">결제 수단</div>
        <Card padded={false}>
          {[
            { I: IconCard, l: "간편결제", hint: "토스페이·카카오페이·네이버페이" },
            { I: IconCard, l: "신용/체크카드", hint: "안전한 토스페이먼츠" },
          ].map((p, i) => (
            <div
              key={p.l}
              className={`flex items-center gap-3 px-5 py-4 ${
                i === 0 ? "border-b border-fog" : ""
              }`}
            >
              <span className="w-5 h-5 rounded-full border-[1.5px] border-ink flex items-center justify-center">
                {i === 0 && (
                  <span className="w-[10px] h-[10px] rounded-full bg-ink" />
                )}
              </span>
              <div className="flex-1">
                <div className="text-[14px] font-bold">{p.l}</div>
                <div className="text-[11px] text-slate">{p.hint}</div>
              </div>
              <p.I size={22} stroke={1.6} />
            </div>
          ))}
        </Card>
      </section>

      <section className="px-5 pt-4">
        <div className="text-[12px] text-slate leading-[1.6]">
          · 이용 1시간 전까지 무료 취소 가능해요.
          <br />· 이후 취소 시 예약 취소/환불 수수료 결제 진행 동의 약관이 적용돼요.
        </div>
      </section>

      <div className="fixed left-0 right-0 bottom-0 flex justify-center">
        <div className="w-full max-w-app bg-white border-t border-fog px-4 py-3">
          <Link
            href={`/app/booking/rsv_new/confirmed?store=${storeId}&product=${productId}`}
            className="h-14 rounded-full bg-ink text-white font-bold text-[15px] w-full flex items-center justify-center"
          >
            {total.toLocaleString("ko-KR")}원 결제하기
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({ l, v }: { l: string; v: number }) {
  const negative = v < 0;
  return (
    <div className="flex items-center justify-between py-[6px]">
      <div className="text-[13px] text-slate">{l}</div>
      <div
        className={`text-[14px] font-semibold ww-num ${
          negative ? "text-danger" : "text-ink"
        }`}
      >
        {negative ? "- " : ""}
        {Math.abs(v).toLocaleString("ko-KR")}원
      </div>
    </div>
  );
}
