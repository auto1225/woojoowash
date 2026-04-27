import Image from "next/image";
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
import { getFlag } from "@/lib/settings";

export default async function MePage() {
  const session = await auth();
  if (!session?.user) redirect("/app/login?callbackUrl=/app/me");

  const shopEnabled = await getFlag("shopEnabled");
  const LINKS = [
    { I: IconCar, label: "내 차량", href: "/app/me/cars" },
    { I: IconTicket, label: "쿠폰함", href: "/app/me/coupons" },
    { I: IconCamera, label: "Before / After", href: "/app/me/before-after" },
    ...(shopEnabled
      ? [
          { I: IconShield, label: "배송지 관리", href: "/app/me/addresses" },
          { I: IconTicket, label: "주문 내역", href: "/app/market/orders" },
        ]
      : []),
    { I: IconMsg, label: "1:1 문의", href: "/app/support" },
    { I: IconHelp, label: "자주 묻는 질문", href: "/app/me/faq" },
    { I: IconShield, label: "이용약관·개인정보처리방침", href: "#" },
    { I: IconInfo, label: "서비스 정보", href: "#" },
    { I: IconSettings, label: "설정", href: "#" },
  ];

  const [userProfile, reservationCount, couponCount, reviewCount] =
    await Promise.all([
      db.user.findUnique({
        where: { id: session.user.id },
        select: { name: true, email: true, image: true },
      }),
      db.reservation.count({
        where: { userId: session.user.id, status: "DONE" },
      }),
      db.coupon.count({
        where: { userId: session.user.id, usedAt: null },
      }),
      db.review.count({ where: { userId: session.user.id } }),
    ]);

  const name =
    userProfile?.name || session.user.name || session.user.email || "고객";
  const email = userProfile?.email || session.user.email;
  const avatarUrl = userProfile?.image ?? null;

  return (
    <>
      <section className="px-5 pt-5 mb-5">
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 rounded-full overflow-hidden bg-cloud flex items-center justify-center text-[18px] font-extrabold shrink-0">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={name}
                fill
                className="object-cover"
                sizes="56px"
              />
            ) : (
              name[0]?.toUpperCase()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[18px] font-extrabold truncate">{name}</div>
            <div className="text-[12px] text-slate truncate">{email}</div>
          </div>
          <Link
            href="/app/me/profile"
            className="text-[12px] text-slate hover:text-ink"
          >
            프로필 수정
          </Link>
        </div>
      </section>

      <section className="px-5 mb-6">
        <div className="grid grid-cols-3 bg-cloud rounded-[16px] overflow-hidden">
          {[
            {
              k: reservationCount,
              l: "이용 완료",
              href: "/app/reservations",
            },
            { k: couponCount, l: "쿠폰", href: "/app/me/coupons" },
            { k: reviewCount, l: "리뷰", href: "/app/me/reviews" },
          ].map((s, i) => (
            <Link
              key={s.l}
              href={s.href}
              className={`py-3 text-center transition active:bg-fog hover:bg-fog/40 ${
                i !== 2 ? "border-r border-fog" : ""
              }`}
            >
              <div className="ww-disp text-[22px] ww-num">{s.k}</div>
              <div className="text-[11px] text-slate font-medium mt-[2px]">
                {s.l}
              </div>
            </Link>
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
