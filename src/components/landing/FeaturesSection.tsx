"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─── Mini UI Previews ─────────────────────────────────────────── */

function BalanceGamePreview() {
  return (
    <div className="mt-auto pt-6 select-none">
      <div className="text-[10px] text-zinc-600 uppercase tracking-widest mb-3">
        Q. 직진 vs 돌아가기
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="py-3 px-4 rounded-xl border border-violet-500/30 bg-violet-500/8 text-center">
          <span className="text-xs font-semibold text-violet-300">직진</span>
        </div>
        <div className="py-3 px-4 rounded-xl border border-white/8 bg-white/3 text-center">
          <span className="text-xs font-medium text-zinc-600">돌아가기</span>
        </div>
      </div>
      <div className="mt-3 h-0.5 rounded-full bg-white/5 overflow-hidden">
        <div className="h-full w-3/4 bg-gradient-to-r from-violet-600 to-violet-400 rounded-full" />
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] text-zinc-700">
        <span>직진 3명</span>
        <span>돌아가기 1명</span>
      </div>
    </div>
  );
}

function MultipleChoicePreview() {
  const options = ["완전 동의", "대체로 동의", "잘 모르겠음", "동의 안 함"];
  const selected = 1;
  return (
    <div className="mt-auto pt-6 select-none space-y-1.5">
      {options.map((opt, i) => (
        <div
          key={opt}
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-lg border text-xs transition-colors",
            i === selected
              ? "border-violet-500/30 bg-violet-500/8 text-violet-300"
              : "border-white/6 bg-white/2 text-zinc-600"
          )}
        >
          <div
            className={cn(
              "w-3.5 h-3.5 rounded-full border flex-shrink-0",
              i === selected
                ? "border-violet-400 bg-violet-500"
                : "border-zinc-700"
            )}
          />
          {opt}
        </div>
      ))}
    </div>
  );
}

function OpenTextPreview() {
  return (
    <div className="mt-auto pt-6 select-none">
      <div className="text-[10px] text-zinc-600 uppercase tracking-widest mb-2">
        자유 응답
      </div>
      <div className="rounded-xl border border-white/8 bg-white/3 p-3">
        <p className="text-xs text-zinc-400 leading-relaxed">
          솔직히 저는 여행보다는 집에서...
        </p>
        <div className="mt-2 flex items-center gap-1">
          <div className="w-0.5 h-3.5 bg-violet-400 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function ResultsPreview() {
  const answers = [
    { name: "나", label: "직진", pct: 75, color: "violet" },
    { name: "민지", label: "돌아가기", pct: 25, color: "sky" },
    { name: "준혁", label: "직진", pct: 75, color: "violet" },
    { name: "수아", label: "직진", pct: 75, color: "violet" },
  ];

  return (
    <div className="mt-6 space-y-3 select-none">
      {answers.map((a, i) => (
        <motion.div
          key={a.name}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 + 0.2, duration: 0.35 }}
          className="space-y-1"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold",
                  a.color === "violet"
                    ? "bg-violet-500/15 text-violet-400"
                    : "bg-sky-500/15 text-sky-400"
                )}
              >
                {a.name[0]}
              </div>
              <span className="text-xs text-zinc-400">{a.name}</span>
            </div>
            <span
              className={cn(
                "text-[11px] px-2 py-0.5 rounded-md border font-medium",
                a.color === "violet"
                  ? "bg-violet-500/10 border-violet-500/20 text-violet-300"
                  : "bg-sky-500/10 border-sky-500/20 text-sky-300"
              )}
            >
              {a.label}
            </span>
          </div>
          <div className="h-0.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${a.pct}%` }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 + 0.5, duration: 0.5, ease: "easeOut" }}
              className={cn(
                "h-full rounded-full",
                a.color === "violet" ? "bg-violet-500" : "bg-sky-500"
              )}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Bento Cards ──────────────────────────────────────────────── */

interface BentoCardProps {
  className?: string;
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
  delay?: number;
}

function BentoCard({
  className,
  eyebrow,
  title,
  description,
  children,
  delay = 0,
}: BentoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "rounded-2xl border border-white/7 bg-[#111114] p-6 flex flex-col overflow-hidden",
        className
      )}
    >
      <div className="text-[10px] text-zinc-600 uppercase tracking-widest mb-3">
        {eyebrow}
      </div>
      <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
      <p className="text-xs text-zinc-500 leading-relaxed">{description}</p>
      {children}
    </motion.div>
  );
}

/* ─── Section ──────────────────────────────────────────────────── */

export function FeaturesSection() {
  return (
    <section className="py-12 md:py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="mb-12"
        >
          <div className="text-xs text-zinc-600 uppercase tracking-widest mb-4">
            기능
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            비교, 그 이상
          </h2>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Results — large, spans 2 rows on left */}
          <BentoCard
            className="md:col-span-2 md:row-span-2 min-h-80"
            eyebrow="핵심 기능"
            title="결과 비교 시각화"
            description="모든 참여자의 답변을 이름과 함께 한눈에 볼 수 있습니다. 누가 무엇을 선택했는지, 얼마나 의견이 갈렸는지 즉시 파악하세요."
            delay={0}
          >
            <ResultsPreview />
          </BentoCard>

          {/* Balance game */}
          <BentoCard
            eyebrow="질문 유형 01"
            title="밸런스 게임"
            description="A vs B, 하나를 선택하세요"
            delay={0.08}
          >
            <BalanceGamePreview />
          </BentoCard>

          {/* Multiple choice */}
          <BentoCard
            eyebrow="질문 유형 02"
            title="객관식"
            description="여러 선택지 중 하나"
            delay={0.16}
          >
            <MultipleChoicePreview />
          </BentoCard>

          {/* Open text */}
          <BentoCard
            eyebrow="질문 유형 03"
            title="주관식"
            description="자유롭게 생각을 표현하세요"
            delay={0.24}
          >
            <OpenTextPreview />
          </BentoCard>

          {/* Answer lock — stat card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-3 rounded-2xl border border-white/7 bg-[#111114] p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6"
          >
            <div className="flex-1">
              <div className="text-[10px] text-zinc-600 uppercase tracking-widest mb-3">
                Answer Lock
              </div>
              <h3 className="text-base font-semibold text-white mb-1">
                결과는 모두가 답변한 후에만 공개
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed max-w-lg">
                참여자는 자신의 답변을 제출하기 전까지 다른 사람의 선택을 볼 수 없습니다.
                편향 없이 솔직한 답변을 받을 수 있어요.
              </p>
            </div>
            <div className="flex gap-8 md:gap-12 flex-shrink-0">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-0.5">100%</div>
                <div className="text-xs text-zinc-600">솔직한 답변</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-0.5">0</div>
                <div className="text-xs text-zinc-600">선행 편향</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-0.5">즉시</div>
                <div className="text-xs text-zinc-600">결과 공개</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
