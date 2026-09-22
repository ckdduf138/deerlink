"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, Reorder, useReducedMotion } from "framer-motion";
import { ArrowLeft, Pencil, Scale, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Fawn } from "@/components/Fawn";
import { QUESTION_META } from "@/lib/question-meta";
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
import { PublishModal } from "@/components/create/publish-modal";
import { DiscardConfirmModal } from "@/components/create/discard-confirm-modal";
import type { PopularQuestion } from "@/data/popular-questions";

const MAX_QUESTIONS = 20;
const APPROACHING_LIMIT = 15;
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
  onStartOver,
}: {
  initialDraft: CreateDraft | null;
  /** "storage"만 "작성 중이던 내용을 불러왔어요" 배너를 띄운다 — 테마 선택은 복원이 아니다 */
  initialSource?: "storage" | "pack" | "question";
  /** "새로 쓰기"는 임시저장만 지우지 않고 테마 선택 화면으로도 되돌려야 한다 */
  onStartOver: () => void;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initialDraft?.title ?? "");
  const [questions, setQuestions] = useState<CreateDraftQuestion[]>(
    initialDraft?.questions ?? []
  );
  const [isPublic, setIsPublic] = useState(false);
  const [restored, setRestored] = useState(initialDraft !== null && initialSource === "storage");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSheet, setShowSheet] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [showFullEditor, setShowFullEditor] = useState(initialSource !== "pack");
  const [exampleIndex, setExampleIndex] = useState(0);
  const [focusId, setFocusId] = useState<string | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

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
    if (title.length > 0 || reduceMotion) return;
    const interval = setInterval(() => {
      setExampleIndex((prev) => (prev + 1) % TITLE_EXAMPLES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [reduceMotion, title]);

  // 질문 추가 시 스크롤은 여기서만 한다 — QuestionCard의 자동 포커스는
  // preventScroll로 브라우저 기본 스크롤을 죽여서 트리거가 겹치지 않게 한다.
  useEffect(() => {
    if (!focusId) return;
    const timer = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
    return () => clearTimeout(timer);
  }, [focusId]);

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

  const moveQuestion = useCallback((id: string, direction: -1 | 1) => {
    setQuestions((prev) => {
      const index = prev.findIndex((question) => question.id === id);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  }, []);

  const discardDraft = () => {
    setShowDiscardConfirm(false);
    setTitle("");
    setQuestions([]);
    setRestored(false);
    clearDraft(CREATE_DRAFT_KEY);
    onStartOver();
  };

  const missing = findMissing(title, questions);
  const isValid = missing === null;

  const openPublishModal = () => {
    if (!isValid || loading) return;
    setError(null);
    setShowPublishModal(true);
  };

  const handleSubmit = async () => {
    if (!isValid || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), questions, isPublic }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.error ?? "방을 만들지 못했어요. 잠시 후 다시 시도해주세요.");
        setLoading(false);
        return;
      }
      const room = await res.json();
      clearDraft(CREATE_DRAFT_KEY);
      router.push(`/room/${room.id}/share`);
    } catch {
      setError("네트워크 연결을 확인하고 다시 시도해주세요.");
      setLoading(false);
    }
  };

  if (!showFullEditor) {
    return (
      <div className="min-h-screen bg-page text-stone-900">
        <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-stone-200 bg-white/90 px-4 py-4 backdrop-blur-md md:px-8">
          <button
            type="button"
            onClick={discardDraft}
            className="flex min-h-11 min-w-11 items-center gap-2 text-sm text-stone-600 transition-colors hover:text-stone-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">테마 선택</span>
          </button>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold tracking-tight text-stone-900">
            <AntlerLogo className="h-[15px] w-3 text-amber-500" />
            Deerlink
          </span>
        </nav>

        <main className="mx-auto max-w-xl px-4 pb-16 pt-24">
          <div className="mb-8">
            <h1 className="text-3xl font-cute leading-tight text-stone-900">
              질문 {questions.length}개 준비됐어요
            </h1>
            <p className="mt-3 break-words text-base leading-relaxed text-stone-600">{title}</p>
          </div>

          <section aria-labelledby="prepared-questions-heading">
            <h2 id="prepared-questions-heading" className="sr-only">준비된 질문</h2>
            <ol className="surface divide-y divide-stone-100 px-5">
              {questions.map((question, index) => {
                const meta = QUESTION_META[question.type];
                const Icon = meta.icon;
                return (
                  <li key={question.id} className="flex items-start gap-3 py-4">
                    <span className="mt-0.5 w-5 flex-shrink-0 text-sm font-bold tabular-nums text-stone-500">
                      {index + 1}
                    </span>
                    <Icon className={cn("mt-0.5 h-4 w-4 flex-shrink-0", meta.accent)} aria-hidden="true" />
                    <span className="min-w-0 flex-1 line-clamp-2 break-words text-base font-semibold leading-relaxed text-stone-800">
                      {question.title}
                    </span>
                  </li>
                );
              })}
            </ol>
          </section>

          <div className="mt-7 space-y-2">
            <button
              type="button"
              onClick={openPublishModal}
              className="btn-primary w-full"
            >
              링크 만들기
            </button>
            <button
              type="button"
              onClick={() => setShowFullEditor(true)}
              className="btn-secondary w-full bg-white hover:bg-stone-50"
            >
              <Pencil className="h-4 w-4" />
              수정하기
            </button>
          </div>
        </main>

        <PublishModal
          open={showPublishModal}
          onClose={() => setShowPublishModal(false)}
          isPublic={isPublic}
          onPublicChange={setIsPublic}
          onConfirm={handleSubmit}
          loading={loading}
          error={error}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page text-stone-900">
      <nav className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-stone-100 bg-white/85 px-2 backdrop-blur-md sm:px-6">
        <Link
          href="/"
          aria-label="홈으로 돌아가기"
          className="pressable flex min-h-11 min-w-11 items-center gap-2 rounded-xl px-2 text-[15px] font-semibold text-stone-700 hover:text-stone-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden items-center gap-1.5 tracking-tight text-stone-900 sm:inline-flex">
            <AntlerLogo className="h-[15px] w-3 text-amber-500" />
            Deerlink
          </span>
        </Link>

        <button
          onClick={openPublishModal}
          disabled={!isValid}
          title={missing ?? undefined}
          className="btn-primary hidden min-h-10 rounded-xl px-4 text-[15px] md:inline-flex"
        >
          링크 만들기
        </button>
      </nav>

      <div className="mx-auto max-w-xl px-4 pb-44 pt-20 md:pb-24 md:pt-24">
        {restored && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, transform: "translateY(-6px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="mb-4 flex items-center justify-between gap-3 rounded-2xl bg-amber-50 py-1 pl-4 pr-2"
          >
            <p className="text-[15px] font-medium text-amber-900">작성 중이던 내용을 불러왔어요</p>
            <button
              onClick={() => setShowDiscardConfirm(true)}
              className="pressable min-h-11 flex-shrink-0 rounded-xl px-3 text-[15px] font-semibold text-amber-900 hover:bg-amber-100"
            >
              새로 쓰기
            </button>
          </motion.div>
        )}

        {/* 예시는 따로 한 줄을 두지 않고 placeholder가 돌아가며 보여준다. 글자 수는 한도에
            가까울 때만 라벨 줄 오른쪽에 뜬다. 아래 줄을 따로 두면 카드 밑이 비어 보였다. */}
        <div className="surface mb-3 px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-sm font-semibold text-stone-600">방 제목</h1>
            {title.length >= TITLE_MAX - 10 && (
              <span className="text-sm tabular-nums text-stone-500">
                {title.length}/{TITLE_MAX}
              </span>
            )}
          </div>
          <input
            id="room-title"
            ref={titleInputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={TITLE_EXAMPLES[exampleIndex]}
            maxLength={TITLE_MAX}
            aria-label="방 제목"
            className="input-lg mt-1 min-h-12 w-full bg-transparent text-[26px] font-bold tracking-tight text-stone-900 outline-none placeholder:text-stone-500"
          />
        </div>

        <div className="space-y-3">
          <Reorder.Group axis="y" values={questions} onReorder={setQuestions} className="space-y-3">
            <AnimatePresence>
              {questions.map((q, i) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  index={i}
                  autoFocus={focusId === q.id}
                  onChange={updateQuestion}
                  onRemove={removeQuestion}
                  onMove={moveQuestion}
                />
              ))}
            </AnimatePresence>
          </Reorder.Group>

          {title.trim().length === 0 && questions.length === 0 && (
            <div className="flex flex-col items-center pt-6 text-center">
              <Fawn mood="curious" className="h-24 w-24" />
              <p className="mt-2 text-[15px] text-stone-600">제목을 정하면 질문을 추가할 수 있어요</p>
            </div>
          )}

          {!atMax && title.trim().length > 0 && (
            <div className="pt-3">
              <p className="mb-2 px-1 text-[15px] font-semibold text-stone-700">
                {questions.length === 0 ? "첫 질문을 골라주세요" : "질문 추가"}
              </p>
              {/* 밸런스 게임이 이 제품의 주력이라 한 줄을 통째로 쓴다. 세 유형을 같은 크기로
                  두면 무엇을 먼저 만들지 고민하게 된다. */}
              <button
                onClick={() => addQuestion("balance")}
                className="pressable fawn-spots flex min-h-20 w-full items-center gap-3 rounded-[24px] bg-amber-100 px-5 text-left text-amber-950 hover:bg-amber-200"
              >
                <Scale className="h-6 w-6 flex-shrink-0 text-amber-800" aria-hidden="true" />
                <span className="text-lg font-bold">밸런스 게임</span>
                <span className="ml-auto text-sm font-semibold text-amber-800">A vs B</span>
              </button>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(["multiple", "subjective"] as const).map((type) => {
                  const { icon: Icon, label, accent } = QUESTION_META[type];
                  return (
                    <button
                      key={type}
                      onClick={() => addQuestion(type)}
                      className="pressable flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-white text-[15px] font-semibold text-stone-800 shadow-[inset_0_0_0_2px_#f1e4cf] hover:bg-[#fffaf2]"
                    >
                      <Icon className={cn("h-4 w-4", accent)} aria-hidden="true" />
                      {label}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setShowSheet(true)}
                className="pressable mt-2 flex min-h-12 w-full items-center justify-center gap-1.5 rounded-2xl text-[15px] font-semibold text-amber-900 hover:bg-amber-50"
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                인기 질문에서 가져오기
              </button>
            </div>
          )}

          {atMax && (
            <p className="text-center text-[15px] text-stone-500">
              질문은 최대 {MAX_QUESTIONS}개까지 넣을 수 있어요
            </p>
          )}

          {!atMax && questions.length >= APPROACHING_LIMIT && (
            <p className="text-center text-sm tabular-nums text-stone-500">
              질문 {questions.length}/{MAX_QUESTIONS}개
            </p>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <div className="bottom-dock md:hidden">
        <button onClick={openPublishModal} disabled={!isValid} className="btn-primary w-full">
          {isValid ? "링크 만들기" : missing ?? "링크 만들기"}
        </button>
      </div>

      <PopularQuestionsSheet
        open={showSheet}
        onClose={() => setShowSheet(false)}
        onSelect={addFromPopular}
      />

      <PublishModal
        open={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        isPublic={isPublic}
        onPublicChange={setIsPublic}
        onConfirm={handleSubmit}
        loading={loading}
        error={error}
      />

      <DiscardConfirmModal
        open={showDiscardConfirm}
        onClose={() => setShowDiscardConfirm(false)}
        onConfirm={discardDraft}
      />
    </div>
  );
}
