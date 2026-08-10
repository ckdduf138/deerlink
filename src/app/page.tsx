import { LandingNav } from "@/components/landing/LandingNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { DiscoverTeaserSection } from "@/components/landing/DiscoverTeaserSection";
import { CtaSection } from "@/components/landing/CtaSection";
import { getPublicRooms } from "@/lib/discover-rooms";

export default async function Home() {
  const { rooms, total, hasMore } = await getPublicRooms({ page: 1, sort: "popular" });

  return (
    <main className="min-h-screen bg-[#fafaf8]">
      <LandingNav />
      <HeroSection />
      <DiscoverTeaserSection initialRooms={rooms} initialTotal={total} initialHasMore={hasMore} />
      <CtaSection />
    </main>
  );
}
