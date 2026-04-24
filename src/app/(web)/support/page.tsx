import Link from "next/link";
import { IconArrow, IconHelp, IconMsg } from "@/components/icons";

const FAQS = [
  {
    q: "예약 취소는 언제까지 가능한가요?",
    a: "이용 1시간 전까지 무료 취소 가능하며, 이후에는 수수료가 발생합니다.",
  },
  {
    q: "포인트·쿠폰 병행 사용이 가능한가요?",
    a: "한 결제에 포인트 + 쿠폰 중 하나씩 선택해 적용할 수 있습니다.",
  },
  {
    q: "결제 영수증은 어떻게 받나요?",
    a: "앱 내 예약 내역에서 전자영수증·현금영수증을 바로 발급할 수 있습니다.",
  },
];

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-site px-5 md:px-10 py-16 md:py-20">
      <div className="mb-12 max-w-[640px]">
        <div className="text-[12px] font-bold text-accent tracking-[0.15em] mb-4">
          SUPPORT
        </div>
        <h1 className="ww-disp text-[40px] md:text-[56px] tracking-[-0.03em] leading-[1.05]">
          도움이 필요하신가요?
        </h1>
        <p className="text-slate text-[15px] leading-[1.7] mt-5">
          대부분의 문의는 FAQ 에서 바로 해결됩니다. 해결되지 않는 경우
          1:1 채팅이나 전화로 문의해 주세요.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-16">
        <div className="bg-paper rounded-[20px] p-8">
          <div className="w-11 h-11 rounded-full bg-ink text-white flex items-center justify-center mb-5">
            <IconMsg size={20} stroke={1.8} />
          </div>
          <div className="text-[18px] font-extrabold mb-2">1:1 문의</div>
          <div className="text-[13px] text-slate leading-[1.6] mb-5">
            앱 내 채팅으로 상담사와 바로 대화. 24시간 접수됩니다.
          </div>
          <Link
            href="/app/support"
            className="inline-flex items-center gap-[6px] text-[13px] font-bold text-accent"
          >
            채팅 시작 <IconArrow size={12} stroke={2.5} />
          </Link>
        </div>
        <div className="bg-paper rounded-[20px] p-8">
          <div className="w-11 h-11 rounded-full bg-ink text-white flex items-center justify-center mb-5">
            <IconHelp size={20} stroke={1.8} />
          </div>
          <div className="text-[18px] font-extrabold mb-2">대표 전화</div>
          <div className="ww-disp text-[22px] ww-num mb-2">1588-0000</div>
          <div className="text-[13px] text-slate">평일 10:00 — 19:00</div>
        </div>
        <div className="bg-paper rounded-[20px] p-8">
          <div className="w-11 h-11 rounded-full bg-ink text-white flex items-center justify-center mb-5">
            <IconHelp size={20} stroke={1.8} />
          </div>
          <div className="text-[18px] font-extrabold mb-2">이메일</div>
          <div className="text-[15px] font-bold mb-2">help@woojoowash.kr</div>
          <div className="text-[13px] text-slate">24시간 접수, 영업일 내 답변</div>
        </div>
      </div>

      <div className="max-w-[920px]">
        <h2 className="ww-disp text-[24px] md:text-[32px] tracking-[-0.02em] mb-6">
          자주 묻는 질문
        </h2>
        <div className="divide-y divide-fog">
          {FAQS.map((f, i) => (
            <details key={i} className="group py-5">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <span className="text-[16px] font-bold">{f.q}</span>
                <span className="w-7 h-7 rounded-full bg-cloud flex items-center justify-center transition-transform group-open:rotate-45">
                  <svg width="14" height="14" viewBox="0 0 14 14">
                    <path
                      d="M7 1v12M1 7h12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </summary>
              <div className="text-[14px] text-slate leading-[1.7] mt-3 pr-10">
                {f.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
