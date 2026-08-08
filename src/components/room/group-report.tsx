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

export function GroupReport({ room }: { room: ResultsRoom }) {
  const pairs = computePairScores(room);
  const dissenter = computeLoneDissenter(room);
  const closest = computeClosestBalance(room);

  if (pairs.length === 0 && !dissenter && !closest) return null;

  const sorted = [...pairs].sort((x, y) => y.pct - x.pct);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];
  const showWorst = worst && best && worst.pct < best.pct;
  const tiedForBest = sorted.filter((p) => p.pct === best?.pct).length > 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="mb-4 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100/40 px-5 py-6"
    >
      <div className="mb-5 flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0" />
        <div>
          <h2 className="text-base font-bold text-stone-900">우리 그룹 리포트</h2>
          <p className="text-xs text-stone-600">답변으로만 계산했어요</p>
        </div>
      </div>

      <div className="space-y-3">
        {best && room.participants.length === 2 && (
          <ReportRow
            label="우리 둘의 일치도"
            value={`${best.a.nickname} · ${best.b.nickname}`}
            pct={best.pct}
            tone="amber"
          />
        )}

        {best && room.participants.length >= 3 && (
          <ReportRow
            label="나랑 제일 비슷한 조합"
            value={`${best.a.nickname} · ${best.b.nickname}`}
            pct={best.pct}
            tone="amber"
            note={tiedForBest ? "동률인 조합이 더 있어요" : undefined}
          />
        )}

        {showWorst && (
          <ReportRow
            label="제일 다른 조합"
            value={`${worst.a.nickname} · ${worst.b.nickname}`}
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

        {closest && (
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
    </motion.div>
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
        {note && <p className="text-[11px] text-stone-500">{note}</p>}
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
