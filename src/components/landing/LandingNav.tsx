"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function LandingNav() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5"
    >
      <span className="text-sm font-semibold text-white tracking-tight">
        LinkMatch
      </span>

      <Link
        href="/create"
        className="text-sm text-zinc-400 hover:text-white transition-colors duration-200"
      >
        방 만들기 &rarr;
      </Link>
    </motion.nav>
  );
}
