import { notFound } from "next/navigation";
import { AppBar } from "@/components/app/AppBar";
import { IconCard, IconChev } from "@/components/icons";
import { getProduct } from "@/lib/queries/stores";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { PayButton } from "./PayButton";

export const dynamic = "force-dynamic";

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: {
    store?: string;
    product?: string;
    startAt?: string;
    options?: string;
  };
}) {
  const storeId = searchParams.store;
  const productId = searchParams.product;
  if (!storeId || !productId) return notFound();

  const product = await getProduct(storeId, productId);
  if (!product) return notFound();

  const session = await auth();
  const myCar = session?.user
    ? await db.car.findFirst({
        where: { userId: session.user.id, isDefault: true },
      })
    : null;

  const startAt = searchParams.startAt
    ? new Date(searchParams.startAt)
    : nextHalfHour();

  // 선택 옵션 — URL 의 ?options=id1,id2 를 product.options 와 매칭
  const selectedIds = (searchParams.options ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const selectedOptions = product.options.filter((o) =>
    selectedIds.includes(o.id),
  );
  const optionsTotal = selectedOptions.reduce((sum, o) => {
    const mode = o.priceMode ?? "amount";
    if (mode === "amount" && o.price > 0) return sum + o.price;
    return sum;
  }, 0);
  const total = product.price + optionsTotal;

  return (
    <div className="pb-[130px] bg-paper min-h-screen">
      <AppBar title="예약/결제" />

      {/* 예약 정보 카드 */}
      <section className="px-5 pt-5">
        <div className="bg-white rounded-[20px] border border-fog overflow-hidden">
          <div className="py-4 border-b border-fog">
            <div className="text-center text-[16px] font-extrabold tracking-[-0.3px]">
              예약 정보
            </div>
          </div>
          <div className="p-6 space-y-5">
            <InfoRow
              label="차량"
              value={
                myCar ? (
                  <>
                    {myCar.brand} {myCar.model}
                    <br />
                    <span className="font-medium">{myCar.plate}</span>
                  </>
                ) : (
                  <span className="text-slate font-normal">차량 등록 필요</span>
                )
              }
            />
            <InfoRow label="매장" value={product.store.name} />
            <InfoRow label="상품" value={product.title} />
            <InfoRow label="일정" value={formatSchedule(startAt)} />
          </div>
        </div>
      </section>

      {/* 총 상품 가격 */}
      <section className="px-5 pt-3">
        <div className="bg-white rounded-[20px] border border-fog overflow-hidden">
          <div className="py-4 border-b border-fog">
            <div className="text-center text-[16px] font-extrabold tracking-[-0.3px]">
              총 상품 가격
            </div>
          </div>
          <div className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[14px]">· {product.title}</span>
              <span className="text-[14px] ww-num">
                {product.price.toLocaleString("ko-KR")}원
              </span>
            </div>
            {selectedOptions.length > 0 && (
              <>
                <div className="text-[12px] font-bold text-slate pt-2">
                  추가 옵션 {selectedOptions.length}건
                </div>
                {selectedOptions.map((o) => {
                  const mode = o.priceMode ?? "amount";
                  const isFree = mode !== "ask" && (!o.price || o.price <= 0);
                  const priceLabel =
                    mode === "ask"
                      ? "가격 협의"
                      : isFree
                        ? "무료"
                        : `+${o.price.toLocaleString("ko-KR")}원`;
                  return (
                    <div
                      key={o.id}
                      className="flex items-center justify-between text-[13px]"
                    >
                      <span className="text-graphite">· {o.label}</span>
                      <span
                        className={`ww-num ${
                          mode === "ask"
                            ? "text-slate"
                            : isFree
                              ? "text-success"
                              : ""
                        }`}
                      >
                        {priceLabel}
                      </span>
                    </div>
                  );
                })}
              </>
            )}
            <div className="flex items-center justify-between pt-3 border-t border-fog">
              <span className="text-[14px] text-slate">총 상품 가격</span>
              <span className="text-[14px] ww-num font-semibold">
                {total.toLocaleString("ko-KR")}원
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 쿠폰 */}
      <section className="px-5 pt-3">
        <div className="bg-white rounded-[20px] border border-fog px-6 py-5 flex items-center gap-3">
          <span className="text-[14px] font-semibold">쿠폰</span>
          <span className="flex-1 text-right text-[13px] font-bold text-accent">
            이용 가능한 쿠폰을 확인해보세요.
          </span>
          <IconChev size={18} stroke={1.8} className="text-ash" />
        </div>
      </section>

      {/* 결제 정보 */}
      <section className="px-5 pt-3">
        <div className="bg-white rounded-[20px] border border-fog px-6 py-5">
          <div className="text-[16px] font-extrabold mb-4">결제 정보</div>
          <div className="flex items-center justify-between py-3 border-t border-fog text-[14px]">
            <span className="text-slate">상품 가격</span>
            <span className="ww-num">
              {product.price.toLocaleString("ko-KR")}원
            </span>
          </div>
          {optionsTotal > 0 && (
            <div className="flex items-center justify-between py-3 border-t border-fog text-[14px]">
              <span className="text-slate">추가 옵션</span>
              <span className="ww-num">
                +{optionsTotal.toLocaleString("ko-KR")}원
              </span>
            </div>
          )}
          <div className="flex items-center justify-between py-3 border-t border-fog">
            <span className="text-[14px] text-slate">총 결제금액</span>
            <span className="ww-disp text-[22px] ww-num">
              {total.toLocaleString("ko-KR")}원
            </span>
          </div>
        </div>
      </section>

      {/* 결제 수단 */}
      <section className="px-5 pt-3">
        <div className="bg-white rounded-[20px] border border-fog px-6 py-5">
          <div className="text-[16px] font-extrabold mb-4">결제 수단</div>
          <div className="flex items-center gap-3 py-3 border-t border-fog">
            <span className="w-5 h-5 rounded-full bg-accent flex items-center justify-center shrink-0">
              <span className="w-[8px] h-[8px] rounded-full bg-white" />
            </span>
            <div className="flex-1 text-[14px] font-bold">우주워시 간편결제</div>
            <span className="text-[10px] font-bold text-white bg-accent rounded-md px-[6px] py-[3px]">
              1초 결제
            </span>
            <span className="text-[12px] font-semibold text-accent">카드 관리</span>
          </div>
          <div className="flex items-center gap-3 py-3 border-t border-fog">
            <span className="w-5 h-5 rounded-full border-[1.5px] border-fog shrink-0" />
            <div className="flex-1 text-[14px]">카드 결제</div>
            <IconCard size={20} stroke={1.6} className="text-slate" />
          </div>
        </div>
      </section>

      {/* 동의 */}
      <section className="px-5 pt-3">
        <div className="bg-white rounded-[20px] border border-fog px-6 py-4 flex items-center gap-2 text-[13px]">
          <span className="w-5 h-5 rounded-full bg-cloud flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 12 12">
              <path
                d="M2 6l3 3 5-5"
                stroke="#6E6E73"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span>예약 취소/환불 수수료 결제 진행 동의</span>
          <span className="text-slate">(필수)</span>
          <IconChev size={14} stroke={1.8} className="text-ash ml-auto" />
        </div>
        <div className="text-[11px] text-slate leading-[1.7] mt-3 px-1">
          * 주식회사 우주워시는 통신판매중개자로서 통신판매의 당사자가 아니며,
          입점판매자가 등록한 상품정보 및 거래에 대한 책임을 지지 않습니다.
        </div>
      </section>

      <div className="fixed left-0 right-0 bottom-0 flex justify-center">
        <div className="w-full max-w-app bg-paper px-4 py-3">
          <PayButton
            storeId={storeId}
            productId={productId}
            startAt={startAt.toISOString()}
            optionIds={selectedOptions.map((o) => o.id)}
            total={total}
          />
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[60px_1fr] gap-4 items-start">
      <div className="text-[13px] text-slate pt-[2px]">{label}</div>
      <div className="text-[15px] font-bold leading-[1.5]">{value}</div>
    </div>
  );
}

function formatSchedule(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const dow = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
  const h24 = d.getHours();
  const ampm = h24 < 12 ? "오전" : "오후";
  const h = h24 === 0 ? 12 : h24 > 12 ? h24 - 12 : h24;
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${y}.${m}.${day}(${dow}) ${ampm} ${String(h).padStart(2, "0")}:${mm}`;
}

function nextHalfHour(): Date {
  const d = new Date();
  d.setSeconds(0, 0);
  d.setMinutes(d.getMinutes() < 30 ? 30 : 60);
  return d;
}
