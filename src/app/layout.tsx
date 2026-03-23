import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Deerlink — 링크 하나로 모두의 생각을 비교하세요",
  description:
    "그룹 링크 하나로 모든 사람이 같은 질문에 답하고, 서로의 생각을 비교할 수 있는 플랫폼",
  openGraph: {
    title: "우리 그룹 생각 비교해봐 💘",
    description: "링크 하나로 그룹 전체 가치관 비교",
    siteName: "Deerlink",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
