import type { Metadata } from "next";
import { SITE_OPEN_GRAPH } from "@/lib/site-metadata";

export const metadata: Metadata = {
  title: "밸런스 게임 만들기",
  description:
    "밸런스 게임 질문을 고르거나 직접 쓰고 나만의 방을 만드세요. 링크를 공유하면 친구들이 각자 답하고 함께 결과를 비교할 수 있어요. 회원가입 없이 무료.",
  alternates: {
    canonical: "/create",
  },
  openGraph: {
    ...SITE_OPEN_GRAPH,
    title: "밸런스 게임 만들기 | 디어링크",
    description:
      "질문을 고르고 링크로 공유하세요. 친구들과 선택을 비교하는 밸런스게임을 무료로 만들 수 있어요.",
    url: "/create",
  },
};

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
