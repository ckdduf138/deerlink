"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Check, ChevronDown, Hourglass, Sparkles, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRemaining, formatRemainingShort } from "@/lib/format";
import { PUBLIC_ROOM_EXTENSION_LABEL } from "@/lib/room-lifetime";
import { participantPath } from "@/lib/room-url";
import { parseOptions, type Participant, type Question, type ResultsRoom } from "@/lib/types";
import { QUESTION_META } from "@/lib/question-meta";
import { BalanceRatioBar } from "@/components/ResultBar";
import { GroupReport } from "@/components/room/group-report";
import { FirstAnswerInsight, PrimaryInsight } from "@/components/results/primary-insight";
import { ResultsOutro } from "@/components/results/results-outro";
import { InviteActions, InviteNavButton, useInviteLink } from "@/components/share/invite-actions";
import { roomShareDescription } from "@/lib/room-share-text";
import {
  computeUnanimousAggregates,
  computeViewerSummary,
  primaryResultInsight,
  type ViewerSummary,
  viewerVerdict,
} from "@/lib/group-stats";
import { Fawn } from "@/components/Fawn";

type Picked = { id: string; nickname: string; value: string };

function answersFor(question: Question, participants: Participant[]): Picked[] {
  return participants.flatMap((p) => {
    const value = p.answers.find((a) => a.questionId === question.id)?.value;
    return value ? [{ id: p.id, nickname: p.nickname, value }] : [];
  });
}

/**
 * 비공개방이면 "민준, 하람도 같은 선택"처럼 이름으로, 공개방이면 인원으로 말한다.
 * 공개방 닉네임은 서버가 붙인 "참여자 N"이라 이름처럼 쓰면 안 된다.
 */
function SameAsMe({
  answers,
  viewerId,
  anonymous,
}: {
  answers: Picked[];
  viewerId: string;
  anonymous: boolean;
}) {
  const mine = answers.find((a) => a.id === viewerId);
  if (!mine || answers.length < 2) return null;
  const same = answers.filter((a) => a.id !== viewerId && a.value === mine.value);

  // 사슴은 이 질문에서 내 선택이 특별할 때만 표정을 바꾼다: 나 혼자면 놀라고, 모두 같으면 웃는다.
  const alone = same.length === 0;
  const everyone = same.length === answers.length - 1;
  let text: string;
  if (alone) text = "나만 이 선택을 했어요";
  else if (anonymous) text = `나 말고 ${same.length}명이 같은 선택을 했어요`;
  else if (everyone) text = "모두 나와 같은 선택이에요";
  else text = `${same.map((a) => a.nickname).join(", ")}도 같은 선택`;

  return (
    <p
      className={cn(
        "mt-4 flex items-center gap-2 rounded-2xl py-2 pl-2 pr-4 text-[15px] font-medium",
        alone ? "bg-teal-50 text-teal-900" : everyone ? "bg-amber-50 text-amber-900" : "bg-page text-stone-700"
      )}
    >
      <Fawn mood={alone ? "wow" : everyone ? "happy" : "default"} className="h-9 w-9 flex-shrink-0" />
      {text}
    </p>
  );
}

/* ─── Balance ─────────────────────────────── */

function BalanceResult({
  question,
  answers,
  viewerId,
  anonymous,
}: {
  question: Question;
  answers: Picked[];
  viewerId: string | null;
  anonymous: boolean;
}) {
  const countA = answers.filter((a) => a.value === "A").length;
  const countB = answers.filter((a) => a.value === "B").length;
  const mine = answers.find((a) => a.id === viewerId)?.value;

  return (
    <div>
      <BalanceRatioBar
        a={{ label: question.optionA ?? "A", count: countA }}
        b={{ label: question.optionB ?? "B", count: countB }}
        mine={mine === "A" ? "a" : mine === "B" ? "b" : null}
      />
      {viewerId && <SameAsMe answers={answers} viewerId={viewerId} anonymous={anonymous} />}
      {!anonymous && (
        <PeopleList
          answers={answers}
          viewerId={viewerId}
          render={(a) => {
            const isA = a.value === "A";
            return (
              <span
                className={cn(
                  "rounded-lg px-2.5 py-1 text-sm font-semibold",
                  isA ? "bg-amber-50 text-amber-900" : "bg-teal-50 text-teal-900"
                )}
              >
                {isA ? question.optionA : question.optionB}
              </span>
            );
          }}
        />
      )}
    </div>
  );
}

/* ─── Multiple ────────────────────────────── */

function MultipleResult({
  question,
  answers,
  viewerId,
  anonymous,
}: {
  question: Question;
  answers: Picked[];
  viewerId: string | null;
  anonymous: boolean;
}) {
  const options = parseOptions(question.options);
  const total = answers.length;
  const counts = options.map((_, i) => answers.filter((a) => a.value === String(i)).length);
  const maxCount = Math.max(...counts, 0);
  const mine = answers.find((a) => a.id === viewerId)?.value;

  return (
    <div>
      <ul className="space-y-3.5">
        {options.map((opt, i) => {
          const count = counts[i];
          const pct = total ? Math.round((count / total) * 100) : 0;
          const isTop = count > 0 && count === maxCount;
          const isMine = mine === String(i);
          return (
            <li key={i}>
              <div className="mb-1.5 flex items-baseline justify-between gap-4">
                <span
                  className={cn(
                    "flex min-w-0 items-center gap-1.5 text-base",
                    isTop || isMine ? "font-semibold text-stone-900" : "text-stone-700"
                  )}
                >
                  <span className="min-w-0 break-words">{opt}</span>
                  {isMine && (
                    <span className="flex-shrink-0 rounded-md bg-amber-800 px-1.5 py-0.5 text-xs font-bold text-white">
                      나
                    </span>
                  )}
                </span>
                <span className="flex-shrink-0 text-sm tabular-nums text-stone-600">
                  <span className={cn(isTop && "font-semibold text-stone-900")}>{pct}%</span>
                  <span className="ml-1.5">{count}명</span>
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-stone-100" aria-hidden="true">
                {count > 0 && (
                  <div
                    className={cn("h-full rounded-full", isTop ? "bg-brand" : "bg-stone-300")}
                    style={{ width: `${pct}%` }}
                  />
                )}
              </div>
            </li>
          );
        })}
      </ul>
      {viewerId && <SameAsMe answers={answers} viewerId={viewerId} anonymous={anonymous} />}
      {!anonymous && (
        <PeopleList
          answers={answers}
          viewerId={viewerId}
          render={(a) => (
            <span className="max-w-[60%] break-words text-right text-sm font-medium text-stone-900">
              {options[Number(a.value)] ?? "선택 확인 불가"}
            </span>
          )}
        />
      )}
    </div>
  );
}

/* ─── Subjective ──────────────────────────── */

function SubjectiveResult({
  answers,
  viewerId,
  anonymous,
}: {
  answers: Picked[];
  viewerId: string | null;
  anonymous: boolean;
}) {
  if (answers.length === 0) {
    return <p className="text-sm text-stone-600">아직 답변이 없어요</p>;
  }

  const mine = answers.find((a) => a.id === viewerId);
  const others = answers.filter((a) => a.id !== viewerId);

  return (
    <div>
      {mine && (
        <div className="rounded-xl bg-amber-50 px-4 py-3.5">
          <p className="text-sm font-semibold text-amber-900">내 답</p>
          <p className="mt-1 break-words text-base leading-relaxed text-amber-950">{mine.value}</p>
        </div>
      )}
      {others.length > 0 && (
        <details className="group mt-3" open={!mine}>
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-sm font-medium text-stone-700 marker:hidden hover:text-stone-900">
            {mine ? `다른 답 ${others.length}개` : `답변 ${others.length}개`}
            <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <ul className="divide-y divide-stone-200 border-t border-stone-200">
            {others.map((answer) => (
              <li key={answer.id} className="py-3">
                {!anonymous && (
                  <p className="text-sm font-medium text-stone-600">{answer.nickname}</p>
                )}
                <p className="break-words text-base leading-relaxed text-stone-900">{answer.value}</p>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

function PeopleList({
  answers,
  viewerId,
  render,
}: {
  answers: Picked[];
  viewerId: string | null;
  render: (answer: Picked) => ReactNode;
}) {
  if (answers.length === 0) return null;
  return (
    <details className="group mt-3 border-t border-stone-100 pt-1">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between text-[15px] font-semibold text-stone-700 marker:hidden hover:text-stone-900">
        누가 뭘 골랐는지 보기
        <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <ul className="space-y-2.5 pb-1">
        {answers.map((a) => (
          <li key={a.id} className="flex items-center justify-between gap-4">
            <span className="min-w-0 break-words text-sm text-stone-700">
              {a.nickname}
              {a.id === viewerId && <span className="ml-1 text-stone-500">(나)</span>}
            </span>
            {render(a)}
          </li>
        ))}
      </ul>
    </details>
  );
}

/* ─── 나의 결과 ───────────────────────────── */

const VERDICT_MOOD = { majority: "happy", balanced: "default", independent: "wow" } as const;

/**
 * "4 / 4" 같은 숫자는 읽고 나서 해석해야 했다. 한마디 판정(대세파·균형파·소신파)과
 * 사슴 표정으로 바로 읽히게 한다. 판정 기준은 group-stats의 viewerVerdict 하나뿐이다.
 */
function ViewerVerdictCard({ summary }: { summary: ViewerSummary }) {
  const verdict = viewerVerdict(summary);
  const reduceMotion = useReducedMotion();
  if (!verdict && !summary.closest) return null;

  return (
    <section aria-label="나의 결과" className="surface mb-8 p-5 sm:p-6">
      {verdict && (
        <div className="flex items-center gap-4">
          {/* 결과가 열리는 순간의 반응. 스프링으로 한 번 톡 튀어나오고 끝난다 (반복 없음) */}
          <motion.div
            initial={reduceMotion ? false : { transform: "scale(0.8) rotate(-8deg)" }}
            animate={{ transform: "scale(1) rotate(0deg)" }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.35, delay: 0.1 }}
            className="flex-shrink-0"
          >
            <Fawn mood={VERDICT_MOOD[verdict.kind]} className="h-16 w-16" />
          </motion.div>
          <div className="min-w-0">
            <p className="font-cute text-[26px] leading-tight text-stone-900">
              나는 <span className="text-amber-700">{verdict.label}</span>
            </p>
            <p className="mt-1 text-sm text-stone-600">{verdict.detail}</p>
          </div>
        </div>
      )}
      {summary.closest && (
        <div
          className={cn(
            "flex items-center justify-between gap-4 rounded-2xl bg-page px-4 py-3",
            verdict && "mt-4"
          )}
        >
          <span className="text-[15px] text-stone-600">나랑 제일 잘 맞는 사람</span>
          <span className="flex min-w-0 items-baseline gap-2">
            <span className="truncate text-base font-semibold text-stone-900">{summary.closest.other.nickname}</span>
            <span className="font-cute text-2xl tabular-nums text-amber-700">{summary.closest.pct}%</span>
          </span>
        </div>
      )}
    </section>
  );
}

/* ─── Main ───────────────────────────────── */

/**
 * 하단 초대 패널이 화면에 들어왔거나 지나갔으면 떠 있는 초대 버튼을 숨긴다.
 * 같은 기능이 이미 보이는데 주 버튼이 두 개 겹치면 아웃트로의 "내 방 만들기"와 경쟁한다.
 */
function useReachedInvitePanel(id: string) {
  const [reached, setReached] = useState(false);
  useEffect(() => {
    const target = document.getElementById(id);
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => {
      setReached(entry.isIntersecting || entry.boundingClientRect.top < 0);
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, [id]);
  return reached;
}

export function ResultsClient({
  room,
  viewerId = null,
  archived = false,
}: {
  room: ResultsRoom;
  viewerId?: string | null;
  archived?: boolean;
}) {
  const invite = useInviteLink({ roomId: room.id, roomTitle: room.title });
  const reachedInvitePanel = useReachedInvitePanel("invite-panel");
  const shareDescription = roomShareDescription({
    expired: false,
    isPublic: room.isPublic,
    questionCount: room.questions.length,
    participantCount: room.participants.length,
  });

  const count = room.participants.length;
  const viewer = viewerId ? room.participants.find((p) => p.id === viewerId) ?? null : null;
  const me = viewer?.id ?? null;
  const primaryInsight = primaryResultInsight(room);
  const rawSummary = me && count >= 2 ? computeViewerSummary(room, me) : null;
  // 최고 궁합에 내가 들어 있으면 바로 아래 인사이트가 같은 사람·같은 숫자를 다시 말한다.
  const meInBestPair =
    primaryInsight?.kind === "best-pair" &&
    (primaryInsight.pair.a.id === me || primaryInsight.pair.b.id === me);
  const summary =
    rawSummary && meInBestPair ? { ...rawSummary, closest: null } : rawSummary;
  const unanimousIds = new Set(computeUnanimousAggregates(room).map((a) => a.question.id));
  const canInvite = !archived;

  const inviteHeading = room.isPublic ? "친구 부르고 하루 더 열기" : "친구 더 부르기";
  // 공개방 문장은 수명 연장(유일한 유포 동기)을 설명하는 자리라 줄이더라도 남은 시간은 문장 안에 둔다.
  const inviteBody = room.isPublic
    ? `한 명 답할 때마다 ${PUBLIC_ROOM_EXTENSION_LABEL} 더 열려요, 지금 ${formatRemaining(room.expiresAt)}`
    : "많이 모일수록 궁합이 정확해져요";

  return (
    <div className="min-h-[100dvh] bg-page text-stone-900">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-stone-100 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-3 sm:px-4 lg:max-w-6xl">
          <Link
            href="/"
            aria-label="홈으로 돌아가기"
            className="-ml-2 flex min-h-11 min-w-11 items-center gap-2 px-2 text-sm text-stone-700 transition-colors hover:text-stone-900"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span className="font-semibold tracking-tight">Deerlink</span>
          </Link>
          {canInvite && count > 0 && <InviteNavButton invite={invite} />}
        </div>
      </nav>

      <main className="mx-auto max-w-2xl px-4 pb-32 pt-20 sm:pt-24 md:pb-16 lg:max-w-6xl">
        {/* 데스크톱(lg)은 2단: 왼쪽 위 제목·판정, 왼쪽 아래 인사이트·초대,
            오른쪽 질문별 결과. 모바일은 DOM 순서 그대로 한 줄이다. 순서를 바꾸면 모바일이 깨진다. */}
        <div className="lg:grid lg:grid-cols-[minmax(0,25rem)_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-10">
          <div className="lg:col-start-1 lg:row-start-1">
        {/* 진입 애니메이션을 두지 않는다. opacity 0에서 시작하면 서버 HTML의 제목이
            하이드레이션이 끝날 때까지 흐리게 박혀 있다 (로비에서 이미 한 번 고친 문제). */}
        <header className="mb-8 px-1">
          <h1 className="break-words text-[30px] font-cute leading-tight text-stone-900 sm:text-4xl">
            {room.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[15px] text-stone-600">
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" aria-hidden="true" />
              {count}명 참여
            </span>
            {archived ? (
              <span>종료된 방</span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Hourglass className="h-4 w-4" aria-hidden="true" />
                {formatRemainingShort(room.expiresAt)}
              </span>
            )}
            {unanimousIds.size > 0 && (
              <span className="flex items-center gap-1.5 font-medium text-amber-800">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                만장일치 {unanimousIds.size}개
              </span>
            )}
          </div>
        </header>

        {/* 공개방은 답하지 않고도 결과를 볼 수 있다. 그 사람에게 가장 필요한 건 "나도 답하기"다. */}
        {room.isPublic && !viewer && !archived && (
          <div className="surface mb-8 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="font-cute text-xl text-stone-900">나는 뭘 고를까?</p>
            </div>
            <Link href={participantPath(room.id)} className="btn-primary flex-shrink-0">
              나도 답하기
            </Link>
          </div>
        )}

        {count === 0 && canInvite && (
          <section aria-labelledby="empty-results-heading" className="surface p-6">
            <h2 id="empty-results-heading" className="text-xl font-cute text-stone-900">
              아직 아무도 답하지 않았어요
            </h2>
            <p className="mt-2 text-base leading-relaxed text-stone-600">
              첫 답변이 도착하면 비교가 시작돼요.
              {room.isPublic && ` 한 명 답할 때마다 이 방이 ${PUBLIC_ROOM_EXTENSION_LABEL} 더 열려요.`}
            </p>
            <InviteActions
              className="mt-5"
              invite={invite}
              roomId={room.id}
              roomTitle={room.title}
              description={shareDescription}
            />
          </section>
        )}

        {summary && <ViewerVerdictCard summary={summary} />}

        {count === 1 && <FirstAnswerInsight />}

          </div>

          <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
        {count > 0 && (
          <section aria-labelledby="question-results-heading">
            <h2 id="question-results-heading" className="mb-3 px-1 text-xl font-cute text-stone-900">
              질문별 결과
            </h2>
            <ol className="space-y-3">
              {room.questions.map((q, idx) => {
                const answers = answersFor(q, room.participants);
                const Icon = QUESTION_META[q.type].icon;
                return (
                  <li key={q.id} className="surface p-5 sm:p-6">
                    <h3 className="mb-5 flex items-start gap-2.5 text-lg font-bold leading-snug tracking-tight text-stone-900">
                      <span className="mt-0.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-stone-100 px-1.5 text-[13px] font-bold tabular-nums text-stone-600">
                        {idx + 1}
                      </span>
                      <span className="min-w-0 flex-1 break-words">{q.title}</span>
                      <Icon className="mt-1 h-4 w-4 flex-shrink-0 text-stone-500" aria-hidden="true" />
                      <span className="sr-only">{QUESTION_META[q.type].label}</span>
                      {unanimousIds.has(q.id) && (
                        <span className="flex flex-shrink-0 items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-sm font-medium text-amber-900">
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                          만장일치
                        </span>
                      )}
                    </h3>

                    {q.type === "balance" && (
                      <BalanceResult question={q} answers={answers} viewerId={me} anonymous={room.isPublic} />
                    )}
                    {q.type === "multiple" && (
                      <MultipleResult question={q} answers={answers} viewerId={me} anonymous={room.isPublic} />
                    )}
                    {q.type === "subjective" && (
                      <SubjectiveResult answers={answers} viewerId={me} anonymous={room.isPublic} />
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        )}

          </div>

          <div className="lg:col-start-1 lg:row-start-2 lg:[&>*:first-child]:mt-0">
        {/* 사람들이 결과에 오는 이유는 "누가 뭘 골랐나"다. 질문별 결과를 먼저 두고,
            궁합·소수파 같은 인사이트는 그 아래에 접지 않고 펼쳐 둔다. */}
        {count >= 2 && (
          <div className="mt-10">
            <PrimaryInsight room={room} viewerId={me} />
            {!room.isPublic && <GroupReport room={room} primaryKind={primaryInsight?.kind ?? null} />}
          </div>
        )}

        {count > 0 && canInvite && (
          <section id="invite-panel" aria-labelledby="invite-heading" className="surface mt-10 p-5 sm:p-6">
            <h2 id="invite-heading" className="text-xl font-cute text-stone-900">
              {inviteHeading}
            </h2>
            <p className="mt-1.5 text-[15px] leading-relaxed text-stone-600">{inviteBody}</p>
            <InviteActions
              className="mt-5"
              invite={invite}
              roomId={room.id}
              roomTitle={room.title}
              description={shareDescription}
            />
            {!room.isPublic && (
              <details className="group -mb-2 mt-3 border-t border-stone-100">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between text-sm font-medium text-stone-700 marker:hidden hover:text-stone-900">
                  지금까지 참여한 {count}명
                  <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <ul className="flex flex-wrap gap-1.5 pb-4">
                  {room.participants.map((p) => (
                    <li
                      key={p.id}
                      className="rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-900"
                    >
                      {p.nickname}
                      {p.id === me && " (나)"}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </section>
        )}

          </div>
        </div>

        <ResultsOutro isPublic={room.isPublic} />
      </main>

      {/* 초대는 이 제품이 퍼지는 유일한 경로라 결과를 보는 내내 손 닿는 곳에 둔다.
          데스크톱은 상단 네비 버튼이 같은 일을 하니 모바일에서만 띄운다. */}
      {canInvite && count > 0 && !reachedInvitePanel && (
        <div className="bottom-dock md:hidden">
          <button
            type="button"
            onClick={invite.canShare ? invite.share : invite.copy}
            disabled={!invite.url}
            className="btn-primary w-full"
          >
            {invite.copied ? "링크 복사했어요" : room.isPublic ? "친구 부르고 하루 더 열기" : "친구 초대하기"}
          </button>
        </div>
      )}
    </div>
  );
}
