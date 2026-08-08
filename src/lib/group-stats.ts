import type { Participant, Question, ResultsRoom } from "./types";

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
