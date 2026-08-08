import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fafaf8] flex flex-col items-center justify-center gap-8 px-4">
      <div className="text-center">
        <div className="text-[96px] font-bold leading-none tracking-tight text-stone-300 mb-6">
          404
        </div>
        <p className="text-stone-800 text-xl font-bold mb-2">
          찾을 수 없는 페이지예요
        </p>
        <p className="text-stone-500 text-sm">
          링크가 만료됐거나 잘못된 주소일 수 있어요
        </p>
      </div>

      <Link
        href="/"
        className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 transition-colors duration-200"
      >
        <ArrowLeft className="w-4 h-4" />
        홈으로 돌아가기
      </Link>
    </div>
  );
}
