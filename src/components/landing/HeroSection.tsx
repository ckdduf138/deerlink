import Link from "next/link";
import { CreateRoomButton } from "@/components/landing/CreateRoomButton";
import { HeroPick } from "@/components/landing/HeroPick";
import type { DiscoverRoom } from "@/lib/types";

/** 네비가 이 버튼이 화면에서 벗어났는지 보고 자기 CTA를 띄운다. */
export const HERO_CTA_ID = "hero-cta";

/**
 * 2026-09 정석 리워크: 왼쪽은 제목·한 줄 설명·버튼 두 개, 오른쪽은 지금 1위 공개방의
 * 첫 질문(HeroPick)이다. 예전 "로고·제목·텍스트 링크"만 있던 히어로는 데스크톱에서
 * 화면 절반 이상이 비었고, 첫 화면에서 이게 뭘 하는 곳인지 보여주지 못했다.
 *
 * 텍스트에 등장 애니메이션을 걸지 않는다. h1이 LCP 요소라 JS 뒤에 숨기지 않는다.
 */
export function HeroSection({ featured }: { featured: DiscoverRoom | null }) {
  return (
    <section className="bg-page px-5 pb-12 pt-24 sm:px-6 md:pb-20 md:pt-32">
      <div
        className={
          featured
            ? "mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:gap-16"
            : "mx-auto max-w-6xl"
        }
      >
        <div>
          <h1 className="break-keep text-[44px] font-cute leading-[1.12] text-stone-900 sm:text-6xl sm:leading-[1.1] xl:text-[76px]">
            밸런스 게임,
            <br />
            우리 답은 <span className="text-amber-600">같을까?</span>
          </h1>

          <p className="mt-5 max-w-md break-keep text-lg leading-relaxed text-stone-600 sm:text-xl">
            디어링크에서 링크 하나로 친구들 답을 비교해요.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CreateRoomButton id={HERO_CTA_ID} className="sm:min-w-44" />
            <Link href="/discover" className="btn-secondary sm:min-w-44">
              공개 게임 둘러보기
            </Link>
          </div>
        </div>

        {featured && <HeroPick room={featured} />}
      </div>
    </section>
  );
}
