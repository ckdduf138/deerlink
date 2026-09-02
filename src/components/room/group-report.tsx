"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import {
  computeClosestBalance,
  computeLoneDissenter,
  computePairScores,
} from "@/lib/group-stats";
import type { ResultsRoom } from "@/lib/types";

/**
 * "지우와 87% 일치" — 익명 통계 서비스는 구조적으로 못 만드는 숫자다.
 * 이름 붙은 유한 그룹의 답변만 있으면 계산되고, 스키마 변경이 없다.
 * 데이터가 부족한 통계는 보여주지 않는다 — 가짜 정밀도보다 침묵이 낫다.
 */

export function GroupReport({
  room,
  primaryKind,
}: {
  room: ResultsRoom;
  primaryKind: "best-pair" | "closest-balance" | "unanimous" | "aggregate" | null;
}) {
  const pairs = computePairScores(room);
  const dissenter = computeLoneDissenter(room);
  const closest = computeClosestBalance(room);

  const sorted = [...pairs].sort((x, y) => y.pct - x.pct);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];
  const showWorst = worst && best && worst.pct < best.pct;
  const showClosest = closest && primaryKind !== "closest-balance";

  if (!showWorst && !dissenter && !showClosest) return null;

  return (
    <motion.details
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="mt-4 border-b border-amber-100"
    >
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between text-sm font-semibold text-stone-700 marker:hidden">
        다른 인사이트 더 보기
        <Sparkles className="h-4 w-4 text-amber-700" aria-hidden="true" />
      </summary>
      <div className="space-y-3 pb-5">
        {showWorst && (
          <ReportRow
            label="제일 다른 조합"
            value={`${worst.a.nickname}, ${worst.b.nickname}`}
            pct={worst.pct}
            tone="teal"
          />
        )}

        {dissenter && (
          <div className="flex items-center justify-between rounded-xl bg-white/70 px-4 py-3">
            <div>
              <p className="text-xs text-stone-500">오늘의 소수파</p>
              <p className="text-sm font-semibold text-stone-900">{dissenter.participant.nickname}</p>
            </div>
            <p className="text-xs text-stone-600">
              {dissenter.count}개 질문에서 <span className="font-medium text-stone-800">혼자 다른 선택</span>
            </p>
          </div>
        )}

        {showClosest && (
          <div className="flex items-center justify-between rounded-xl bg-white/70 px-4 py-3">
            <div className="min-w-0">
              <p className="text-xs text-stone-500">가장 팽팽했던 질문</p>
              <p className="truncate text-sm font-semibold text-stone-900">{closest.question.title}</p>
            </div>
            <p className="flex-shrink-0 text-xs font-mono tabular-nums text-stone-600">
              {closest.countA} : {closest.countB}
            </p>
          </div>
        )}
      </div>
    </motion.details>
  );
}

function ReportRow({
  label,
  value,
  pct,
  tone,
  note,
}: {
  label: string;
  value: string;
  pct: number;
  tone: "amber" | "teal";
  note?: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white/70 px-4 py-3">
      <div className="min-w-0">
        <p className="text-xs text-stone-500">{label}</p>
        <p className="truncate text-sm font-semibold text-stone-900">{value}</p>
        {note && <p className="text-xs text-stone-500">{note}</p>}
      </div>
      <div
        className={
          "flex flex-shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold tabular-nums " +
          (tone === "amber" ? "bg-amber-100 text-amber-900" : "bg-teal-100 text-teal-900")
        }
      >
        {tone === "amber" && <Sparkles className="h-3 w-3" />}
        {pct}%
      </div>
    </div>
  );
}
