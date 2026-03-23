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
  const tagColors = ["bg-amber-50", "bg-pink-50", "bg-lime-50", "bg-sky-50"];

  return (
    <section className="py-16 md:py-24 px-6 border-t border-stone-200">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center gap-8">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="md:w-52 flex-shrink-0"
        >
          <div className="text-xs text-stone-500 uppercase tracking-widest mb-2">
            활용 사례
          </div>
          <p className="text-sm text-stone-600 leading-relaxed">
            어떤 모임이든 링크 하나면 충분합니다
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap gap-2"
        >
          {tags.map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.04 + 0.1 }}
              className={`px-3.5 py-1.5 rounded-full text-xs text-stone-600 border border-amber-100 ${tagColors[i % 4]}`}
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
