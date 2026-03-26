import type { Metadata, Viewport } from "next";
import { Gowun_Dodum } from "next/font/google";
import "./globals.css";

const gowunDodum = Gowun_Dodum({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-gowun-dodum",
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://deerlink.kr";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Deerlink — 밸런스게임·그룹 설문·의견 비교 플랫폼",
    template: "%s | Deerlink",
  },
  description:
    "링크 하나로 그룹 전체가 같은 질문에 답하고 서로의 선택을 한꺼번에 비교해요. 밸런스게임, 객관식, 주관식 질문으로 친구들의 속마음을 알아보세요. 회원가입 없이 무료.",
  keywords: [
    "밸런스게임",
    "밸런스게임 만들기",
    "온라인 밸런스게임",
    "밸런스게임 링크",
    "그룹 설문",
    "온라인 설문 만들기",
    "무료 설문 도구",
    "의견 비교",
    "가치관 비교",
    "가치관 비교 테스트",
    "커플 가치관 테스트",
    "친구 비교",
    "아이스브레이킹 게임",
    "MT 게임",
    "팀빌딩 게임",
    "그룹 투표",
    "링크 설문",
    "링크 공유",
    "회원가입 없는 설문",
    "투표",
    "설문조사",
    "Deerlink",
    "디어링크",
  ],
  openGraph: {
    title: "우리 생각 얼마나 다를까? | Deerlink",
    description:
      "링크 하나 공유하면 끝. 모두가 답할 때까지 서로의 선택은 비밀, 그 뒤엔 한꺼번에 공개.",
    siteName: "Deerlink",
    type: "website",
    locale: "ko_KR",
    url: baseUrl,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Deerlink — 링크 하나로 모두의 생각을 비교해요" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "우리 생각 얼마나 다를까? | Deerlink",
    description:
      "링크 하나 공유하면 끝. 모두가 답할 때까지 서로의 선택은 비밀.",
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
  url: baseUrl,
  description:
    "링크 하나로 그룹 전체가 같은 질문에 답하고 서로의 선택을 한꺼번에 비교하는 서비스. 밸런스게임, 객관식, 주관식 질문 지원.",
  applicationCategory: "SocialNetworkingApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "KRW",
  },
  inLanguage: "ko-KR",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Deerlink는 무료인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "네, 완전 무료입니다. 회원가입도 필요 없어요.",
      },
    },
    {
      "@type": "Question",
      name: "몇 명까지 참여할 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "인원 제한 없이 링크를 공유하면 누구나 참여할 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "어떤 질문 유형을 만들 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "밸런스 게임(A vs B), 객관식, 주관식 세 가지 유형을 지원합니다.",
      },
    },
    {
      "@type": "Question",
      name: "답변 결과는 언제 공개되나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "모든 참여자가 답변을 완료해야 결과가 공개됩니다. 미리 볼 수 없어요.",
      },
    },
    {
      "@type": "Question",
      name: "링크는 얼마나 유효한가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "생성 후 24시간 동안 유효합니다.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={gowunDodum.variable}>
      <head>
        <meta name="naver-site-verification" content="e27d20053691ae1e1d1d23a7a14da0d60cccf90d" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
