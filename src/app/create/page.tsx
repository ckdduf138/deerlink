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

  // 이미 쓰던 게 있으면 팩 화면 없이 바로 이어서 — 팩 선택도, 건너뛰기도 안 눌렀을 때만
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
    return <CreateEditor initialDraft={draft} initialSource="pack" />;
  }

  return <CreateEditor initialDraft={hasContent ? saved : null} />;
}
