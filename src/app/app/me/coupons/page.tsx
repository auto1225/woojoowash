import { redirect } from "next/navigation";
import { format } from "date-fns";
import { AppBar } from "@/components/app/AppBar";
import { IconTicket } from "@/components/icons";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function CouponsPage() {
  const session = await auth();
  if (!session?.user) redirect("/app/login?callbackUrl=/app/me/coupons");

  const coupons = await db.coupon.findMany({
    where: { userId: session.user.id, usedAt: null },
    orderBy: { expiresAt: "asc" },
  });

  return (
    <div className="min-h-screen bg-paper pb-[100px]">
      <AppBar title="쿠폰함" />
      <section className="px-5 pt-5 flex flex-col gap-3">
        {coupons.length === 0 ? (
          <div className="py-10 text-center text-slate text-[13px]">
            사용 가능한 쿠폰이 없어요.
          </div>
        ) : (
          coupons.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-[16px] border border-fog p-5 flex gap-4 items-center"
            >
              <div className="w-12 h-12 rounded-[12px] bg-ink text-white flex items-center justify-center">
                <IconTicket size={22} stroke={1.6} />
              </div>
              <div className="flex-1">
                <div className="text-[15px] font-extrabold mb-[2px]">
                  {c.title}
                </div>
                <div className="text-[12px] text-slate">
                  {c.discountType === "FLAT"
                    ? `${c.amount.toLocaleString("ko-KR")}원 할인`
                    : `${c.amount}% 할인`}
                </div>
                <div className="text-[11px] text-slate ww-num mt-1">
                  {format(c.expiresAt, "yyyy-MM-dd")}까지
                </div>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
