"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, Reorder, useDragControls } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Trash2,
  Scale,
  ListChecks,
  PenLine,
  GripVertical,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/* ─── Types ─────────────────────────────────────── */

type QuestionType = "balance" | "multiple" | "subjective";

interface Question {
  id: string;
  type: QuestionType;
  title: string;
  optionA?: string;
  optionB?: string;
  options?: string[];
}

/* ─── Config ─────────────────────────────────────── */

const TYPE_CONFIG = {
  balance: {
    icon: Scale,
    label: "밸런스",
    color: "text-violet-400",
  },
  multiple: {
    icon: ListChecks,
    label: "객관식",
    color: "text-sky-400",
  },
  subjective: {
    icon: PenLine,
    label: "주관식",
    color: "text-zinc-400",
  },
} as const;

const MAX_QUESTIONS = 20;

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

/* ─── Question Card ─────────────────────────────── */

interface QuestionCardProps {
  question: Question;
  index: number;
  onChange: (id: string, updates: Partial<Question>) => void;
  onRemove: (id: string) => void;
}

function QuestionCard({ question, index, onChange, onRemove }: QuestionCardProps) {
  const { icon: Icon, label, color } = TYPE_CONFIG[question.type];
  const dragControls = useDragControls();

  const addOption = () => {
    if ((question.options?.length ?? 0) < 5) {
      onChange(question.id, { options: [...(question.options ?? []), ""] });
    }
  };

  const updateOption = (i: number, value: string) => {
    onChange(question.id, {
      options: question.options?.map((o, idx) => (idx === i ? value : o)),
    });
  };

  const removeOption = (i: number) => {
    if ((question.options?.length ?? 0) > 2) {
      onChange(question.id, {
        options: question.options?.filter((_, idx) => idx !== i),
      });
    }
  };

  return (
    <Reorder.Item
      value={question}
      dragListener={false}
      dragControls={dragControls}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-white/7 bg-[#111114] overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
        {/* Drag handle */}
        <button
          onPointerDown={(e) => dragControls.start(e)}
          className="touch-none cursor-grab active:cursor-grabbing p-0.5 text-zinc-800 hover:text-zinc-600 transition-colors"
          aria-label="드래그하여 순서 변경"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </button>

        <span className="text-[10px] font-mono text-zinc-700 tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className={cn("flex items-center gap-1 flex-1", color)}>
          <Icon className="w-3 h-3 flex-shrink-0" />
          <span className="text-[10px] uppercase tracking-widest font-medium">
            {label}
          </span>
        </div>

        <button
          onClick={() => onRemove(question.id)}
          className="w-7 h-7 flex items-center justify-center text-zinc-800 hover:text-red-400 transition-colors"
          aria-label="질문 삭제"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Question title */}
      <div className="px-4 pt-3.5 pb-3">
        <input
          type="text"
          value={question.title}
          onChange={(e) => onChange(question.id, { title: e.target.value })}
          placeholder={
            question.type === "balance"
              ? "치킨 vs 피자, 뭐 먹을래?"
              : question.type === "multiple"
              ? "요즘 주로 어디서 시간 보내?"
              : "요즘 가장 큰 고민이 뭐야?"
          }
          maxLength={80}
          className="w-full bg-transparent text-sm font-medium text-white placeholder:text-zinc-700 outline-none leading-relaxed"
        />
      </div>

      {/* Balance game */}
      {question.type === "balance" && (
        <div className="px-4 pb-4 grid grid-cols-2 gap-2">
          <input
            type="text"
            value={question.optionA ?? ""}
            onChange={(e) => onChange(question.id, { optionA: e.target.value })}
            placeholder="치킨"
            maxLength={30}
            className="py-2.5 px-3 rounded-xl border border-white/8 bg-white/3 text-xs text-white placeholder:text-zinc-700 outline-none focus:border-violet-500/40 transition-colors"
          />
          <input
            type="text"
            value={question.optionB ?? ""}
            onChange={(e) => onChange(question.id, { optionB: e.target.value })}
            placeholder="피자"
            maxLength={30}
            className="py-2.5 px-3 rounded-xl border border-white/8 bg-white/3 text-xs text-white placeholder:text-zinc-700 outline-none focus:border-violet-500/40 transition-colors"
          />
        </div>
      )}

      {/* Multiple choice */}
      {question.type === "multiple" && (
        <div className="px-4 pb-4 space-y-1.5">
          {question.options?.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 flex-shrink-0" />
              <input
                type="text"
                value={opt}
                onChange={(e) => updateOption(i, e.target.value)}
                placeholder={`선택지 ${i + 1}`}
                maxLength={30}
                className="flex-1 py-2 px-3 rounded-xl border border-white/8 bg-white/3 text-xs text-white placeholder:text-zinc-700 outline-none focus:border-sky-500/30 transition-colors"
              />
              {(question.options?.length ?? 0) > 2 && (
                <button
                  onClick={() => removeOption(i)}
                  className="text-zinc-800 hover:text-red-400 transition-colors flex-shrink-0 p-1"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
          {(question.options?.length ?? 0) < 5 && (
            <button
              onClick={addOption}
              className="text-[11px] text-zinc-700 hover:text-zinc-400 transition-colors pl-3.5 py-1"
            >
              + 선택지 추가
            </button>
          )}
        </div>
      )}

      {/* Subjective */}
      {question.type === "subjective" && (
        <div className="px-4 pb-3">
          <p className="text-xs text-zinc-700">자유롭게 텍스트로 답변</p>
        </div>
      )}
    </Reorder.Item>
  );
}

/* ─── Page ───────────────────────────────────────── */

export default function CreateRoomPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 100);
    }
  }, [questions.length]);

  const addQuestion = (type: QuestionType) => {
    const q: Question = {
      id: generateId(),
      type,
      title: "",
      ...(type === "balance" ? { optionA: "", optionB: "" } : {}),
      ...(type === "multiple" ? { options: ["", ""] } : {}),
    };
    setQuestions((prev) => [...prev, q]);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
  };

  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const isValid =
    title.trim().length > 0 &&
    questions.length > 0 &&
    questions.every((q) => {
      if (!q.title.trim()) return false;
      if (q.type === "balance") return q.optionA?.trim() && q.optionB?.trim();
      if (q.type === "multiple")
        return q.options?.every((o) => o.trim()) && (q.options?.length ?? 0) >= 2;
      return true;
    });

  const handleSubmit = async () => {
    if (!isValid || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), questions }),
      });
      if (!res.ok) throw new Error();
      const room = await res.json();
      router.push(`/room/${room.id}`);
    } catch {
      setLoading(false);
    }
  };

  const atMax = questions.length >= MAX_QUESTIONS;

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 py-4 border-b border-white/5 bg-[#09090b]/90 backdrop-blur-md">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline text-sm font-semibold text-white tracking-tight">
            LinkMatch
          </span>
        </Link>

        {/* Desktop submit */}
        <button
          onClick={handleSubmit}
          disabled={!isValid || loading}
          className={cn(
            "hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
            isValid && !loading
              ? "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/30 hover:-translate-y-0.5"
              : "bg-white/5 text-zinc-600 cursor-not-allowed"
          )}
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <>
              링크 만들기
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </nav>

      {/* Content */}
      <div className="max-w-xl mx-auto px-4 pt-24 pb-40 md:pb-20">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs text-zinc-600 mb-1">질문 만들고 링크 공유하면 끝</p>
          <input
            ref={titleInputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="오늘 점심 뭐 먹을까?"
            maxLength={50}
            className="w-full text-2xl font-bold bg-transparent text-white placeholder:text-zinc-800 outline-none border-b border-white/8 focus:border-violet-500/30 pb-3 transition-colors"
          />
        </div>

        {/* Question list */}
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
                  onChange={updateQuestion}
                  onRemove={removeQuestion}
                />
              ))}
            </AnimatePresence>
          </Reorder.Group>

          {/* Add question buttons */}
          <AnimatePresence>
            {!atMax && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-3 gap-2"
              >
                {(["balance", "multiple", "subjective"] as QuestionType[]).map((type) => {
                  const { icon: Icon, label } = TYPE_CONFIG[type];
                  return (
                    <motion.button
                      key={type}
                      onClick={() => addQuestion(type)}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center justify-center gap-1.5 py-3 rounded-xl border border-dashed border-white/8 hover:border-violet-500/25 text-zinc-600 hover:text-violet-400 text-xs transition-all duration-150"
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {questions.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-xs text-zinc-800 pt-2"
            >
              질문 하나면 충분해요
            </motion.p>
          )}


          <div ref={bottomRef} />
        </div>
      </div>

      {/* Mobile sticky bar */}
      <div className="fixed bottom-0 inset-x-0 md:hidden z-40">
        <div className="bg-gradient-to-t from-[#09090b] via-[#09090b]/95 to-transparent pt-8 pb-8 px-4">
          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className={cn(
              "w-full py-4 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2",
              isValid && !loading
                ? "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/40"
                : "bg-white/5 text-zinc-600"
            )}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                링크 만들기
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
          {questions.length > 0 && !isValid && (
            <p className="text-center text-[11px] text-zinc-700 mt-2">
              선택지까지 입력해주세요
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
