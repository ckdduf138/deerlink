import type { PopularQuestion } from "@/data/popular-questions";
import { prisma } from "./prisma";

/**
 * 인기 질문 하나가 실제로 어떻게 답을 받았는지 — 질문별 페이지(/popular/q/[id])의 본체.
 *
 * 공개방 답변만 센다. 비공개방은 Answer Lock 안쪽이다: 세 명짜리 방 하나에서만 쓰인
 * 질문이면 "A 2명, B 1명"이 곧 그 그룹의 답이고, 아직 답하지 않은 멤버보다 검색
 * 결과가 먼저 보여주게 된다. 공개방은 원래 누구나 결과를 보는 방이라 이 문제가 없다.
 */
export const QUESTION_STATS_MIN_ANSWERS = 10;

export type QuestionStats =
  | { type: "balance"; total: number; a: number; b: number }
  | { type: "multiple"; total: number; counts: number[] };

/**
 * 방을 만들 때 사용자가 문항을 고칠 수 있고, 고쳐도 sourceId는 남는다. 선택지가
 * 바뀐 문항의 "1번"은 원래 질문의 1번이 아니니 선택지가 원본과 똑같은 것만 센다.
 * 제목 문구는 고쳐도 같은 질문으로 본다.
 *
 * sourceId가 없는 옛 방(출처를 남기기 전에 만들어졌거나, 테마 방 시딩이 출처를 빠뜨렸던
 * 때)은 제목까지 원본과 똑같을 때만 같은 질문으로 인정한다.
 */
function sameQuestionWhere(question: PopularQuestion) {
  return {
    type: question.type,
    optionA: question.optionA ?? null,
    optionB: question.optionB ?? null,
    options: question.options ? JSON.stringify(question.options) : null,
    room: { isPublic: true },
    OR: [{ sourceId: question.id }, { sourceId: null, title: question.title }],
  };
}

/**
 * 표본이 QUESTION_STATS_MIN_ANSWERS보다 적으면 null이다 — 가짜 정밀도보다 침묵이 낫다.
 * 주관식은 자유 텍스트라 집계할 게 없고, 공개방 답변이라도 문장을 그대로 검색 페이지에
 * 옮기는 건 답한 사람이 예상한 노출이 아니라서 다루지 않는다.
 */
export async function getQuestionStats(question: PopularQuestion): Promise<QuestionStats | null> {
  if (question.type === "subjective") return null;

  const rows = await prisma.answer.groupBy({
    by: ["value"],
    where: { question: sameQuestionWhere(question) },
    _count: { _all: true },
  });
  const countOf = (value: string) => rows.find((row) => row.value === value)?._count._all ?? 0;

  if (question.type === "balance") {
    const a = countOf("A");
    const b = countOf("B");
    const total = a + b;
    return total >= QUESTION_STATS_MIN_ANSWERS ? { type: "balance", total, a, b } : null;
  }

  const counts = (question.options ?? []).map((_, index) => countOf(String(index)));
  const total = counts.reduce((sum, count) => sum + count, 0);
  return total >= QUESTION_STATS_MIN_ANSWERS ? { type: "multiple", total, counts } : null;
}

/** BalanceRatioBar·공유 카드와 같은 공식이다. 화면마다 반올림이 다르면 숫자가 어긋난다. */
export function percentOf(count: number, total: number): number {
  return total ? Math.round((count / total) * 100) : 0;
}
