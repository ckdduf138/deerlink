"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Trash2, LogOut, Users, MessageSquare, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type Answer = { id: string; questionId: string; value: string };
type Participant = { id: string; nickname: string; answers: Answer[] };
type Question = {
  id: string;
  type: string;
  title: string;
  optionA: string | null;
  optionB: string | null;
  options: string | null;
  order: number;
};
type Room = {
  id: string;
  title: string;
  createdAt: string;
  expiresAt: string;
  questions: Question[];
  participants: Participant[];
};

type SortKey = "recent" | "participants";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isExpired(expiresAt: string) {
  return new Date(expiresAt) < new Date();
}

function getAnswerLabel(question: Question, value: string) {
  if (question.type === "balance") return value === "A" ? question.optionA ?? "A" : question.optionB ?? "B";
  if (question.type === "multiple") {
    try {
      const opts = JSON.parse(question.options ?? "[]") as string[];
      return opts[parseInt(value)] ?? value;
    } catch {
      return value;
    }
  }
  return value;
}

function RoomDetail({ room }: { room: Room }) {
  const { questions, participants } = room;

  if (participants.length === 0) {
    return <p className="text-xs text-stone-400 py-4 text-center">아직 참여자가 없어요</p>;
  }

  return (
    <div className="space-y-4">
      {questions.map((q) => (
        <div key={q.id} className="rounded-xl border border-stone-100 bg-stone-50 p-4">
          <div className="flex items-start gap-2 mb-3">
            <span className="text-[10px] text-stone-400 uppercase tracking-widest mt-0.5 flex-shrink-0">
              {q.type === "balance" ? "밸런스" : q.type === "multiple" ? "객관식" : "주관식"}
            </span>
            <p className="text-sm font-medium text-stone-800 leading-snug">{q.title}</p>
          </div>
          <div className="space-y-1.5">
            {participants.map((p) => {
              const ans = p.answers.find((a) => a.questionId === q.id);
              return (
                <div key={p.id} className="flex items-center justify-between gap-2">
                  <span className="text-xs text-stone-500 truncate max-w-[120px]">{p.nickname}</span>
                  {ans ? (
                    <span className="text-xs px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-700 font-medium truncate max-w-[200px]">
                      {getAnswerLabel(q, ans.value)}
                    </span>
                  ) : (
                    <span className="text-xs text-stone-300">미응답</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function RoomRow({ room, onDelete }: { room: Room; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const expired = isExpired(room.expiresAt);

  const handleDelete = async () => {
    if (!confirm) {
      setConfirm(true);
      setTimeout(() => setConfirm(false), 3000);
      return;
    }
    setDeleting(true);
    await fetch(`/api/admin/rooms/${room.id}`, { method: "DELETE" });
    onDelete(room.id);
  };

  return (
    <div className={cn("rounded-2xl border bg-white overflow-hidden", expired ? "border-stone-100" : "border-stone-200")}>
      {/* Header row */}
      <div
        className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-stone-50 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className={cn("text-sm font-semibold truncate", expired ? "text-stone-400" : "text-stone-900")}>
              {room.title}
            </p>
            {expired && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-400 flex-shrink-0">만료</span>
            )}
          </div>
          <p className="text-xs text-stone-400">{formatDate(room.createdAt)}</p>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0 text-xs text-stone-500">
          <div className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" />
            {room.questions.length}
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {room.participants.length}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {formatDate(room.expiresAt)}
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          disabled={deleting}
          className={cn(
            "flex-shrink-0 text-xs px-2.5 py-1.5 rounded-lg transition-colors",
            confirm
              ? "bg-red-500 text-white"
              : "text-stone-400 hover:text-red-500 hover:bg-red-50"
          )}
        >
          {deleting ? "..." : confirm ? "확인" : <Trash2 className="w-3.5 h-3.5" />}
        </button>

        {expanded ? (
          <ChevronUp className="w-4 h-4 text-stone-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-stone-400 flex-shrink-0" />
        )}
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-5 pb-5 pt-1 border-t border-stone-100">
          <RoomDetail room={room} />
        </div>
      )}
    </div>
  );
}

export function AdminClient({ initialRooms }: { initialRooms: Room[] }) {
  const [rooms, setRooms] = useState(initialRooms);
  const [sort, setSort] = useState<SortKey>("recent");
  const router = useRouter();

  const sorted = useMemo(() => {
    return [...rooms].sort((a, b) => {
      if (sort === "recent") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return b.participants.length - a.participants.length;
    });
  }, [rooms, sort]);

  const handleDelete = (id: string) => setRooms((prev) => prev.filter((r) => r.id !== id));

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  const totalParticipants = rooms.reduce((sum, r) => sum + r.participants.length, 0);
  const activeRooms = rooms.filter((r) => !isExpired(r.expiresAt)).length;

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-bold text-stone-900">관리자</h1>
            <p className="text-xs text-stone-400 mt-0.5">
              방 {rooms.length}개 · 활성 {activeRooms}개 · 참여자 {totalParticipants}명
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-600 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            로그아웃
          </button>
        </div>

        {/* Sort tabs */}
        <div className="flex gap-2 mb-4">
          {(["recent", "participants"] as SortKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setSort(key)}
              className={cn(
                "text-xs px-3 py-1.5 rounded-lg transition-colors",
                sort === key
                  ? "bg-amber-100 text-amber-700 font-medium"
                  : "text-stone-500 hover:text-stone-700 hover:bg-stone-100"
              )}
            >
              {key === "recent" ? "최근순" : "참여 많은 순"}
            </button>
          ))}
        </div>

        {/* Room list */}
        <div className="space-y-2">
          {sorted.length === 0 ? (
            <p className="text-sm text-stone-400 text-center py-16">방이 없어요</p>
          ) : (
            sorted.map((room) => (
              <RoomRow key={room.id} room={room} onDelete={handleDelete} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
