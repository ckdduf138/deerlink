import type { Metadata } from "next";
import { LandingNav } from "@/components/landing/LandingNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { LANDING_ROOM_COUNT, PublicRoomsSection } from "@/components/landing/PublicRoomsSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { RoomKindsSection } from "@/components/landing/RoomKindsSection";
import { CtaSection } from "@/components/landing/CtaSection";
import { getPublicRooms } from "@/lib/discover-rooms";
import type { DiscoverRoom } from "@/lib/types";

export const revalidate = 30;

/**
 * canonical은 루트 layout이 아니라 여기에만 둔다. layout에 두면 자기 canonical이 없는
 * 하위 페이지(예: /discover)가 전부 홈을 canonical로 물려받아서, 검색엔진에게 "이 페이지는
 * 홈의 복사본"이라고 말하게 된다. 실제로 /discover가 그 상태로 배포돼 있었다.
 */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "디어링크",
  alternateName: "Deerlink",
  url: "https://deerlink.kr/",
  inLanguage: "ko-KR",
};

/**
 * 공개방 목록은 서버에서 읽는다. 예전엔 클라이언트가 마운트 후 fetch 했는데,
 * 그러면 크롤러와 첫 페인트에는 "공개방을 불러오는 중이에요"만 남는다 — 랜딩의
 * 본문 절반이 통째로 비어 보인다는 뜻이다. getPublicRooms는 이미 캐시된
 * 서버 함수라 여기서 그냥 await 하면 된다.
 */
/**
 * 히어로 카드는 처음 온 사람의 첫인상이라, 인기 1위라도 질문이 "a"·선택지 "가/나" 같은
 * 방은 건너뛴다 (실제로 로컬 1위 방이 그랬다). 기준은 글자 수뿐이다. 내용 검열이 아니다.
 * 조건을 만족하는 방이 없으면 히어로는 카드 없이 그려진다.
 */
const SHOWCASE_MIN_TITLE = 6;
const SHOWCASE_MIN_OPTION = 2;

function isShowcaseable(room: DiscoverRoom): boolean {
  const q = room.previewQuestion;
  if (!q || q.type !== "balance" || !q.optionA || !q.optionB) return false;
  const a = q.optionA.trim();
  const b = q.optionB.trim();
  return (
    q.title.trim().length >= SHOWCASE_MIN_TITLE &&
    a.length >= SHOWCASE_MIN_OPTION &&
    b.length >= SHOWCASE_MIN_OPTION &&
    a !== b
  );
}

export default async function Home() {
  // 히어로가 1위 방을 가져가니 목록에서 그 방을 빼고도 한 화면 분량이 남도록 하나 더 받는다.
  const publicRooms = await getPublicRooms({ page: 1, sort: "popular", pageSize: LANDING_ROOM_COUNT + 1 })
    .then((data) => ({ ...data, error: null as string | null }))
    .catch(() => ({
      rooms: [],
      total: 0,
      hasMore: false,
      error: "공개방을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.",
    }));

  const featured = publicRooms.rooms.find(isShowcaseable) ?? null;

  return (
    <main className="min-h-screen bg-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <LandingNav />
      <HeroSection featured={featured} />
      <PublicRoomsSection
        excludeId={featured?.id ?? null}
        rooms={publicRooms.rooms}
        total={publicRooms.total}
        hasMore={publicRooms.hasMore}
        error={publicRooms.error}
      />
      <RoomKindsSection />
      <FaqSection />
      <CtaSection />
    </main>
  );
}
