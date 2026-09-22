"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, ArrowLeft, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { QUESTION_META } from "@/lib/question-meta";
import { parseOptions, type LobbyRoom } from "@/lib/types";
import { Fawn } from "@/components/Fawn";

const SUBJECTIVE_MAX = 500;

/**
 * 고르면 잠깐 뒤 다음 질문으로 넘어간다.
 *
 * 예전엔 문항마다 "선택 -> 다음" 두 번을 눌러야 해서 20문항이면 40번이었다.
 * 선택이 화면에 반영되는 걸 보고 넘어가야 하니 즉시가 아니라 짧은 지연을 둔다.
 */
const AUTO_ADVANCE_MS = 380;

export interface SubmitResult {
  ok: boolean;
  message?: string;
}

export function AnswerMode({
  room,
  nickname,
  initialAnswers,
  initialQuestion,
  onAnswersChange,
  onComplete,
}: {
  room: LobbyRoom;
  nickname: string;
  initialAnswers: Record<string, string>;
  initialQuestion: number;
  onAnswersChange: (answers: Record<string, string>, currentQuestion: number) => void;
  onComplete: (answers: Record<string, string>) => Promise<SubmitResult>;
}) {
  const [currentQ, setCurrentQ] = useState(() =>
    Math.min(Math.max(initialQuestion, 0), Math.max(room.questions.length - 1, 0))
  );
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const advanceTimer = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();

  const cancelAdvance = useCallback(() => {
    if (advanceTimer.current !== null) {
      window.clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
  }, []);

  useEffect(() => cancelAdvance, [cancelAdvance]);

  useEffect(() => {
    onAnswersChange(answers, currentQ);
  }, [answers, currentQ, onAnswersChange]);

  const question = room.questions[currentQ];
  const parsedOptions = parseOptions(question?.options ?? null);
  const currentAnswer = answers[question?.id ?? ""];
  const answered = !!currentAnswer?.trim();
  const allAnswered = room.questions.every((q) => !!answers[q.id]?.trim());
  // 지금 보고 있는 문항은 빼고 센다. 그 문항만 남았으면 이동할 곳이 없다.
  const otherUnanswered = room.questions.flatMap((q, i) =>
    i !== currentQ && !answers[q.id]?.trim() ? [i] : []
  );
  const progress = ((currentQ + 1) / room.questions.length) * 100;
  const meta = QUESTION_META[question?.type ?? "balance"];
  const IconComponent = meta.icon;

  const selectAnswer = (value: string) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
    if (error) setError(null);
  };

  const isLastQuestion = currentQ >= room.questions.length - 1;

  /**
   * 객관식·밸런스처럼 한 번 누르면 끝나는 유형만 자동으로 넘어간다.
   * 마지막 문항에서는 넘어갈 곳이 없고(제출 버튼이 있다), 모션을 줄여달라고 한
   * 사용자에게는 예고 없는 화면 전환을 만들지 않는다.
   */
  const selectAndAdvance = (value: string) => {
    selectAnswer(value);
    cancelAdvance();
    if (reduceMotion || isLastQuestion) return;

    advanceTimer.current = window.setTimeout(() => {
      advanceTimer.current = null;
      setDirection(1);
      setCurrentQ((current) => Math.min(current + 1, room.questions.length - 1));
    }, AUTO_ADVANCE_MS);
  };

  const goTo = (index: number) => {
    // 자동 진행 대기 중에 직접 이동하면 예약된 이동은 버린다.
    cancelAdvance();
    setDirection(index > currentQ ? 1 : -1);
    setCurrentQ(index);
  };

  const handleSubmit = async () => {
    cancelAdvance();
    if (!allAnswered || submitting) return;
    setSubmitting(true);
    setError(null);
    const result = await onComplete(answers);
    // 실패해도 입력은 그대로 두고 다시 시도할 수 있어야 한다
    if (!result.ok) {
      setSubmitting(false);
      setError(result.message ?? "제출에 실패했어요. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <div className="mx-auto max-w-lg overflow-x-clip px-4 pb-40 pt-16 md:pb-20 md:pt-20">
      <div className="mb-6">
        <div className="mb-2.5 flex items-center justify-between px-1">
          <span className="font-cute text-lg tabular-nums text-stone-900">
            {currentQ + 1}
            <span className="font-medium text-stone-500"> / {room.questions.length}</span>
          </span>
          {nickname && <span className="text-sm font-medium text-stone-600">{nickname}</span>}
        </div>
        {/* 아기 사슴이 진행 막대 위에 겹쳐 앉아 채워진 끝을 따라간다.
            사슴이 막대 양 끝에서 잘리지 않게 레일을 사슴 반 폭(22px)씩 안쪽으로 줄였다.
            채움 끝과 사슴 중심이 몇 px 어긋나지만 사슴이 그 자리를 덮는다.
            예전 발굽 줄(DeerHoofMark)은 막대와 같은 정보를 한 줄 더 그릴 뿐이라 걷어냈다.
            "안 푼 질문으로 이동"은 마지막 문항의 버튼이 맡는다. */}
        <div className="relative flex h-11 items-center">
          <div
            className="h-3 w-full overflow-hidden rounded-full bg-[#f1e4cf]"
            role="progressbar"
            aria-valuenow={currentQ + 1}
            aria-valuemin={1}
            aria-valuemax={room.questions.length}
            aria-label="진행"
          >
            <div
              className="h-full origin-left rounded-full bg-brand transition-transform duration-300 ease-out-strong"
              style={{ transform: `scaleX(${progress / 100})` }}
            />
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-[22px] right-[22px]" aria-hidden="true">
            <div
              className="flex h-full w-full items-center justify-end transition-transform duration-300 ease-out-strong"
              style={{ transform: `translateX(${progress - 100}%)` }}
            >
              <Fawn
                mood={submitting ? "wow" : answered ? "happy" : "default"}
                className="h-11 w-11 flex-shrink-0 translate-x-1/2 -translate-y-1.5 drop-shadow-[0_2px_2px_rgb(150_95_30/0.25)]"
              />
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait" custom={direction} initial={false}>
        <motion.div
          key={currentQ}
          custom={direction}
          initial={reduceMotion ? false : { opacity: 0, transform: `translateX(${direction * 20}px)` }}
          animate={{ opacity: 1, transform: "translateX(0px)" }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: `translateX(${direction * -20}px)` }}
          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="mb-6 px-1">
            <div className={cn("mb-2.5 flex items-center gap-1.5", meta.accent)}>
              <IconComponent className="h-4 w-4" aria-hidden="true" />
              <span className="text-sm font-semibold">{meta.longLabel}</span>
            </div>
            <h1 className="break-keep text-2xl font-bold leading-snug tracking-tight text-stone-900 sm:text-[26px]">
              {question?.title}
            </h1>
          </div>

          {question?.type === "balance" && (
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: question.optionA ?? "", value: "A" as const, tone: "amber" as const },
                { label: question.optionB ?? "", value: "B" as const, tone: "teal" as const },
              ].map((opt) => {
                const isSelected = currentAnswer === opt.value;
                const otherSelected = !!currentAnswer && !isSelected;
                return (
                  <button
                    key={opt.value}
                    onClick={() => selectAndAdvance(opt.value)}
                    aria-pressed={isSelected}
                    className={cn(
                      "pressable fawn-spots relative flex min-h-48 flex-col items-start justify-between rounded-[28px] p-5 text-left sm:min-h-56",
                      "transition-[transform,background-color,opacity] duration-200",
                      otherSelected && "opacity-50",
                      opt.tone === "amber"
                        ? isSelected
                          ? "bg-brand text-brand-ink"
                          : "bg-amber-100 text-amber-950 hover:bg-amber-200"
                        : isSelected
                          ? "bg-teal-500 text-brand-ink"
                          : "bg-teal-100 text-teal-950 hover:bg-teal-200"
                    )}
                  >
                    <span className="flex w-full items-center justify-between">
                      <span className="font-cute text-lg opacity-70">{opt.value}</span>
                      {isSelected && (
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-ink/90 text-white">
                          <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
                        </span>
                      )}
                    </span>
                    <span className="break-keep text-xl font-bold leading-snug">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {question?.type === "multiple" && (
            <div className="space-y-2">
              {parsedOptions.map((opt, i) => {
                const isSelected = currentAnswer === String(i);
                return (
                  <button
                    key={i}
                    onClick={() => selectAndAdvance(String(i))}
                    aria-pressed={isSelected}
                    className={cn(
                      "pressable flex min-h-16 w-full items-center gap-3 rounded-[22px] px-5 py-4 text-left text-[17px] font-semibold ring-2",
                      isSelected
                        ? "bg-amber-50 text-amber-950 ring-brand"
                        : "bg-white text-stone-800 ring-transparent hover:bg-stone-50"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-150",
                        isSelected ? "bg-brand text-brand-ink" : "bg-stone-100"
                      )}
                    >
                      {isSelected && <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />}
                    </span>
                    <span className="min-w-0 break-words">{opt}</span>
                  </button>
                );
              })}
            </div>
          )}

          {question?.type === "subjective" && (
            <div>
              <textarea
                value={currentAnswer ?? ""}
                onChange={(e) => selectAnswer(e.target.value)}
                placeholder="자유롭게 답변하세요"
                rows={5}
                maxLength={SUBJECTIVE_MAX}
                aria-label={question.title}
                className="w-full resize-none rounded-2xl bg-white px-5 py-4 text-stone-900 outline-none ring-2 ring-transparent transition-shadow placeholder:text-stone-500 focus:ring-amber-400 leading-relaxed"
              />
              <p className="mt-2 px-1 text-right text-sm tabular-nums text-stone-500">
                {(currentAnswer ?? "").length}/{SUBJECTIVE_MAX}
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {error && (
        <div role="alert" className="mt-6 flex items-start gap-2 rounded-2xl bg-red-50 px-4 py-3">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" aria-hidden="true" />
          <div className="text-sm leading-relaxed text-red-700">
            <p className="font-semibold">{error}</p>
            <p className="mt-0.5">적어둔 답변은 그대로 있어요. 다시 제출을 눌러주세요.</p>
          </div>
        </div>
      )}

      <div className="bottom-dock">
        <div className="mx-auto max-w-lg">
          {isLastQuestion && otherUnanswered.length > 0 && (
            <button
              type="button"
              onClick={() => goTo(otherUnanswered[0])}
              className="pressable mb-2 flex min-h-11 w-full items-center justify-center rounded-full text-[15px] font-semibold text-amber-900 hover:bg-amber-50"
            >
              남은 질문 {otherUnanswered.length}개 답하러 가기
            </button>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => goTo(Math.max(currentQ - 1, 0))}
              disabled={currentQ === 0}
              aria-label="이전 질문"
              className="btn-secondary w-14 flex-shrink-0 bg-white px-0 hover:bg-stone-50 disabled:bg-white disabled:opacity-60"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            </button>

            {!isLastQuestion ? (
              <button onClick={() => goTo(currentQ + 1)} disabled={!answered} className="btn-primary flex-1">
                {answered ? "다음" : question?.type === "subjective" ? "답을 적어주세요" : "하나를 골라주세요"}
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={!allAnswered || submitting} className="btn-primary flex-1">
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    제출 중
                  </>
                ) : error ? (
                  "다시 제출"
                ) : (
                  "제출하고 결과 보기"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
