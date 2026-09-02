"use client";

import Link from "next/link";
import { AntlerLogo } from "./AntlerLogo";

export function LandingNav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-amber-100 bg-[#fafaf8]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link
          href="/"
          className="flex min-h-11 items-center gap-2 text-base font-semibold tracking-tight text-stone-900"
        >
          <AntlerLogo className="h-[18px] w-3.5 text-amber-500" />
          Deerlink
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/popular"
            className="flex min-h-11 items-center px-2 text-sm text-stone-600 transition-colors duration-200 hover:text-stone-900 sm:px-3 sm:text-base"
          >
            인기 질문
          </Link>
          <Link
            href="/create"
            className="flex min-h-11 items-center rounded-xl bg-amber-700 px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-amber-600 sm:px-5 sm:text-base"
          >
            방 만들기
          </Link>
        </div>
      </div>
    </nav>
  );
}
