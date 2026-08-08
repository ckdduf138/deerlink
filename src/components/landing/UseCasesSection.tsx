"use client";

import { motion } from "framer-motion";

const tags = [
  "대학 MT",
  "커플 가치관",
  "팀 빌딩",
  "친구 모임",
  "동아리 신입",
  "가족 모임",
  "온라인 회의",
  "데이트 계획",
];

export function UseCasesSection() {
  return (
    <section className="border-t border-stone-200 bg-white px-6 py-20 md:py-28">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 md:flex-row md:items-start md:gap-16">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold leading-snug tracking-tight text-stone-900 md:w-64 md:flex-shrink-0 md:text-3xl"
        >
          이런 자리에서 많이 써요
        </motion.h2>

        <motion.ul
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap gap-2.5"
        >
          {tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-amber-100 bg-amber-50 px-4 py-2 text-base text-amber-900"
            >
              {tag}
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
