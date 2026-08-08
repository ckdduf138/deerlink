import { LandingNav } from "@/components/landing/LandingNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { AnswerLockSection } from "@/components/landing/AnswerLockSection";
import { StepsSection } from "@/components/landing/StepsSection";
import { QuestionTypesSection } from "@/components/landing/QuestionTypesSection";
import { UseCasesSection } from "@/components/landing/UseCasesSection";
import { CtaSection } from "@/components/landing/CtaSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fafaf8]">
      <LandingNav />
      <HeroSection />
      <AnswerLockSection />
      <StepsSection />
      <QuestionTypesSection />
      <UseCasesSection />
      <CtaSection />
    </main>
  );
}
