import type { QuestionType } from "./types";

/**
 * 작성 중인 내용을 브라우저에 임시 보관한다.
 * 새로고침·실수로 닫기·제출 실패로 입력이 통째로 날아가던 문제를 막는 용도다.
 */

const DRAFT_TTL_MS = 24 * 60 * 60 * 1000;

interface Envelope<T> {
  savedAt: number;
  value: T;
}

export interface CreateDraftQuestion {
  id: string;
  type: QuestionType;
  title: string;
  optionA?: string;
  optionB?: string;
  options?: string[];
}

export interface CreateDraft {
  title: string;
  questions: CreateDraftQuestion[];
}

export interface AnswerDraft {
  nickname: string;
  answers: Record<string, string>;
  currentQuestion: number;
  submissionId?: string;
}

export const CREATE_DRAFT_KEY = "deerlink:draft:create";

export function answerDraftKey(roomId: string): string {
  return `deerlink:draft:answers:${roomId}`;
}

/**
 * localStorage는 같은 탭 안에서 storage 이벤트를 쏘지 않는다.
 * useSyncExternalStore가 구독할 수 있도록 직접 알린다.
 */
const listeners = new Set<() => void>();

export function subscribeDrafts(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function notify(): void {
  listeners.forEach((listener) => listener());
}

/** useSyncExternalStore용 스냅샷 — 원문 문자열이라 참조가 안정적이다 */
export function draftSnapshot(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function parseDraft<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    const envelope = JSON.parse(raw) as Envelope<T>;
    if (typeof envelope?.savedAt !== "number") return null;
    if (Date.now() - envelope.savedAt > DRAFT_TTL_MS) return null;
    return envelope.value;
  } catch {
    return null;
  }
}

export function loadDraft<T>(key: string): T | null {
  const value = parseDraft<T>(draftSnapshot(key));
  if (value === null) clearDraft(key);
  return value;
}

export function saveDraft<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    const envelope: Envelope<T> = { savedAt: Date.now(), value };
    window.localStorage.setItem(key, JSON.stringify(envelope));
  } catch {
    // 시크릿 모드나 용량 초과 — 임시저장은 실패해도 본 작업을 막지 않는다
  }
  notify();
}

export function clearDraft(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // 위와 동일
  }
  notify();
}
