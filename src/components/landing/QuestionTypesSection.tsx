"use client";

import { motion } from "framer-motion";
import { QUESTION_META } from "@/lib/question-meta";

/**
 * 질문 유형을 설명 대신 실제 생김새로 보여준다.
 * 셀 3개 = 유형 3개. 빈 칸을 채우려고 타일을 늘리지 않는다.
 */

const BalanceIcon = QUESTION_META.balance.icon;
const MultipleIcon = QUESTION_META.multiple.icon;
const SubjectiveIcon = QUESTION_META.subjective.icon;

function TypeLabel({
  icon: Icon,
  label,
  accent,
}: {
  icon: typeof BalanceIcon;
  label: string;
  accent: string;
}) {
  return (
    <p className={`mb-4 flex items-center gap-2 text-sm font-semibold ${accent}`}>
      <Icon className="h-4 w-4" />
      {label}
    </p>
  );
}

export function QuestionTypesSection() {
  return (
    <section className="border-t border-stone-200 bg-[#fafaf8] px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl text-3xl font-bold leading-snug tracking-tight text-stone-900 md:text-4xl"
        >
          세 가지 방식으로 물어봐요
        </motion.h2>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45 }}
            className="rounded-3xl border border-amber-100 bg-white p-7 md:row-span-2"
          >
            <TypeLabel
              icon={BalanceIcon}
              label={QUESTION_META.balance.label}
              accent={QUESTION_META.balance.accent}
            />
            <p className="text-xl font-bold leading-snug text-stone-900">
              평생 라면만 vs 평생 치킨만
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="flex min-h-24 items-center justify-center rounded-2xl border-2 border-amber-500 bg-amber-50 text-base font-semibold text-amber-900">
                라면
              </div>
              <div className="flex min-h-24 items-center justify-center rounded-2xl border-2 border-stone-200 text-base font-semibold text-stone-700">
                치킨
              </div>
            </div>
            <p className="mt-6 text-base leading-relaxed text-stone-600">
              둘 중 하나만 고르게 하면 성향이 확실하게 갈려요. 가장 많이 쓰는
              방식입니다.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="rounded-3xl border border-teal-100 bg-white p-7"
          >
            <TypeLabel
              icon={MultipleIcon}
              label={QUESTION_META.multiple.label}
              accent={QUESTION_META.multiple.accent}
            />
            <p className="text-lg font-bold leading-snug text-stone-900">
              다음 회식 어디로 갈까?
            </p>
            <ul className="mt-5 space-y-2">
              {["고깃집", "이자카야", "파스타"].map((option, i) => (
                <li
                  key={option}
                  className={`flex min-h-12 items-center gap-3 rounded-xl border px-4 text-base ${
                    i === 1
                      ? "border-teal-600 bg-teal-50 text-teal-900"
                      : "border-stone-200 text-stone-700"
                  }`}
                >
                  <span
                    className={`h-4 w-4 flex-shrink-0 rounded-full border-2 ${
                      i === 1 ? "border-teal-600 bg-teal-600" : "border-stone-300"
                    }`}
                  />
                  {option}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: 0.16 }}
            className="rounded-3xl border border-stone-200 bg-white p-7"
          >
            <TypeLabel
              icon={SubjectiveIcon}
              label={QUESTION_META.subjective.label}
              accent={QUESTION_META.subjective.accent}
            />
            <p className="text-lg font-bold leading-snug text-stone-900">
              요즘 제일 걱정되는 게 뭐야?
            </p>
            <div className="mt-5 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3.5">
              <p className="text-base leading-relaxed text-stone-700">
                이직할지 말지 계속 고민 중이야.
              </p>
            </div>
            <p className="mt-5 text-base leading-relaxed text-stone-600">
              선택지로 담기 어려운 이야기는 그냥 쓰게 두세요.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
