import { getPublicRooms, DISCOVER_PAGE_SIZE, type DiscoverSort } from "@/lib/discover-rooms";
import { NextResponse } from "next/server";

const MAX_PAGE = 500;
const MIN_PAGE_SIZE = 1;

export async function GET(request: Request) {
  const startedAt = performance.now();
  const { searchParams } = new URL(request.url);

  const pageParam = Number(searchParams.get("page"));
  const page = Number.isInteger(pageParam) && pageParam > 0
    ? Math.min(pageParam, MAX_PAGE)
    : 1;

  const sortParam = searchParams.get("sort");
  const sort: DiscoverSort =
    sortParam === "popular" || sortParam === "answers" ? sortParam : "recent";

  const pageSizeParam = Number(searchParams.get("pageSize"));
  const pageSize = Number.isInteger(pageSizeParam) && pageSizeParam >= MIN_PAGE_SIZE
    ? Math.min(pageSizeParam, DISCOVER_PAGE_SIZE)
    : DISCOVER_PAGE_SIZE;

  const { rooms, total, hasMore } = await getPublicRooms({ page, sort, pageSize });

  const totalDurationMs = performance.now() - startedAt;
  if (totalDurationMs >= 750) {
    console.warn(
      JSON.stringify({
        event: "slow_discover_request",
        totalMs: Math.round(totalDurationMs),
        region: process.env.VERCEL_REGION ?? "local",
        sort,
      })
    );
  }

  return NextResponse.json(
    { rooms, page, pageSize, total, hasMore },
    {
      headers: {
        "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30",
        "Server-Timing": `total;dur=${totalDurationMs.toFixed(1)}`,
      },
    }
  );
}
