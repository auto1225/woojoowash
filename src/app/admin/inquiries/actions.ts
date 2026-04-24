"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/console";
import { db } from "@/lib/db";
import type { InquiryStatus } from "@prisma/client";

const VALID: InquiryStatus[] = ["NEW", "CONTACTED", "APPROVED", "REJECTED"];

export async function updateInquiry(
  id: string,
  status: string,
  memo: string | null,
) {
  await requireAdmin();
  if (!VALID.includes(status as InquiryStatus)) return;
  await db.partnerInquiry.update({
    where: { id },
    data: { status: status as InquiryStatus, memo: memo || null },
  });
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
}
