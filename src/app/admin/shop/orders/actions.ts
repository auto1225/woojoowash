"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/console";
import { db } from "@/lib/db";
import type { OrderStatus } from "@prisma/client";

const VALID: OrderStatus[] = [
  "PENDING",
  "PAID",
  "PREPARING",
  "SHIPPED",
  "DELIVERED",
  "CANCELED",
  "REFUNDED",
];

export async function updateOrderStatus(id: string, status: string) {
  await requireAdmin();
  if (!VALID.includes(status as OrderStatus)) return;
  await db.order.update({
    where: { id },
    data: { status: status as OrderStatus },
  });
  revalidatePath("/admin/shop/orders");
  revalidatePath("/admin/shop/shipments");
  revalidatePath(`/admin/shop/orders/${id}`);
}

export async function updateShipment(orderId: string, formData: FormData) {
  await requireAdmin();
  const carrier = String(formData.get("carrier") ?? "").trim() || null;
  const trackingNumber =
    String(formData.get("trackingNumber") ?? "").trim() || null;
  const markShipped = formData.get("markShipped") === "on";
  const markDelivered = formData.get("markDelivered") === "on";

  const now = new Date();
  await db.shipment.upsert({
    where: { orderId },
    update: {
      carrier,
      trackingNumber,
      shippedAt: markShipped
        ? now
        : markDelivered
          ? undefined
          : undefined,
      deliveredAt: markDelivered ? now : undefined,
    },
    create: {
      orderId,
      carrier,
      trackingNumber,
      shippedAt: markShipped ? now : null,
      deliveredAt: markDelivered ? now : null,
    },
  });

  // 상태 자동 전환
  const order = await db.order.findUnique({ where: { id: orderId } });
  if (order) {
    let nextStatus = order.status;
    if (markDelivered) nextStatus = "DELIVERED";
    else if (markShipped) nextStatus = "SHIPPED";
    else if (trackingNumber && order.status === "PAID") nextStatus = "PREPARING";
    if (nextStatus !== order.status) {
      await db.order.update({
        where: { id: orderId },
        data: { status: nextStatus },
      });
    }
  }

  revalidatePath("/admin/shop/orders");
  revalidatePath("/admin/shop/shipments");
  revalidatePath(`/admin/shop/orders/${orderId}`);
}
