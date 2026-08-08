"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * 밸런스 게임(선택지 2개) 결과를 amber/teal 비율 막대로 그린다.
 * 이전엔 뿔 모양 SVG로 그렸는데, 굵기를 sqrt로 죽인 탓에 0명도 두께가
 * 눈에 띄게 남아 "0명인데 표는 있네?"로 읽혔다. 막대는 폭이 곧 비율이라
 * 0%는 실제로 폭 0이 된다 — 숫자와 그림이 항상 같은 값을 말한다.
 */

interface Side {
  label: string;
  count: number;
}

export function BalanceRatioBar({
  a,
  b,
  mine = null,
  className,
}: {
  a: Side;
  b: Side;
  mine?: "a" | "b" | null;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const total = a.count + b.count;
  const pctA = total ? Math.round((a.count / total) * 100) : 0;
  const pctB = total ? 100 - pctA : 0;

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <p className="min-w-0 truncate text-base font-semibold text-amber-800">{a.label}</p>
        <p className="min-w-0 truncate text-right text-base font-semibold text-teal-800">
          {b.label}
        </p>
      </div>

      <div
        className="flex h-3 w-full overflow-hidden rounded-full bg-stone-100"
        aria-hidden="true"
      >
        {a.count > 0 && (
          <motion.div
            className="h-full bg-amber-500"
            initial={reduce ? false : { width: 0 }}
            animate={{ width: `${pctA}%` }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
        {b.count > 0 && (
          <motion.div
            className="h-full bg-teal-500"
            initial={reduce ? false : { width: 0 }}
            animate={{ width: `${pctB}%` }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
      </div>

      <div className="mt-1.5 flex items-center justify-between text-sm text-stone-600">
        <span className="font-mono tabular-nums">
          {a.count}명 · {pctA}%
          {mine === "a" && <span className="ml-1.5 text-stone-500">나 포함</span>}
        </span>
        <span className="font-mono tabular-nums">
          {mine === "b" && <span className="mr-1.5 text-stone-500">나 포함</span>}
          {pctB}% · {b.count}명
        </span>
      </div>
    </div>
  );
}
