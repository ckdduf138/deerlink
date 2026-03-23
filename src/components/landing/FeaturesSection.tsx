"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─── Mini UI Previews ─────────────────────────────────────────── */

function BalanceGamePreview() {
  return (
    <div className="mt-auto pt-6 select-none">
      <div className="text-[10px] text-stone-400 uppercase tracking-widest mb-3">
        Q. 밤샘 vs 푹 쉬기
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="py-3 px-4 rounded-xl border border-amber-200 bg-amber-50 text-center">
          <span className="text-xs font-semibold text-amber-700">밤샘</span>
        </div>
        <div className="py-3 px-4 rounded-xl border border-stone-200 bg-stone-100 text-center">
          <span className="text-xs font-medium text-stone-600">푹 쉬기</span>
        </div>
      </div>
      <div className="mt-3 h-0.5 rounded-full bg-stone-200 overflow-hidden">
        <div className="h-full w-3/4 bg-gradient-to-r from-amber-600 to-amber-400 rounded-full" />
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] text-stone-500">
        <span>밤샘 3명</span>
        <span>푹 쉬기 1명</span>
      </div>
    </div>
  );
}

function MultipleChoicePreview() {
  const options = ["이번 계절이 최고", "괜찮은 편", "별로", "최악"];
  const selected = 1;
  return (
    <div className="mt-auto pt-6 select-none space-y-1.5">
      {options.map((opt, i) => (
        <div
          key={opt}
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-lg border text-xs transition-colors",
            i === selected
              ? "border-amber-200 bg-amber-50 text-amber-700"
              : "border-stone-200 bg-stone-100 text-stone-600"
          )}
        >
          <div
            className={cn(
              "w-3.5 h-3.5 rounded-full border flex-shrink-0",
              i === selected
                ? "border-amber-400 bg-amber-500"
                : "border-stone-300"
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
      <div className="text-[10px] text-stone-400 uppercase tracking-widest mb-2">
        자유 응답
      </div>
      <div className="rounded-xl border border-stone-200 bg-stone-100 p-3">
        <p className="text-xs text-stone-600 leading-relaxed">
          개인적으로는 야근하면서 번아웃 오는 게...
        </p>
        <div className="mt-2 flex items-center gap-1">
          <div className="w-0.5 h-3.5 bg-amber-400 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function ResultsPreview() {
  const answers = [
    { name: "나", label: "완전 동의", pct: 75, color: "amber" },
    { name: "민지", label: "별로", pct: 25, color: "teal" },
    { name: "준혁", label: "완전 동의", pct: 75, color: "amber" },
    { name: "수아", label: "완전 동의", pct: 75, color: "amber" },
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
                  a.color === "amber"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-teal-100 text-teal-700"
                )}
              >
                {a.name[0]}
              </div>
              <span className="text-xs text-stone-500">{a.name}</span>
            </div>
            <span
              className={cn(
                "text-[11px] px-2 py-0.5 rounded-md border font-medium",
                a.color === "amber"
                  ? "bg-amber-50 border-amber-200 text-amber-700"
                  : "bg-teal-50 border-teal-200 text-teal-700"
              )}
            >
              {a.label}
            </span>
          </div>
          <div className="h-0.5 rounded-full bg-stone-200 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${a.pct}%` }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 + 0.5, duration: 0.5, ease: "easeOut" }}
              className={cn(
                "h-full rounded-full",
                a.color === "amber" ? "bg-amber-500" : "bg-teal-500"
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
        "rounded-2xl border border-amber-100 bg-white p-6 flex flex-col overflow-hidden shadow-sm",
        className
      )}
    >
      <div className="text-[10px] text-stone-400 uppercase tracking-widest mb-3">
        {eyebrow}
      </div>
      <h3 className="text-sm font-semibold text-stone-900 mb-1">{title}</h3>
      <p className="text-xs text-stone-500 leading-relaxed">{description}</p>
      {children}
    </motion.div>
  );
}

/* ─── Section ──────────────────────────────────────────────────── */

export function FeaturesSection() {
  return (
    <section className="py-12 md:py-20 px-6 bg-[#fafaf8]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="mb-12"
        >
          <div className="text-xs text-stone-500 uppercase tracking-widest mb-4">
            기능
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
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
            className="md:col-span-3 rounded-2xl border border-amber-100 bg-white p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6 shadow-sm"
          >
            <div className="flex-1">
              <div className="text-[10px] text-stone-400 uppercase tracking-widest mb-3">
                Answer Lock
              </div>
              <h3 className="text-base font-semibold text-stone-900 mb-1">
                결과는 모두가 답변한 후에만 공개
              </h3>
              <p className="text-sm text-stone-500 leading-relaxed max-w-lg">
                참여자는 자신의 답변을 제출하기 전까지 다른 사람의 선택을 볼 수 없습니다.
                편향 없이 솔직한 답변을 받을 수 있어요.
              </p>
            </div>
            <div className="flex gap-8 md:gap-12 flex-shrink-0">
              <div className="text-center">
                <div className="text-2xl font-bold text-stone-900 mb-0.5">100%</div>
                <div className="text-xs text-stone-500">솔직한 답변</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-stone-900 mb-0.5">0</div>
                <div className="text-xs text-stone-500">선행 편향</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-stone-900 mb-0.5">즉시</div>
                <div className="text-xs text-stone-500">결과 공개</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
