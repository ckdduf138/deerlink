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
    default: "밸런스 게임, 친구와 답 비교하기 | 디어링크",
    template: "%s | 디어링크",
  },
  description:
    "디어링크에서 밸런스 게임 질문을 고르거나 직접 만들고 링크로 친구를 초대하세요. 각자 답을 마치면 서로의 선택과 그룹 결과를 비교할 수 있어요.",
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
  openGraph: {
    title: "밸런스 게임, 친구와 답 비교하기 | 디어링크",
    description:
      "밸런스 게임 질문을 고르거나 직접 만들고 링크로 친구를 초대하세요. 모두 답하면 서로의 선택과 그룹 결과가 열려요.",
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
    // 검색 결과에 큰 썸네일과 긴 스니펫을 허용한다. 지시어가 없으면 구글이 보수적인
    // 기본값(작은 미리보기)으로 잘라서 보여준다.
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "P6K0w_olXohe-HY7SjqzGxOT4_Pvtx97_7FIXKicZkM",
  },
};

const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "디어링크",
  alternateName: "Deerlink",
  url: baseUrl,
  description:
    "친구들과 밸런스게임을 만들고 답을 비교하는 무료 서비스.",
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
