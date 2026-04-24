import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AppBar } from "@/components/app/AppBar";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

async function updateProfile(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user) redirect("/app/login");

  const name = String(formData.get("name") ?? "").trim() || null;
  const phoneRaw = String(formData.get("phone") ?? "").trim();
  const phone = phoneRaw || null;

  // 다른 유저가 같은 번호를 쓰지 않게 검증
  if (phone) {
    const dup = await db.user.findFirst({
      where: { phone, NOT: { id: session.user.id } },
      select: { id: true },
    });
    if (dup) return;
  }

  await db.user.update({
    where: { id: session.user.id },
    data: { name, phone },
  });
  revalidatePath("/app/me");
  revalidatePath("/app/me/profile");
  redirect("/app/me");
}

export default async function ProfileEditPage() {
  const session = await auth();
  if (!session?.user) redirect("/app/login?callbackUrl=/app/me/profile");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, phone: true, createdAt: true },
  });
  if (!user) redirect("/app/login");

  return (
    <div className="min-h-screen bg-paper pb-[100px]">
      <AppBar title="프로필 수정" />

      <form
        action={updateProfile}
        className="px-5 pt-5 flex flex-col gap-3"
      >
        <label className="block">
          <span className="text-[12px] font-bold mb-[6px] block">이름</span>
          <input
            type="text"
            name="name"
            defaultValue={user.name ?? ""}
            placeholder="이름을 입력하세요"
            className="w-full h-12 px-4 bg-white border border-fog rounded-[12px] text-[15px] outline-none focus:border-ink"
          />
        </label>

        <label className="block">
          <span className="text-[12px] font-bold mb-[6px] block">
            이메일 <span className="text-slate font-medium ml-1">(변경 불가)</span>
          </span>
          <input
            type="email"
            value={user.email ?? ""}
            disabled
            className="w-full h-12 px-4 bg-cloud border border-fog rounded-[12px] text-[15px] text-slate"
          />
        </label>

        <label className="block">
          <span className="text-[12px] font-bold mb-[6px] block">전화번호</span>
          <input
            type="tel"
            name="phone"
            defaultValue={user.phone ?? ""}
            placeholder="010-0000-0000"
            className="w-full h-12 px-4 bg-white border border-fog rounded-[12px] text-[15px] outline-none focus:border-ink ww-num"
          />
          <span className="text-[11px] text-slate mt-1 block">
            예약 안내·배송 알림에 사용돼요.
          </span>
        </label>

        <div className="h-4" />

        <button
          type="submit"
          className="h-14 rounded-full bg-accent text-white font-bold text-[15px] shadow-ww-blue"
        >
          저장
        </button>
      </form>
    </div>
  );
}
