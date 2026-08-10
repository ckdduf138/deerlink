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
import { formatRemaining } from "@/lib/format";
import { parseOptions, type ResultsRoom, type Participant, type Question } from "@/lib/types";
import { BalanceRatioBar } from "@/components/ResultBar";
import { GroupReport } from "@/components/room/group-report";
import { ShareCard } from "./share-card";


/* ─── Balance Result ─────────────────────── */

function BalanceResult({
  question,
  participants,
  anonymous,
}: {
  question: Question;
  participants: Participant[];
  anonymous: boolean;
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

  return (
    <div>
      <BalanceRatioBar
        className="mb-6"
        a={{ label: question.optionA ?? "A", count: countA }}
        b={{ label: question.optionB ?? "B", count: countB }}
      />

      {/* Individual answers — 익명 공개방은 참여자별로 풀지 않고 집계만 보여준다 */}
      {!anonymous && (
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
                <span className="text-sm text-stone-700">{a.nickname}</span>
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
      )}

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
  anonymous,
}: {
  question: Question;
  participants: Participant[];
  anonymous: boolean;
}) {
  const options = parseOptions(question.options);
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
              <span className={cn("text-sm", isTop ? "text-stone-900 font-semibold" : "text-stone-600")}>
                {opt}
              </span>
              <span className="text-[11px] text-stone-600 font-mono tabular-nums">
                {count}명 · {pct}%
              </span>
            </div>
            <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-stone-100" aria-hidden="true">
              <div
                className={cn("h-full rounded-full", isTop ? "bg-amber-500" : "bg-stone-300")}
                style={{ width: `${pct}%` }}
              />
            </div>
            {!anonymous && voters.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {voters.map((v) => (
                  <motion.span
                    key={v.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.2 }}
                    className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-100"
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
  anonymous,
}: {
  question: Question;
  participants: Participant[];
  anonymous: boolean;
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
          {!anonymous && (
            <span className="mb-2 block text-[11px] font-medium text-stone-500">
              {a.nickname}
            </span>
          )}
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

export function ResultsClient({ room }: { room: ResultsRoom }) {
  const [copied, setCopied] = useState(false);
  const [imageBusy, setImageBusy] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);

  const unanimousQuestionIds = new Set(
    room.questions
      .filter((q) => {
        if (q.type === "subjective") return false;
        const values = room.participants
          .flatMap((p) => p.answers.filter((a) => a.questionId === q.id))
          .map((a) => a.value);
        return values.length >= 2 && new Set(values).size === 1;
      })
      .map((q) => q.id)
  );
  const unanimousCount = unanimousQuestionIds.size;

  const copyInviteLink = async () => {
    const url = window.location.href.replace("/results", "");
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareInviteLink = async () => {
    const url = window.location.href.replace("/results", "");
    const text = `${room.title} - Deerlink에서 같이 답해봐요`;
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
      const text = `${room.title} - 우리 답 비교해봤어요`;
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
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-4">
            <AntlerLogo
              animated
              className="w-4 h-5 text-amber-500"
            />
            <div className="text-[10px] uppercase tracking-widest text-stone-600">
              결과 비교
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-3 leading-[1.15] tracking-tight">
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
          <div className="py-16 text-center">
            <Users className="mx-auto mb-5 w-10 h-10 text-stone-300" />
            <p className="text-stone-600 text-sm">아직 참여자가 없어요</p>
            <p className="text-stone-600 text-xs mt-1">
              링크를 공유해서 친구들을 초대하세요
            </p>
            <button
              onClick={copyInviteLink}
              className="mt-6 flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-amber-100 bg-amber-50 text-xs text-amber-900 hover:text-amber-950 hover:border-amber-200 transition-colors mx-auto"
            >
              <Copy className="w-3.5 h-3.5" />
              초대 링크 복사
            </button>
          </div>
        )}

        {/* Group report — 익명 통계로는 못 만드는, 이름 붙은 그룹만의 숫자 */}
        {/* 궁합·소수파 통계는 "이름 붙은 우리 그룹" 전제라 공개방(모르는 사람도 보는 방)엔 안 어울린다 */}
        {!room.isPublic && room.participants.length > 0 && <GroupReport room={room} />}

        {/* Questions */}
        {room.participants.length > 0 && (
          <div className="space-y-5">
            {room.questions.map((q, idx) => {
              const Icon = TYPE_ICON[q.type];
              return (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: idx * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "rounded-2xl border px-5 py-6",
                    unanimousQuestionIds.has(q.id)
                      ? "border-amber-200 bg-amber-50/40"
                      : "border-amber-100 bg-white"
                  )}
                >
                  <h3 className="mb-6 flex items-start gap-2 text-lg font-semibold leading-snug tracking-tight text-stone-900">
                    <span className="mt-0.5 font-mono text-xs tabular-nums text-stone-400">
                      {idx + 1}
                    </span>
                    <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-stone-400" aria-hidden="true" />
                    <span className="sr-only">{TYPE_LABEL[q.type]}</span>
                    <span className="flex-1">{q.title}</span>
                    {unanimousQuestionIds.has(q.id) && (
                      <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" aria-label="만장일치" />
                    )}
                  </h3>

                  {q.type === "balance" && (
                    <BalanceResult
                      question={q}
                      participants={room.participants}
                      anonymous={room.isPublic}
                    />
                  )}
                  {q.type === "multiple" && (
                    <MultipleResult
                      question={q}
                      participants={room.participants}
                      anonymous={room.isPublic}
                    />
                  )}
                  {q.type === "subjective" && (
                    <SubjectiveResult
                      question={q}
                      participants={room.participants}
                      anonymous={room.isPublic}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* 마무리 블록 — 참여자 요약·결과 공유·초대를 하나의 흐름으로 묶는다.
            예전엔 이 셋이 거의 똑같이 생긴 흰 카드로 세 번 반복돼서 리포트 템플릿처럼 보였다. */}
        {room.participants.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-8 divide-y divide-stone-100 rounded-2xl border border-amber-100 bg-white"
          >
            {/* 참여자 — 공개방은 익명이라 닉네임 목록이 의미가 없다. 헤더의 참여자 수로 충분하다. */}
            {!room.isPublic && (
              <div className="px-5 py-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs text-stone-500">참여자</span>
                  <span className="text-xs font-mono tabular-nums text-stone-500">
                    {room.participants.length}명
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {room.participants.map((p) => (
                    <motion.span
                      key={p.id}
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                      className="px-2.5 py-1 rounded-full text-xs border border-amber-100 bg-amber-50 text-amber-900 cursor-default"
                    >
                      {p.nickname}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}

            {/* 결과 이미지 공유 — 가장 중요한 액션이라 버튼 색으로 무게를 준다 */}
            <div className="px-5 py-5">
              <p className="mb-1 text-sm font-semibold text-stone-900">
                친구한테 결과 보여주기
              </p>
              <p className="mb-4 text-xs text-stone-600 leading-relaxed">
                이미지로 저장해서 카톡·인스타에 공유하세요
              </p>
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
            </div>

            {/* 초대 + 새 방 */}
            <div className="px-5 py-5">
              <p className="mb-3 text-xs text-stone-600">친구를 더 초대할까요?</p>
              <div className="flex gap-2">
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
            </div>

            {/* 새 방 */}
            <div className="px-5 py-5 text-center space-y-2">
              <p className="text-xs text-stone-600">또 다른 주제로 비교해볼까요?</p>
              <Link
                href="/create"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
              >
                새 방 만들기
              </Link>
            </div>
          </motion.div>
        )}
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
