import Link from "next/link";
import { Fawn } from "@/components/Fawn";

/**
 * 결과를 다 본 사람이 다음에 할 일을 놓는 자리.
 *
 * 예전엔 접힌 목록들 맨 밑에 text-xs 링크 하나였는데, 퍼널에서 가장 중요한 전환이
 * 여기다 — 남의 방에 답하러 온 사람이 자기 방을 만드는 순간. 공개방은 링크만 알면
 * 아무나 들어오므로 제품 설명 한 줄도 같이 둔다.
 */
export function ResultsOutro({ isPublic }: { isPublic: boolean }) {
  return (
    <section
      aria-labelledby="results-outro-heading"
      className="surface mt-10 px-6 py-12 text-center sm:px-10"
    >
      <Fawn mood="happy" className="mx-auto mb-3 h-24 w-24" />
      <h2
        id="results-outro-heading"
        className="text-2xl font-cute leading-snug text-stone-900 md:text-3xl"
      >
        다음 질문도 준비돼 있어요
      </h2>
      <p className="mx-auto mt-2 max-w-md text-[15px] text-stone-600">질문 고르고 링크만 보내면 끝</p>
      <Link
        href="/create"
        className="btn-primary mt-8 w-full sm:w-auto sm:min-w-52"
      >
        내 방 만들기
      </Link>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
        <Link
          href="/popular"
          className="inline-flex min-h-11 items-center text-[15px] font-medium text-stone-600 transition-colors hover:text-stone-900"
        >
          질문 모음 보기
        </Link>
        {isPublic && (
          <Link
            href="/discover"
            className="inline-flex min-h-11 items-center text-[15px] font-medium text-stone-600 transition-colors hover:text-stone-900"
          >
            다른 공개방 둘러보기
          </Link>
        )}
      </div>
    </section>
  );
}
