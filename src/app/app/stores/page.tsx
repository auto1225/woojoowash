import Image from "next/image";
import Link from "next/link";
import { AppBar } from "@/components/app/AppBar";
import { Chip } from "@/components/ui/Chip";
import {
  IconDown,
  IconFilter,
  IconSearch,
  IconStarFill,
} from "@/components/icons";
import { MOCK_STORES } from "@/lib/mock/stores";

export default function FinderPage() {
  return (
    <div className="pb-[90px]">
      <AppBar
        title="매장 찾기"
        right={<IconFilter size={22} stroke={1.7} />}
        showBack={false}
        border={false}
      />

      <div className="px-4 py-2 flex gap-[6px] overflow-x-auto ww-scroll-x">
        {["전체", "셀프", "손세차", "배달", "출장", "프리미엄"].map((t, i) => (
          <Chip key={t} size="sm" active={i === 0}>
            {t}
          </Chip>
        ))}
      </div>

      <MapPlaceholder />

      <div className="px-5 pt-4 pb-[10px] flex items-center justify-between">
        <div>
          <div className="text-[11px] text-slate font-medium mb-[2px]">
            반경 2km 내
          </div>
          <div className="text-[18px] font-extrabold tracking-[-0.4px]">
            {MOCK_STORES.length}개 매장
          </div>
        </div>
        <div className="flex items-center gap-1 text-[13px] font-semibold">
          거리순 <IconDown size={14} stroke={2} />
        </div>
      </div>

      <div className="px-5 flex flex-col gap-3">
        {MOCK_STORES.map((s) => (
          <Link
            key={s.id}
            href={`/app/stores/${s.id}`}
            className="flex gap-3 p-3 rounded-[16px] border border-fog bg-white active:bg-paper transition"
          >
            <div className="relative w-[84px] h-[84px] rounded-[12px] shrink-0 overflow-hidden">
              <Image
                src={s.cover}
                alt={s.name}
                fill
                className="object-cover"
                sizes="90px"
              />
              <span
                className={`absolute left-[4px] top-[4px] text-[9px] font-bold px-[6px] py-[2px] rounded-[4px] ${
                  s.open ? "bg-accent text-white" : "bg-ash/90 text-white"
                }`}
              >
                {s.open ? "영업중" : "영업종료"}
              </span>
            </div>
            <div className="flex-1 min-w-0 py-[2px]">
              <div className="text-[14px] font-bold truncate">{s.name}</div>
              <div className="flex items-center gap-[6px] mt-[3px] mb-[6px] text-[11px]">
                <IconStarFill size={11} />
                <span className="font-semibold">{s.rating}</span>
                <span className="text-slate">({s.reviews})</span>
                <span className="text-ash">·</span>
                <span className="text-slate">{s.dist}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {s.types.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-semibold px-[7px] py-[2px] rounded-[4px] bg-cloud text-graphite"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="text-[13px] font-extrabold ww-num">
                  {s.priceFrom.toLocaleString("ko-KR")}원~
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function MapPlaceholder() {
  return (
    <div className="h-[240px] relative overflow-hidden bg-cloud shrink-0">
      <svg viewBox="0 0 400 240" className="w-full h-full block">
        <rect width="400" height="240" fill="#F2F2F4" />
        <path d="M0 80 L400 100" stroke="#E8E8EB" strokeWidth="18" fill="none" />
        <path d="M0 180 L400 170" stroke="#E8E8EB" strokeWidth="14" fill="none" />
        <path d="M120 0 L140 240" stroke="#E8E8EB" strokeWidth="16" fill="none" />
        <path d="M280 0 L260 240" stroke="#E8E8EB" strokeWidth="12" fill="none" />
        <rect x="20" y="105" width="100" height="60" fill="#fff" rx="2" />
        <rect x="145" y="105" width="110" height="60" fill="#fff" rx="2" />
        <rect x="270" y="105" width="100" height="60" fill="#fff" rx="2" />
        <rect x="20" y="5" width="100" height="65" fill="#fff" rx="2" />
        <rect x="145" y="10" width="110" height="75" fill="#fff" rx="2" />
        <rect x="270" y="5" width="100" height="85" fill="#fff" rx="2" />
        <rect x="20" y="180" width="100" height="55" fill="#fff" rx="2" />
        <rect x="145" y="180" width="110" height="55" fill="#fff" rx="2" />
        <rect x="270" y="180" width="100" height="55" fill="#fff" rx="2" />
        <circle
          cx="210"
          cy="140"
          r="7"
          fill="#fff"
          stroke="#D4D4D9"
          strokeWidth="1.5"
        />
        <text x="225" y="144" fontSize="9" fill="#6E6E73" fontWeight="500">
          강남역
        </text>
      </svg>
      {[
        { x: 85, y: 130, price: "8K", active: true },
        { x: 200, y: 75, price: "25K" },
        { x: 310, y: 160, price: "15K" },
      ].map((p, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${(p.x / 400) * 100}%`,
            top: `${(p.y / 240) * 100}%`,
            transform: "translate(-50%,-100%)",
          }}
        >
          <div
            className={`px-[10px] py-[5px] rounded-full text-[11px] font-bold shadow ${
              p.active ? "bg-ink text-white" : "bg-white text-ink border border-fog"
            }`}
          >
            {p.price}
          </div>
          <div
            className="w-0 h-0 mx-auto"
            style={{
              borderLeft: "5px solid transparent",
              borderRight: "5px solid transparent",
              borderTop: `6px solid ${p.active ? "#0A0A0B" : "#fff"}`,
            }}
          />
        </div>
      ))}
      <div
        className="absolute top-3 left-1/2 -translate-x-1/2 w-[14px] h-[14px] rounded-full bg-accent border-[3px] border-white"
        style={{ boxShadow: "0 0 0 6px rgba(30,64,255,0.15)" }}
      />
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-ink text-white px-[14px] py-2 rounded-full text-[12px] font-semibold flex items-center gap-[6px] shadow">
        <IconSearch size={14} stroke={2} /> 이 지역 재검색
      </div>
    </div>
  );
}
