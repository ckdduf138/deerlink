"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AntlerLogo } from "./AntlerLogo";
import { FeedbackModal } from "@/components/FeedbackModal";

export function CtaSection() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-amber-50 px-6 pt-24 pb-14 md:pt-32">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-xl text-center"
      >
        <AntlerLogo className="mx-auto mb-8 h-14 w-12 text-amber-500" />
        <h2 className="text-3xl font-bold leading-snug tracking-tight text-stone-900 md:text-4xl">
          질문 하나로 시작하세요
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-stone-600">
          회원가입 없이, 30초면 돼요.
        </p>
        <Link
          href="/create"
          className="mt-10 inline-flex min-h-14 items-center gap-2 rounded-2xl bg-amber-700 px-8 text-base font-semibold text-white shadow-lg shadow-amber-900/30 transition-colors duration-200 hover:bg-amber-600"
        >
          방 만들기
          <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>

      <footer className="mx-auto mt-20 flex max-w-xl flex-col items-center gap-3 border-t border-amber-100 pt-8 sm:flex-row sm:justify-between">
        <p className="text-sm text-stone-600">&copy; 2026 Deerlink</p>
        <button
          onClick={() => setFeedbackOpen(true)}
          className="min-h-11 text-sm text-stone-600 transition-colors hover:text-stone-900"
        >
          피드백 보내기
        </button>
      </footer>

      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </section>
  );
}
