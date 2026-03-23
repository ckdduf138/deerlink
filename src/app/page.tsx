import { LandingNav } from "@/components/landing/LandingNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { StepsSection } from "@/components/landing/StepsSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { UseCasesSection } from "@/components/landing/UseCasesSection";
import { CtaSection } from "@/components/landing/CtaSection";

export default function Home() {
  return (
    <main className="bg-[#fafaf8] min-h-screen">
      <LandingNav />
      <HeroSection />
      <StepsSection />
      <FeaturesSection />
      <UseCasesSection />
      <CtaSection />
    </main>
  );
}
