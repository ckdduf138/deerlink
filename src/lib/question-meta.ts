import { ListChecks, PenLine, Scale, type LucideIcon } from "lucide-react";
import type { QuestionType } from "./types";

interface QuestionMeta {
  icon: LucideIcon;
  /** 버튼·뱃지용 짧은 라벨 */
  label: string;
  /** 답변 화면 헤더용 */
  longLabel: string;
  /** WCAG AA를 통과하는 전경색 — amber-400/teal-400은 흰 배경에서 미달이다 */
  accent: string;
  /** 유형 뱃지 (테두리 + 배경 + 전경) */
  badge: string;
}

export const QUESTION_META: Record<QuestionType, QuestionMeta> = {
  balance: {
    icon: Scale,
    label: "밸런스",
    longLabel: "밸런스 게임",
    accent: "text-amber-700",
    badge: "border-amber-200 bg-amber-50 text-amber-800",
  },
  multiple: {
    icon: ListChecks,
    label: "객관식",
    longLabel: "객관식",
    accent: "text-teal-700",
    badge: "border-teal-200 bg-teal-50 text-teal-800",
  },
  subjective: {
    icon: PenLine,
    label: "주관식",
    longLabel: "주관식",
    accent: "text-stone-600",
    badge: "border-stone-200 bg-stone-100 text-stone-700",
  },
};

export const QUESTION_TYPES: QuestionType[] = ["balance", "multiple", "subjective"];
