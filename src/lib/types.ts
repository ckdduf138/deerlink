export type QuestionType = "balance" | "multiple" | "subjective";

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  optionA: string | null;
  optionB: string | null;
  options: string | null;
  order: number;
}

export interface Answer {
  id: string;
  questionId: string;
  value: string;
}

export interface ParticipantSummary {
  id: string;
  nickname: string;
}

export interface Participant extends ParticipantSummary {
  answers: Answer[];
}

interface RoomBase {
  id: string;
  title: string;
  isPublic: boolean;
  expiresAt: string;
  questions: Question[];
}

/** 방 입장 화면 — Answer Lock 때문에 남의 답변은 내려오지 않는다 */
export interface LobbyRoom extends RoomBase {
  participants: ParticipantSummary[];
}

/** 결과 화면 — 전 문항을 답한 뒤에만 받는 모양 */
export interface ResultsRoom extends RoomBase {
  participants: Participant[];
}

export interface AdminRoom extends ResultsRoom {
  createdAt: string;
}

/** 공개방 발견 피드 카드 — 참여자 닉네임·답변은 담지 않는다. Answer Lock과 무관한 디렉터리다. */
export interface DiscoverRoom {
  id: string;
  title: string;
  questionCount: number;
  participantCount: number;
  createdAt: string;
  expiresAt: string;
}

/** DB의 options는 JSON 문자열이다. 깨져 있어도 화면이 죽지 않아야 한다. */
export function parseOptions(options: string | null): string[] {
  if (!options) return [];
  try {
    const parsed: unknown = JSON.parse(options);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((option): option is string => typeof option === "string");
  } catch {
    return [];
  }
}
