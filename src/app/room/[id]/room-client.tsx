"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Lobby } from "@/components/room/lobby";
import { AnswerMode, type SubmitResult } from "@/components/room/answer-mode";
import {
  answerDraftKey,
  clearDraft,
  draftSnapshot,
  parseDraft,
  saveDraft,
  subscribeDrafts,
  type AnswerDraft,
} from "@/lib/draft-storage";
import type { LobbyRoom } from "@/lib/types";

const EMPTY_DRAFT: AnswerDraft = {
  nickname: "",
  answers: {},
  currentQuestion: 0,
};

function createSubmissionId(): string {
  return crypto.randomUUID();
}

/**
 * 이 화면은 공유 링크를 받은 사람이 처음 보는 곳이라 서버에서 바로 그려져야 한다.
 * 임시저장은 localStorage에만 있으므로 스토어로 구독해서, 서버 렌더는 빈 draft로
 * 시작하고 하이드레이션 뒤에 저장된 값으로 채운다.
 */
export function RoomClient({ room }: { room: LobbyRoom }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // 발견 피드(랜딩 티저 · /discover)에서 온 방문자는 공개방 QR 로비를 볼 이유가 없다 —
  // 닉네임도 필요 없으니 바로 답변 화면으로 들어간다.
  const skipLobby = searchParams.get("join") === "1" && room.isPublic;
  const draftKey = answerDraftKey(room.id);
  const submissionIdRef = useRef<string | null>(null);
  const [mode, setMode] = useState<"lobby" | "answer">(skipLobby ? "answer" : "lobby");

  useEffect(() => {
    if (!searchParams.has("join") && !searchParams.has("new")) return;
    const normalized = new URLSearchParams(searchParams.toString());
    normalized.delete("join");
    normalized.delete("new");
    const suffix = normalized.toString();
    router.replace(`/room/${room.id}${suffix ? `?${suffix}` : ""}`, { scroll: false });
  }, [room.id, router, searchParams]);

  const raw = useSyncExternalStore(
    subscribeDrafts,
    () => draftSnapshot(draftKey),
    () => null
  );
  const draft = useMemo(
    () => ({ ...EMPTY_DRAFT, ...(parseDraft<AnswerDraft>(raw) ?? {}) }),
    [raw]
  );

  const handleAnswersChange = useCallback(
    (answers: Record<string, string>, currentQuestion: number) => {
      const current = parseDraft<AnswerDraft>(draftSnapshot(draftKey)) ?? EMPTY_DRAFT;
      saveDraft(draftKey, { ...current, answers, currentQuestion });
    },
    [draftKey]
  );

  const handleStart = (nickname: string) => {
    submissionIdRef.current ??= draft.submissionId ?? createSubmissionId();
    saveDraft(draftKey, {
      ...draft,
      nickname,
      submissionId: submissionIdRef.current,
    });
    setMode("answer");
  };

  const handleComplete = async (
    answers: Record<string, string>
  ): Promise<SubmitResult> => {
    const savedDraft = parseDraft<AnswerDraft>(draftSnapshot(draftKey)) ?? draft;
    submissionIdRef.current ??= savedDraft.submissionId ?? createSubmissionId();
    const submissionId = submissionIdRef.current;

    saveDraft(draftKey, {
      ...savedDraft,
      answers,
      submissionId,
    });

    try {
      const res = await fetch(`/api/rooms/${room.id}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: savedDraft.nickname,
          submissionId,
          answers: Object.entries(answers).map(([questionId, value]) => ({
            questionId,
            value,
          })),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        return { ok: false, message: body?.error ?? "제출에 실패했어요." };
      }

      clearDraft(draftKey);
      router.push(`/room/${room.id}/results`);
      return { ok: true };
    } catch {
      return { ok: false, message: "네트워크 연결을 확인하고 다시 시도해주세요." };
    }
  };

  const answeredCount = Object.keys(draft.answers).length;
  const canResume = answeredCount > 0 && (room.isPublic || draft.nickname.length > 0);

  const handleExit = () => {
    if (!room.isPublic) {
      setMode("lobby");
      return;
    }
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/discover");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] text-stone-900">
      <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-amber-100 bg-white/90 px-4 py-4 backdrop-blur-md md:px-8">
        <Link
          href="/"
          aria-label="홈으로 돌아가기"
          className="flex min-h-11 min-w-11 items-center gap-2 text-sm text-stone-600 transition-colors hover:text-stone-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Deerlink</span>
        </Link>
        {mode === "answer" && (
          <button
            onClick={handleExit}
            className="min-h-11 px-2 text-sm text-stone-600 transition-colors hover:text-stone-900"
          >
            나가기
          </button>
        )}
      </nav>

      {mode === "lobby" ? (
        <>
          <Lobby
            key={draft.nickname ? "restored" : "fresh"}
            room={room}
            initialNickname={draft.nickname}
            onStart={handleStart}
          />
          {canResume && (
            <div className="mx-auto -mt-4 max-w-md px-4 pb-10">
              <button
                onClick={() => setMode("answer")}
                className="min-h-11 w-full rounded-xl border border-amber-200 bg-amber-50 px-4 text-sm text-amber-900 transition-colors hover:bg-amber-100"
              >
                이어서 답변하기 ({answeredCount}/{room.questions.length}개 완료)
              </button>
            </div>
          )}
        </>
      ) : (
        <AnswerMode
          room={room}
          nickname={draft.nickname}
          initialAnswers={draft.answers}
          initialQuestion={draft.currentQuestion}
          onAnswersChange={handleAnswersChange}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
}
