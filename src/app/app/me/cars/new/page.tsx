import { redirect } from "next/navigation";
import { AppBar } from "@/components/app/AppBar";
import { auth } from "@/auth";
import { createCar } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewCarPage() {
  const session = await auth();
  if (!session?.user) redirect("/app/login?callbackUrl=/app/me/cars/new");

  return (
    <div className="min-h-screen bg-paper pb-[100px]">
      <AppBar title="차량 추가" />

      <form
        action={createCar}
        className="px-5 pt-5 flex flex-col gap-3"
      >
        <label className="block">
          <span className="text-[12px] font-bold mb-[6px] block">
            브랜드 <span className="text-danger">*</span>
          </span>
          <input
            type="text"
            name="brand"
            required
            placeholder="예: 현대 / BMW / 기아"
            className="w-full h-12 px-4 bg-white border border-fog rounded-[12px] text-[15px] outline-none focus:border-ink"
          />
        </label>

        <label className="block">
          <span className="text-[12px] font-bold mb-[6px] block">
            모델 <span className="text-danger">*</span>
          </span>
          <input
            type="text"
            name="model"
            required
            placeholder="예: 그랜저 IG / 3시리즈 / K5"
            className="w-full h-12 px-4 bg-white border border-fog rounded-[12px] text-[15px] outline-none focus:border-ink"
          />
        </label>

        <label className="block">
          <span className="text-[12px] font-bold mb-[6px] block">
            번호판 <span className="text-danger">*</span>
          </span>
          <input
            type="text"
            name="plate"
            required
            placeholder="예: 12가 3456"
            className="w-full h-12 px-4 bg-white border border-fog rounded-[12px] text-[15px] outline-none focus:border-ink"
          />
        </label>

        <label className="block">
          <span className="text-[12px] font-bold mb-[6px] block">색상</span>
          <input
            type="text"
            name="color"
            placeholder="예: 펄 화이트 / 블랙 / 실버"
            className="w-full h-12 px-4 bg-white border border-fog rounded-[12px] text-[15px] outline-none focus:border-ink"
          />
        </label>

        <label className="flex items-center gap-2 text-[13px] mt-2">
          <input
            type="checkbox"
            name="isDefault"
            className="w-4 h-4 accent-accent"
          />
          기본 차량으로 설정
        </label>

        <div className="h-4" />

        <button
          type="submit"
          className="h-14 rounded-full bg-accent text-white font-bold text-[15px] shadow-ww-blue"
        >
          차량 등록
        </button>
      </form>
    </div>
  );
}
