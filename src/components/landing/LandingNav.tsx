"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AntlerLogo } from "./AntlerLogo";
import { CreateRoomButton } from "./CreateRoomButton";
import { HERO_CTA_ID } from "./HeroSection";

/**
 * 네비의 "방 만들기"는 히어로 CTA가 화면에서 벗어났을 때만 보인다.
 * 첫 화면에 같은 버튼이 두 개 나란히 떠 있으면 어느 쪽이 주인공인지 흐려진다.
 * 스크롤을 내린 뒤에는 CTA가 사라지면 안 되니 그때 네비가 이어받는다.
 */
function useHeroCtaHidden() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const target = document.getElementById(HERO_CTA_ID);
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHidden(!entry.isIntersecting),
      { rootMargin: "-72px 0px 0px 0px" }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return hidden;
}

export function LandingNav() {
  const showCta = useHeroCtaHidden();
  const reduce = useReducedMotion();

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-stone-100 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
        <Link
          href="/"
          className="flex min-h-11 items-center gap-2 text-base font-semibold tracking-tight text-stone-900"
        >
          <AntlerLogo className="h-[18px] w-3.5 text-amber-500" />
          디어링크
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/popular"
            className="pressable flex min-h-10 items-center rounded-xl px-3 text-[15px] font-semibold text-stone-700 hover:bg-stone-100 hover:text-stone-900"
          >
            인기 질문
          </Link>
          <AnimatePresence initial={false}>
            {showCta && (
              <motion.div
                initial={reduce ? false : { opacity: 0, transform: "scale(0.95)" }}
                animate={{ opacity: 1, transform: "scale(1)" }}
                exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, transform: "scale(0.95)", transition: { duration: 0.12 } }}
                transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
              >
                <CreateRoomButton size="md" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
