import { AntlerLogo } from "@/components/landing/AntlerLogo";
import { CreateRoomButton } from "@/components/landing/CreateRoomButton";

/** 네비가 이 버튼이 화면에서 벗어났는지 보고 자기 CTA를 띄운다. */
export const HERO_CTA_ID = "hero-cta";

/**
 * 히어로는 로고, 제목, CTA 셋뿐이다. 체험은 바로 아래 공개방 카드가 맡는다.
 *
 * 예전엔 오른쪽에 가짜 친구 넷이 박힌 데모 질문이 있었는데, 눌러도 아무 데이터도 안 남고
 * 바로 아래 공개방과 같은 체험을 두 번 시켰다. 설명 문장도 뺐다. 제목이 이미 무엇을 하는
 * 곳인지 말하고, Answer Lock 같은 세부 설명은 FAQ가 맡는다.
 *
 * 제목 크기는 모바일과 데스크톱이 다르다. 모바일 기본값(text-5xl)은 두 줄로 꺾이는
 * "밸런스 게임 / 우리 답은 같을까?"를 화면 높이의 절반 가까이 차지하게 만들어서
 * text-4xl로 낮췄다 — 데스크톱의 큰 타이포(문서 상한 82px)는 그대로 두고 화면 폭이
 * 커질수록만 커지게 했다.
 *
 * 텍스트에 등장 애니메이션을 걸지 않는다. h1이 LCP 요소라 JS 뒤에 숨기지 않는다.
 * 높이도 고정하지 않는다. 모바일 첫 화면에서 공개방 카드가 보여야 한다.
 *
 * 배경은 평평한 단색 대신 왼쪽 위에서 옅게 번지는 radial-gradient를 한 겹 깐다.
 * CLAUDE.md가 이미 허용해 둔 범위(from-amber-50 to-amber-100/40 정도)를 넘지 않는
 * 옅기라 "그라디언트 남용 금지" 규칙과 부딪히지 않는다 — 색을 말하는 그라디언트가
 * 아니라 빛이 드는 방향을 암시하는 질감이라 정적이어도 화면이 평평해 보이지 않는다.
 */
export function HeroSection() {
  return (
    <section className="bg-[#fafaf8] bg-[radial-gradient(ellipse_90%_60%_at_15%_-10%,theme(colors.amber.100/50),transparent_55%)] px-6 pb-10 pt-24 md:pb-20 md:pt-36">
      <div className="mx-auto max-w-6xl">
        <AntlerLogo
          animated
          className="mb-4 h-10 w-9 text-amber-500 sm:mb-6 sm:h-16 sm:w-14"
        />

        <h1 className="break-keep text-4xl font-bold leading-[1.12] tracking-tighter text-stone-900 sm:text-6xl sm:leading-[1.05] lg:text-7xl xl:text-[82px]">
          밸런스 게임
          <br />
          우리 답은 같을까?
        </h1>

        <CreateRoomButton id={HERO_CTA_ID} className="mt-7 sm:mt-10" />
      </div>
    </section>
  );
}
