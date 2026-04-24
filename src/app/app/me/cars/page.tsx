import { redirect } from "next/navigation";
import { AppBar } from "@/components/app/AppBar";
import { Card } from "@/components/ui/Card";
import { IconCar, IconPlus } from "@/components/icons";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function CarsPage() {
  const session = await auth();
  if (!session?.user) redirect("/app/login?callbackUrl=/app/me/cars");

  const cars = await db.car.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
  });

  return (
    <div className="min-h-screen bg-paper pb-[100px]">
      <AppBar title="내 차량" />
      <section className="px-5 pt-5 flex flex-col gap-3">
        {cars.length === 0 ? (
          <div className="py-10 text-center text-slate text-[13px]">
            등록된 차량이 없어요.
          </div>
        ) : (
          cars.map((c) => (
            <Card key={c.id} className="p-5 flex items-center gap-3">
              <div className="w-12 h-12 rounded-[12px] bg-cloud flex items-center justify-center">
                <IconCar size={24} stroke={1.6} />
              </div>
              <div className="flex-1">
                <div className="text-[15px] font-bold">
                  {c.brand} {c.model}
                </div>
                <div className="text-[12px] text-slate">
                  {c.plate}
                  {c.color ? ` · ${c.color}` : ""}
                </div>
              </div>
              {c.isDefault && (
                <span className="text-[10px] font-bold bg-ink text-white px-2 py-[3px] rounded">
                  기본
                </span>
              )}
            </Card>
          ))
        )}
        <button
          type="button"
          className="h-14 rounded-[14px] border-[1.5px] border-dashed border-fog flex items-center justify-center gap-2 text-[14px] font-bold text-slate"
        >
          <IconPlus size={18} stroke={2} /> 차량 추가
        </button>
      </section>
    </div>
  );
}
