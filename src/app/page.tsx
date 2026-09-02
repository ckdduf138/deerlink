import { LandingNav } from "@/components/landing/LandingNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { PublicRoomsSection } from "@/components/landing/PublicRoomsSection";
import { CtaSection } from "@/components/landing/CtaSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fafaf8]">
      <LandingNav />
      <HeroSection />
      <PublicRoomsSection />
      <CtaSection />
    </main>
  );
}
