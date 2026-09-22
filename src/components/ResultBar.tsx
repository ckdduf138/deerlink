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
      <div className="mb-2.5 flex items-end justify-between gap-4">
        <SideLabel label={a.label} pct={pctA} count={a.count} tone="amber" mine={mine === "a"} />
        <SideLabel label={b.label} pct={pctB} count={b.count} tone="teal" mine={mine === "b"} align="right" />
      </div>

      <div
        className="flex h-3.5 w-full gap-1 overflow-hidden rounded-full bg-[#f5ecdd]"
        aria-hidden="true"
      >
        {a.count > 0 && (
          <motion.div
            className="h-full rounded-full bg-brand"
            initial={reduce ? false : { width: 0 }}
            animate={{ width: `${pctA}%` }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          />
        )}
        {b.count > 0 && (
          <motion.div
            className="h-full rounded-full bg-teal-500"
            initial={reduce ? false : { width: 0 }}
            animate={{ width: `${pctB}%` }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          />
        )}
      </div>
    </div>
  );
}

function SideLabel({
  label,
  pct,
  count,
  tone,
  mine,
  align = "left",
}: {
  label: string;
  pct: number;
  count: number;
  tone: "amber" | "teal";
  mine: boolean;
  align?: "left" | "right";
}) {
  return (
    <div className={cn("min-w-0 flex-1", align === "right" && "text-right")}>
      <p
        className={cn(
          "flex items-center gap-1.5 text-[17px] font-bold",
          align === "right" && "flex-row-reverse",
          tone === "amber" ? "text-amber-800" : "text-teal-800"
        )}
      >
        <span className="min-w-0 truncate">{label}</span>
        {mine && (
          <span
            className={cn(
              "flex-shrink-0 rounded-md px-1.5 py-0.5 text-xs font-bold text-white",
              tone === "amber" ? "bg-amber-800" : "bg-teal-700"
            )}
          >
            나
          </span>
        )}
      </p>
      <p className="mt-0.5 text-[15px] tabular-nums text-stone-600">
        <span className="font-cute text-2xl text-stone-900">{pct}%</span>
        <span className="ml-1.5">{count}명</span>
      </p>
    </div>
  );
}
