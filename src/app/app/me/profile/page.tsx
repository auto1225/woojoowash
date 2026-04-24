import { promises as fs } from "node:fs";
import path from "node:path";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AppBar } from "@/components/app/AppBar";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ProfileImagePicker } from "./ProfileImagePicker";

export const dynamic = "force-dynamic";

const MAX_BYTES = 3 * 1024 * 1024; // 3MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

async function saveProfile(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user) redirect("/app/login");

  const name = String(formData.get("name") ?? "").trim() || null;
  const phoneRaw = String(formData.get("phone") ?? "").trim();
  const phone = phoneRaw || null;
  const removeImage = formData.get("removeImage") === "on";

  if (phone) {
    const dup = await db.user.findFirst({
      where: { phone, NOT: { id: session.user.id } },
      select: { id: true },
    });
    if (dup) return;
  }

  let imageUrl: string | null | undefined = undefined;
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    if (!ALLOWED.includes(file.type)) return;
    if (file.size > MAX_BYTES) return;

    const bytes = Buffer.from(await file.arrayBuffer());
    const ext =
      file.type === "image/jpeg"
        ? "jpg"
        : file.type === "image/png"
          ? "png"
          : file.type === "image/webp"
            ? "webp"
            : "gif";
    const filename = `${session.user.id}-${Date.now()}.${ext}`;
    const dir = path.join(process.cwd(), "public", "uploads", "profile");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, filename), bytes);
    imageUrl = `/uploads/profile/${filename}`;
  } else if (removeImage) {
    imageUrl = null;
  }

  await db.user.update({
    where: { id: session.user.id },
    data: {
      name,
      phone,
      ...(imageUrl !== undefined ? { image: imageUrl } : {}),
    },
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
    select: { name: true, email: true, phone: true, image: true },
  });
  if (!user) redirect("/app/login");

  return (
    <div className="min-h-screen bg-paper pb-[100px]">
      <AppBar title="프로필 수정" />

      <form
        action={saveProfile}
        encType="multipart/form-data"
        className="px-5 pt-5 flex flex-col gap-3"
      >
        <ProfileImagePicker
          currentImage={user.image ?? null}
          fallbackLetter={(user.name ?? user.email ?? "U")[0]?.toUpperCase()}
        />

        <label className="block mt-2">
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
            이메일{" "}
            <span className="text-slate font-medium ml-1">(변경 불가)</span>
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
