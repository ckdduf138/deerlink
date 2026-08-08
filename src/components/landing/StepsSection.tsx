"use client";

import { motion } from "framer-motion";

const steps = [
  {
    title: "질문을 만든다",
    description:
      "밸런스 게임, 객관식, 주관식 중에 고르면 돼요. 회원가입은 없습니다.",
  },
  {
    title: "링크를 보낸다",
    description:
      "만들어진 링크를 단톡방에 붙여넣으세요. 받은 사람은 바로 답할 수 있어요.",
  },
  {
    title: "나란히 놓고 본다",
    description:
      "모두 답하면 결과가 열려요. 누가 뭘 골랐는지, 어디서 갈렸는지 한눈에 보입니다.",
  },
];

export function StepsSection() {
  return (
    <section id="steps" className="bg-[#fafaf8] px-6 py-24 md:py-32">
      <div className="mx-auto max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold tracking-tight text-stone-900 md:text-4xl"
        >
          30초면 끝나요
        </motion.h2>

        <div className="mt-12 divide-y divide-stone-200 border-y border-stone-200">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="grid gap-2 py-8 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-10"
            >
              <h3 className="text-xl font-bold tracking-tight text-stone-900">
                {step.title}
              </h3>
              <p className="text-base leading-relaxed text-stone-600">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
