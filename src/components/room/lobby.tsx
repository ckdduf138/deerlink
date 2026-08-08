"use client";

import { useState, useSyncExternalStore } from "react";
import { ArrowRight, Check, Copy, ListChecks, Share2, Users } from "lucide-react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";
import { formatRemaining } from "@/lib/format";
import type { LobbyRoom } from "@/lib/types";
import { AntlerLogo } from "@/components/landing/AntlerLogo";
import { DeerHoofMark } from "@/components/DeerHoofMark";

const NICKNAME_MAX = 20;

// 방 주소는 브라우저에만 있다. 렌더 중 window를 읽으면 QR이 빈 값으로 하이드레이션된다.
const neverChanges = () => () => {};
const readHref = () => window.location.href;
const noHref = () => "";

export function Lobby({
  room,
  initialNickname,
  onStart,
}: {
  room: LobbyRoom;
  initialNickname: string;
  onStart: (nickname: string) => void;
}) {
  const [nickname, setNickname] = useState(initialNickname);
  const [copied, setCopied] = useState(false);
  const [shareFailed, setShareFailed] = useState(false);
  const url = useSyncExternalStore(neverChanges, readHref, noHref);

  const trimmed = nickname.trim();
  const isDuplicate = room.participants.some((p) => p.nickname === trimmed);
  const canStart = trimmed.length > 0 && !isDuplicate;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setShareFailed(false);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setShareFailed(true);
    }
  };

  const shareLink = async () => {
    if (!navigator.share) {
      copyLink();
      return;
    }
    try {
      await navigator.share({ title: room.title, url });
    } catch {
      // 사용자가 공유 시트를 닫은 경우도 여기로 온다 — 조용히 무시
    }
  };

  const handleStart = () => {
    if (canStart) onStart(trimmed);
  };

  return (
    <div className="max-w-md mx-auto px-4 pt-20 pb-10">
      <div className="mb-8">
        <div className="text-[10px] uppercase tracking-widest text-stone-500 mb-3">
          Deerlink
        </div>
        <h1 className="text-2xl font-bold text-stone-900 mb-2 leading-snug">
          {room.title}
        </h1>
        <div className="flex items-center gap-3 text-xs text-stone-600">
          <span className="flex items-center gap-1">
            <ListChecks className="w-3 h-3" />
            {room.questions.length}개 질문
          </span>
          <span className="w-px h-3 bg-stone-300" />
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {room.participants.length}명 참여 중
          </span>
          <span className="w-px h-3 bg-stone-300" />
          <span className="font-mono tabular-nums">{formatRemaining(room.expiresAt)}</span>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-amber-100 bg-white overflow-hidden">
        <div className="px-5 py-3 border-b border-stone-100 text-center">
          <p className="text-xs text-stone-600">QR을 보여주거나 링크를 보내세요</p>
        </div>
        <div className="flex justify-center py-5 border-b border-stone-100">
          {url ? (
            <QRCodeSVG
              value={url}
              size={128}
              fgColor="#1c1917"
              bgColor="transparent"
              imageSettings={{ src: "/icon.png", width: 24, height: 24, excavate: true }}
            />
          ) : (
            <div
              className="w-32 h-32 rounded-lg bg-stone-100 animate-pulse"
              aria-label="QR 코드 준비 중"
            />
          )}
        </div>
        <div className="px-5 py-3 border-b border-stone-100">
          <p className="text-xs text-stone-500 truncate" aria-live="polite">
            {url || "주소를 불러오는 중"}
          </p>
        </div>
        <div className="flex">
          <button
            onClick={copyLink}
            disabled={!url}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 min-h-11 text-xs border-r border-stone-100 transition-colors disabled:text-stone-300",
              copied ? "text-amber-700" : "text-stone-600 hover:text-stone-900"
            )}
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" />
                복사됨
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                링크 복사
              </>
            )}
          </button>
          <button
            onClick={shareLink}
            disabled={!url}
            className="flex-1 flex items-center justify-center gap-1.5 min-h-11 text-xs text-stone-600 hover:text-stone-900 transition-colors disabled:text-stone-300"
          >
            <Share2 className="w-3 h-3" />
            공유하기
          </button>
        </div>
        {shareFailed && (
          <p className="px-5 pb-3 text-xs text-red-600" role="alert">
            복사에 실패했어요. 위 주소를 길게 눌러 직접 복사해주세요.
          </p>
        )}
      </div>

      {room.participants.length > 0 ? (
        <div className="mb-6">
          <div className="text-[10px] uppercase tracking-widest text-stone-500 mb-2">
            이미 참여한 사람
          </div>
          <div className="flex flex-wrap gap-1.5">
            {room.participants.map((p) => (
              <span
                key={p.id}
                className="px-2.5 py-1 rounded-full text-xs border border-amber-100 bg-amber-50 text-amber-900"
              >
                {p.nickname}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="relative flex flex-col items-center justify-center py-8 mb-6">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <DeerHoofMark className="absolute top-1 left-[22%] w-2 h-2.5 text-stone-300/50 -rotate-12" />
            <DeerHoofMark className="absolute bottom-3 right-[24%] w-2 h-2.5 text-stone-300/50 rotate-6" />
          </div>
          <AntlerLogo animated className="relative w-8 h-10 text-stone-300 mb-4" />
          <p className="relative text-center text-xs text-stone-600">
            아직 아무도 없어요. 링크를 공유하면 모두가 함께할 수 있어요.
          </p>
        </div>
      )}

      <div className="space-y-3">
        <div>
          <label
            htmlFor="nickname"
            className="block text-[10px] uppercase tracking-widest text-stone-500 mb-3"
          >
            닉네임
          </label>
          <input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleStart()}
            placeholder="나를 뭐라고 부를까요?"
            maxLength={NICKNAME_MAX}
            autoComplete="nickname"
            aria-invalid={isDuplicate}
            aria-describedby={isDuplicate ? "nickname-error" : undefined}
            className={cn(
              "w-full py-3.5 px-4 rounded-xl border bg-amber-50 text-sm text-stone-900 placeholder:text-stone-500 outline-none transition-colors",
              isDuplicate
                ? "border-red-300 focus:border-red-400"
                : "border-amber-100 focus:border-amber-300"
            )}
          />
          <div className="flex items-center justify-between mt-2 min-h-4">
            {isDuplicate ? (
              <p id="nickname-error" className="text-xs text-red-600" role="alert">
                이미 있는 닉네임이에요. 다른 이름을 써주세요.
              </p>
            ) : (
              <span />
            )}
            <span className="text-[11px] text-stone-400 font-mono tabular-nums">
              {nickname.length}/{NICKNAME_MAX}
            </span>
          </div>
        </div>
        <motion.button
          onClick={handleStart}
          disabled={!canStart}
          whileTap={canStart ? { scale: 0.99 } : undefined}
          className={cn(
            "w-full py-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors duration-200",
            canStart
              ? "bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-900/30"
              : "bg-stone-100 text-stone-400"
          )}
        >
          참여하기
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
}
