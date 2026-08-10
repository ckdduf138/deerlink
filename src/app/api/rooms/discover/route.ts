import { getPublicRooms, DISCOVER_PAGE_SIZE, type DiscoverSort } from "@/lib/discover-rooms";
import { NextResponse } from "next/server";

const MAX_PAGE = 500;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const pageParam = Number(searchParams.get("page"));
  const page = Number.isInteger(pageParam) && pageParam > 0
    ? Math.min(pageParam, MAX_PAGE)
    : 1;

  const sortParam = searchParams.get("sort");
  const sort: DiscoverSort =
    sortParam === "popular" || sortParam === "answers" ? sortParam : "recent";

  const { rooms, total, hasMore } = await getPublicRooms({ page, sort });

  return NextResponse.json({ rooms, page, pageSize: DISCOVER_PAGE_SIZE, total, hasMore });
}
