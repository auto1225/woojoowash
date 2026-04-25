"use client";

import { useTransition } from "react";
import { updateOrderStatus, updateShipment } from "../actions";
import type { OrderStatus } from "@prisma/client";

const OPTIONS: Array<{ v: OrderStatus; l: string }> = [
  { v: "PENDING", l: "결제 대기" },
  { v: "PAID", l: "결제 완료" },
  { v: "PREPARING", l: "준비중" },
  { v: "SHIPPED", l: "배송중" },
  { v: "DELIVERED", l: "배송 완료" },
  { v: "CANCELED", l: "취소" },
  { v: "REFUNDED", l: "환불" },
];

export function OrderStatusControl({
  orderId,
  currentStatus,
  shipment,
}: {
  orderId: string;
  currentStatus: OrderStatus;
  shipment: {
    carrier: string;
    trackingNumber: string;
    shippedAt: string | null;
    deliveredAt: string | null;
  };
}) {
  const [pending, startTransition] = useTransition();

  return (
    <>
      <div className="bg-white border border-fog rounded-[20px] p-6">
        <div className="text-[15px] font-extrabold mb-4">주문 상태</div>
        <select
          defaultValue={currentStatus}
          disabled={pending}
          onChange={(e) =>
            startTransition(() => updateOrderStatus(orderId, e.target.value))
          }
          className="w-full h-11 px-3 bg-paper border border-fog rounded-[10px] text-[14px] font-semibold"
        >
          {OPTIONS.map((o) => (
            <option key={o.v} value={o.v}>
              {o.l}
            </option>
          ))}
        </select>
        <div className="text-[11px] text-slate mt-3 leading-[1.6]">
          상태를 변경하면 고객 주문 내역에도 즉시 반영됩니다.
        </div>
      </div>

      <form
        action={updateShipment.bind(null, orderId)}
        className="bg-white border border-fog rounded-[20px] p-6"
      >
        <div className="text-[15px] font-extrabold mb-4">배송 정보</div>
        <label className="block mb-3">
          <span className="text-[12px] font-bold mb-[4px] block">
            택배사
          </span>
          <input
            type="text"
            name="carrier"
            defaultValue={shipment.carrier}
            placeholder="예: CJ대한통운"
            className="w-full h-11 px-3 bg-paper border border-fog rounded-[10px] text-[14px]"
          />
        </label>
        <label className="block mb-3">
          <span className="text-[12px] font-bold mb-[4px] block">
            운송장 번호
          </span>
          <input
            type="text"
            name="trackingNumber"
            defaultValue={shipment.trackingNumber}
            placeholder="숫자만 입력"
            className="w-full h-11 px-3 bg-paper border border-fog rounded-[10px] text-[14px] ww-num"
          />
        </label>
        <label className="flex items-center gap-2 text-[13px] py-1">
          <input type="checkbox" name="markShipped" className="w-4 h-4 accent-accent" />
          출고 처리 (상태를 배송중으로 변경)
        </label>
        <label className="flex items-center gap-2 text-[13px] py-1">
          <input type="checkbox" name="markDelivered" className="w-4 h-4 accent-accent" />
          배송 완료 처리
        </label>
        <button
          type="submit"
          className="mt-4 h-11 w-full rounded-full btn-brand text-[13px]"
        >
          저장
        </button>
        {(shipment.shippedAt || shipment.deliveredAt) && (
          <div className="mt-4 pt-4 border-t border-fog text-[11px] text-slate space-y-1">
            {shipment.shippedAt && (
              <div>
                출고:{" "}
                <span className="ww-num">
                  {new Date(shipment.shippedAt).toLocaleString("ko-KR")}
                </span>
              </div>
            )}
            {shipment.deliveredAt && (
              <div>
                완료:{" "}
                <span className="ww-num">
                  {new Date(shipment.deliveredAt).toLocaleString("ko-KR")}
                </span>
              </div>
            )}
          </div>
        )}
      </form>
    </>
  );
}
