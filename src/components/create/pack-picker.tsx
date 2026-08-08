"use client";

import { motion } from "framer-motion";
import { Compass, Heart, PenLine, Tent, Users } from "lucide-react";
import { QUESTION_PACKS, type QuestionPack } from "@/data/question-packs";

const PACK_ICON: Record<string, typeof Users> = {
  friends: Users,
  dating: Heart,
  values: Compass,
  gathering: Tent,
};

/**
 * 지금 가장 큰 이탈 지점은 "누군가 질문을 먼저 만들어야 함"이다.
 * 팩을 고르면 제목·질문 5개가 채워진 채로 바로 제출 화면까지 간다.
 */
export function PackPicker({
  onPick,
  onSkip,
}: {
  onPick: (pack: QuestionPack) => void;
  onSkip: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#fafaf8] px-4 pt-28 pb-16">
      <div className="mx-auto max-w-xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-stone-900">뭐부터 물어볼까요?</h1>
          <p className="mt-2 text-sm text-stone-600">
            팩을 고르면 질문이 채워진 채로 바로 시작해요
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {QUESTION_PACKS.map((pack, i) => {
            const Icon = PACK_ICON[pack.id] ?? Users;
            return (
              <motion.button
                key={pack.id}
                onClick={() => onPick(pack)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-2xl border border-amber-100 bg-white p-5 text-left transition-colors hover:border-amber-300 hover:bg-amber-50/40"
              >
                <Icon className="h-5 w-5 text-amber-600" />
                <p className="mt-3 text-base font-bold text-stone-900">{pack.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-stone-500">
                  {pack.description}
                </p>
                <p className="mt-3 text-[11px] text-stone-400">질문 {pack.questionIds.length}개</p>
              </motion.button>
            );
          })}
        </div>

        <button
          onClick={onSkip}
          className="mx-auto mt-6 flex min-h-11 items-center gap-1.5 px-4 text-sm text-stone-500 transition-colors hover:text-stone-800"
        >
          <PenLine className="h-3.5 w-3.5" />
          아니요, 직접 만들게요
        </button>
      </div>
    </div>
  );
}
