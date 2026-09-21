import type { Metadata } from "next";

/**
 * 모든 페이지가 공유하는 og 기본값.
 *
 * Next.js는 metadata.openGraph를 얕게 합친다 — 페이지가 openGraph를 하나라도 선언하면
 * 루트의 images·siteName·locale이 통째로 사라진다. 실제로 /popular, /popular/[topic],
 * /create가 og:image 없이 배포돼서 카톡에 링크를 붙이면 이미지 없는 텍스트 카드로 떴다.
 * 자기 og를 선언하는 페이지는 이걸 펼쳐 넣을 것.
 */
export const SITE_OPEN_GRAPH = {
  siteName: "Deerlink",
  type: "website",
  locale: "ko_KR",
  images: [
    {
      url: "/opengraph-image",
      width: 1200,
      height: 630,
      alt: "Deerlink - 밸런스게임 만들기, 링크 하나로 의견 비교",
    },
  ],
} satisfies NonNullable<Metadata["openGraph"]>;
