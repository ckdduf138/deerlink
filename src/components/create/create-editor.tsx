"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { AlertCircle, ArrowLeft, ArrowRight, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { QUESTION_META, QUESTION_TYPES } from "@/lib/question-meta";
import {
  CREATE_DRAFT_KEY,
  clearDraft,
  saveDraft,
  type CreateDraft,
  type CreateDraftQuestion,
} from "@/lib/draft-storage";
import type { QuestionType } from "@/lib/types";
import { AntlerLogo } from "@/components/landing/AntlerLogo";
import { PopularQuestionsSheet } from "@/components/PopularQuestionsSheet";
import { QuestionCard, MIN_OPTIONS } from "@/components/create/question-card";
import type { PopularQuestion } from "@/data/popular-questions";

const MAX_QUESTIONS = 20;
const TITLE_MAX = 50;

const TITLE_EXAMPLES = [
  "우리 팀 워크샵 의견 모으기",
  "칼퇴 vs 야근, 친구들 생각은?",
  "다음 회식 메뉴 정하기",
  "친구들 가치관 비교해보기",
  "이번 휴가 어디로 갈까?",
  "MT 단체게임 - 누가 가장 비슷할까",
];

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

/** 버튼을 회색으로 만들기만 하면 뭐가 빠졌는지 알 수 없다 */
function findMissing(title: string, questions: CreateDraftQuestion[]): string | null {
  if (!title.trim()) return "제목을 입력해주세요";
  if (questions.length === 0) return "질문을 하나 이상 추가해주세요";

  for (const [i, q] of questions.entries()) {
    const label = `${i + 1}번 질문`;
    if (!q.title.trim()) return `${label} 내용을 입력해주세요`;
    if (q.type === "balance" && !(q.optionA?.trim() && q.optionB?.trim())) {
      return `${label}의 두 옵션을 모두 채워주세요`;
    }
    if (q.type === "multiple") {
      const options = q.options ?? [];
      if (options.length < MIN_OPTIONS || options.some((o) => !o.trim())) {
        return `${label}의 선택지를 모두 채워주세요`;
      }
    }
  }
  return null;
}

export function CreateEditor({
  initialDraft,
  initialSource = "storage",
}: {
  initialDraft: CreateDraft | null;
  /** "storage"만 "작성 중이던 내용을 불러왔어요" 배너를 띄운다 — 팩 선택은 복원이 아니다 */
  initialSource?: "storage" | "pack";
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initialDraft?.title ?? "");
  const [questions, setQuestions] = useState<CreateDraftQuestion[]>(
    initialDraft?.questions ?? []
  );
  const [restored, setRestored] = useState(initialDraft !== null && initialSource === "storage");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSheet, setShowSheet] = useState(false);
  const [exampleIndex, setExampleIndex] = useState(0);
  const [focusId, setFocusId] = useState<string | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialDraft === null) titleInputRef.current?.focus();
  }, [initialDraft]);

  useEffect(() => {
    if (!title && questions.length === 0) {
      clearDraft(CREATE_DRAFT_KEY);
      return;
    }
    saveDraft<CreateDraft>(CREATE_DRAFT_KEY, { title, questions });
  }, [title, questions]);

  useEffect(() => {
    if (title.length > 0) return;
    const interval = setInterval(() => {
      setExampleIndex((prev) => (prev + 1) % TITLE_EXAMPLES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [title]);

  useEffect(() => {
    if (questions.length === 0) return;
    const timer = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
    return () => clearTimeout(timer);
  }, [questions.length]);

  const atMax = questions.length >= MAX_QUESTIONS;

  const addQuestion = (type: QuestionType) => {
    const q: CreateDraftQuestion = {
      id: generateId(),
      type,
      title: "",
      ...(type === "balance" ? { optionA: "", optionB: "" } : {}),
      ...(type === "multiple" ? { options: ["", ""] } : {}),
    };
    setQuestions((prev) => [...prev, q]);
    setFocusId(q.id);
  };

  const addFromPopular = (pq: PopularQuestion) => {
    if (atMax) return;
    setQuestions((prev) => [
      ...prev,
      {
        id: generateId(),
        type: pq.type,
        title: pq.title,
        ...(pq.type === "balance"
          ? { optionA: pq.optionA ?? "", optionB: pq.optionB ?? "" }
          : {}),
        ...(pq.type === "multiple" ? { options: pq.options ?? ["", ""] } : {}),
      },
    ]);
    setShowSheet(false);
  };

  const updateQuestion = useCallback(
    (id: string, updates: Partial<CreateDraftQuestion>) => {
      setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...updates } : q)));
    },
    []
  );

  const removeQuestion = useCallback((id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }, []);

  const discardDraft = () => {
    setTitle("");
    setQuestions([]);
    setRestored(false);
    clearDraft(CREATE_DRAFT_KEY);
    titleInputRef.current?.focus();
  };

  const missing = findMissing(title, questions);
  const isValid = missing === null;

  const handleSubmit = async () => {
    if (!isValid || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), questions }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.error ?? "방을 만들지 못했어요. 잠시 후 다시 시도해주세요.");
        setLoading(false);
        return;
      }
      const room = await res.json();
      clearDraft(CREATE_DRAFT_KEY);
      router.push(`/room/${room.id}`);
    } catch {
      setError("네트워크 연결을 확인하고 다시 시도해주세요.");
      setLoading(false);
    }
  };

  const submitLabel = loading ? "만드는 중" : error ? "다시 시도" : "링크 만들기";

  return (
    <div className="min-h-screen bg-[#fafaf8] text-stone-900">
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 md:px-8 py-4 border-b border-amber-100 bg-white/90 backdrop-blur-md">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-stone-900 tracking-tight">
            <AntlerLogo className="w-3 h-[15px] text-amber-500" />
            Deerlink
          </span>
        </Link>

        <button
          onClick={handleSubmit}
          disabled={!isValid || loading}
          title={missing ?? undefined}
          className={cn(
            "hidden md:flex items-center gap-1.5 px-4 min-h-10 rounded-xl text-sm font-medium transition-colors duration-200",
            isValid && !loading
              ? "bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-900/30"
              : "bg-stone-100 text-stone-400 cursor-not-allowed"
          )}
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <>
              {submitLabel}
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </nav>

      <div className="max-w-xl mx-auto px-4 pt-24 pb-40 md:pb-20">
        {restored && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3"
          >
            <p className="text-xs text-amber-900">작성 중이던 내용을 불러왔어요.</p>
            <button
              onClick={discardDraft}
              className="text-xs text-amber-800 underline underline-offset-2 hover:text-amber-900 transition-colors flex-shrink-0"
            >
              새로 쓰기
            </button>
          </motion.div>
        )}

        <div className="mb-8">
          <p className="text-xs text-stone-500 mb-1">질문 만들고 공유해요</p>
          <input
            ref={titleInputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            maxLength={TITLE_MAX}
            aria-label="방 제목"
            className="w-full text-2xl font-bold bg-transparent text-stone-900 placeholder:text-stone-500 outline-none border-b border-amber-100 focus:border-amber-300 pb-3 transition-colors"
          />
          <div className="flex items-start justify-between gap-3 mt-2.5">
            <AnimatePresence mode="wait">
              {title.length === 0 && (
                <motion.p
                  key={exampleIndex}
                  initial={{ opacity: 0, y: -3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 3 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="text-[11px] text-stone-500 tracking-wide"
                >
                  <span className="text-stone-400">예시 · </span>
                  {TITLE_EXAMPLES[exampleIndex]}
                </motion.p>
              )}
            </AnimatePresence>
            {title.length > 0 && (
              <span className="ml-auto text-[11px] text-stone-400 font-mono tabular-nums">
                {title.length}/{TITLE_MAX}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <Reorder.Group
            axis="y"
            values={questions}
            onReorder={setQuestions}
            className="space-y-3"
          >
            <AnimatePresence>
              {questions.map((q, i) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  index={i}
                  autoFocus={focusId === q.id}
                  onChange={updateQuestion}
                  onRemove={removeQuestion}
                />
              ))}
            </AnimatePresence>
          </Reorder.Group>

          {title.trim().length === 0 && questions.length === 0 && (
            <p className="pt-4 text-center text-xs text-stone-500">
              제목을 정하면 질문을 추가할 수 있어요
            </p>
          )}

          <AnimatePresence>
            {!atMax && title.trim().length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-3 gap-2"
              >
                {QUESTION_TYPES.map((type) => {
                  const { icon: Icon, label } = QUESTION_META[type];
                  return (
                    <motion.button
                      key={type}
                      onClick={() => addQuestion(type)}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center justify-center gap-1.5 min-h-11 rounded-xl border border-dashed border-stone-300 hover:border-amber-400 text-stone-600 hover:text-amber-700 text-xs transition-colors duration-150"
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {atMax && (
            <p className="text-center text-[11px] text-stone-500">
              질문은 최대 {MAX_QUESTIONS}개까지 넣을 수 있어요
            </p>
          )}

          <AnimatePresence>
            {!atMax && title.trim().length > 0 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowSheet(true)}
                className="w-full flex items-center justify-center gap-1.5 min-h-11 text-xs text-stone-600 hover:text-amber-700 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                인기 질문에서 가져오기
              </motion.button>
            )}
          </AnimatePresence>

          {title.trim().length > 0 && questions.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative flex flex-col items-center justify-center py-12 gap-4"
            >
              <Sparkles className="w-8 h-8 text-amber-300" />
              <p className="text-center text-xs text-stone-600">
                질문 하나면 충분해요
              </p>
            </motion.div>
          )}

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
            >
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 leading-relaxed">
                {error}
                <br />
                <span className="text-red-600">
                  작성한 내용은 저장돼 있으니 그대로 다시 시도하면 돼요.
                </span>
              </p>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 md:hidden z-40">
        <div className="bg-gradient-to-t from-[#fafaf8] via-[#fafaf8]/95 to-transparent pt-8 px-4 pb-safe">
          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className={cn(
              "w-full min-h-12 rounded-xl text-sm font-semibold transition-colors duration-200 flex items-center justify-center gap-2",
              isValid && !loading
                ? "bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-900/40"
                : "bg-stone-100 text-stone-400"
            )}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                {submitLabel}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
          {missing && (
            <p className="text-center text-[11px] text-stone-500 mt-2">{missing}</p>
          )}
        </div>
      </div>

      <PopularQuestionsSheet
        open={showSheet}
        onClose={() => setShowSheet(false)}
        onSelect={addFromPopular}
      />
    </div>
  );
}
