"use client";

import { useEffect, useState } from "react";
import { PublicRoomsFeed } from "@/components/discover/public-rooms-feed";
import type { DiscoverRoom } from "@/lib/types";

type PublicRoomsState =
  | { status: "loading" }
  | {
      status: "ready";
      rooms: DiscoverRoom[];
      total: number;
      hasMore: boolean;
    }
  | { status: "error" };

export function HeroPublicRooms() {
  const [state, setState] = useState<PublicRoomsState>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();

    async function loadRooms() {
      try {
        const response = await fetch(
          "/api/rooms/discover?sort=popular&page=1&pageSize=2",
          { signal: controller.signal }
        );
        const data = (await response.json().catch(() => null)) as {
          rooms?: DiscoverRoom[];
          total?: number;
          hasMore?: boolean;
        } | null;

        if (
          !response.ok ||
          !data ||
          !Array.isArray(data.rooms) ||
          typeof data.total !== "number" ||
          typeof data.hasMore !== "boolean"
        ) {
          throw new Error("discover request failed");
        }

        setState({
          status: "ready",
          rooms: data.rooms,
          total: data.total,
          hasMore: data.hasMore,
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setState({ status: "error" });
      }
    }

    void loadRooms();
    return () => controller.abort();
  }, []);

  if (state.status === "loading") return <HeroPublicRoomsSkeleton />;

  if (state.status === "error") {
    return (
      <PublicRoomsFeed
        initialRooms={[]}
        initialTotal={0}
        initialHasMore={false}
        initialError="공개방을 불러오지 못했어요. 잠시 후 다시 시도해 주세요."
        mode="landing"
      />
    );
  }

  return (
    <PublicRoomsFeed
      initialRooms={state.rooms}
      initialTotal={state.total}
      initialHasMore={state.hasMore}
      mode="landing"
    />
  );
}

export function HeroPublicRoomsSkeleton() {
  return (
    <div role="status" aria-label="공개방 불러오는 중">
      <span className="sr-only">공개방을 불러오는 중이에요.</span>
      <div
        className="grid gap-4 lg:grid-cols-2"
        aria-hidden="true"
      >
        {[0, 1].map((item) => (
          <div
            key={item}
            className="h-56 animate-pulse rounded-2xl border border-amber-100 bg-white/70"
          />
        ))}
      </div>
    </div>
  );
}
