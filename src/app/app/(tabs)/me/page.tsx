import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import {
  IconCamera,
  IconCar,
  IconChev,
  IconHelp,
  IconInfo,
  IconMsg,
  IconSettings,
  IconShield,
  IconTicket,
} from "@/components/icons";
import { db } from "@/lib/db";

const LINKS = [
  { I: IconCar, label: "내 차량", href: "/app/me/cars" },
  { I: IconTicket, label: "쿠폰함", href: "/app/me/coupons" },
  { I: IconCamera, label: "Before / After", href: "/app/me/before-after" },
  { I: IconMsg, label: "1:1 문의", href: "#" },
  { I: IconHelp, label: "자주 묻는 질문", href: "#" },
  { I: IconShield, label: "이용약관·개인정보처리방침", href: "#" },
  { I: IconInfo, label: "서비스 정보", href: "#" },
  { I: IconSettings, label: "설정", href: "#" },
];

export default async function MePage() {
  const session = await auth();
  if (!session?.user) redirect("/app/login?callbackUrl=/app/me");

  const [reservationCount, couponCount, reviewCount] = await Promise.all([
    db.reservation.count({
      where: { userId: session.user.id, status: "DONE" },
    }),
    db.coupon.count({
      where: { userId: session.user.id, usedAt: null },
    }),
    db.review.count({ where: { userId: session.user.id } }),
  ]);

  const name = session.user.name || session.user.email || "고객";

  return (
    <>
      <div className="px-5 pt-4 pb-6">
        <div className="ww-disp text-[26px] tracking-[-0.02em]">마이</div>
      </div>

      <section className="px-5 mb-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-cloud flex items-center justify-center text-[18px] font-extrabold">
            {name[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[18px] font-extrabold truncate">{name}</div>
            <div className="text-[12px] text-slate truncate">
              {session.user.email}
            </div>
          </div>
          <Link href="#" className="text-[12px] text-slate">
            프로필 수정
          </Link>
        </div>
      </section>

      <section className="px-5 mb-6">
        <div className="grid grid-cols-3 bg-cloud rounded-[16px] overflow-hidden">
          {[
            { k: reservationCount, l: "이용 완료" },
            { k: couponCount, l: "쿠폰" },
            { k: reviewCount, l: "리뷰" },
          ].map((s, i) => (
            <div
              key={s.l}
              className={`py-5 text-center ${i !== 2 ? "border-r border-fog" : ""}`}
            >
              <div className="ww-disp text-[24px] ww-num">{s.k}</div>
              <div className="text-[11px] text-slate font-medium mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="h-3 bg-cloud" />

      <section className="flex flex-col">
        {LINKS.map((x) => (
          <Link
            key={x.label}
            href={x.href}
            className="flex items-center gap-[14px] px-5 py-4 bg-white"
          >
            <x.I size={22} stroke={1.6} />
            <div className="flex-1 text-[15px] font-medium">{x.label}</div>
            <IconChev size={18} stroke={1.8} className="text-ash" />
          </Link>
        ))}

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/home" });
          }}
          className="px-5 py-5"
        >
          <button
            type="submit"
            className="w-full h-12 rounded-full border border-fog text-[13px] font-bold text-slate"
          >
            로그아웃
          </button>
        </form>
      </section>
    </>
  );
}
