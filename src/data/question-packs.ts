import { POPULAR_QUESTIONS, type PopularQuestion } from "./popular-questions";

/**
 * 질문 테마 — 지금 가장 큰 이탈 지점은 "누군가 질문을 먼저 만들어야 함"이다.
 * 테마 하나를 고르면 제목·질문 5개가 채워진 채로 바로 제출 화면까지 간다.
 * 문항은 POPULAR_QUESTIONS를 id로 참조한다 — 텍스트를 두 곳에 중복해서
 * 적으면 나중에 한쪽만 고치는 사고가 난다.
 */

export interface QuestionPack {
  id: string;
  title: string;
  roomTitle: string;
  description: string;
  questionIds: string[];
}

function resolve(ids: string[]): PopularQuestion[] {
  return ids.map((id) => {
    const q = POPULAR_QUESTIONS.find((p) => p.id === id);
    if (!q) throw new Error(`question-packs: 존재하지 않는 id "${id}"`);
    return q;
  });
}

interface PackDef {
  id: string;
  title: string;
  roomTitle: string;
  description: string;
  ids: string[];
}

const PACK_DEFS: PackDef[] = [
  {
    id: "friends",
    title: "친구끼리",
    roomTitle: "우리 그룹 탐구생활",
    description: "포지션부터 결혼까지, 서로를 놀리기 딱 좋은 질문",
    ids: ["m-position", "s-first-married", "s-want-to-say", "b-tangsuyuk", "m-gongpo-movie"],
  },
  {
    id: "dating",
    title: "연애·썸",
    roomTitle: "연애 취향 비교",
    description: "이상형부터 연애 습관까지",
    ids: ["b-jjaksarang", "b-seontok-katok", "b-honja-gachi", "m-galdeung", "m-katok-wass"],
  },
  {
    id: "values",
    title: "가치관",
    roomTitle: "가치관 비교",
    description: "돈, 관계, 미래 앞에서 우리는 뭘 고를까",
    ids: ["b-1eok-jeolyeon", "b-tumyeong-maeum", "b-200man-1000man", "m-10eok", "s-ten-years"],
  },
  {
    id: "gathering",
    title: "MT·모임",
    roomTitle: "MT 단체 게임",
    description: "여행 가서 바로 돌리기 좋은 아이스브레이커",
    ids: ["b-sowon-changpi", "s-anywhere", "m-stress", "m-yaksok-sigan", "s-into-lately"],
  },
  {
    id: "light",
    title: "가벼운 취향",
    roomTitle: "가볍게 취향 비교",
    description: "치킨 취향부터 여행 스타일까지, 부담 없이 시작하기 좋은 질문",
    ids: ["b-chicken", "b-yeohaeng-style", "m-jumal-achim", "m-danche-sajin", "s-choegeun-utgin"],
  },
];

export const QUESTION_PACKS: QuestionPack[] = PACK_DEFS.map(({ ids, ...rest }) => ({
  ...rest,
  questionIds: ids,
}));

export function packQuestions(pack: QuestionPack): PopularQuestion[] {
  return resolve(pack.questionIds);
}
