"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { CreateEditor } from "@/components/create/create-editor";
import { PackPicker } from "@/components/create/pack-picker";
import { useHydrated } from "@/lib/use-hydrated";
import { CREATE_DRAFT_KEY, loadDraft, type CreateDraft } from "@/lib/draft-storage";
import { packQuestions, type QuestionPack } from "@/data/question-packs";

export default function CreateRoomPage() {
  const hydrated = useHydrated();
  const [pack, setPack] = useState<QuestionPack | null>(null);
  const [skipped, setSkipped] = useState(false);
  // pack/skipped가 이미 기본값(null/false)이면 같은 값을 다시 set해도 리렌더가 안 일어난다 —
  // "새로 쓰기"가 그 상태에서 호출되면 PackPicker로 못 돌아가고 그대로 멈춘다. 매번 값이
  // 바뀌는 더미 상태를 하나 더 둬서 리렌더를 강제한다.
  const [, forceReset] = useState(0);

  // 임시저장을 읽기 전에 빈 폼을 그리면 작성 중이던 내용이 날아간 것처럼 보인다
  if (!hydrated) {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
      </div>
    );
  }

  const saved = loadDraft<CreateDraft>(CREATE_DRAFT_KEY);
  const hasContent = Boolean(saved?.title || saved?.questions?.length);

  // "새로 쓰기"는 임시저장만 지우는 게 아니라 테마 선택 화면으로도 되돌아가야 한다 —
  // 안 그러면 PackPicker의 "아니요, 직접 만들게요"와 의미가 겹치면서 결과만 달라진다.
  const resetToPicker = () => {
    setPack(null);
    setSkipped(false);
    forceReset((n) => n + 1);
  };

  // 이미 쓰던 게 있으면 테마 화면 없이 바로 이어서 — 테마 선택도, 건너뛰기도 안 눌렀을 때만
  if (!hasContent && !pack && !skipped) {
    return (
      <PackPicker
        onPick={setPack}
        onSkip={() => setSkipped(true)}
      />
    );
  }

  if (pack) {
    const draft: CreateDraft = {
      title: pack.roomTitle,
      questions: packQuestions(pack).map((q) => ({
        id: q.id,
        type: q.type,
        title: q.title,
        optionA: q.optionA,
        optionB: q.optionB,
        options: q.options,
      })),
    };
    return <CreateEditor initialDraft={draft} initialSource="pack" onStartOver={resetToPicker} />;
  }

  return (
    <CreateEditor initialDraft={hasContent ? saved : null} onStartOver={resetToPicker} />
  );
}
