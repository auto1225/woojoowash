import { AppBar } from "@/components/app/AppBar";
import { db } from "@/lib/db";
import { FaqList, type FaqItem } from "./FaqList";

export const dynamic = "force-dynamic";

export default async function AppFaqPage() {
  const rows = await db.faq.findMany({
    where: { active: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  // 폴백 — DB 가 비어있을 때를 위한 기본 항목
  const fallback: FaqItem[] = [
    {
      id: "f1",
      category: "예약",
      question: "예약 취소는 언제까지 가능한가요?",
      answer:
        "이용 1시간 전까지 무료 취소 가능하며, 이후에는 안내된 약관에 따라 수수료가 발생할 수 있어요.",
    },
    {
      id: "f2",
      category: "결제",
      question: "결제 수단은 어떤 게 있나요?",
      answer:
        "우주워시 간편결제(저장된 카드)와 카드 직접 결제를 지원해요. 추후 카카오페이·네이버페이도 추가 예정입니다.",
    },
    {
      id: "f3",
      category: "이용",
      question: "예약 시간보다 늦게 도착하면 어떻게 되나요?",
      answer:
        "10분 이내 지연은 매장 사정에 따라 진행 가능하며, 그 이상 지연 시 일정 조정 또는 취소가 필요할 수 있어요.",
    },
    {
      id: "f4",
      category: "리뷰",
      question: "리뷰는 언제 작성할 수 있나요?",
      answer:
        "이용이 완료된 예약에 대해 작성할 수 있어요. 예약 내역 → 해당 예약의 '리뷰 작성하기' 버튼을 누르세요.",
    },
    {
      id: "f5",
      category: "기타",
      question: "쿠폰은 어떻게 받을 수 있나요?",
      answer:
        "회원가입·이벤트 참여·매장 방문 적립으로 쿠폰이 발급됩니다. 마이 → 쿠폰함에서 확인하세요.",
    },
  ];

  const faqs: FaqItem[] =
    rows.length > 0
      ? rows.map((r) => ({
          id: r.id,
          category: r.category,
          question: r.question,
          answer: r.answer,
        }))
      : fallback;

  return (
    <div className="pb-12">
      <AppBar title="자주 묻는 질문" showBack />
      <FaqList items={faqs} />
    </div>
  );
}
