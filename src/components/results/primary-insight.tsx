import { Sparkles, Users } from "lucide-react";
import { BalanceRatioBar } from "@/components/ResultBar";
import { primaryResultInsight, type PrimaryResultInsight } from "@/lib/group-stats";
import type { ResultsRoom } from "@/lib/types";

export function PrimaryInsight({ room }: { room: ResultsRoom }) {
  const insight = primaryResultInsight(room);

  return (
    <section aria-labelledby="primary-insight-heading" className="border-y border-amber-200 py-7">
      <div className="mb-5 flex items-center gap-2 text-amber-800">
        <Sparkles className="h-5 w-5" aria-hidden="true" />
        <h2 id="primary-insight-heading" className="text-xl font-bold tracking-tight text-stone-900">
          우리에게서 발견한 것
        </h2>
      </div>
      {insight ? (
        <InsightBody insight={insight} />
      ) : (
        <div>
          <p className="text-2xl font-bold leading-snug text-stone-900">
            서로 다른 문장들이 모였어요.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            주관식 답변은 점수로 단순화하지 않고 그대로 보여드려요.
          </p>
        </div>
      )}
    </section>
  );
}

function InsightBody({ insight }: { insight: PrimaryResultInsight }) {
  if (insight.kind === "best-pair") {
    return (
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-amber-800">최고 궁합</p>
          <p className="mt-2 break-words text-2xl font-bold leading-snug text-stone-900 sm:text-3xl">
            {insight.pair.a.nickname}, {insight.pair.b.nickname}
          </p>
          <p className="mt-2 text-sm text-stone-600">
            비교 가능한 질문 {insight.pair.comparable}개를 기준으로 계산했어요.
          </p>
        </div>
        <p className="flex-shrink-0 font-mono text-5xl font-bold leading-none tabular-nums text-amber-700">
          {insight.pair.pct}%
        </p>
      </div>
    );
  }

  if (insight.kind === "closest-balance") {
    const { question, countA, countB } = insight.result;
    return (
      <div>
        <p className="text-sm font-semibold text-amber-800">가장 팽팽한 질문</p>
        <p className="mt-2 break-words text-2xl font-bold leading-snug text-stone-900">
          {question.title}
        </p>
        <BalanceRatioBar
          className="mt-5"
          a={{ label: question.optionA ?? "A", count: countA }}
          b={{ label: question.optionB ?? "B", count: countB }}
        />
      </div>
    );
  }

  const { aggregate } = insight;
  const topOptions = aggregate.options.filter((option) => option.count === aggregate.topCount);
  const topLabel = topOptions.map((option) => option.label).join(", ");
  const topPct = topOptions[0]?.pct ?? 0;

  return (
    <div>
      <p className="text-sm font-semibold text-amber-800">
        {insight.kind === "unanimous" ? "만장일치" : "가장 많이 모인 답"}
      </p>
      <p className="mt-2 break-words text-xl font-bold leading-snug text-stone-900 sm:text-2xl">
        {aggregate.question.title}
      </p>
      <div className="mt-5 flex flex-col gap-2 rounded-xl bg-amber-50 px-4 py-4 text-amber-900 sm:flex-row sm:items-end sm:justify-between">
        <p className="break-words text-lg font-semibold leading-snug">{topLabel}</p>
        <p className="flex-shrink-0 font-mono text-3xl font-bold tabular-nums">{topPct}%</p>
      </div>
    </div>
  );
}

export function FirstAnswerInsight() {
  return (
    <section className="border-y border-amber-200 py-7" aria-labelledby="first-answer-heading">
      <Users className="mb-4 h-6 w-6 text-amber-700" aria-hidden="true" />
      <h2 id="first-answer-heading" className="text-2xl font-bold leading-snug text-stone-900">
        첫 답변이 도착했어요.
      </h2>
      <p className="mt-2 text-base leading-relaxed text-stone-600">
        한 명 더 오면 비교가 시작돼요.
      </p>
    </section>
  );
}
