import { Plus } from "lucide-react";
import Link from "next/link";
import { popularQuestionPath, type PopularQuestion } from "@/data/popular-questions";
import { QUESTION_META } from "@/lib/question-meta";
import { cn } from "@/lib/utils";

const MULTIPLE_PREVIEW = 3;

/**
 * 밸런스는 A amber / B teal, 객관식은 teal 톤 하나로 3개까지 + "+N" — RoomCard의 TypePreview와
 * 같은 문법이다. 주관식은 보여줄 선택지가 없으니 비운다.
 */
function Choices({ question }: { question: PopularQuestion }) {
  if (question.type === "balance") {
    return (
      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs font-medium">
        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-900">{question.optionA}</span>
        <span className="text-stone-500">vs</span>
        <span className="rounded-full bg-teal-50 px-2.5 py-1 text-teal-900">{question.optionB}</span>
      </div>
    );
  }

  if (question.type === "multiple" && question.options) {
    const shown = question.options.slice(0, MULTIPLE_PREVIEW);
    const rest = question.options.length - shown.length;
    return (
      <div className="mt-2 flex flex-wrap gap-1.5 text-xs font-medium">
        {shown.map((option) => (
          <span key={option} className="rounded-full bg-teal-50 px-2.5 py-1 text-teal-900">
            {option}
          </span>
        ))}
        {rest > 0 && <span className="px-1 py-1 text-stone-500">+{rest}</span>}
      </div>
    );
  }

  return null;
}

/**
 * 한 줄에 한 질문. 행 전체가 질문 상세(/popular/q/[id])로 가는 링크이고, 오른쪽 버튼만
 * 바로 방 만들기로 간다. 예전 카드는 질문 하나에 200px 넘게 써서 70개가 한 화면에 안 잡혔다.
 */
export function PopularQuestionRow({
  question,
  rank,
  highlight,
  showType,
}: {
  question: PopularQuestion;
  rank: number;
  highlight: boolean;
  showType: boolean;
}) {
  const meta = QUESTION_META[question.type];

  return (
    <li className="relative flex items-center gap-3 px-4 py-4 transition-colors hover:bg-amber-50/40 sm:gap-4 sm:px-6">
      <span
        className={cn(
          "w-8 flex-shrink-0 text-center font-cute text-2xl tabular-nums",
          highlight ? "text-amber-700" : "text-stone-500"
        )}
      >
        {rank}
      </span>
      <div className="min-w-0 flex-1">
        {showType && (
          <span className={cn("mb-1 inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium", meta.badge)}>
            {meta.label}
          </span>
        )}
        <h3 className="break-keep text-[15px] font-semibold leading-snug text-stone-900 sm:text-base">
          <Link
            href={popularQuestionPath(question.id)}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {question.title}
          </Link>
        </h3>
        <Choices question={question} />
      </div>
      <Link
        href={`/create?question=${encodeURIComponent(question.id)}`}
        aria-label={`"${question.title}" 질문으로 방 만들기`}
        className="pressable relative z-10 flex min-h-11 flex-shrink-0 items-center justify-center gap-1 rounded-full bg-amber-100 pl-2.5 pr-3.5 text-sm font-semibold text-amber-900 hover:bg-amber-200"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        <span className="sm:hidden">시작</span>
        <span className="hidden sm:inline">이 질문으로 시작</span>
      </Link>
    </li>
  );
}

export function PopularQuestionList({
  questions,
  showType = false,
  startRank = 1,
  highlightTop = 0,
}: {
  questions: PopularQuestion[];
  showType?: boolean;
  startRank?: number;
  /** 앞에서 몇 개의 순위 숫자를 amber로 강조할지. 순위가 없는 목록(주제 페이지)은 0. */
  highlightTop?: number;
}) {
  return (
    <ol start={startRank} className="surface divide-y divide-stone-100 overflow-hidden">
      {questions.map((question, index) => {
        const rank = startRank + index;
        return (
          <PopularQuestionRow
            key={question.id}
            question={question}
            rank={rank}
            highlight={rank <= highlightTop}
            showType={showType}
          />
        );
      })}
    </ol>
  );
}
