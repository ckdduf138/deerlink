"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Scale,
  ListChecks,
  PenLine,
  Users,
  Copy,
  Check,
  Share2,
  Sparkles,
  Download,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AntlerLogo } from "@/components/landing/AntlerLogo";
import { DeerHoofMark } from "@/components/DeerHoofMark";
import { ShareCard } from "./share-card";

/* ─── Types ─────────────────────────────── */

interface Answer {
  id: string;
  questionId: string;
  value: string;
}

interface Participant {
  id: string;
  nickname: string;
  answers: Answer[];
}

interface Question {
  id: string;
  type: "balance" | "multiple" | "subjective";
  title: string;
  optionA: string | null;
  optionB: string | null;
  options: string | null;
  order: number;
}

interface Room {
  id: string;
  title: string;
  expiresAt: string;
  questions: Question[];
  participants: Participant[];
}

function formatRemaining(expiresAt: string): string {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "만료";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
}

/* ─── Balance Result ─────────────────────── */

function BalanceResult({
  question,
  participants,
  index,
}: {
  question: Question;
  participants: Participant[];
  index: number;
}) {
  const answers = participants
    .map((p) => ({
      id: p.id,
      nickname: p.nickname,
      value: p.answers.find((a) => a.questionId === question.id)?.value,
    }))
    .filter((a) => a.value != null);

  const countA = answers.filter((a) => a.value === "A").length;
  const countB = answers.filter((a) => a.value === "B").length;
  const total = countA + countB;
  const pctA = total ? Math.round((countA / total) * 100) : 0;
  const pctB = total ? 100 - pctA : 0;

  return (
    <div>
      {/* Option labels */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="py-2.5 px-3.5 rounded-xl bg-amber-50 border border-amber-100 text-center">
          <span className="text-[10px] text-amber-600 font-mono block mb-0.5">A</span>
          <span className="text-xs font-medium text-amber-900">{question.optionA}</span>
        </div>
        <div className="py-2.5 px-3.5 rounded-xl bg-teal-50 border border-teal-100 text-center">
          <span className="text-[10px] text-teal-600 font-mono block mb-0.5">B</span>
          <span className="text-xs font-medium text-teal-900">{question.optionB}</span>
        </div>
      </div>

      {/* Split bar */}
      {total > 0 && (
        <div className="mb-4">
          <div className="flex h-3 rounded-full overflow-hidden bg-stone-100 gap-0.5">
            {pctA > 0 && (
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${pctA}%` }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 + 0.2, duration: 0.55, ease: "easeOut" }}
                className="h-full bg-amber-500 rounded-l-full"
              />
            )}
            {pctB > 0 && (
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${pctB}%` }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 + 0.2, duration: 0.55, ease: "easeOut" }}
                className="h-full bg-teal-500 rounded-r-full"
              />
            )}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-stone-600 font-mono tabular-nums">
              {countA}명 · <span className="font-semibold text-amber-600">{pctA}%</span>
            </span>
            <span className="text-xs text-stone-600 font-mono tabular-nums">
              <span className="font-semibold text-teal-600">{pctB}%</span> · {countB}명
            </span>
          </div>
        </div>
      )}

      {/* Individual answers */}
      <div className="space-y-1.5">
        {answers.map((a, i) => {
          const isA = a.value === "A";
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 + 0.3, duration: 0.3 }}
              className="flex items-center justify-between py-1"
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold",
                    isA
                      ? "bg-amber-100 text-amber-700"
                      : "bg-teal-100 text-teal-700"
                  )}
                >
                  {a.nickname[0].toUpperCase()}
                </div>
                <span className="text-xs text-stone-700">{a.nickname}</span>
              </div>
              <span
                className={cn(
                  "text-[11px] px-2 py-0.5 rounded-md border font-medium",
                  isA
                    ? "bg-amber-50 border-amber-100 text-amber-900"
                    : "bg-teal-50 border-teal-100 text-teal-900"
                )}
              >
                {isA ? question.optionA : question.optionB}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Majority note */}
      {total >= 2 && (countA !== countB) && (
        <p className="mt-3 text-xs text-stone-600">
          <span className="font-medium text-stone-700">
            {countA > countB ? countA : countB}명
          </span>
          {" "}이{" "}
          <span className="font-medium text-stone-700">
            &ldquo;{countA > countB ? question.optionA : question.optionB}&rdquo;
          </span>
          를 선택했어요
        </p>
      )}
      {total >= 2 && countA === countB && (
        <p className="mt-3 text-xs text-stone-600">정확히 <span className="font-medium text-stone-700">반반</span>이에요</p>
      )}
    </div>
  );
}

/* ─── Multiple Choice Result ─────────────── */

function MultipleResult({
  question,
  participants,
  index,
}: {
  question: Question;
  participants: Participant[];
  index: number;
}) {
  const options: string[] = question.options ? JSON.parse(question.options) : [];
  const answers = participants
    .map((p) => ({
      id: p.id,
      nickname: p.nickname,
      value: p.answers.find((a) => a.questionId === question.id)?.value,
    }))
    .filter((a) => a.value != null);
  const total = answers.length;

  const optionCounts = options.map((_, i) => answers.filter((a) => a.value === String(i)).length);
  const maxCount = Math.max(...optionCounts, 0);

  return (
    <div className="space-y-3">
      {options.map((opt, i) => {
        const count = optionCounts[i];
        const voters = answers.filter((a) => a.value === String(i));
        const pct = total ? Math.round((count / total) * 100) : 0;
        const isTop = count > 0 && count === maxCount;

        return (
          <div key={i}>
            <div className="flex items-center justify-between mb-1.5">
              <span className={cn("text-xs", isTop ? "text-stone-900 font-medium" : "text-stone-600")}>
                {opt}
              </span>
              <span className="text-[11px] text-stone-600 font-mono tabular-nums">
                {count}명 · {pct}%
              </span>
            </div>
            <div className="h-2 bg-stone-100 rounded-full overflow-hidden mb-2">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 + i * 0.08 + 0.2, duration: 0.5, ease: "easeOut" }}
                className={cn(
                  "h-full rounded-full",
                  isTop ? "bg-amber-500" : "bg-stone-300"
                )}
              />
            </div>
            {voters.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {voters.map((v) => (
                  <motion.span
                    key={v.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.2 }}
                    className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-50 text-stone-700 border border-amber-100"
                  >
                    {v.nickname}
                  </motion.span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Subjective Result ──────────────────── */

function SubjectiveResult({
  question,
  participants,
}: {
  question: Question;
  participants: Participant[];
}) {
  const answers = participants
    .map((p) => ({
      id: p.id,
      nickname: p.nickname,
      value: p.answers.find((a) => a.questionId === question.id)?.value,
    }))
    .filter((a) => a.value);

  if (answers.length === 0) {
    return <p className="text-xs text-stone-600">아직 답변이 없습니다</p>;
  }

  return (
    <div className="space-y-2">
      {answers.map((a, i) => (
        <motion.div
          key={a.id}
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, duration: 0.3 }}
          className="rounded-xl border border-amber-100 bg-amber-50 p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 rounded-full bg-amber-100 flex items-center justify-center text-[9px] font-bold text-amber-700">
              {a.nickname![0].toUpperCase()}
            </div>
            <span className="text-[11px] text-stone-700">{a.nickname}</span>
          </div>
          <p className="text-sm text-stone-700 leading-relaxed">{a.value}</p>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Main ───────────────────────────────── */

const TYPE_LABEL = {
  balance: "밸런스 게임",
  multiple: "객관식",
  subjective: "주관식",
};

const TYPE_ICON = {
  balance: Scale,
  multiple: ListChecks,
  subjective: PenLine,
};

export function ResultsClient({ room }: { room: Room }) {
  const [copied, setCopied] = useState(false);
  const [imageBusy, setImageBusy] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);

  const unanimousCount = room.questions.filter((q) => {
    if (q.type === "subjective") return false;
    const values = room.participants
      .flatMap((p) => p.answers.filter((a) => a.questionId === q.id))
      .map((a) => a.value);
    if (values.length < 2) return false;
    return new Set(values).size === 1;
  }).length;

  const copyInviteLink = async () => {
    const url = window.location.href.replace("/results", "");
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareInviteLink = async () => {
    const url = window.location.href.replace("/results", "");
    const text = `${room.title} — Deerlink에서 같이 답해봐요`;
    if (navigator.share) {
      await navigator.share({ title: room.title, text, url });
    } else {
      copyInviteLink();
    }
  };

  const generateImage = async (): Promise<File | null> => {
    if (!shareCardRef.current) return null;
    const { toPng } = await import("html-to-image");
    const dataUrl = await toPng(shareCardRef.current, {
      pixelRatio: 2,
      cacheBust: true,
    });
    const blob = await (await fetch(dataUrl)).blob();
    return new File([blob], `deerlink-${room.id}.png`, { type: "image/png" });
  };

  const shareResultImage = async () => {
    if (imageBusy) return;
    setImageBusy(true);
    try {
      const file = await generateImage();
      if (!file) return;
      const url = window.location.href.replace("/results", "");
      const text = `${room.title} — 우리 답 비교해봤어요`;
      if (
        navigator.canShare &&
        navigator.canShare({ files: [file] }) &&
        navigator.share
      ) {
        await navigator.share({ files: [file], title: room.title, text, url });
      } else {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(file);
        link.download = file.name;
        link.click();
        URL.revokeObjectURL(link.href);
      }
    } catch {
      // 사용자가 시스템 공유 시트를 닫은 경우 무시
    } finally {
      setImageBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] text-stone-900">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center px-4 md:px-8 py-4 border-b border-amber-100 bg-white/90 backdrop-blur-md">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Deerlink</span>
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-4 pt-20 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-3">
            <AntlerLogo
              animated
              className="w-3 h-[15px] text-amber-500"
            />
            <div className="text-[10px] uppercase tracking-widest text-stone-600">
              결과 비교
            </div>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 mb-2 leading-snug">
            {room.title}
          </h1>
          <div className="flex items-center gap-3 text-xs text-stone-600 flex-wrap">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {room.participants.length}명 참여
            </span>
            <span className="w-px h-3 bg-stone-300" />
            <span className="font-mono">{formatRemaining(room.expiresAt)}</span>
            {unanimousCount > 0 && (
              <>
                <span className="w-px h-3 bg-stone-300" />
                <span className="flex items-center gap-1 text-amber-700">
                  <Sparkles className="w-3 h-3" />
                  <span className="font-medium">
                    같은 답 {unanimousCount}개
                  </span>
                </span>
              </>
            )}
          </div>
        </motion.div>

        {/* Empty state */}
        {room.participants.length === 0 && (
          <div className="relative py-20 text-center">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <DeerHoofMark className="absolute top-10 left-[18%] w-3 h-4 text-stone-300/50 -rotate-12" />
              <DeerHoofMark className="absolute top-24 right-[20%] w-3 h-4 text-stone-300/50 rotate-[8deg]" />
              <DeerHoofMark className="absolute bottom-16 left-[26%] w-2.5 h-3 text-stone-300/40 rotate-3" />
              <DeerHoofMark className="absolute bottom-24 right-[28%] w-2.5 h-3 text-stone-300/40 -rotate-6" />
            </div>
            <div className="relative flex justify-center mb-6">
              <AntlerLogo animated className="w-10 h-12 text-stone-300" />
            </div>
            <p className="relative text-stone-600 text-sm">아직 참여자가 없어요</p>
            <p className="relative text-stone-600 text-xs mt-1">
              링크를 공유해서 친구들을 초대하세요
            </p>
            <button
              onClick={copyInviteLink}
              className="relative mt-6 flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-amber-100 bg-amber-50 text-xs text-stone-700 hover:text-stone-900 hover:border-amber-200 transition-colors mx-auto"
            >
              <Copy className="w-3.5 h-3.5" />
              초대 링크 복사
            </button>
          </div>
        )}

        {/* Questions */}
        {room.participants.length > 0 && (
          <div className="space-y-4">
            {room.questions.map((q, idx) => {
              const Icon = TYPE_ICON[q.type];
              return (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: idx * 0.06 }}
                  className="rounded-2xl border border-amber-100 bg-white overflow-hidden"
                >
                  {/* Card header */}
                  <div className="flex items-center gap-2 px-5 py-3.5 border-b border-stone-200">
                    <span className="text-[10px] font-mono text-stone-600 tabular-nums w-5">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <Icon className="w-3 h-3 text-stone-600" />
                    <span className="text-[10px] uppercase tracking-widest text-stone-600">
                      {TYPE_LABEL[q.type]}
                    </span>
                  </div>

                  {/* Question + result */}
                  <div className="px-5 py-5">
                    <h3 className="text-base font-semibold text-stone-900 mb-5 leading-snug">
                      {q.title}
                    </h3>

                    {q.type === "balance" && (
                      <BalanceResult
                        question={q}
                        participants={room.participants}
                        index={idx}
                      />
                    )}
                    {q.type === "multiple" && (
                      <MultipleResult
                        question={q}
                        participants={room.participants}
                        index={idx}
                      />
                    )}
                    {q.type === "subjective" && (
                      <SubjectiveResult
                        question={q}
                        participants={room.participants}
                      />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Participant summary */}
        {room.participants.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-6 rounded-2xl border border-amber-100 bg-white px-5 py-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] uppercase tracking-widest text-stone-600">
                참여자
              </div>
              <span className="text-xs text-stone-600 font-mono tabular-nums">
                {room.participants.length}명
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {room.participants.map((p) => (
                <motion.span
                  key={p.id}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="px-2.5 py-1 rounded-full text-xs border border-amber-100 bg-amber-50 text-stone-700 cursor-default"
                >
                  {p.nickname}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Result image share — primary viral hook */}
        {room.participants.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="mt-6 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100/40 px-5 py-5"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-1">
                <p className="text-sm font-semibold text-stone-900 mb-1">
                  친구한테 결과 보여주기
                </p>
                <p className="text-xs text-stone-600 leading-relaxed">
                  이미지로 저장해서 카톡·인스타에 공유하세요
                </p>
              </div>
            </div>
            <button
              onClick={shareResultImage}
              disabled={imageBusy}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                imageBusy
                  ? "bg-amber-300 text-white cursor-wait"
                  : "bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-900/25 hover:-translate-y-0.5"
              )}
            >
              {imageBusy ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  이미지 만드는 중…
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4" />
                  결과 이미지 공유
                  <Download className="w-3.5 h-3.5 opacity-70" />
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* Invite + new room */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-3 rounded-2xl border border-amber-100 bg-white px-5 py-5"
        >
          <p className="text-xs text-stone-600 mb-3">친구를 더 초대할까요?</p>
          <div className="flex gap-2 mb-5">
            <button
              onClick={copyInviteLink}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs transition-colors",
                copied
                  ? "border-amber-200 bg-amber-50 text-amber-700"
                  : "border-amber-100 text-stone-700 hover:text-stone-900 hover:border-amber-200"
              )}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "복사됨" : "방 링크 복사"}
            </button>
            <button
              onClick={shareInviteLink}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-amber-100 text-xs text-stone-700 hover:text-stone-900 hover:border-amber-200 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              방 공유하기
            </button>
          </div>

          <div className="h-px bg-stone-100 mb-5" />

          <div className="text-center space-y-2">
            <p className="text-xs text-stone-600">또 다른 주제로 비교해볼까요?</p>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
            >
              새 방 만들기
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Hidden share card — rendered off-screen for html-to-image capture */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          left: -10000,
          top: 0,
          pointerEvents: "none",
        }}
      >
        <ShareCard ref={shareCardRef} room={room} />
      </div>
    </div>
  );
}
