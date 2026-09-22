"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Loader2, Send, Star, X } from "lucide-react";
import { Fawn, type FawnMood } from "@/components/Fawn";
import { cn } from "@/lib/utils";

const MESSAGE_MAX = 1000;
/** 페이지에 들어온 뒤 이만큼 지나야 뜬다. 들어오자마자 물으면 아직 써보지도 않았다. */
const PROMPT_DELAY_MS = 30_000;
/** 닫으면 이 기간 동안 다시 묻지 않는다. 보내면 다시 묻지 않는다. */
const DISMISS_DAYS = 30;
const STORAGE_KEY = "deerlink:feedback-prompt";
/** 푸터의 "피드백 보내기"가 이 이벤트로 카드를 바로 연다. */
export const OPEN_FEEDBACK_EVENT = "deerlink:open-feedback";

const RATING_LABEL = ["", "별로예요", "아쉬워요", "보통이에요", "좋아요", "최고예요"] as const;

/**
 * 자동으로 뜨는 곳. 답변·방 만들기 화면은 한창 입력하는 중이라 끼어들지 않는다.
 * 결과 화면은 흐름을 끝낸 뒤라 묻기 가장 좋은 때다.
 */
function isPromptRoute(pathname: string): boolean {
  if (pathname === "/" || pathname.startsWith("/discover") || pathname.startsWith("/popular")) return true;
  if (pathname.startsWith("/archive/")) return true;
  return /^\/room\/[^/]+\/results$/.test(pathname);
}

/** 모바일 결과 화면은 하단에 "친구 초대하기"가 떠 있어서 그 위로 올린다. */
function hasBottomDock(pathname: string): boolean {
  return /^\/room\/[^/]+\/results$/.test(pathname);
}

type Stored = { state: "dismissed" | "sent"; at: number };

function readStored(): Stored | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Stored) : null;
  } catch {
    return null;
  }
}

function writeStored(state: Stored["state"]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ state, at: Date.now() }));
  } catch {
    // 저장이 막혀 있으면(시크릿 모드 등) 다음 방문에 한 번 더 물을 뿐이다
  }
}

function shouldAutoPrompt(): boolean {
  const stored = readStored();
  if (!stored) return true;
  if (stored.state === "sent") return false;
  return Date.now() - stored.at > DISMISS_DAYS * 24 * 60 * 60 * 1000;
}

function moodFor(rating: number): FawnMood {
  if (rating === 0 || rating === 3) return "default";
  return rating <= 2 ? "curious" : "happy";
}

/**
 * refresh.cv처럼 시간이 조금 지나면 우측 하단에 조용히 뜨는 피드백 카드.
 * 화면을 덮지 않고, 별점 한 번이면 보낼 수 있고, 의견은 선택이다. 보내면 사슴이 웃으며 고맙다고 한다.
 */
export function FeedbackPrompt() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const closeTimer = useRef<number | null>(null);
  const shown = hover || rating;

  useEffect(() => {
    if (!isPromptRoute(pathname)) return;
    const timer = window.setTimeout(() => {
      if (shouldAutoPrompt()) setOpen(true);
    }, PROMPT_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    const openNow = () => setOpen(true);
    window.addEventListener(OPEN_FEEDBACK_EVENT, openNow);
    return () => window.removeEventListener(OPEN_FEEDBACK_EVENT, openNow);
  }, []);

  useEffect(() => () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  }, []);

  const close = useCallback(
    (reason: "dismissed" | "sent") => {
      if (status === "sending") return;
      writeStored(reason);
      setOpen(false);
      window.setTimeout(() => {
        setRating(0);
        setHover(0);
        setMessage("");
        setStatus("idle");
      }, 250);
    },
    [status]
  );

  const submit = async () => {
    if (rating === 0 || status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, message: message.trim() }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      writeStored("sent");
      closeTimer.current = window.setTimeout(() => {
        setOpen(false);
        setStatus("idle");
      }, 2600);
    } catch {
      setStatus("error");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.section
          key="feedback"
          role="dialog"
          aria-labelledby="feedback-title"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: "translateY(16px) scale(0.98)" }}
          animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: "translateY(8px) scale(0.98)", transition: { duration: 0.15 } }}
          transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
          className={cn(
            "fixed inset-x-4 z-50 rounded-[24px] bg-white p-5 sm:inset-x-auto sm:right-6 sm:w-[22rem]",
            "shadow-[0_2px_0_rgb(191_122_34/0.08),0_20px_48px_-16px_rgb(150_95_30/0.4)]",
            hasBottomDock(pathname)
              ? "bottom-[calc(max(env(safe-area-inset-bottom),0.875rem)+4.75rem)] md:bottom-6"
              : "bottom-[max(env(safe-area-inset-bottom),1rem)] sm:bottom-6"
          )}
        >
          {status !== "done" && (
            <button
              type="button"
              onClick={() => close("dismissed")}
              aria-label="닫기"
              className="pressable absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 hover:text-stone-800"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}

          {status === "done" ? (
            <div className="flex flex-col items-center py-2 text-center" aria-live="polite">
              <Fawn mood="happy" className="h-20 w-20" />
              <h2 id="feedback-title" className="font-cute mt-2 text-xl text-stone-900">
                고마워요!
              </h2>
              <p className="mt-1 text-[15px] text-stone-600">보내준 의견은 꼭 읽어볼게요</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 pr-8">
                <Fawn mood={moodFor(shown)} className="h-12 w-12 flex-shrink-0" />
                <h2 id="feedback-title" className="font-cute text-xl text-stone-900">
                  디어링크 어땠어요?
                </h2>
              </div>

              <div
                className="mt-3 flex items-center justify-center gap-1"
                role="radiogroup"
                aria-label="별점"
                onMouseLeave={() => setHover(0)}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={rating === n}
                    aria-label={`${n}점, ${RATING_LABEL[n]}`}
                    onClick={() => setRating(n)}
                    onMouseEnter={() => setHover(n)}
                    className="pressable flex h-11 w-11 items-center justify-center rounded-full"
                  >
                    <Star
                      className={cn(
                        "h-8 w-8 transition-colors duration-100",
                        n <= shown ? "fill-brand text-brand" : "fill-stone-100 text-stone-200"
                      )}
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </button>
                ))}
              </div>
              <p className="min-h-6 text-center text-[15px] font-semibold text-stone-700">{RATING_LABEL[shown]}</p>

              {rating > 0 && (
                <>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={MESSAGE_MAX}
                    rows={3}
                    placeholder={rating <= 3 ? "어떤 점이 아쉬웠나요? (선택)" : "어떤 점이 좋았나요? (선택)"}
                    aria-label="의견 (선택)"
                    className="mt-3 w-full resize-none rounded-2xl bg-page px-4 py-3 text-stone-900 outline-none ring-2 ring-transparent transition-shadow placeholder:text-stone-500 focus:ring-amber-400"
                  />
                  {status === "error" && (
                    <p className="mt-2 text-sm text-red-700" role="alert">
                      보내지 못했어요. 적은 내용은 그대로 있어요.
                    </p>
                  )}
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={submit}
                      disabled={status === "sending"}
                      className="btn-primary min-h-11 px-5 text-[15px]"
                    >
                      {status === "sending" ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      ) : (
                        <Send className="h-4 w-4" aria-hidden="true" />
                      )}
                      {status === "error" ? "다시 보내기" : "보내기"}
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </motion.section>
      )}
    </AnimatePresence>
  );
}
