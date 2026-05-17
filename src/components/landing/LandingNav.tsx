"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { AntlerLogo } from "./AntlerLogo";

export function LandingNav() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 bg-transparent backdrop-blur-md border-b border-transparent"
    >
      <span className="flex items-center gap-2 text-sm font-semibold text-stone-900 tracking-tight">
        <AntlerLogo className="w-3.5 h-[18px] text-amber-500" />
        Deerlink
      </span>

      <div className="flex items-center gap-5">
        <Link
          href="/popular"
          className="text-sm text-stone-600 hover:text-stone-900 transition-colors duration-200"
        >
          인기 질문
        </Link>
        <Link
          href="/create"
          className="text-sm text-stone-600 hover:text-stone-900 transition-colors duration-200"
        >
          방 만들기 &rarr;
        </Link>
      </div>
    </motion.nav>
  );
}
