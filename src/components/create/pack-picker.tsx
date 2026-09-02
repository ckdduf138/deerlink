"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ChevronDown, Coffee, Compass, Heart, PenLine, Tent, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { QUESTION_PACKS, type QuestionPack } from "@/data/question-packs";
import { AntlerLogo } from "@/components/landing/AntlerLogo";

const PACK_ICON: Record<string, typeof Users> = {
  friends: Users,
  dating: Heart,
  values: Compass,
  gathering: Tent,
  light: Coffee,
};

/**
 * 지금 가장 큰 이탈 지점은 "누군가 질문을 먼저 만들어야 함"이다.
 * 테마를 고르면 제목·질문 5개가 채워진 채로 바로 제출 화면까지 간다.
 */
export function PackPicker({
  onPick,
  onSkip,
}: {
  onPick: (pack: QuestionPack) => void;
  onSkip: () => void;
}) {
  const [showAll, setShowAll] = useState(false);
  const visiblePacks = showAll ? QUESTION_PACKS : QUESTION_PACKS.slice(0, 2);
  const reduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 md:px-8 py-4 border-b border-amber-100 bg-white/90 backdrop-blur-md">
        <Link
          href="/"
          aria-label="홈으로 돌아가기"
          className="flex min-h-11 min-w-11 items-center gap-2 text-sm text-stone-600 transition-colors hover:text-stone-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-stone-900 tracking-tight">
            <AntlerLogo className="w-3 h-[15px] text-amber-500" />
            Deerlink
          </span>
        </Link>
      </nav>

      <div className="px-4 pt-28 pb-16">
        <div className="mx-auto max-w-xl">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-stone-900">뭐부터 물어볼까요?</h1>
            <p className="mt-2 text-sm text-stone-600">
              테마를 고르면 질문이 채워진 채로 바로 시작해요
            </p>
          </div>

          <div id="all-question-themes" className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {visiblePacks.map((pack, i) => {
              const Icon = PACK_ICON[pack.id] ?? Users;
              return (
                <motion.button
                  key={pack.id}
                  onClick={() => onPick(pack)}
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                  className="rounded-2xl border border-amber-100 bg-white p-5 text-left transition-colors hover:border-amber-300 hover:bg-amber-50/40"
                >
                  <Icon className="h-5 w-5 text-amber-600" />
                  <p className="mt-3 text-base font-bold text-stone-900">{pack.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-stone-500">
                    {pack.description}
                  </p>
                  <p className="mt-3 text-xs text-stone-500">질문 {pack.questionIds.length}개</p>
                </motion.button>
              );
            })}
          </div>

          <button
            onClick={() => setShowAll((current) => !current)}
            className="mx-auto mt-4 flex min-h-11 items-center gap-1.5 px-4 text-sm text-stone-600 transition-colors hover:text-stone-900"
            aria-expanded={showAll}
            aria-controls="all-question-themes"
          >
            {showAll
              ? "테마 접기"
              : `다른 테마 ${QUESTION_PACKS.length - visiblePacks.length}개 보기`}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${showAll ? "rotate-180" : ""}`}
            />
          </button>

          <button
            onClick={onSkip}
            className="mx-auto mt-2 flex min-h-11 items-center gap-1.5 px-4 text-sm text-stone-500 transition-colors hover:text-stone-800"
          >
            <PenLine className="h-3.5 w-3.5" />
            직접 만들기
          </button>
        </div>
      </div>
    </div>
  );
}
