"use client";

import { useState } from "react";
import { Clock3, Globe, Hourglass, ListChecks, Lock, Users } from "lucide-react";
import { formatEstimatedDuration, formatRemainingShort } from "@/lib/format";
import { PUBLIC_ROOM_EXTENSION_LABEL } from "@/lib/room-lifetime";
import type { LobbyRoom } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Fawn, FawnPaws } from "@/components/Fawn";

const NICKNAME_MAX = 20;

export function Lobby({
  room,
  initialNickname,
  onStart,
  resume = null,
}: {
  room: LobbyRoom;
  initialNickname: string;
  onStart: (nickname: string) => void;
  /** 임시저장된 답이 있으면 버튼이 "이어서 답하기"가 된다. 시작해도 저장된 답은 그대로 이어진다. */
  resume?: { answered: number } | null;
}) {
  const [nickname, setNickname] = useState(initialNickname);
  const trimmed = nickname.trim();
  const isDuplicate = !room.isPublic && room.participants.some((p) => p.nickname === trimmed);
  const canStart = room.isPublic || (trimmed.length > 0 && !isDuplicate);

  const handleStart = () => {
    if (canStart) onStart(room.isPublic ? "" : trimmed);
  };

  return (
    // 공유 링크를 받은 사람이 처음 보는 화면이라 등장 애니메이션을 걸지 않는다.
    // initial opacity 0은 서버 HTML에 그대로 박혀서, 카톡 인앱 브라우저처럼 JS가 늦게 도는
    // 환경에선 하이드레이션 전까지 제목과 "바로 답하기"가 안 보였다 (HeroSection과 같은 이유).
    <main className="mx-auto max-w-lg px-4 pb-36 pt-20 sm:pt-24 md:pb-20">
      <div className="relative pt-20">
        {/* 카드 뒤에서 빼꼼. 공유 링크로 처음 온 사람이 보는 첫 얼굴이다 */}
        <Fawn mood="default" className="absolute left-1/2 top-0 h-24 w-24 -translate-x-1/2" />
        <FawnPaws className="absolute left-1/2 top-[71px] z-20 -translate-x-1/2" />
      <section className="surface relative z-10 p-6 pt-8 sm:p-8 sm:pt-10">
        <span
          className={cn(
            "inline-flex min-h-8 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold",
            room.isPublic ? "bg-teal-50 text-teal-900" : "bg-amber-50 text-amber-900"
          )}
        >
          {room.isPublic ? <Globe className="h-3.5 w-3.5" aria-hidden="true" /> : <Lock className="h-3.5 w-3.5" aria-hidden="true" />}
          {room.isPublic ? "공개방" : "비공개방"}
        </span>

        <h1 className="mt-4 break-words text-[28px] font-cute leading-tight text-stone-900 sm:text-[32px]">
          {room.title}
        </h1>

        <dl className="mt-6 grid grid-cols-3 gap-2 text-center">
          {[
            { icon: ListChecks, label: "질문", value: `${room.questions.length}개` },
            { icon: Clock3, label: "소요", value: formatEstimatedDuration(room.questions.length) },
            { icon: Hourglass, label: "남은 시간", value: formatRemainingShort(room.expiresAt) },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-2xl bg-page px-2 py-3.5">
              <dt className="flex items-center justify-center gap-1 text-[13px] text-stone-600">
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {label}
              </dt>
              <dd className="font-cute mt-1 text-lg tabular-nums text-stone-900">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 border-t border-stone-100 pt-6">
          <p className="font-cute text-xl text-stone-900">
            {room.isPublic ? "닉네임 없이 바로 답해요" : "다 답하면 친구들 답이 열려요"}
          </p>
          {room.isPublic && (
            <p className="mt-3 flex items-center gap-2 rounded-xl bg-teal-50 px-4 py-3 text-[15px] font-medium text-teal-900">
              <Clock3 className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              지금 답하면 이 방이 {PUBLIC_ROOM_EXTENSION_LABEL} 더 열려요
            </p>
          )}
        </div>

        {room.participants.length > 0 && (
          <div className="mt-6 border-t border-stone-100 pt-6">
            <p className="flex items-center gap-1.5 text-[15px] font-semibold text-stone-800">
              <Users className="h-4 w-4" aria-hidden="true" />
              {room.participants.length}명 답함
            </p>
            {!room.isPublic && (
              <div className="mt-3 flex flex-wrap gap-1.5" aria-label="참여자">
                {room.participants.map((participant) => (
                  <span
                    key={participant.id}
                    className="max-w-full truncate rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-900"
                  >
                    {participant.nickname}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
      </div>

      {!room.isPublic && (
        <div className="mt-4">
          <label htmlFor="nickname" className="mb-2 block px-1 text-[15px] font-semibold text-stone-800">
            친구들이 알아볼 이름
          </label>
          <input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleStart();
            }}
            maxLength={NICKNAME_MAX}
            autoComplete="nickname"
            placeholder="닉네임 입력"
            aria-invalid={isDuplicate}
            aria-describedby={isDuplicate ? "nickname-error" : "nickname-count"}
            className={cn(
              "min-h-14 w-full rounded-2xl bg-white px-5 text-[17px] font-medium text-stone-900 outline-none ring-2 transition-shadow placeholder:text-stone-500",
              isDuplicate ? "ring-red-400" : "ring-transparent focus:ring-amber-400"
            )}
          />
          <div className="mt-2 flex items-start justify-between gap-3 px-1">
            {isDuplicate ? (
              <p id="nickname-error" className="text-sm leading-relaxed text-red-700" role="alert">
                이미 사용 중인 닉네임이에요. 다른 이름을 입력해 주세요.
              </p>
            ) : (
              <span />
            )}
            <span id="nickname-count" className="flex-shrink-0 text-sm tabular-nums text-stone-500">
              {nickname.length}/{NICKNAME_MAX}
            </span>
          </div>
        </div>
      )}

      <div className="bottom-dock">
        <div className="mx-auto max-w-lg">
          <button type="button" onClick={handleStart} disabled={!canStart} className="btn-primary w-full">
            {!canStart
              ? isDuplicate
                ? "다른 닉네임을 써 주세요"
                : "닉네임을 입력해 주세요"
              : resume
                ? `이어서 답하기 (${resume.answered}/${room.questions.length})`
                : room.isPublic
                  ? "바로 답하기"
                  : "참여하기"}
          </button>
        </div>
      </div>
    </main>
  );
}
