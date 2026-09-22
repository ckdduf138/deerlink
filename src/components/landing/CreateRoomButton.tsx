import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * "방 만들기" 하나를 히어로·네비·CTA 세 곳에서 같은 링크로 쓰는 공용 컴포넌트다.
 *
 * 두 크기는 그냥 스케일이 아니라 서로 다른 물건이다.
 * - `lg`(히어로, 맨 아래 CTA): 배경도 그림자도 없는 텍스트 + 밑줄 + 화살표다. 전에는
 *   채운 버튼에 유리질 하이라이트·그림자를 얹어서 오히려 "생성형 SaaS 버튼" 신호를
 *   더 키웠다 — 지금은 이미 "전체 보기"·`RoomCard`가 쓰던 것과 같은 텍스트 링크
 *   문법(밑줄 + 화살표, hover에 화살표만 미끄러짐)을 재사용한다. 채운 사각형이 아니라
 *   화면에 하나만 있는 큰 텍스트라서 크기와 위치만으로 이미 주목을 끈다.
 * - `md`(네비, 스크롤 후에만 뜬다): 얇은 네비 바 안에서 로고·"인기 질문"과 구분되려면
 *   여전히 채운 면이 필요하다. 그림자 없이 평평하게 채운다 — 이전에 넣었던 그림자·
 *   유리질 하이라이트를 뺐다.
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
  if (size === "md") {
    return (
      <Link
        id={id}
        href="/create"
        className={cn(
          "inline-flex min-h-11 items-center justify-center rounded-xl bg-amber-700 px-4 text-sm font-semibold text-white transition-colors duration-150 hover:bg-amber-600 active:scale-[0.97] sm:px-5 sm:text-base",
          className
        )}
      >
        방 만들기
      </Link>
    );
  }

  return (
    <Link
      id={id}
      href="/create"
      className={cn(
        "group inline-flex min-h-11 items-center gap-1.5 text-xl font-bold text-amber-800 transition-colors duration-150 hover:text-amber-600 sm:text-2xl",
        className
      )}
    >
      <span className="border-b-2 border-amber-700 pb-0.5 transition-colors duration-150 group-hover:border-amber-500">
        방 만들기
      </span>
      <ArrowRight
        className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
        aria-hidden="true"
      />
    </Link>
  );
}
