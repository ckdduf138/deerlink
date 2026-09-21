import type { Metadata } from "next";
import { SITE_OPEN_GRAPH } from "@/lib/site-metadata";

export const metadata: Metadata = {
  title: "새 방 만들기 - 밸런스게임, 투표, 설문 질문 작성",
  description:
    "밸런스게임, 객관식, 주관식 질문으로 나만의 방을 만들고 링크를 공유하세요. 인기 질문 모음에서 바로 추가 가능. 술자리, MT, 모임에서 바로 사용할 수 있어요. 회원가입 없이 무료.",
  alternates: {
    canonical: "/create",
  },
  openGraph: {
    ...SITE_OPEN_GRAPH,
    title: "새 방 만들기 | Deerlink",
    description:
      "밸런스게임, 객관식, 주관식 질문을 만들고 링크 하나로 공유하세요. 무료, 회원가입 불필요.",
    url: "/create",
  },
};

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
