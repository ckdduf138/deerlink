import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { FREEZE_MIN_PARTICIPANTS } from "@/lib/room-archive";
import { PUBLIC_ROOM_EXTENSION_LABEL, PUBLIC_ROOM_MAX_LABEL, roomLifetimeLabel } from "@/lib/room-lifetime";

const FAQS: { question: string; answer: string; link?: { href: string; label: string } }[] = [
  {
    question: "밸런스 게임은 어떻게 하나요?",
    answer:
      "둘 중 하나만 골라야 하는 질문을 던지고, 각자 고른 답을 비교하는 게임이에요. 질문을 만들어 링크를 단톡방에 올리면 모두 따로 답하고, 내가 답을 마친 뒤에 누가 무엇을 골랐는지 한 번에 열려요. 질문이 떠오르지 않으면 질문 모음에서 골라 쓰면 돼요.",
    link: { href: "/popular", label: "밸런스 게임 질문 모음 보기" },
  },
  {
    question: "친구들의 답은 언제 볼 수 있나요?",
    answer:
      "비공개방에서는 내가 모든 질문에 답한 뒤 열려요. 아직 답하지 않은 질문이 있으면 다른 사람의 선택은 보이지 않아요.",
  },
  {
    question: "공개방과 비공개방은 무엇이 다른가요?",
    answer:
      "비공개방은 링크를 받은 사람만 참여하고 닉네임으로 답을 비교해요. 공개방은 누구나 결과를 볼 수 있고 닉네임 없이 익명으로 답해요.",
  },
  {
    question: "만든 방은 얼마나 유지되나요?",
    // 수명 규칙은 room-lifetime.ts, 보존 기준은 room-archive.ts가 단일 출처다. 숫자를 여기 손으로 적지 않는다.
    answer: `비공개방은 ${roomLifetimeLabel(false)} 뒤 사라져요. 공개방은 ${roomLifetimeLabel(true)} 동안 열리고, 새로 한 명이 답할 때마다 ${PUBLIC_ROOM_EXTENSION_LABEL}씩 늘어나요 (만든 날부터 최대 ${PUBLIC_ROOM_MAX_LABEL}). 기간이 끝난 공개방 중 ${FREEZE_MIN_PARTICIPANTS}명 이상 답한 방은 지우지 않고 결과를 보관해요.`,
  },
  {
    question: "회원가입이나 결제가 필요한가요?",
    answer: "필요하지 않아요. 회원가입 없이 무료로 방을 만들고 링크를 공유할 수 있어요.",
  },
];

/**
 * FAQPage 스키마 — 이 문답들이 랜딩의 유일한 본문 텍스트다.
 * 답변 문구를 고치면 화면과 스키마가 같이 움직이도록 FAQS 하나만 본다.
 */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export function FaqSection() {
  return (
    <section className="bg-page px-5 py-16 sm:px-6 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-16">
        <div>
          <h2 className="text-[26px] font-cute text-stone-900 sm:text-4xl">자주 묻는 질문</h2>
        </div>

        <div className="surface divide-y divide-stone-100 px-5 sm:px-7">
          {FAQS.map((item) => (
            <details key={item.question} className="group">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 text-[17px] font-semibold text-stone-900 marker:hidden">
                {item.question}
                <ChevronDown
                  className="h-5 w-5 flex-shrink-0 text-stone-400 transition-transform duration-200 ease-out-strong group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <div className="max-w-xl pb-5 text-base leading-relaxed text-stone-600">
                <p>{item.answer}</p>
                {item.link && (
                  <Link href={item.link.href} className="mt-2 inline-flex min-h-11 items-center font-semibold text-amber-900 underline underline-offset-4">
                    {item.link.label}
                  </Link>
                )}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
