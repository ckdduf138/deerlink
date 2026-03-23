"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "방 만들기",
    description: "질문 유형을 선택하고 방을 생성합니다. 별도 회원가입 없이 바로 시작할 수 있어요.",
  },
  {
    number: "02",
    title: "링크 공유",
    description: "생성된 링크를 그룹 채팅방에 붙여넣으세요. 참여자는 링크 하나로 바로 입장합니다.",
  },
  {
    number: "03",
    title: "결과 비교",
    description: "모두가 답변을 완료하면 결과가 공개됩니다. 누가 무엇을 선택했는지 한눈에 확인하세요.",
  },
];

export function StepsSection() {
  return (
    <section id="steps" className="py-28 md:py-36 px-6 bg-[#fafaf8]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="mb-16"
        >
          <div className="text-xs text-stone-500 uppercase tracking-widest mb-4">
            사용 방법
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
            3단계로 끝납니다
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-amber-100/50 rounded-2xl overflow-hidden border border-stone-200">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="bg-[#fafaf8] p-8 md:p-10 relative"
            >
              <span className="block text-xs font-mono text-amber-600 mb-6 tabular-nums">
                {step.number}
              </span>
              <h3 className="text-base font-semibold text-stone-900 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-stone-500 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
