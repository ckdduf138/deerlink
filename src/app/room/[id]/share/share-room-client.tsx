"use client";

import Link from "next/link";
import { Check, ListChecks } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { AntlerLogo } from "@/components/landing/AntlerLogo";
import { InviteActions, useInviteLink } from "@/components/share/invite-actions";
import { formatEstimatedDuration } from "@/lib/format";
import { roomShareDescription } from "@/lib/room-share-text";
import { participantPath } from "@/lib/room-url";
import type { LobbyRoom } from "@/lib/types";

export function ShareRoomClient({ room }: { room: LobbyRoom }) {
  const invite = useInviteLink({ roomId: room.id, roomTitle: room.title });
  const inviteUrl = invite.url;
  const shareDescription = roomShareDescription({
    expired: false,
    isPublic: room.isPublic,
    questionCount: room.questions.length,
    participantCount: room.participants.length,
  });

  return (
    <main className="min-h-screen bg-page px-4 pb-12 pt-10 text-stone-900 sm:pt-14">
      <div className="mx-auto max-w-md">
        <div className="mb-8 flex items-center gap-2 text-sm font-semibold tracking-tight text-stone-900">
          <AntlerLogo className="h-[18px] w-3.5 text-amber-500" />
          Deerlink
        </div>

        <div className="mb-7">
          <h1 className="flex items-center gap-2 text-3xl font-cute leading-tight text-stone-900">
            <Check className="h-7 w-7 text-amber-700" aria-hidden="true" />
            방을 만들었어요
          </h1>
          <p className="mt-3 break-words text-base leading-relaxed text-stone-600">{room.title}</p>
          <div className="mt-3 flex items-center gap-x-3 text-sm text-stone-600">
            <span className="flex items-center gap-1.5">
              <ListChecks className="h-4 w-4" aria-hidden="true" />
              {room.questions.length}개 질문
            </span>
            <span>{formatEstimatedDuration(room.questions.length)}</span>
          </div>
        </div>

        <section aria-labelledby="invite-heading" className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
          <div className="border-b border-stone-100 px-5 py-4">
            <h2 id="invite-heading" className="text-base font-bold text-stone-900">
              친구를 초대하세요
            </h2>
          </div>
          <div className="flex justify-center border-b border-stone-100 py-6">
            {inviteUrl ? (
              <div role="img" aria-label="참여 링크 QR 코드">
                <QRCodeSVG
                  value={inviteUrl}
                  size={176}
                  fgColor="#1c1917"
                  bgColor="transparent"
                  imageSettings={{ src: "/icon.png", width: 28, height: 28, excavate: true }}
                />
              </div>
            ) : (
              <div className="h-44 w-44 animate-pulse rounded-xl bg-stone-100" role="status">
                <span className="sr-only">QR 코드 준비 중</span>
              </div>
            )}
          </div>
          <InviteActions
            className="px-5 pb-3 pt-5"
            invite={invite}
            roomId={room.id}
            roomTitle={room.title}
            description={shareDescription}
          />
        </section>

        <Link
          href={participantPath(room.id)}
          className="mt-5 flex min-h-12 w-full items-center justify-center rounded-xl bg-amber-700 px-5 text-sm font-semibold text-white shadow-lg shadow-amber-900/25 transition-colors hover:bg-amber-800"
        >
          나도 답하기
        </Link>
        <Link
          href="/"
          className="mt-2 flex min-h-11 w-full items-center justify-center text-sm text-stone-600 transition-colors hover:text-stone-900"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </main>
  );
}
