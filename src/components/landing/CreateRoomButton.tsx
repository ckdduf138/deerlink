import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * "방 만들기" 하나를 히어로·네비·CTA 세 곳에서 같은 링크로 쓰는 공용 컴포넌트다.
 *
 * 2026-09 정석 리워크로 두 크기 모두 브랜드 amber를 채운 버튼이 됐다 (`btn-primary`).
 * 텍스트 + 밑줄 링크였던 이전 버전은 주 행동이 본문 링크처럼 약하게 읽혔다.
 * 화살표는 달지 않는다. 채운 면이 이미 누를 곳이라는 신호다.
 */
export function CreateRoomButton({
  size = "lg",
  id,
  className,
}: {
  size?: "md" | "lg";
  id?: string;
  className?: string;
}) {
  return (
    <Link
      id={id}
      href="/create"
      className={cn(
        "btn-primary",
        size === "md" && "min-h-10 rounded-xl px-4 text-[15px]",
        size === "lg" && "px-7",
        className
      )}
    >
      방 만들기
    </Link>
  );
}
