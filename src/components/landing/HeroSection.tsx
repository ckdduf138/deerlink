import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { AntlerLogo } from "@/components/landing/AntlerLogo";

/**
 * 히어로는 텍스트와 CTA만 갖는다. 체험은 바로 아래 공개방 카드가 맡는다.
 *
 * 예전엔 오른쪽에 가짜 친구 넷이 박힌 데모 질문이 있었는데, 눌러도 아무 데이터도 안 남고
 * 바로 아래 공개방(실제로 답할 수 있고 답하면 방이 하루 더 열린다)과 같은 체험을 두 번
 * 시켰다. 대신 데모가 혼자 설명하던 Answer Lock은 공개방으로는 보여줄 수 없다 (공개방은
 * 게이트를 건너뛴다). 그래서 그 메시지는 본문 문장이 직접 말한다. 이 문장을 빼면 랜딩이
 * 그냥 익명 투표 사이트로 읽힌다.
 *
 * 텍스트에 등장 애니메이션을 걸지 않는 건 그대로다. h1이 LCP 요소라 JS 뒤에 숨기지 않는다.
 * 높이도 고정하지 않는다. 모바일 첫 화면에서 공개방 카드 윗부분이 보여야 한다.
 */
export function HeroSection() {
  return (
    <section className="bg-[#fafaf8] px-6 pb-10 pt-24 md:pb-14 md:pt-32">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-14">
        <div>
          <AntlerLogo
            animated
            className="mb-4 h-12 w-11 text-amber-500 sm:h-14 sm:w-12"
          />

          <h1 className="break-keep text-4xl font-bold leading-[1.15] tracking-tight text-stone-900 sm:text-5xl xl:text-6xl">
            밸런스 게임,
            <br />
            우리 답은 같을까?
          </h1>
        </div>

        <div className="lg:pb-2">
          <p className="max-w-md break-keep text-lg leading-relaxed text-stone-600">
            질문을 만들고 링크를 보내세요. 친구들 답은 내가 답하기 전까지 잠겨 있다가,
            답하는 순간 한 번에 나란히 열려요.
          </p>

          <div className="mt-6">
            <Link
              href="/create"
              className="group inline-flex min-h-14 items-center gap-2 rounded-2xl bg-amber-700 px-8 text-base font-semibold text-white shadow-lg shadow-amber-900/30 transition-colors duration-200 hover:bg-amber-600"
            >
              방 만들기
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
