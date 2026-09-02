import { Loader2 } from "lucide-react";
import { AntlerLogo } from "@/components/landing/AntlerLogo";

export default function DiscoverLoading() {
  return (
    <div className="min-h-screen bg-[#fafaf8] text-stone-900" aria-busy="true">
      <nav className="fixed inset-x-0 top-0 z-50 flex items-center border-b border-amber-100 bg-white/90 px-4 py-4 backdrop-blur-md md:px-8">
        <span className="flex min-h-11 items-center gap-1.5 text-sm font-semibold tracking-tight text-stone-900">
          <AntlerLogo className="h-[15px] w-3 text-amber-500" />
          Deerlink
        </span>
      </nav>

      <main className="mx-auto max-w-2xl px-4 pb-20 pt-24" role="status" aria-live="polite">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">공개방 둘러보기</h1>
          <div className="mt-3 flex items-center gap-2 text-sm text-stone-600">
            <Loader2
              className="h-4 w-4 animate-spin text-amber-700 motion-reduce:animate-none"
              aria-hidden="true"
            />
            최신 공개방을 불러오는 중이에요.
          </div>
        </div>

        <div className="mb-6 flex gap-2" aria-hidden="true">
          {["w-20", "w-20", "w-28"].map((width, index) => (
            <div key={index} className={`h-11 ${width} rounded-full bg-stone-200`} />
          ))}
        </div>

        <div className="space-y-3" aria-hidden="true">
          {[0, 1, 2].map((item) => (
            <div key={item} className="rounded-2xl border border-amber-100 bg-white p-5">
              <div className="h-5 w-3/4 animate-pulse rounded bg-stone-200 motion-reduce:animate-none" />
              <div className="mt-4 h-3 w-1/2 animate-pulse rounded bg-stone-100 motion-reduce:animate-none" />
              <div className="mt-6 h-11 w-full animate-pulse rounded-xl bg-amber-100 motion-reduce:animate-none" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
