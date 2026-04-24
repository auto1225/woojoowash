import Image from "next/image";
import Link from "next/link";
import {
  IconArrow,
  IconBucket,
  IconCarWash,
  IconCheck,
  IconClock,
  IconPin,
  IconShield,
  IconSpray,
  IconStarFill,
  IconTruck,
} from "@/components/icons";
import { IMG } from "@/lib/images";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Services />
      <HowItWorks />
      <AppShowcase />
      <Reviews />
      <Membership />
      <Partners />
      <Faq />
      <FinalCta />
    </>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[720px] md:min-h-[820px] overflow-hidden">
      <Image
        src={IMG.hero}
        alt="깔끔하게 세차된 차량"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 ww-gradient-fade" />
      <div className="absolute inset-0 bg-ink/20" />

      <div className="relative z-10 mx-auto max-w-site px-5 md:px-10 pt-28 md:pt-36 pb-24">
        <div className="max-w-[720px] text-white ww-fade-up">
          <div className="inline-flex items-center gap-2 h-9 px-4 rounded-full bg-white/10 ww-backdrop-glass border border-white/20 text-[12px] font-semibold">
            <span className="w-[6px] h-[6px] rounded-full bg-accent-sky" />
            전국 450개 매장 · 24만 이용자가 선택한
          </div>
          <h1 className="ww-disp text-[44px] md:text-[84px] leading-[1.02] tracking-[-0.035em] mt-6">
            번거로운 세차,
            <br />
            <span className="relative inline-block">
              이제 <span className="text-accent-sky">3초</span>면 끝
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 10"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path
                  d="M2 7 Q80 2 160 5 T298 4"
                  stroke="#4D68FF"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>
          <p className="text-[16px] md:text-[19px] text-white/80 leading-[1.6] mt-8 max-w-[520px]">
            셀프세차부터 프리미엄 손세차, 픽업 배달까지.
            <br />
            전국 어디서나 단 한 번의 탭으로 예약하세요.
          </p>

          <div className="flex flex-wrap gap-3 mt-10">
            <Link
              href="/download"
              className="inline-flex h-14 items-center gap-3 px-7 rounded-full bg-white text-ink text-[15px] font-bold shadow-ww-ink hover:-translate-y-[2px] transition"
            >
              앱 다운로드
              <IconArrow size={16} stroke={2.5} />
            </Link>
            <Link
              href="/app"
              className="inline-flex h-14 items-center gap-3 px-7 rounded-full bg-white/10 border border-white/30 text-white text-[15px] font-bold ww-backdrop-glass hover:bg-white/20 transition"
            >
              웹앱 체험하기
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4 md:gap-10 mt-14 max-w-[520px]">
            {[
              { k: "450+", v: "전국 매장" },
              { k: "24만+", v: "누적 이용자" },
              { k: "4.9", v: "앱 평점" },
            ].map((s) => (
              <div key={s.v}>
                <div className="ww-disp text-[32px] md:text-[40px] ww-num">
                  {s.k}
                </div>
                <div className="text-[12px] md:text-[13px] text-white/60 mt-1">
                  {s.v}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <FloatingHeroCard />
    </section>
  );
}

function FloatingHeroCard() {
  return (
    <div className="hidden lg:block absolute right-10 bottom-24 z-10 ww-float">
      <div className="w-[320px] bg-white rounded-[22px] p-5 shadow-ww-pop">
        <div className="flex items-center justify-between mb-4">
          <div className="text-[11px] font-bold text-accent tracking-[0.1em]">
            NEXT BOOKING
          </div>
          <span className="text-[10px] px-2 py-[3px] rounded-full bg-accent-soft text-accent-deep font-bold">
            예약 확정
          </span>
        </div>
        <div className="ww-disp text-[22px] tracking-[-0.02em]">
          강남점 · 토요일 14:30
        </div>
        <div className="text-[12px] text-slate mt-1">
          기본(베이직) 디테일링 · 60분
        </div>
        <div className="flex items-center gap-3 mt-5 pt-4 border-t border-fog">
          <div className="w-9 h-9 rounded-full bg-ink text-white flex items-center justify-center">
            <IconCheck size={18} stroke={2.5} />
          </div>
          <div className="flex-1 text-[12px] text-graphite">
            15분 전에 알림을 보내드릴게요
          </div>
        </div>
      </div>
    </div>
  );
}

function TrustBar() {
  const logos = ["현대", "기아", "BMW", "벤츠", "테슬라", "포르쉐", "렉서스", "아우디"];
  return (
    <section className="border-y border-fog bg-paper py-10 overflow-hidden">
      <div className="mx-auto max-w-site px-5 md:px-10 flex items-center gap-8">
        <div className="shrink-0 text-[12px] font-bold text-slate tracking-[0.1em] hidden md:block">
          TRUSTED BY
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="ww-marquee gap-10 items-center text-[17px] font-bold text-graphite/60">
            {[...logos, ...logos].map((l, i) => (
              <div key={`${l}-${i}`} className="px-6 whitespace-nowrap">
                {l}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const items = [
    {
      Icon: IconSpray,
      tag: "SELF",
      name: "셀프세차",
      desc: "30분 단위 BAY 예약. 내가 직접, 내 속도로.",
      img: IMG.svcSelf,
    },
    {
      Icon: IconBucket,
      tag: "HAND",
      name: "손세차",
      desc: "전문 디테일러가 책임지는 프리미엄 핸드워시.",
      img: IMG.svcHand,
      featured: true,
    },
    {
      Icon: IconTruck,
      tag: "PICKUP",
      name: "배달세차",
      desc: "맡기고, 돌려받고. 이동 없이 끝내는 픽업.",
      img: IMG.svcPickup,
    },
    {
      Icon: IconCarWash,
      tag: "VISIT",
      name: "출장세차",
      desc: "주차장으로 직접 방문해 세차해 드려요.",
      img: IMG.svcVisit,
    },
  ];
  return (
    <section id="services" className="py-24 md:py-32">
      <div className="mx-auto max-w-site px-5 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="text-[12px] font-bold text-accent tracking-[0.15em] mb-4">
              OUR SERVICES
            </div>
            <h2 className="ww-disp text-[36px] md:text-[56px] tracking-[-0.03em] leading-[1.05]">
              4가지 세차 방식을
              <br />
              하나의 앱에서
            </h2>
          </div>
          <p className="text-slate text-[15px] leading-[1.7] max-w-[360px]">
            상황과 취향에 따라 원하는 방식을 고르세요. 어떤 서비스든 우주워시
            품질 기준을 통과한 매장만 선별합니다.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-12">
          {items.map((s) => (
            <article
              key={s.name}
              className={`group relative rounded-[24px] overflow-hidden bg-ink text-white ${
                s.featured ? "md:col-span-7 md:row-span-2" : "md:col-span-5"
              } ${s.featured ? "min-h-[540px]" : "min-h-[360px]"}`}
            >
              <Image
                src={s.img}
                alt={s.name}
                fill
                className="object-cover opacity-70 group-hover:scale-[1.04] transition-transform duration-[600ms]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
              <div className="relative z-10 h-full flex flex-col justify-between p-7 md:p-9">
                <div className="inline-flex self-start items-center gap-2 text-[10px] font-bold text-white/80 tracking-[0.2em] bg-white/10 ww-backdrop-glass px-3 h-7 rounded-full border border-white/20">
                  <s.Icon size={14} stroke={1.8} />
                  {s.tag}
                </div>
                <div>
                  <h3 className="ww-disp text-[30px] md:text-[40px] tracking-[-0.02em] mb-3">
                    {s.name}
                  </h3>
                  <p className="text-white/75 text-[14px] md:text-[15px] leading-[1.6] max-w-[320px]">
                    {s.desc}
                  </p>
                  <div className="inline-flex items-center gap-[6px] mt-6 text-[13px] font-bold text-accent-sky">
                    자세히 보기 <IconArrow size={14} stroke={2.5} />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "원하는 매장 검색",
      desc: "지도에서 내 주변 매장과 가격, 빈 시간을 한눈에.",
      img: IMG.gallery1,
    },
    {
      n: "02",
      title: "일시 선택 & 결제",
      desc: "30분 단위로 예약하고 토스페이·카카오페이로 결제.",
      img: IMG.gallery2,
    },
    {
      n: "03",
      title: "QR로 간편 입장",
      desc: "도착해서 QR 찍으면 끝. Before/After도 앱에 자동 저장.",
      img: IMG.gallery4,
    },
  ];
  return (
    <section className="bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-site px-5 md:px-10">
        <div className="mb-14 max-w-[720px]">
          <div className="text-[12px] font-bold text-accent tracking-[0.15em] mb-4">
            HOW IT WORKS
          </div>
          <h2 className="ww-disp text-[36px] md:text-[56px] tracking-[-0.03em] leading-[1.05]">
            단 세 번의 탭으로,
            <br />
            반짝이는 내 차
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <article
              key={s.n}
              className="bg-white rounded-[22px] border border-fog overflow-hidden group"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={s.img}
                  alt={s.title}
                  fill
                  className="object-cover group-hover:scale-[1.05] transition-transform duration-[600ms]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute left-5 top-5 w-11 h-11 rounded-full bg-white/95 ww-backdrop-glass flex items-center justify-center ww-disp text-[15px]">
                  {s.n}
                </div>
              </div>
              <div className="p-7">
                <h3 className="ww-disp text-[22px] tracking-[-0.02em] mb-2">
                  {s.title}
                </h3>
                <p className="text-slate text-[14px] leading-[1.6]">{s.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function AppShowcase() {
  const features = [
    { Icon: IconPin, text: "현재 위치 기반 즉시 예약" },
    { Icon: IconClock, text: "30분 단위 정밀 스케줄" },
    { Icon: IconShield, text: "세차 보증과 보험 제공" },
    { Icon: IconCheck, text: "Before / After 자동 기록" },
  ];
  return (
    <section className="bg-ink text-white py-24 md:py-32 overflow-hidden">
      <div className="mx-auto max-w-site px-5 md:px-10 grid gap-14 md:grid-cols-2 items-center">
        <div>
          <div className="text-[12px] font-bold text-accent-sky tracking-[0.15em] mb-4">
            APP FEATURES
          </div>
          <h2 className="ww-disp text-[36px] md:text-[56px] tracking-[-0.03em] leading-[1.05] mb-6">
            핵심 기능은 모두
            <br />
            앱 안에
          </h2>
          <p className="text-white/70 text-[16px] leading-[1.7] max-w-[440px] mb-10">
            예약부터 결제, 도착 알림, 세차 기록까지. 차량 관리에 필요한
            모든 것이 한 앱에서 끝나요.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {features.map((f) => (
              <li
                key={f.text}
                className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-[14px] px-4 py-3"
              >
                <div className="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center shrink-0">
                  <f.Icon size={18} stroke={1.8} />
                </div>
                <span className="text-[14px]">{f.text}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <span className="h-12 px-5 inline-flex items-center gap-2 rounded-full bg-white text-ink text-[13px] font-bold">
              <svg width="16" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12-.99.362-2.02 1.01-2.8.73-.87 1.99-1.54 3.154-1.85zM19.8 17.6c-.47 1.04-.71 1.5-1.32 2.42-.85 1.28-2.05 2.87-3.54 2.88-1.32.01-1.66-.86-3.45-.85-1.79.01-2.17.87-3.49.86-1.49-.01-2.63-1.45-3.48-2.73C2.16 16.35 1.86 11.45 3.64 9.1 4.89 7.36 6.89 6.4 8.75 6.4c1.9 0 3.09.99 4.66.99 1.53 0 2.45-.99 4.65-.99 1.66 0 3.42.9 4.68 2.47-4.12 2.25-3.45 8.14-2.94 8.74z" />
              </svg>
              App Store
            </span>
            <span className="h-12 px-5 inline-flex items-center gap-2 rounded-full border border-white/30 text-white text-[13px] font-bold">
              <svg width="16" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 20.5V3.5c0-.3.2-.6.5-.7L14 12 3.5 21.2c-.3-.1-.5-.4-.5-.7zM14.5 12.5l2.4 2.4-11 6.3 8.6-8.7zM16.9 9.6L14.5 12 5.9 3.3l11 6.3zM20.2 12.5c.5-.3.8-.8.8-1.3s-.3-1-.8-1.3l-2.6-1.5L15 11l2.6 2.6 2.6-1.1z" />
              </svg>
              Google Play
            </span>
          </div>
        </div>

        <div className="relative h-[560px]">
          <div
            className="absolute right-0 top-0 w-[280px] h-[520px] rounded-[44px] bg-white p-[10px] shadow-[0_60px_120px_rgba(0,0,0,0.5)] ww-float"
          >
            <div className="relative w-full h-full rounded-[36px] overflow-hidden bg-paper">
              <Image
                src={IMG.heroPhone}
                alt="앱 화면"
                fill
                className="object-cover"
                sizes="280px"
              />
              <div className="absolute inset-x-4 top-4 h-14 rounded-[20px] bg-white/95 ww-backdrop-glass border border-fog flex items-center px-4">
                <div>
                  <div className="text-[10px] font-bold text-accent">
                    NEXT BOOKING
                  </div>
                  <div className="text-[13px] font-extrabold ww-num">
                    강남점 · 14:30
                  </div>
                </div>
                <span className="ml-auto text-[10px] font-bold px-2 py-[3px] rounded-full bg-ink text-white">
                  D-1
                </span>
              </div>
              <div className="absolute inset-x-4 bottom-4 rounded-[20px] bg-white p-4 shadow-ww-card">
                <div className="text-[11px] text-slate font-medium mb-1">
                  결제 금액
                </div>
                <div className="ww-disp text-[22px] ww-num">55,000원</div>
                <div className="mt-3 pt-3 border-t border-fog flex items-center justify-between">
                  <span className="text-[11px] text-slate">기본 디테일링</span>
                  <span className="text-[11px] font-bold text-accent">
                    쿠폰 3,000원 적용됨
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute left-0 bottom-6 w-[230px] bg-white text-ink rounded-[22px] p-5 shadow-ww-ink ww-float">
            <div className="text-[11px] font-bold text-accent tracking-[0.1em] mb-3">
              BEFORE / AFTER
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative aspect-square rounded-[10px] overflow-hidden">
                <Image
                  src={IMG.gallery3}
                  alt="before"
                  fill
                  className="object-cover grayscale opacity-80"
                  sizes="110px"
                />
                <span className="absolute bottom-1 left-1 text-[9px] font-bold text-white bg-ink/70 px-[6px] py-[2px] rounded">
                  BEFORE
                </span>
              </div>
              <div className="relative aspect-square rounded-[10px] overflow-hidden">
                <Image
                  src={IMG.gallery4}
                  alt="after"
                  fill
                  className="object-cover"
                  sizes="110px"
                />
                <span className="absolute bottom-1 left-1 text-[9px] font-bold text-white bg-accent px-[6px] py-[2px] rounded">
                  AFTER
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  const items = [
    {
      name: "이주현",
      tag: "셀프세차 이용",
      img: IMG.avatar1,
      photo: IMG.review1,
      rating: 5,
      body: "평일 저녁에도 자리 잡기 편하고, 결제부터 입장까지 30초도 안 걸렸어요. 앞으론 여기서만 쓸 듯.",
    },
    {
      name: "박서연",
      tag: "프리미엄 손세차",
      img: IMG.avatar2,
      photo: IMG.review2,
      rating: 5,
      body: "디테일러 분이 차 상태 보고 먼저 코팅 제안해 주신 게 좋았어요. 결과물은 말할 것도 없고요.",
    },
    {
      name: "장재호",
      tag: "배달세차 이용",
      img: IMG.avatar3,
      photo: IMG.review3,
      rating: 5,
      body: "회의 중에 맡기고 끝나고 찾으니 차가 새 차가 됐어요. 바쁜 직장인한테 진짜 추천합니다.",
    },
  ];
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-site px-5 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="text-[12px] font-bold text-accent tracking-[0.15em] mb-4">
              REVIEWS
            </div>
            <h2 className="ww-disp text-[36px] md:text-[56px] tracking-[-0.03em] leading-[1.05]">
              이용자의 <span className="text-accent">진짜 후기</span>
            </h2>
          </div>
          <div className="flex items-center gap-3 text-[14px] text-slate">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <IconStarFill key={i} size={16} />
              ))}
            </div>
            <span className="ww-num font-bold text-ink">4.9</span>
            <span>/ 5.0 · 24,382명</span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {items.map((r) => (
            <article
              key={r.name}
              className="bg-white rounded-[22px] border border-fog overflow-hidden flex flex-col"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={r.photo}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-7 flex-1 flex flex-col">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <IconStarFill key={i} size={14} />
                  ))}
                </div>
                <p className="text-[15px] leading-[1.7] mb-6 flex-1">
                  “{r.body}”
                </p>
                <div className="flex items-center gap-3 pt-5 border-t border-fog">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={r.img}
                      alt={r.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <div>
                    <div className="text-[13px] font-bold">{r.name}</div>
                    <div className="text-[11px] text-slate">{r.tag}</div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Membership() {
  const plans = [
    { n: "라이트", p: "9,900", d: "셀프세차 30% 할인" },
    {
      n: "스탠다드",
      p: "19,900",
      d: "셀프·손세차 40% 할인",
      hot: true,
    },
    { n: "프리미엄", p: "29,900", d: "모든 서비스 50% + 픽업 무료" },
  ];
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-site px-5 md:px-10">
        <div className="relative ww-gradient-ink rounded-[32px] overflow-hidden p-8 md:p-16 grid gap-10 md:grid-cols-2 items-center">
          <div className="absolute inset-0 opacity-40">
            <Image
              src={IMG.member}
              alt=""
              fill
              className="object-cover mix-blend-overlay"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          </div>
          <div className="relative z-10 text-white">
            <div className="text-[12px] font-bold text-accent-sky tracking-[0.15em] mb-4">
              MEMBERSHIP
            </div>
            <h3 className="ww-disp text-[36px] md:text-[52px] tracking-[-0.03em] leading-[1.05] mb-5">
              할인패스로
              <br />
              세차비 반값
            </h3>
            <p className="text-white/70 text-[15px] leading-[1.7] mb-8 max-w-[420px]">
              월 9,900원부터 시작하는 세차 정기권. 첫 달은 50% 할인된
              가격으로 경험하세요. 언제든 중도 해지 가능.
            </p>
            <Link
              href="/pass"
              className="inline-flex items-center gap-2 h-14 px-7 rounded-full bg-white text-ink text-[15px] font-bold hover:bg-accent-soft transition"
            >
              할인패스 둘러보기 <IconArrow size={16} stroke={2.5} />
            </Link>
          </div>
          <div className="relative z-10 flex flex-col gap-3">
            {plans.map((p) => (
              <div
                key={p.n}
                className={`rounded-[18px] px-6 py-5 flex items-center justify-between ${
                  p.hot
                    ? "bg-white text-ink shadow-ww-pop"
                    : "bg-white/10 border border-white/15 text-white ww-backdrop-glass"
                }`}
              >
                <div>
                  <div className="text-[15px] font-extrabold mb-1 flex items-center gap-2">
                    {p.n}
                    {p.hot && (
                      <span className="text-[10px] px-2 py-[2px] rounded-full bg-accent text-white">
                        BEST
                      </span>
                    )}
                  </div>
                  <div className="text-[12px] opacity-70">{p.d}</div>
                </div>
                <div className="text-[22px] font-extrabold ww-num">
                  {p.p}원
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Partners() {
  const stats = [
    { k: "142%", v: "평균 매출 상승" },
    { k: "3x", v: "공실 시간 활용" },
    { k: "24만+", v: "활성 이용자" },
    { k: "0원", v: "입점 수수료" },
  ];
  return (
    <section className="bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-site px-5 md:px-10 grid gap-12 md:grid-cols-2 items-center">
        <div className="relative rounded-[28px] overflow-hidden aspect-[4/5]">
          <Image
            src={IMG.partner}
            alt="우주워시 파트너 매장"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute bottom-5 left-5 right-5 bg-white/95 ww-backdrop-glass rounded-[16px] p-5 shadow-ww-card">
            <div className="text-[11px] font-bold text-accent tracking-[0.1em] mb-2">
              CASE STUDY · 용산점
            </div>
            <div className="ww-disp text-[20px] tracking-[-0.02em] mb-2">
              제휴 3개월 만에 매출 2배
            </div>
            <div className="text-[12px] text-slate leading-[1.6]">
              공실 시간대에 예약이 들어오기 시작하면서 운영 효율이 극대화됐어요.
            </div>
          </div>
        </div>
        <div>
          <div className="text-[12px] font-bold text-accent tracking-[0.15em] mb-4">
            PARTNERSHIP
          </div>
          <h3 className="ww-disp text-[36px] md:text-[52px] tracking-[-0.03em] leading-[1.05] mb-5">
            사장님이세요?
            <br />
            우주워시와 함께해요
          </h3>
          <p className="text-slate text-[15px] leading-[1.7] mb-8 max-w-[440px]">
            공실 시간대를 예약으로 채우고, 앱 전용 할인패스 고객을 확보하세요.
            입점 수수료 0원.
          </p>
          <div className="grid grid-cols-2 gap-3 mb-8">
            {stats.map((s) => (
              <div
                key={s.v}
                className="bg-white rounded-[16px] border border-fog p-5"
              >
                <div className="ww-disp text-[26px] ww-num">{s.k}</div>
                <div className="text-[12px] text-slate mt-1">{s.v}</div>
              </div>
            ))}
          </div>
          <Link
            href="/partners"
            className="inline-flex items-center gap-2 h-14 px-7 rounded-full bg-ink text-white text-[15px] font-bold hover:bg-accent-deep transition"
          >
            입점 문의하기 <IconArrow size={16} stroke={2.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const qs = [
    {
      q: "예약 취소는 언제까지 가능한가요?",
      a: "이용 1시간 전까지는 무료 취소가 가능하며, 이후에는 예약 취소/환불 수수료 약관이 적용됩니다.",
    },
    {
      q: "Before / After 사진은 어떻게 저장되나요?",
      a: "담당 디테일러가 앱 내에 자동 업로드하며, 마이 페이지 > Before/After 에서 언제든 확인할 수 있습니다.",
    },
    {
      q: "할인패스는 중도 해지할 수 있나요?",
      a: "다음 결제일 전까지 언제든 해지 가능합니다. 해지 후에도 남은 기간은 정상 이용됩니다.",
    },
    {
      q: "출장세차는 어느 지역까지 되나요?",
      a: "현재 수도권 전역 · 부산·대구 일부 지역에서 제공되며, 앱에서 위치 기반으로 가능 여부를 확인할 수 있어요.",
    },
    {
      q: "결제 영수증은 어떻게 받나요?",
      a: "앱 내 예약 내역에서 전자영수증과 현금영수증(사업자용 포함) 발급이 가능합니다.",
    },
  ];
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="mx-auto max-w-[920px] px-5 md:px-10">
        <div className="mb-14 text-center">
          <div className="text-[12px] font-bold text-accent tracking-[0.15em] mb-4">
            FAQ
          </div>
          <h2 className="ww-disp text-[36px] md:text-[52px] tracking-[-0.03em] leading-[1.05]">
            자주 묻는 질문
          </h2>
        </div>
        <div className="divide-y divide-fog">
          {qs.map((f, i) => (
            <details key={i} className="group py-6">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <span className="text-[17px] md:text-[18px] font-bold pr-4">
                  {f.q}
                </span>
                <span className="relative w-8 h-8 shrink-0 rounded-full bg-cloud flex items-center justify-center transition-transform group-open:rotate-45">
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
              <div className="text-[14px] md:text-[15px] text-slate leading-[1.7] mt-4 pr-10">
                {f.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="pb-24 md:pb-32">
      <div className="mx-auto max-w-site px-5 md:px-10">
        <div className="relative rounded-[28px] overflow-hidden bg-ink text-white p-10 md:p-16 text-center">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full ww-gradient-blue opacity-25 blur-3xl" />
          <div className="relative z-10">
            <div className="text-[12px] font-bold text-accent-sky tracking-[0.15em] mb-4">
              START TODAY
            </div>
            <h2 className="ww-disp text-[36px] md:text-[64px] tracking-[-0.03em] leading-[1.05] mb-6">
              오늘도 빛나는
              <br />
              드라이브 되세요
            </h2>
            <p className="text-white/70 text-[15px] md:text-[17px] leading-[1.7] max-w-[480px] mx-auto mb-10">
              지금 앱을 다운로드하면 첫 예약 3,000원 쿠폰을 드려요.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/download"
                className="inline-flex h-14 items-center gap-2 px-8 rounded-full bg-white text-ink text-[15px] font-bold shadow-ww-ink hover:-translate-y-[2px] transition"
              >
                앱 다운로드 <IconArrow size={16} stroke={2.5} />
              </Link>
              <Link
                href="/app"
                className="inline-flex h-14 items-center gap-2 px-8 rounded-full border border-white/30 text-white text-[15px] font-bold ww-backdrop-glass hover:bg-white/10 transition"
              >
                웹앱 체험하기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
