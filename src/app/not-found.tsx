import type { Metadata } from "next";
import Link from "next/link";
import { Fawn } from "@/components/Fawn";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-page px-5 text-center">
      <Fawn mood="curious" className="h-40 w-40" title="고개를 갸웃하는 아기 사슴" />
      <h1 className="font-cute mt-4 text-[28px] text-stone-900 sm:text-4xl">길을 잃었어요</h1>
      <p className="mt-2 text-base text-stone-600">링크가 만료됐거나 잘못된 주소일 수 있어요</p>
      <Link href="/" className="btn-primary mt-8 min-w-52">
        홈으로 가기
      </Link>
    </div>
  );
}
