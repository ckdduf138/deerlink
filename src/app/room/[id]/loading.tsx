import { Loader2 } from "lucide-react";
import { AntlerLogo } from "@/components/landing/AntlerLogo";

export default function RoomLoading() {
  return (
    <div className="min-h-screen bg-[#fafaf8] text-stone-900" aria-busy="true">
      <nav className="fixed inset-x-0 top-0 z-50 flex items-center border-b border-amber-100 bg-white/90 px-4 py-4 backdrop-blur-md md:px-8">
        <span className="flex min-h-11 items-center gap-1.5 text-sm font-semibold tracking-tight text-stone-900">
          <AntlerLogo className="h-[15px] w-3 text-amber-500" />
          Deerlink
        </span>
      </nav>

      <main className="mx-auto max-w-md px-4 pb-12 pt-28" role="status" aria-live="polite">
        <div className="mb-8 flex items-center gap-3">
          <Loader2
            className="h-5 w-5 animate-spin text-amber-700 motion-reduce:animate-none"
            aria-hidden="true"
          />
          <div>
            <p className="text-base font-bold text-stone-900">방을 불러오는 중이에요</p>
            <p className="mt-1 text-sm text-stone-600">질문과 참여 상태를 확인하고 있어요.</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-amber-100 bg-white p-5" aria-hidden="true">
          <div className="h-3 w-24 animate-pulse rounded bg-stone-200 motion-reduce:animate-none" />
          <div className="mt-5 h-6 w-4/5 animate-pulse rounded bg-stone-200 motion-reduce:animate-none" />
          <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-stone-100 motion-reduce:animate-none" />
          <div className="mt-8 h-12 w-full animate-pulse rounded-xl bg-amber-100 motion-reduce:animate-none" />
        </div>
      </main>
    </div>
  );
}
