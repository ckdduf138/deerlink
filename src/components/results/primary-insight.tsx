import { BalanceRatioBar } from "@/components/ResultBar";
import { Fawn } from "@/components/Fawn";
import { primaryResultInsight, type PrimaryResultInsight } from "@/lib/group-stats";
import type { ResultsRoom } from "@/lib/types";

export function PrimaryInsight({ room, viewerId = null }: { room: ResultsRoom; viewerId?: string | null }) {
  const insight = primaryResultInsight(room);

  return (
    <section aria-labelledby="primary-insight-heading">
      <h2 id="primary-insight-heading" className="mb-3 px-1 text-xl font-cute text-stone-900">
        {room.isPublic ? "모두의 선택에서 보인 것" : "우리에게서 발견한 것"}
      </h2>
      <div className="surface relative p-5 sm:p-7">
      <Fawn mood="wow" className="absolute -top-9 right-4 h-16 w-16 sm:right-6" />
      {insight ? (
        <InsightBody insight={insight} viewerId={viewerId} />
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
      </div>
    </section>
  );
}

function InsightBody({
  insight,
  viewerId,
}: {
  insight: PrimaryResultInsight;
  viewerId: string | null;
}) {
  const name = (p: { id: string; nickname: string }) =>
    p.id === viewerId ? `${p.nickname}(나)` : p.nickname;

  if (insight.kind === "best-pair") {
    return (
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-amber-800">최고 궁합</p>
          <p className="font-cute mt-1.5 break-words text-[26px] leading-snug text-stone-900">
            {name(insight.pair.a)}, {name(insight.pair.b)}
          </p>
          <p className="mt-2 text-sm text-stone-600">
            질문 {insight.pair.comparable}개 기준
          </p>
        </div>
        <p className="font-cute flex-shrink-0 text-6xl leading-none tabular-nums text-amber-700">
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
        <p className="mt-1.5 break-words text-xl font-bold leading-snug text-stone-900">
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
        <p className="flex-shrink-0 text-3xl font-bold tracking-tight tabular-nums">{topPct}%</p>
      </div>
    </div>
  );
}

export function FirstAnswerInsight() {
  return (
    <section className="surface p-5 sm:p-7" aria-labelledby="first-answer-heading">
      <Fawn mood="happy" className="mb-2 h-16 w-16" />
      <h2 id="first-answer-heading" className="text-xl font-cute leading-snug text-stone-900">
        첫 답변이 도착했어요.
      </h2>
      <p className="mt-2 text-base leading-relaxed text-stone-600">
        한 명 더 오면 비교가 시작돼요.
      </p>
    </section>
  );
}
