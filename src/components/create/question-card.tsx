"use client";

import { useEffect, useRef } from "react";
import { GripVertical, Trash2 } from "lucide-react";
import { Reorder, useDragControls } from "framer-motion";
import { cn } from "@/lib/utils";
import { QUESTION_META } from "@/lib/question-meta";
import type { CreateDraftQuestion } from "@/lib/draft-storage";

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
}: {
  question: CreateDraftQuestion;
  index: number;
  autoFocus: boolean;
  onChange: (id: string, updates: Partial<CreateDraftQuestion>) => void;
  onRemove: (id: string) => void;
}) {
  const { icon: Icon, label, accent } = QUESTION_META[question.type];
  const dragControls = useDragControls();
  const titleRef = useRef<HTMLInputElement>(null);

  // 새로 추가한 카드로 커서를 옮긴다. 예전에는 DOM 셀렉터로 찾다가 항상 1번 질문을 잡았다.
  useEffect(() => {
    if (autoFocus) titleRef.current?.focus();
  }, [autoFocus]);

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
      className="rounded-2xl border border-amber-100 bg-white overflow-hidden"
    >
      <div className="flex items-center gap-2 px-4 py-2 border-b border-stone-200">
        <button
          onPointerDown={(e) => dragControls.start(e)}
          className="touch-none cursor-grab active:cursor-grabbing w-8 h-9 -ml-1.5 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors"
          aria-label={`질문 ${index + 1} 순서 변경`}
        >
          <GripVertical className="w-3.5 h-3.5" />
        </button>

        <span className="text-[10px] font-mono text-stone-500 tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className={cn("flex items-center gap-1 flex-1", accent)}>
          <Icon className="w-3 h-3 flex-shrink-0" />
          <span className="text-[10px] uppercase tracking-widest font-medium">
            {label}
          </span>
        </div>

        <button
          onClick={() => onRemove(question.id)}
          className="w-9 h-9 -mr-2 flex items-center justify-center text-stone-500 hover:text-red-600 transition-colors"
          aria-label={`질문 ${index + 1} 삭제`}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="px-4 pt-3.5 pb-3">
        <input
          ref={titleRef}
          type="text"
          value={question.title}
          onChange={(e) => onChange(question.id, { title: e.target.value })}
          placeholder="질문을 입력하세요"
          maxLength={QUESTION_TITLE_MAX}
          aria-label={`질문 ${index + 1} 내용`}
          className="w-full bg-transparent text-sm font-medium text-stone-900 placeholder:text-stone-500 outline-none leading-relaxed"
        />
      </div>

      {question.type === "balance" && (
        <div className="px-4 pb-4 grid grid-cols-2 gap-2">
          {(["optionA", "optionB"] as const).map((key, i) => (
            <input
              key={key}
              type="text"
              value={question[key] ?? ""}
              onChange={(e) => onChange(question.id, { [key]: e.target.value })}
              placeholder={`옵션 ${i + 1}`}
              maxLength={OPTION_MAX}
              aria-label={`질문 ${index + 1} 옵션 ${i + 1}`}
              className="min-h-11 px-3 rounded-xl border border-amber-100 bg-amber-50 text-xs text-stone-900 placeholder:text-stone-500 outline-none focus:border-amber-300 transition-colors"
            />
          ))}
        </div>
      )}

      {question.type === "multiple" && (
        <div className="px-4 pb-4 space-y-1.5">
          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-stone-300 flex-shrink-0" />
              <input
                type="text"
                value={opt}
                onChange={(e) => updateOption(i, e.target.value)}
                placeholder={`선택지 ${i + 1}`}
                maxLength={OPTION_MAX}
                aria-label={`질문 ${index + 1} 선택지 ${i + 1}`}
                className="flex-1 min-h-11 px-3 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 placeholder:text-stone-500 outline-none focus:border-stone-400 transition-colors"
              />
              {options.length > MIN_OPTIONS && (
                <button
                  onClick={() => removeOption(i)}
                  className="w-9 h-9 flex items-center justify-center text-stone-500 hover:text-red-600 transition-colors flex-shrink-0"
                  aria-label={`선택지 ${i + 1} 삭제`}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
          {options.length < MAX_OPTIONS && (
            <button
              onClick={addOption}
              className="text-[11px] text-stone-600 hover:text-amber-700 transition-colors pl-3.5 min-h-9"
            >
              + 선택지 추가
            </button>
          )}
        </div>
      )}

      {question.type === "subjective" && (
        <div className="px-4 pb-3">
          <p className="text-xs text-stone-500">참여자가 자유롭게 텍스트로 답변해요</p>
        </div>
      )}
    </Reorder.Item>
  );
}
