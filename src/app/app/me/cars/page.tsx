import { AppBar } from "@/components/app/AppBar";
import { Card } from "@/components/ui/Card";
import { IconCar, IconPlus } from "@/components/icons";
import { MOCK_USER } from "@/lib/mock/user";

export default function CarsPage() {
  return (
    <div className="min-h-screen bg-paper pb-[100px]">
      <AppBar title="내 차량" />
      <section className="px-5 pt-5 flex flex-col gap-3">
        {MOCK_USER.cars.map((c) => (
          <Card key={c.plate} className="p-5 flex items-center gap-3">
            <div className="w-12 h-12 rounded-[12px] bg-cloud flex items-center justify-center">
              <IconCar size={24} stroke={1.6} />
            </div>
            <div className="flex-1">
              <div className="text-[15px] font-bold">
                {c.brand} {c.model}
              </div>
              <div className="text-[12px] text-slate">
                {c.plate} · {c.color}
              </div>
            </div>
            <span className="text-[10px] font-bold bg-ink text-white px-2 py-[3px] rounded">
              기본
            </span>
          </Card>
        ))}
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
