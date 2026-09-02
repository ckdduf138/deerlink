import { parseOptions, type Participant, type Question, type ResultsRoom } from "./types";

/**
 * "지우와 87% 일치" 같은 그룹 리포트 계산. 결과 페이지와 공유 카드가
 * 같은 숫자를 말해야 하므로 순수 함수로 뽑아 양쪽이 이 파일 하나만 쓴다.
 */

export interface PairScore {
  a: Participant;
  b: Participant;
  pct: number;
  comparable: number;
}

function comparableQuestions(room: ResultsRoom): Question[] {
  return room.questions.filter((q) => q.type !== "subjective");
}

export function computePairScores(room: ResultsRoom): PairScore[] {
  const qs = comparableQuestions(room);
  const people = room.participants;
  const scores: PairScore[] = [];

  for (let i = 0; i < people.length; i++) {
    for (let j = i + 1; j < people.length; j++) {
      const a = people[i];
      const b = people[j];
      let match = 0;
      let comparable = 0;
      for (const q of qs) {
        const av = a.answers.find((x) => x.questionId === q.id)?.value;
        const bv = b.answers.find((x) => x.questionId === q.id)?.value;
        if (av == null || bv == null) continue;
        comparable++;
        if (av === bv) match++;
      }
      // 비교 가능한 질문이 1개 이하면 %가 0 또는 100으로 튀어 의미가 없다
      if (comparable >= 2) {
        scores.push({ a, b, comparable, pct: Math.round((match / comparable) * 100) });
      }
    }
  }
  return scores;
}

export function bestPair(room: ResultsRoom): PairScore | null {
  const sorted = [...computePairScores(room)].sort((x, y) => y.pct - x.pct);
  return sorted[0] ?? null;
}

export function computeLoneDissenter(
  room: ResultsRoom
): { participant: Participant; count: number } | null {
  const qs = comparableQuestions(room);
  const counts = new Map<string, number>();

  for (const q of qs) {
    const entries = room.participants
      .map((p) => ({ p, v: p.answers.find((a) => a.questionId === q.id)?.value }))
      .filter((e): e is { p: Participant; v: string } => e.v != null);
    if (entries.length < 3) continue;

    const byValue = new Map<string, Participant[]>();
    for (const e of entries) {
      byValue.set(e.v, [...(byValue.get(e.v) ?? []), e.p]);
    }
    // 정확히 두 갈래이고 그중 하나가 단독일 때만 "혼자 다른 선택"이다
    if (byValue.size !== 2) continue;
    const groups = [...byValue.values()];
    const lone = groups.find((g) => g.length === 1);
    const majority = groups.find((g) => g.length === entries.length - 1);
    if (lone && majority) {
      const id = lone[0].id;
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
  }

  let top: { participant: Participant; count: number } | null = null;
  for (const [id, count] of counts) {
    if (!top || count > top.count) {
      const participant = room.participants.find((p) => p.id === id);
      if (participant) top = { participant, count };
    }
  }
  return top;
}

export function computeClosestBalance(
  room: ResultsRoom
): { question: Question; countA: number; countB: number; diff: number } | null {
  let best: { question: Question; countA: number; countB: number; diff: number } | null = null;
  let qualifying = 0;

  for (const q of room.questions) {
    if (q.type !== "balance") continue;
    const values = room.participants
      .map((p) => p.answers.find((a) => a.questionId === q.id)?.value)
      .filter((v): v is string => v != null);
    const countA = values.filter((v) => v === "A").length;
    const countB = values.filter((v) => v === "B").length;
    if (countA + countB < 2) continue;
    qualifying++;
    const diff = Math.abs(countA - countB);
    if (!best || diff < best.diff) best = { question: q, countA, countB, diff };
  }

  // "가장" 팽팽한 걸 뽑으려면 비교 대상이 최소 둘은 있어야 한다
  return qualifying >= 2 ? best : null;
}

export interface QuestionAggregate {
  question: Question;
  options: { label: string; count: number; pct: number }[];
  total: number;
  topCount: number;
  topLabels: string[];
}

function answerLabel(question: Question, value: string): string | null {
  if (question.type === "balance") {
    if (value === "A") return question.optionA ?? "A";
    if (value === "B") return question.optionB ?? "B";
    return null;
  }
  if (question.type === "multiple") {
    const index = Number(value);
    return Number.isInteger(index) ? (parseOptions(question.options)[index] ?? null) : null;
  }
  return null;
}

export function questionAggregate(
  room: ResultsRoom,
  question: Question
): QuestionAggregate | null {
  if (question.type === "subjective") return null;

  const labels =
    question.type === "balance"
      ? [question.optionA ?? "A", question.optionB ?? "B"]
      : parseOptions(question.options);
  const values = room.participants
    .map((participant) =>
      participant.answers.find((answer) => answer.questionId === question.id)?.value
    )
    .filter((value): value is string => value !== undefined);
  const resolved = values
    .map((value) => answerLabel(question, value))
    .filter((label): label is string => label !== null);
  const total = resolved.length;
  const options = labels.map((label) => {
    const count = resolved.filter((value) => value === label).length;
    return { label, count, pct: total ? Math.round((count / total) * 100) : 0 };
  });
  const topCount = Math.max(...options.map((option) => option.count), 0);

  return {
    question,
    options,
    total,
    topCount,
    topLabels: options.filter((option) => option.count === topCount && topCount > 0).map((option) => option.label),
  };
}

export function computeQuestionAggregates(room: ResultsRoom): QuestionAggregate[] {
  return room.questions
    .map((question) => questionAggregate(room, question))
    .filter((aggregate): aggregate is QuestionAggregate => aggregate !== null);
}

export function computeUnanimousAggregates(room: ResultsRoom): QuestionAggregate[] {
  return computeQuestionAggregates(room).filter(
    (aggregate) => aggregate.total >= 2 && aggregate.topCount === aggregate.total
  );
}

export function mostMeaningfulAggregate(room: ResultsRoom): QuestionAggregate | null {
  const aggregates = computeQuestionAggregates(room).filter((aggregate) => aggregate.total > 0);
  aggregates.sort((a, b) => {
    if (b.total !== a.total) return b.total - a.total;
    const bShare = b.total ? b.topCount / b.total : 0;
    const aShare = a.total ? a.topCount / a.total : 0;
    if (bShare !== aShare) return bShare - aShare;
    return a.question.order - b.question.order;
  });
  return aggregates[0] ?? null;
}

export type PrimaryResultInsight =
  | { kind: "best-pair"; pair: PairScore }
  | {
      kind: "closest-balance";
      result: NonNullable<ReturnType<typeof computeClosestBalance>>;
    }
  | { kind: "unanimous"; aggregate: QuestionAggregate }
  | { kind: "aggregate"; aggregate: QuestionAggregate };

export function primaryResultInsight(room: ResultsRoom): PrimaryResultInsight | null {
  if (!room.isPublic) {
    const pair = bestPair(room);
    if (pair) return { kind: "best-pair", pair };
  }

  const closest = computeClosestBalance(room);
  if (closest) return { kind: "closest-balance", result: closest };

  const unanimous = computeUnanimousAggregates(room)[0];
  if (unanimous) return { kind: "unanimous", aggregate: unanimous };

  const aggregate = mostMeaningfulAggregate(room);
  return aggregate ? { kind: "aggregate", aggregate } : null;
}
