import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "방 만들기",
  description:
    "밸런스게임, 객관식, 주관식 질문으로 방을 만들고 링크를 공유하세요. 회원가입 없이 무료로 시작할 수 있어요.",
};

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
