import { AppBar } from "@/components/app/AppBar";
import { IconCamera } from "@/components/icons";

export default function BeforeAfterPage() {
  return (
    <div className="min-h-screen bg-paper pb-[100px]">
      <AppBar title="Before / After" />
      <section className="px-5 pt-5">
        <div className="bg-white rounded-[16px] border border-fog overflow-hidden">
          <div className="grid grid-cols-2">
            {["Before", "After"].map((t, i) => (
              <div key={t} className={i === 0 ? "border-r border-fog" : ""}>
                <div className="aspect-square bg-gradient-to-br from-cloud to-fog flex items-center justify-center">
                  <IconCamera size={32} stroke={1.2} className="text-graphite opacity-60" />
                </div>
                <div className="p-3 text-center text-[12px] font-semibold text-slate">
                  {t}
                </div>
              </div>
            ))}
          </div>
          <div className="p-5 border-t border-fog">
            <div className="text-[11px] text-slate font-medium">
              2026-04-20 · 우주워시 역삼점
            </div>
            <div className="text-[14px] font-bold mt-1">셀프세차 1시간</div>
          </div>
        </div>
      </section>
    </div>
  );
}
