import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AntlerLogo } from "@/components/landing/AntlerLogo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0d0a07] flex flex-col items-center justify-center gap-10 px-4">
      <AntlerLogo className="w-10 h-12 text-amber-500 opacity-30" variant="filled" />

      <div className="text-center">
        <div className="text-[96px] font-bold leading-none tracking-tight text-stone-800 mb-6">
          404
        </div>
        <p className="text-stone-400 text-base mb-2">
          찾을 수 없는 페이지예요
        </p>
        <p className="text-stone-600 text-sm">
          링크가 만료됐거나 잘못된 주소일 수 있어요
        </p>
      </div>

      <Link
        href="/"
        className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-200 transition-colors duration-200"
      >
        <ArrowLeft className="w-4 h-4" />
        홈으로 돌아가기
      </Link>
    </div>
  );
}
