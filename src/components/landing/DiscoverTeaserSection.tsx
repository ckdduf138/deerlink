"use client";

import { motion } from "framer-motion";
import { PublicRoomsFeed } from "@/components/discover/public-rooms-feed";
import type { DiscoverRoom } from "@/lib/types";

/**
 * 공개방 둘러보기(/discover) UI를 통째로 랜딩 안에 끌어온다 — 스크롤해서 내려오면
 * 바로 실제로 돌아가는 공개방이 보이면서 흥미를 끄는 게 목적이라, 티저 몇 장 보여주고
 * "전체 보기"로 밀어내는 대신 목록·정렬·더 보기까지 이 자리에서 다 끝나게 한다.
 * 카드 링크는 PublicRoomsFeed가 ?join=1로 걸어준다 — 공개방일 때 QR 로비를 건너뛴다.
 * 공개방이 하나도 없으면 이 섹션을 마케팅 페이지에 통째로 숨긴다.
 */
export function DiscoverTeaserSection({
  initialRooms,
  initialTotal,
  initialHasMore,
}: {
  initialRooms: DiscoverRoom[];
  initialTotal: number;
  initialHasMore: boolean;
}) {
  if (initialRooms.length === 0) return null;

  return (
    <section className="border-t border-stone-200 bg-[#fafaf8] py-20 md:py-28">
      <div className="mx-auto max-w-2xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-2xl font-bold leading-snug tracking-tight text-stone-900 md:text-3xl"
        >
          지금 딱 갈리는 질문들
        </motion.h2>

        <PublicRoomsFeed
          initialRooms={initialRooms}
          initialTotal={initialTotal}
          initialHasMore={initialHasMore}
          initialSort="popular"
        />
      </div>
    </section>
  );
}
