import Image from "next/image";
import { IconArrow, IconCheck } from "@/components/icons";
import { IMG } from "@/lib/images";

const PROMISES = [
  "입점 수수료 0원. 결제 수수료만 청구",
  "공실 시간대를 예약으로 채워드립니다",
  "할인패스 고객 자동 유입",
  "전담 매니저의 매장 운영 컨설팅",
];

export default function PartnersPage() {
  return (
    <>
      <section className="relative min-h-[520px] overflow-hidden flex items-center">
        <Image
          src={IMG.partner}
          alt="제휴"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 ww-gradient-fade" />
        <div className="absolute inset-0 bg-ink/30" />
        <div className="relative z-10 mx-auto max-w-site px-5 md:px-10 py-20 text-white">
          <div className="max-w-[640px]">
            <div className="text-[12px] font-bold text-accent-sky tracking-[0.15em] mb-4">
              PARTNERSHIP
            </div>
            <h1 className="ww-disp text-[44px] md:text-[64px] tracking-[-0.03em] leading-[1.05]">
              사장님과 함께
              <br />
              성장하는 우주워시
            </h1>
            <p className="text-white/75 text-[16px] leading-[1.7] mt-6 max-w-[480px]">
              월 평균 매출 142% 상승, 공실 시간대 활용도 3배. 우주워시와
              함께라면 다음 분기가 달라집니다.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-site px-5 md:px-10 grid gap-14 lg:grid-cols-2 items-start">
          <div>
            <div className="text-[12px] font-bold text-accent tracking-[0.15em] mb-4">
              WHY WOOJOOWASH
            </div>
            <h2 className="ww-disp text-[32px] md:text-[44px] tracking-[-0.03em] leading-[1.1] mb-8">
              파트너가 되면
              <br />
              달라지는 것들
            </h2>
            <ul className="flex flex-col gap-4 mb-10">
              {PROMISES.map((p) => (
                <li
                  key={p}
                  className="flex items-start gap-3 text-[15px] leading-[1.6]"
                >
                  <span className="w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center shrink-0 mt-[1px]">
                    <IconCheck size={14} stroke={3} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <div className="grid grid-cols-2 gap-3">
              {[
                { k: "142%", v: "평균 매출 상승" },
                { k: "3x", v: "공실 시간 활용" },
                { k: "24만+", v: "활성 이용자" },
                { k: "0원", v: "입점 수수료" },
              ].map((s) => (
                <div
                  key={s.v}
                  className="bg-paper rounded-[16px] p-5"
                >
                  <div className="ww-disp text-[28px] ww-num">{s.k}</div>
                  <div className="text-[12px] text-slate mt-1">{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-paper rounded-[24px] p-8 md:p-10">
            <div className="text-[12px] font-bold text-accent tracking-[0.15em] mb-2">
              CONTACT
            </div>
            <h3 className="ww-disp text-[24px] md:text-[30px] tracking-[-0.02em] mb-2">
              입점 문의하기
            </h3>
            <p className="text-slate text-[14px] mb-8">
              영업일 기준 1일 이내에 담당자가 연락드려요.
            </p>
            <form className="grid gap-4">
              {[
                { l: "상호 / 매장명", type: "text", ph: "예: 우주워시 강남점" },
                { l: "대표자 성함", type: "text", ph: "예: 김우주" },
                { l: "연락처", type: "tel", ph: "010-0000-0000" },
                { l: "주소", type: "text", ph: "예: 서울 강남구 테헤란로 123" },
              ].map((f) => (
                <label key={f.l} className="block">
                  <span className="text-[12px] font-bold mb-[6px] block">
                    {f.l}
                  </span>
                  <input
                    type={f.type}
                    placeholder={f.ph}
                    className="w-full h-12 px-4 bg-white border border-fog rounded-[12px] text-[14px] outline-none focus:border-ink transition"
                  />
                </label>
              ))}
              <label className="block">
                <span className="text-[12px] font-bold mb-[6px] block">
                  문의 내용
                </span>
                <textarea
                  rows={4}
                  placeholder="매장 규모, 제공 서비스, 궁금한 점 등 자유롭게 남겨주세요."
                  className="w-full p-4 bg-white border border-fog rounded-[12px] text-[14px] outline-none focus:border-ink transition resize-none"
                />
              </label>
              <button
                type="button"
                className="h-14 rounded-full bg-ink text-white font-bold inline-flex items-center justify-center gap-2 hover:bg-accent-deep transition"
              >
                문의 보내기 <IconArrow size={16} stroke={2.5} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
