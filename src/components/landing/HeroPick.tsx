"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Hourglass, Users } from "lucide-react";
import { answerDraftKey, loadDraft, saveDraft, type AnswerDraft } from "@/lib/draft-storage";
import { formatRemainingShort } from "@/lib/format";
import type { DiscoverRoom } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Fawn, FawnPaws } from "@/components/Fawn";

/**
 * 히어로의 체험은 가짜 데모가 아니라 지금 1위 공개방의 첫 질문이다.
 * 고른 답은 그 방의 답변 임시저장에 그대로 들어가고, 방에 들어가면 2번 문항부터
 * 이어진다. 즉 여기서 누른 한 번이 실제 참여의 첫 답이다 (예전 데모는 눌러도 아무것도
 * 남지 않아서 걷어냈다).
 */
export function HeroPick({ room }: { room: DiscoverRoom }) {
  const router = useRouter();
  const [picked, setPicked] = useState<"A" | "B" | null>(null);
  const q = room.previewQuestion;
  const href = `/room/${room.id}?join=1`;

  useEffect(() => {
    router.prefetch(href);
  }, [router, href]);

  if (!q || q.type !== "balance" || !q.optionA || !q.optionB) return null;

  const pick = (value: "A" | "B") => {
    if (picked) return;
    setPicked(value);
    const key = answerDraftKey(room.id);
    const current = loadDraft<AnswerDraft>(key);
    saveDraft<AnswerDraft>(key, {
      nickname: "",
      ...current,
      answers: { ...(current?.answers ?? {}), [q.id]: value },
      currentQuestion: room.questionCount > 1 ? 1 : 0,
    });
    router.push(href);
  };

  const sides = [
    { value: "A" as const, label: q.optionA },
    { value: "B" as const, label: q.optionB },
  ];

  return (
    <div className="relative pt-20 lg:pt-[106px]">
      {/* 턱을 카드 가장자리에 걸치고 앞발로 붙잡는다. 고르면 웃는다.
          카드 윗변이 얼굴 아래 끝(턱)에 오게 맞췄다. 더 올려 입 중간을 자르면 앞발 사이에
          흰 주둥이 조각만 남아 뒤집힌 U자처럼 보였다. */}
      <Fawn
        mood={picked ? "happy" : "default"}
        className="absolute right-10 top-0 h-24 w-24 sm:right-14 lg:h-32 lg:w-32"
      />
      <FawnPaws className="absolute right-14 top-[71px] z-20 sm:right-[4.5rem] lg:right-[5.5rem] lg:top-[97px]" />
    <div className="relative z-10 rounded-[32px] bg-white p-5 shadow-[0_2px_0_rgb(191_122_34/0.08),0_18px_40px_-18px_rgb(150_95_30/0.35)] sm:p-7">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-stone-600">
        <span className="font-semibold text-stone-800">{room.title}</span>
        {room.participantCount > 0 && (
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="tabular-nums">{room.participantCount}명 참여</span>
          </span>
        )}
        <span className="flex items-center gap-1">
          <Hourglass className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="tabular-nums">{formatRemainingShort(room.expiresAt)}</span>
        </span>
      </div>

      <p className="mt-3 break-keep text-2xl font-bold leading-snug tracking-tight text-stone-900 sm:text-[28px]">
        {q.title}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3" role="group" aria-label="하나를 고르면 이 방에 바로 참여해요">
        {sides.map(({ value, label }) => {
          const amber = value === "A";
          const isPicked = picked === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => pick(value)}
              disabled={picked !== null && !isPicked}
              aria-pressed={isPicked}
              className={cn(
                "pressable fawn-spots flex min-h-36 flex-col items-start justify-between rounded-[24px] p-4 text-left sm:min-h-44 sm:p-5",
                "transition-[transform,background-color,opacity] duration-200 disabled:opacity-40",
                amber
                  ? isPicked
                    ? "bg-brand text-brand-ink"
                    : "bg-amber-100 text-amber-950 hover:bg-amber-200"
                  : isPicked
                    ? "bg-teal-500 text-brand-ink"
                    : "bg-teal-100 text-teal-950 hover:bg-teal-200"
              )}
            >
              <span className="font-cute text-base opacity-70">{value}</span>
              <span className="break-keep text-lg font-bold leading-snug sm:text-xl">{label}</span>
            </button>
          );
        })}
      </div>

    </div>
    </div>
  );
}
