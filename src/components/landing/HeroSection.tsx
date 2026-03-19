"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const participants = [
  { name: "나", answer: "치킨", color: "violet" as const, delay: 0.6 },
  { name: "민지", answer: "피자", color: "sky" as const, delay: 0.75 },
  { name: "준혁", answer: "치킨", color: "violet" as const, delay: 0.9 },
  { name: "수아", answer: "치킨", color: "violet" as const, delay: 1.05 },
];

const colorMap = {
  violet: {
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    text: "text-violet-300",
    dot: "bg-violet-400",
  },
  sky: {
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    text: "text-sky-300",
    dot: "bg-sky-400",
  },
};

function ProductMockup() {
  const chickenCount = participants.filter((p) => p.answer === "치킨").length;
  const pizzaCount = participants.filter((p) => p.answer === "피자").length;
  const total = participants.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-sm mx-auto"
    >
      {/* Glow */}
      <div className="absolute -inset-8 bg-violet-600/10 rounded-3xl blur-2xl pointer-events-none" />

      {/* Card */}
      <div className="relative rounded-2xl border border-white/8 bg-[#111114] overflow-hidden shadow-2xl shadow-black/60">
        {/* Window bar */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/6">
          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <span className="ml-auto text-[10px] text-zinc-600 font-mono">
            room / MNX3
          </span>
        </div>

        {/* Question */}
        <div className="px-5 pt-5 pb-3">
          <div className="text-[10px] text-zinc-600 uppercase tracking-widest mb-2">
            Q1 · 밸런스 게임
          </div>
          <div className="text-sm font-semibold text-white leading-snug mb-4">
            치킨 vs 피자, 뭐 시킬래?
          </div>

          {/* Option buttons */}
          <div className="grid grid-cols-2 gap-2 mb-5">
            <div className="py-3 px-3 rounded-xl bg-violet-500/10 border border-violet-500/25 flex items-center justify-between">
              <span className="text-xs font-medium text-violet-300">치킨</span>
              <Check className="w-3 h-3 text-violet-400" />
            </div>
            <div className="py-3 px-3 rounded-xl bg-white/4 border border-white/8 flex items-center">
              <span className="text-xs font-medium text-zinc-500">피자</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/6 mx-5" />

        {/* Results */}
        <div className="px-5 py-4">
          <div className="text-[10px] text-zinc-600 uppercase tracking-widest mb-3">
            결과 비교
          </div>

          <div className="space-y-2 mb-4">
            {participants.map((p) => {
              const c = colorMap[p.color];
              return (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: p.delay }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className={cn("w-1.5 h-1.5 rounded-full", c.dot)} />
                    <span className="text-xs text-zinc-400">{p.name}</span>
                  </div>
                  <span
                    className={cn(
                      "text-[11px] px-2 py-0.5 rounded-md border font-medium",
                      c.bg,
                      c.border,
                      c.text
                    )}
                  >
                    {p.answer}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Split bar */}
          <div className="space-y-1.5">
            <motion.div
              className="flex h-1 rounded-full overflow-hidden bg-white/5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(chickenCount / total) * 100}%` }}
                transition={{ delay: 1.3, duration: 0.6, ease: "easeOut" }}
                className="h-full bg-violet-500 rounded-full"
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(pizzaCount / total) * 100}%` }}
                transition={{ delay: 1.3, duration: 0.6, ease: "easeOut" }}
                className="h-full bg-sky-500 rounded-full"
              />
            </motion.div>
            <div className="flex justify-between">
              <span className="text-[10px] text-zinc-600">
                치킨 {chickenCount}명
              </span>
              <span className="text-[10px] text-zinc-600">
                피자 {pizzaCount}명
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6 overflow-hidden dot-grid">
      {/* Radial vignette over dot grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(139,92,246,0.08),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(9,9,11,0.9),transparent)]" />

      <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 text-xs text-zinc-500 mb-8 tracking-wide uppercase"
        >
          <span className="w-4 h-px bg-zinc-700" />
          그룹 생각 비교 플랫폼
          <span className="w-4 h-px bg-zinc-700" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-[82px] font-bold text-white leading-[1.05] tracking-tight mb-6"
        >
          링크 하나로
          <br />
          <span className="text-zinc-400">생각이 만나는 곳</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base md:text-lg text-zinc-500 max-w-md mx-auto mb-10 leading-relaxed"
        >
          방을 만들고 링크를 공유하면 — 모두가 같은 질문에 답하고,
          서로의 선택을 한눈에 비교합니다.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-20"
        >
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all duration-200 shadow-lg shadow-violet-900/40 hover:shadow-violet-800/50 hover:-translate-y-0.5"
          >
            방 만들기
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        {/* Product mockup */}
        <ProductMockup />
      </div>
    </section>
  );
}
