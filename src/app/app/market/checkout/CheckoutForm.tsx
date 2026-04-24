"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";

type AddressOpt = {
  id: string;
  label: string | null;
  recipientName: string;
  phone: string;
  postalCode: string;
  addr1: string;
  addr2: string | null;
  isDefault: boolean;
};

export function CheckoutForm({ addresses }: { addresses: AddressOpt[] }) {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [mode, setMode] = useState<"saved" | "new">(
    addresses.length > 0 ? "saved" : "new",
  );
  const [selectedAddrId, setSelectedAddrId] = useState<string>(
    addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id ?? "",
  );
  const [recipientName, setRecipientName] = useState("");
  const [phone, setPhone] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [addr1, setAddr1] = useState("");
  const [addr2, setAddr2] = useState("");
  const [memo, setMemo] = useState("");
  const [method, setMethod] = useState<"easy" | "card">("easy");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shippingFee = subtotal >= 50000 || subtotal === 0 ? 0 : 3000;
  const total = subtotal + shippingFee;

  if (mounted && items.length === 0) {
    return (
      <div className="px-5 pt-20 text-center">
        <div className="text-[14px] text-slate mb-4">
          장바구니가 비어있어요.
        </div>
        <a
          href="/app/market"
          className="inline-flex h-11 items-center px-5 rounded-full bg-ink text-white text-[13px] font-bold"
        >
          마켓 둘러보기
        </a>
      </div>
    );
  }

  async function submit() {
    setError(null);
    setLoading(true);
    try {
      const payload: Record<string, unknown> = {
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
        paymentMethod: method,
        memo,
      };
      if (mode === "saved" && selectedAddrId) {
        payload.addressId = selectedAddrId;
      } else {
        Object.assign(payload, {
          recipientName,
          phone,
          postalCode,
          addr1,
          addr2,
        });
      }
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error ?? "주문에 실패했어요.");
        return;
      }
      const { id } = (await res.json()) as { id: string };
      clear();
      router.replace(`/app/market/orders/${id}`);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="px-5 pt-5">
        <div className="bg-white rounded-[14px] border border-fog p-5">
          <div className="text-[13px] font-bold mb-3">주문 상품</div>
          <ul className="flex flex-col gap-2">
            {items.map((it) => (
              <li
                key={it.productId}
                className="flex items-center justify-between text-[14px]"
              >
                <span className="truncate pr-3">
                  {it.name}{" "}
                  <span className="text-slate ww-num">× {it.quantity}</span>
                </span>
                <span className="ww-num font-semibold">
                  {(it.price * it.quantity).toLocaleString("ko-KR")}원
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-5 pt-4">
        <div className="bg-white rounded-[14px] border border-fog p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[13px] font-bold">배송지</div>
            {addresses.length > 0 && (
              <div className="flex gap-[4px] text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setMode("saved")}
                  className={`px-3 py-1 rounded-full ${
                    mode === "saved" ? "bg-ink text-white" : "bg-cloud text-slate"
                  }`}
                >
                  저장된 주소
                </button>
                <button
                  type="button"
                  onClick={() => setMode("new")}
                  className={`px-3 py-1 rounded-full ${
                    mode === "new" ? "bg-ink text-white" : "bg-cloud text-slate"
                  }`}
                >
                  새 주소
                </button>
              </div>
            )}
          </div>

          {mode === "saved" ? (
            <div className="flex flex-col gap-2">
              {addresses.map((a) => (
                <label
                  key={a.id}
                  className={`p-3 rounded-[10px] border-[1.5px] cursor-pointer ${
                    selectedAddrId === a.id
                      ? "border-accent bg-accent/5"
                      : "border-fog"
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    className="sr-only"
                    checked={selectedAddrId === a.id}
                    onChange={() => setSelectedAddrId(a.id)}
                  />
                  <div className="flex items-center justify-between">
                    <div className="text-[13px] font-bold">
                      {a.label ? `${a.label} · ` : ""}
                      {a.recipientName}
                    </div>
                    {a.isDefault && (
                      <span className="text-[10px] font-bold bg-ink text-white px-2 py-[3px] rounded">
                        기본
                      </span>
                    )}
                  </div>
                  <div className="text-[12px] text-slate mt-1 ww-num">
                    {a.phone}
                  </div>
                  <div className="text-[12px] text-graphite mt-1">
                    ({a.postalCode}) {a.addr1} {a.addr2 ?? ""}
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <div className="grid gap-2">
              <Field
                placeholder="받는 분"
                value={recipientName}
                onChange={setRecipientName}
              />
              <Field
                placeholder="연락처"
                value={phone}
                onChange={setPhone}
                type="tel"
              />
              <Field
                placeholder="우편번호"
                value={postalCode}
                onChange={setPostalCode}
              />
              <Field
                placeholder="기본 주소"
                value={addr1}
                onChange={setAddr1}
              />
              <Field
                placeholder="상세 주소 (선택)"
                value={addr2}
                onChange={setAddr2}
              />
            </div>
          )}

          <textarea
            placeholder="배송 요청사항 (선택)"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            rows={2}
            className="w-full mt-3 p-3 bg-paper border border-fog rounded-[10px] text-[13px] resize-none"
          />
        </div>
      </section>

      <section className="px-5 pt-4">
        <div className="bg-white rounded-[14px] border border-fog p-5">
          <div className="text-[13px] font-bold mb-3">결제 수단</div>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                { id: "easy", label: "간편결제", hint: "1초 결제" },
                { id: "card", label: "신용/체크카드", hint: "토스페이먼츠" },
              ] as const
            ).map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id)}
                className={`rounded-[10px] p-3 text-left border-[1.5px] ${
                  method === m.id
                    ? "border-accent bg-accent/5"
                    : "border-fog"
                }`}
              >
                <div className="text-[13px] font-bold">{m.label}</div>
                <div className="text-[11px] text-slate mt-1">{m.hint}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pt-4">
        <div className="bg-white rounded-[14px] border border-fog p-5">
          <div className="text-[13px] font-bold mb-3">결제 금액</div>
          <div className="flex items-center justify-between py-1 text-[13px]">
            <span className="text-slate">상품 합계</span>
            <span className="ww-num">
              {subtotal.toLocaleString("ko-KR")}원
            </span>
          </div>
          <div className="flex items-center justify-between py-1 text-[13px]">
            <span className="text-slate">배송비</span>
            <span className="ww-num">
              {shippingFee === 0
                ? "무료"
                : `${shippingFee.toLocaleString("ko-KR")}원`}
            </span>
          </div>
          <div className="h-px bg-fog my-3" />
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-bold">최종 결제금액</span>
            <span className="ww-disp text-[22px] ww-num">
              {total.toLocaleString("ko-KR")}원
            </span>
          </div>
        </div>
      </section>

      {error && (
        <div className="px-5 pt-3">
          <div className="text-[13px] text-danger bg-danger/5 border border-danger/20 rounded-[10px] px-3 py-2">
            {error}
          </div>
        </div>
      )}

      <div className="fixed left-0 right-0 bottom-0 flex justify-center">
        <div className="w-full max-w-app bg-white border-t border-fog px-4 py-3">
          <button
            type="button"
            onClick={submit}
            disabled={loading}
            className="h-14 w-full rounded-full bg-accent text-white font-bold text-[15px] disabled:opacity-50 shadow-ww-blue"
          >
            {loading
              ? "결제 진행 중…"
              : `${total.toLocaleString("ko-KR")}원 결제하기`}
          </button>
        </div>
      </div>
    </>
  );
}

function Field({
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 px-3 bg-paper border border-fog rounded-[10px] text-[13px] outline-none focus:border-ink"
    />
  );
}
