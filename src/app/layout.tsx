import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { FeedbackPrompt } from "@/components/FeedbackPrompt";
import { SITE_OPEN_GRAPH } from "@/lib/site-metadata";
// Pretendard 동적 서브셋: 유니코드 범위로 쪼갠 파일 중 페이지에 실제 쓰인 글자 조각만 받는다.
// 예전 Gowun Dodum은 400 한 굵기뿐이라 font-bold가 전부 브라우저가 가짜로 두껍게 그린 글자였다.
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import { Jua } from "next/font/google";
import "./globals.css";

// 큰 제목·큰 숫자용 둥근 글씨. 굵기가 400 하나뿐이라 globals.css의 font-cute가
// font-synthesis를 꺼서 브라우저가 가짜 볼드를 그리지 않게 한다. 본문은 Pretendard 그대로.
const jua = Jua({ weight: "400", subsets: ["latin"], display: "swap", preload: false, variable: "--font-jua" });

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://deerlink.kr";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "밸런스 게임 만들기 - 단톡방 투표 30초 완성 | Deerlink",
    template: "%s | Deerlink",
  },
  description:
    "링크 하나로 만드는 밸런스 게임, 투표, 설문. 인기 밸런스게임 질문으로 바로 시작하고, 내 답을 마치기 전까지 친구들의 선택이 잠기는 단톡방 의견 비교 도구입니다.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/icon-192.png"],
  },
  keywords: [
    "밸런스 게임",
    "밸런스게임",
    "밸런스 게임 만들기",
    "밸런스게임 만들기",
    "밸런스게임 사이트",
    "밸런스게임 질문",
    "밸런스게임 질문 모음",
    "밸런스게임 링크",
    "온라인 밸런스게임",
    "단톡방 밸런스게임",
    "단톡방 투표",
    "단톡방 투표 만들기",
    "카톡 투표",
    "커플 밸런스게임",
    "웃긴 밸런스게임",
    "온라인 투표 만들기",
    "무료 투표 만들기",
    "링크 투표",
    "온라인 설문 만들기",
    "무료 설문 도구",
    "그룹 설문",
    "그룹 투표",
    "술자리 게임",
    "이심전심 게임",
    "MT 게임",
    "단체 게임",
    "워크샵 게임",
    "팀빌딩 게임",
    "아이스브레이킹 게임",
    "친구와 할 수 있는 게임",
    "의견 비교",
    "생각 비교",
    "가치관 비교",
    "가치관 테스트",
    "커플 가치관 테스트",
    "친구 궁합",
    "고민 나누기",
    "링크 공유",
    "링크 공유 게임",
    "회원가입 없는 설문",
    "설문조사",
    "투표",
    "Deerlink",
    "디어링크",
  ],
  openGraph: {
    title: "우리 답이 얼마나 다를까? 밸런스게임 만들기 | Deerlink",
    description:
      "링크 하나 공유하면 끝. 내 답을 마치면 친구들의 선택과 그룹 리포트가 열리는 단톡방 밸런스게임과 투표.",
    ...SITE_OPEN_GRAPH,
  },
  twitter: {
    // title/description은 두지 않는다. 여기 두면 twitter는 얕게 합쳐지지도 않고 그냥
    // 물려받아서 모든 하위 페이지가 홈 제목을 달고 나간다. X 크롤러는 og:title로 폴백한다.
    card: "summary_large_image",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  verification: {
    google: "P6K0w_olXohe-HY7SjqzGxOT4_Pvtx97_7FIXKicZkM",
  },
};

const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Deerlink",
  alternateName: "디어링크",
  url: baseUrl,
  description:
    "밸런스게임 만들기, 온라인 투표, 그룹 설문을 링크 하나로 만들고 공유하는 무료 플랫폼. 술자리 게임, MT 단체 게임, 이심전심 게임, 고민 나누기까지 지원합니다.",
  applicationCategory: "SocialNetworkingApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "KRW",
  },
  inLanguage: "ko-KR",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={jua.variable}>
      <head>
        <GoogleAnalytics />
        <meta name="naver-site-verification" content="e27d20053691ae1e1d1d23a7a14da0d60cccf90d" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
        />
      </head>
      <body className="antialiased">
        {children}
        <FeedbackPrompt />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
