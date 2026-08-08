"use client";

import { motion } from "framer-motion";

export function AnswerLockSection() {
  return (
    <section className="border-t border-stone-200 bg-white px-6 py-24 md:py-32">
      <div className="mx-auto max-w-4xl">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="text-2xl leading-[1.45] tracking-tight text-stone-900 sm:text-3xl md:text-4xl md:leading-[1.4]"
        >
          <span className="font-normal">남의 답을 먼저 보면 </span>
          <span className="font-normal">나도 모르게 따라가게 돼요.</span>
          <br />
          <span className="font-bold">그래서 전부 답할 때까지 잠가둡니다.</span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10 max-w-lg text-lg leading-relaxed text-stone-600"
        >
          눈치 보지 않고 고른 답만 모이니까, 결과를 볼 때 훨씬 재밌어요.
        </motion.p>
      </div>
    </section>
  );
}
