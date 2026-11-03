"use client";

import Link from "next/link";
import { OPEN_FEEDBACK_EVENT } from "@/components/FeedbackPrompt";
import { cn } from "@/lib/utils";

/**
 * 공개 페이지가 공유하는 푸터. 예전엔 페이지마다 "© 2026 Deerlink" 한 줄을 따로 적어둬서
 * 개인정보처리방침 같은 링크를 넣으려면 세 군데를 고쳐야 했다.
 *
 * 문의 창구는 이메일 대신 피드백 카드다 (운영자 요청). 같은 카드를 푸터 버튼과 30초 뒤
 * 자동 노출이 공유하므로 여는 경로만 이벤트로 알린다.
 */
export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "mx-auto flex max-w-6xl flex-col items-center gap-2 border-t border-stone-200 pt-6 sm:flex-row sm:justify-between",
        className
      )}
    >
      <p className="text-sm text-stone-500">&copy; 2026 Deerlink</p>
      <nav className="flex items-center gap-1">
        <Link
          href="/privacy"
          className="flex min-h-11 items-center px-2 text-sm font-medium text-stone-600 transition-colors hover:text-stone-900"
        >
          개인정보처리방침
        </Link>
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event(OPEN_FEEDBACK_EVENT))}
          className="flex min-h-11 items-center px-2 text-sm font-medium text-stone-600 transition-colors hover:text-stone-900"
        >
          피드백 보내기
        </button>
      </nav>
    </footer>
  );
}
