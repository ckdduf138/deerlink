"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Fawn } from "@/components/Fawn";
import { CreateRoomButton } from "./CreateRoomButton";
import { SiteFooter } from "@/components/SiteFooter";

export function CtaSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-white px-5 pb-10 pt-16 sm:px-6 md:pt-24">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, transform: "translateY(12px)" }}
        whileInView={{ opacity: 1, transform: "translateY(0px)" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="mx-auto max-w-xl text-center"
      >
        <Fawn mood="happy" className="mx-auto mb-4 h-28 w-28" />
        <h2 className="break-keep text-[28px] font-cute leading-snug text-stone-900 sm:text-4xl">
          질문 하나로 시작하세요
        </h2>
        <p className="mt-3 text-lg leading-relaxed text-stone-600">회원가입 없이, 링크 하나면 돼요.</p>
        <CreateRoomButton className="mt-8 w-full sm:w-auto sm:min-w-52" />
      </motion.div>

      <SiteFooter className="mt-20" />

    </section>
  );
}
