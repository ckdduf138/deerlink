"use client";

import { useEffect, useRef, useState } from "react";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { Reorder, useDragControls } from "framer-motion";
import { cn } from "@/lib/utils";
import { QUESTION_META } from "@/lib/question-meta";
import type { CreateDraftQuestion } from "@/lib/draft-storage";

const DELETE_ARM_MS = 2500;

export const QUESTION_TITLE_MAX = 80;
export const OPTION_MAX = 30;
export const MAX_OPTIONS = 5;
export const MIN_OPTIONS = 2;

export function QuestionCard({
  question,
  index,
  autoFocus,
  onChange,
  onRemove,
  onMove,
}: {
  question: CreateDraftQuestion;
  index: number;
  autoFocus: boolean;
  onChange: (id: string, updates: Partial<CreateDraftQuestion>) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: -1 | 1) => void;
}) {
  const { icon: Icon, label, accent } = QUESTION_META[question.type];
  const dragControls = useDragControls();
  const titleRef = useRef<HTMLInputElement>(null);
  const [armed, setArmed] = useState(false);
  const armTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 새로 추가한 카드로 커서를 옮긴다. 예전에는 DOM 셀렉터로 찾다가 항상 1번 질문을 잡았다.
  // preventScroll: 스크롤은 create-editor.tsx의 bottomRef 하나로만 한다 — 안 그러면
  // 브라우저 기본 포커스 스크롤과 겹쳐서 두 번 움직이는 것처럼 보인다.
  useEffect(() => {
    if (autoFocus) titleRef.current?.focus({ preventScroll: true });
  }, [autoFocus]);

  useEffect(() => {
    return () => {
      if (armTimeout.current) clearTimeout(armTimeout.current);
    };
  }, []);

  const handleDeleteClick = () => {
    if (armed) {
      if (armTimeout.current) clearTimeout(armTimeout.current);
      onRemove(question.id);
      return;
    }
    setArmed(true);
    armTimeout.current = setTimeout(() => setArmed(false), DELETE_ARM_MS);
  };

  const options = question.options ?? [];

  const addOption = () => {
    if (options.length < MAX_OPTIONS) {
      onChange(question.id, { options: [...options, ""] });
    }
  };

  const updateOption = (i: number, value: string) => {
    onChange(question.id, {
      options: options.map((o, idx) => (idx === i ? value : o)),
    });
  };

  const removeOption = (i: number) => {
    if (options.length > MIN_OPTIONS) {
      onChange(question.id, { options: options.filter((_, idx) => idx !== i) });
    }
  };

  return (
    <Reorder.Item
      value={question}
      dragListener={false}
      dragControls={dragControls}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="surface overflow-hidden"
    >
      <div className="flex items-center gap-2 px-5 pt-2">
        <button
          onPointerDown={(e) => dragControls.start(e)}
          onKeyDown={(event) => {
            if (event.key === "ArrowUp" || event.key === "ArrowDown") {
              event.preventDefault();
              onMove(question.id, event.key === "ArrowUp" ? -1 : 1);
            }
          }}
          className="touch-none cursor-grab active:cursor-grabbing min-w-11 min-h-11 -ml-2 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors"
          aria-label={`질문 ${index + 1} 순서 변경, 위아래 화살표 키 사용`}
          aria-keyshortcuts="ArrowUp ArrowDown"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-stone-100 px-1.5 text-[13px] font-bold tabular-nums text-stone-600">
          {index + 1}
        </span>

        <div className={cn("flex flex-1 items-center gap-1.5", accent)}>
          <Icon className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
          <span className="text-sm font-semibold">
            {label}
          </span>
        </div>

        <button
          onClick={handleDeleteClick}
          className={cn(
            "min-w-11 min-h-11 -mr-2.5 flex items-center justify-center rounded-lg transition-colors",
            armed
              ? "bg-red-50 text-red-600"
              : "text-stone-500 hover:text-red-600"
          )}
          aria-label={
            armed
              ? `질문 ${index + 1} 삭제를 확인하려면 다시 누르세요`
              : `질문 ${index + 1} 삭제`
          }
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="px-3 pb-2 pt-1">
        <input
          ref={titleRef}
          type="text"
          value={question.title}
          onChange={(e) => onChange(question.id, { title: e.target.value })}
          placeholder="질문을 입력하세요"
          maxLength={QUESTION_TITLE_MAX}
          aria-label={`질문 ${index + 1} 내용`}
          className="input-lg min-h-12 w-full rounded-xl bg-transparent px-2 text-lg font-bold leading-relaxed text-stone-900 placeholder:font-semibold placeholder:text-stone-500 transition-colors focus-visible:bg-page focus-visible:outline-none"
        />
      </div>

      {question.type === "balance" && (
        <div className="grid grid-cols-2 gap-2 px-5 pb-5">
          {(["optionA", "optionB"] as const).map((key, i) => (
            <input
              key={key}
              type="text"
              value={question[key] ?? ""}
              onChange={(e) => onChange(question.id, { [key]: e.target.value })}
              placeholder={`옵션 ${i + 1}`}
              maxLength={OPTION_MAX}
              aria-label={`질문 ${index + 1} 옵션 ${i + 1}`}
              className={cn(
                "min-h-14 rounded-2xl px-4 font-semibold text-stone-900 outline-none ring-2 ring-transparent transition-shadow placeholder:font-medium placeholder:text-stone-500",
                key === "optionA"
                  ? "bg-amber-50 focus-visible:ring-amber-400"
                  : "bg-teal-50 focus-visible:ring-teal-400"
              )}
            />
          ))}
        </div>
      )}

      {question.type === "multiple" && (
        <div className="space-y-2 px-5 pb-5">
          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={opt}
                onChange={(e) => updateOption(i, e.target.value)}
                placeholder={`선택지 ${i + 1}`}
                maxLength={OPTION_MAX}
                aria-label={`질문 ${index + 1} 선택지 ${i + 1}`}
                className="min-h-12 flex-1 rounded-xl bg-teal-50 px-4 font-medium text-stone-900 outline-none ring-2 ring-transparent transition-shadow placeholder:text-stone-500 focus-visible:ring-teal-400"
              />
              {options.length > MIN_OPTIONS && (
                <button
                  onClick={() => removeOption(i)}
                  className="min-w-11 min-h-11 flex items-center justify-center text-stone-500 hover:text-red-600 transition-colors flex-shrink-0"
                  aria-label={`선택지 ${i + 1} 삭제`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          {options.length < MAX_OPTIONS && (
            <button
              onClick={addOption}
              className="pressable flex min-h-12 w-full items-center justify-center gap-1.5 rounded-xl bg-stone-100 text-[15px] font-semibold text-stone-700 hover:bg-stone-200"
            >
              <Plus className="w-3.5 h-3.5" />
              선택지 추가
            </button>
          )}
        </div>
      )}

      {question.type === "subjective" && (
        <div className="px-5 pb-5">
          <p className="rounded-xl bg-page px-4 py-3 text-[15px] text-stone-600">참여자가 자유롭게 텍스트로 답변해요</p>
        </div>
      )}
    </Reorder.Item>
  );
}
