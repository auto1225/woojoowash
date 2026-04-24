import { WWLogo } from "@/components/brand/Logo";
import { IconBell } from "@/components/icons";

export function TabsHeader() {
  return (
    <header className="shrink-0 h-[56px] px-5 flex items-center justify-between bg-white border-b border-fog">
      <WWLogo size={18} compact />
      <div className="relative">
        <IconBell size={22} stroke={1.6} />
        <span className="absolute top-0 right-0 w-[6px] h-[6px] rounded-full bg-accent" />
      </div>
    </header>
  );
}
