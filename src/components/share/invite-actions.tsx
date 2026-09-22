"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { Check, Link2, Share2 } from "lucide-react";
import { KakaoShareButton } from "@/components/share/kakao-share-button";
import { participantUrl } from "@/lib/room-url";
import { cn } from "@/lib/utils";

const neverChanges = () => () => {};

function isShareCanceled(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

// 카카오톡 인앱 브라우저 등은 Clipboard API를 막는 경우가 있다. 옛 방식으로 한 번 더 시도한다.
function legacyCopy(text: string): boolean {
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.appendChild(field);
  field.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  field.remove();
  return ok;
}

/**
 * 초대 링크 복사·공유 상태를 한 곳에 둔다. 결과 페이지의 상단 버튼과 하단 패널이
 * 같은 상태를 봐야 "복사됨"이 한쪽에서만 뜨는 일이 없다.
 */
export function useInviteLink({ roomId, roomTitle }: { roomId: string; roomTitle: string }) {
  const url = useSyncExternalStore(
    neverChanges,
    () => participantUrl(window.location.origin, roomId),
    () => ""
  );
  // navigator.share가 없는 데스크톱에서 "공유하기"를 눌러 결국 복사가 되는 건 같은
  // 버튼이 두 개 있는 것뿐이다. 지원하는 브라우저에서만 공유 버튼을 그린다.
  const canShare = useSyncExternalStore(
    neverChanges,
    () => typeof navigator.share === "function",
    () => false
  );
  const [status, setStatus] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [copied, setCopied] = useState(false);
  // 두 방식 다 실패하면 주소를 선택 가능한 입력칸으로 보여준다. 버튼 안의 잘린 주소는 길게 눌러도 복사가 안 된다.
  const [manual, setManual] = useState(false);
  const timer = useRef<number | null>(null);

  const copy = async () => {
    if (!url) return;
    let ok = false;
    try {
      await navigator.clipboard.writeText(url);
      ok = true;
    } catch {
      ok = legacyCopy(url);
    }
    if (ok) {
      setCopied(true);
      setManual(false);
      setStatus({ tone: "ok", text: "링크를 복사했어요. 단톡방에 붙여넣으세요." });
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        setCopied(false);
        setStatus(null);
      }, 2500);
    } else {
      setManual(true);
      setStatus({ tone: "error", text: "자동 복사가 막혀 있어요. 아래 주소를 길게 눌러 복사해 주세요." });
    }
  };

  const share = async () => {
    if (!url) return;
    if (!canShare) {
      await copy();
      return;
    }
    try {
      await navigator.share({ title: roomTitle, text: `${roomTitle}, 같이 답해봐요`, url });
      setStatus(null);
    } catch (error) {
      if (!isShareCanceled(error)) {
        setStatus({ tone: "error", text: "공유 창을 열지 못했어요. 링크 복사를 이용해 주세요." });
      }
    }
  };

  return { url, canShare, copied, manual, status, copy, share };
}

export type InviteLink = ReturnType<typeof useInviteLink>;

function displayUrl(url: string): string {
  return url.replace(/^https?:\/\//, "");
}

export function InviteActions({
  invite,
  roomId,
  roomTitle,
  description,
  className,
}: {
  invite: InviteLink;
  roomId: string;
  roomTitle: string;
  description: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <button
        type="button"
        onClick={invite.copy}
        disabled={!invite.url}
        aria-label={invite.copied ? "링크 복사됨" : "초대 링크 복사"}
        className="pressable group flex min-h-16 w-full items-center gap-3 rounded-2xl bg-page py-2 pl-4 pr-2 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
      >
        <Link2 className="h-4 w-4 flex-shrink-0 text-stone-500" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate text-[15px] font-medium text-stone-700">
          {invite.url ? displayUrl(invite.url) : "주소를 준비하고 있어요"}
        </span>
        <span
          className={cn(
            "inline-flex min-h-12 flex-shrink-0 items-center gap-1.5 rounded-xl px-5 text-[15px] font-bold transition-colors duration-150",
            invite.copied ? "bg-stone-900 text-white" : "bg-brand text-brand-ink group-hover:bg-brand-strong"
          )}
          aria-hidden="true"
        >
          {invite.copied && <Check className="h-3.5 w-3.5" />}
          {invite.copied ? "복사됨" : "복사"}
        </span>
      </button>

      <div className="mt-2 grid gap-2 sm:grid-cols-2 sm:[&>*:only-child]:col-span-2">
        <KakaoShareButton
          roomId={roomId}
          roomTitle={roomTitle}
          description={description}
          roomUrl={invite.url}
        />
        {invite.canShare && (
          <button
            type="button"
            onClick={invite.share}
            className="btn-secondary w-full text-[15px]"
          >
            <Share2 className="h-4 w-4" aria-hidden="true" />
            다른 앱으로 공유
          </button>
        )}
      </div>

      <p
        className={cn(
          "mt-2 min-h-5 text-sm",
          invite.status?.tone === "error" ? "text-red-700" : "text-stone-600"
        )}
        role={invite.status?.tone === "error" ? "alert" : "status"}
        aria-live="polite"
      >
        {invite.status?.text}
      </p>
      {invite.manual && (
        <input
          readOnly
          value={invite.url}
          aria-label="초대 링크 주소"
          onFocus={(event) => event.currentTarget.select()}
          className="mt-1 w-full rounded-xl bg-page px-4 py-3 text-stone-900"
        />
      )}
    </div>
  );
}

/** 상단 네비의 초대 버튼. 스크롤 위치와 무관하게 언제든 공유할 수 있게 한다. */
export function InviteNavButton({ invite }: { invite: InviteLink }) {
  return (
    <button
      type="button"
      onClick={invite.canShare ? invite.share : invite.copy}
      disabled={!invite.url}
      className="pressable inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-stone-100 px-3.5 text-[15px] font-semibold text-stone-800 hover:bg-stone-200"
    >
      {invite.copied ? (
        <Check className="h-3.5 w-3.5 text-amber-700" aria-hidden="true" />
      ) : invite.canShare ? (
        <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
      ) : (
        <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      {invite.copied ? "복사됨" : invite.canShare ? "초대하기" : "링크 복사"}
    </button>
  );
}
