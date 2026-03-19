"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CtaSection() {
  return (
    <section className="py-28 md:py-40 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-5">
            지금 바로 시작하세요
          </h2>
          <p className="text-zinc-500 text-base mb-10">
            회원가입 없이 무료로. 링크 하나면 됩니다.
          </p>

          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all duration-200 shadow-lg shadow-violet-900/40 hover:shadow-violet-800/50 hover:-translate-y-0.5"
          >
            방 만들기
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        <div className="mt-24 pt-8 border-t border-white/5">
          <p className="text-xs text-zinc-700">&copy; 2026 LinkMatch</p>
        </div>
      </div>
    </section>
  );
}
