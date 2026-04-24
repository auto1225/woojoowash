"use server";

import { db } from "@/lib/db";

export async function submitPartnerInquiry(
  formData: FormData,
): Promise<{ ok?: true; error?: string }> {
  const storeName = String(formData.get("storeName") ?? "").trim();
  const contactName = String(formData.get("contactName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim() || null;
  const message = String(formData.get("message") ?? "").trim() || null;

  if (!storeName || !contactName || !phone) {
    return { error: "필수 항목을 입력해 주세요." };
  }
  if (phone.length < 9) {
    return { error: "유효한 전화번호를 입력해 주세요." };
  }

  await db.partnerInquiry.create({
    data: { storeName, contactName, phone, address, message, status: "NEW" },
  });

  return { ok: true };
}
