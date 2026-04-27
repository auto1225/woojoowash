"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IconChev, IconClose } from "@/components/icons";
import {
  EMPTY_CARD,
  isCardValid,
  PaymentMethodSelector,
  type CardInfo,
  type PayMethod,
} from "./PaymentMethodSelector";

export function PaymentClient({
  storeId,
  productId,
  startAt,
  optionIds,
  total,
}: {
  storeId: string;
  productId: string;
  startAt: string;
  optionIds: string[];
  total: number;
}) {
  const router = useRouter();
  const [method, setMethod] = useState<PayMethod>("EASY");
  const [card, setCard] = useState<CardInfo>(EMPTY_CARD);
  const [agreed, setAgreed] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cardOk = method === "EASY" || isCardValid(card);

  // 약관 시트 열린 동안 body 스크롤 잠금 + ESC 닫기
  useEffect(() => {
    if (!termsOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setTermsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [termsOpen]);

  async function pay() {
    setError(null);
    if (!agreed) {
      setError("예약 취소/환불 수수료 결제 진행 동의가 필요해요.");
      return;
    }
    if (!cardOk) {
      setError("카드 정보를 모두 정확히 입력해 주세요.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId,
          productId,
          startAt,
          optionIds,
          paymentMethod: method,
        }),
      });
      if (res.status === 401) {
        const callback = new URLSearchParams({
          store: storeId,
          product: productId,
          startAt,
        });
        if (optionIds.length > 0) callback.set("options", optionIds.join(","));
        router.push(
          `/app/login?callbackUrl=${encodeURIComponent(
            `/app/booking/payment?${callback.toString()}`,
          )}`,
        );
        return;
      }
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error ?? "결제에 실패했어요.");
        return;
      }
      const { id } = (await res.json()) as { id: string };
      router.replace(`/app/booking/${id}/confirmed`);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PaymentMethodSelector
        method={method}
        onMethodChange={setMethod}
        card={card}
        onCardChange={setCard}
      />

      {/* 동의 */}
      <section className="px-5 pt-3">
        <div className="bg-white rounded-[20px] border border-fog px-6 py-4 flex items-center gap-2 text-[13px]">
          <button
            type="button"
            onClick={() => setAgreed((v) => !v)}
            aria-pressed={agreed}
            aria-label="예약 취소/환불 수수료 결제 진행 동의"
            className={`w-5 h-5 rounded-full inline-flex items-center justify-center shrink-0 transition border ${
              agreed
                ? "bg-accent border-accent"
                : "bg-cloud border-fog hover:border-ink"
            }`}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke={agreed ? "#fff" : "#6E6E73"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 6l3 3 5-5" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setAgreed((v) => !v)}
            className="flex-1 text-left flex items-center gap-2"
          >
            <span>예약 취소/환불 수수료 결제 진행 동의</span>
            <span className="text-slate">(필수)</span>
          </button>
          <button
            type="button"
            onClick={() => setTermsOpen(true)}
            aria-label="약관 상세 보기"
            className="text-ash hover:text-ink transition"
          >
            <IconChev size={14} stroke={1.8} />
          </button>
        </div>
        <div className="text-[11px] text-slate leading-[1.7] mt-3 px-1">
          * 주식회사 우주워시는 통신판매중개자로서 통신판매의 당사자가 아니며,
          입점판매자가 등록한 상품정보 및 거래에 대한 책임을 지지 않습니다.
        </div>
      </section>

      <div className="fixed left-0 right-0 bottom-0 flex justify-center z-30">
        <div className="w-full max-w-app bg-paper px-4 py-3">
          {error && (
            <div className="mb-2 text-[12px] text-danger">{error}</div>
          )}
          <button
            type="button"
            onClick={pay}
            disabled={loading || !cardOk || !agreed}
            className="h-14 rounded-full bg-accent text-white font-bold text-[16px] w-full flex items-center justify-center disabled:opacity-50 shadow-ww-blue"
          >
            {loading
              ? "결제 진행 중…"
              : !agreed
                ? "약관 동의 후 결제 가능"
                : `${total.toLocaleString("ko-KR")}원 결제하기`}
          </button>
        </div>
      </div>

      {/* 약관 상세 — 바텀시트 */}
      {termsOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center"
          onClick={() => setTermsOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40 ww-fade-up" />
          <div
            className="relative w-full max-w-app bg-white rounded-t-[24px] pt-3 pb-[calc(env(safe-area-inset-bottom)+12px)] ww-fade-up max-h-[80dvh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto w-10 h-1 rounded-full bg-fog mb-3" />
            <div className="px-5 pb-3 flex items-center justify-between">
              <div className="text-[16px] font-extrabold tracking-[-0.3px]">
                예약 취소/환불 수수료 약관
              </div>
              <button
                type="button"
                onClick={() => setTermsOpen(false)}
                aria-label="닫기"
                className="w-8 h-8 inline-flex items-center justify-center rounded-full hover:bg-cloud transition"
              >
                <IconClose size={18} stroke={2} />
              </button>
            </div>
            <div className="overflow-y-auto px-5 pb-3 text-[13px] leading-[1.7] text-graphite flex flex-col gap-3">
              <Section title="1. 예약 취소·변경 가능 시점">
                <p>
                  이용 시작 시각 기준 <strong>1시간 전까지</strong>는 무료로
                  취소·변경할 수 있습니다.
                </p>
              </Section>
              <Section title="2. 환불 수수료">
                <p>1시간 미만 ~ 시작 직전: 결제 금액의 30%</p>
                <p>이용 시작 후 노쇼: 결제 금액의 100%</p>
              </Section>
              <Section title="3. 매장 사정으로 인한 취소">
                <p>
                  기상 악화·장비 고장 등 매장 측 사유로 취소될 경우 결제 금액
                  전액이 즉시 환불됩니다. 입금 영업일 기준 1~3일 이내 카드사로
                  취소 요청이 진행됩니다.
                </p>
              </Section>
              <Section title="4. 추가 옵션·소요시간 변경">
                <p>
                  현장에서 추가 옵션이 변경되거나 차량 상태에 따라 소요시간이
                  연장될 수 있으며, 차액은 매장에서 별도 안내합니다.
                </p>
              </Section>
              <Section title="5. 분쟁 해결">
                <p>
                  취소·환불 관련 분쟁은 우주워시 고객센터(1:1 문의) 를 통해
                  접수해 주세요. 입점 매장과 직접 협의가 어려운 경우 우주워시가
                  중재합니다.
                </p>
              </Section>
              <p className="text-[11px] text-slate leading-[1.6] mt-2">
                ※ 본 약관은 시연용 샘플 문구입니다. 실제 시행 시점에 정식 약관
                문서로 교체될 예정입니다.
              </p>
            </div>
            <div className="px-5 pt-3 pb-1 border-t border-fog flex gap-2">
              <button
                type="button"
                onClick={() => setTermsOpen(false)}
                className="flex-1 h-12 rounded-full bg-cloud text-ink font-bold text-[14px]"
              >
                닫기
              </button>
              <button
                type="button"
                onClick={() => {
                  setAgreed(true);
                  setTermsOpen(false);
                }}
                className="flex-1 h-12 rounded-full bg-ink text-white font-bold text-[14px]"
              >
                동의하고 닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[13px] font-extrabold mb-1">{title}</div>
      <div className="text-[13px] text-graphite leading-[1.7] flex flex-col gap-1">
        {children}
      </div>
    </div>
  );
}
