import { Check, Globe, Lock } from "lucide-react";
import { PUBLIC_ROOM_EXTENSION_LABEL } from "@/lib/room-lifetime";
import { cn } from "@/lib/utils";
import { Fawn } from "@/components/Fawn";

/**
 * 방을 만들기 전에 가장 먼저 정해야 하는 게 공개 여부다. 두 방은 규칙이 정반대라
 * (닉네임 vs 익명, 답해야 열림 vs 바로 보임) 나란히 놓고 비교하게 한다.
 * 비공개는 amber, 공개는 teal. 밸런스 게임 A/B와 같은 "둘 중 하나" 문법이다.
 */
const KINDS = [
  {
    tone: "amber",
    icon: Lock,
    name: "비공개방",
    lead: "우리끼리",
    points: [
      "다 답해야 친구 답이 열려요",
      "누가 나랑 잘 맞는지 알려줘요",
      "24시간 뒤 사라져요",
    ],
  },
  {
    tone: "teal",
    icon: Globe,
    name: "공개방",
    lead: "모두와 함께",
    points: [
      "누구나 익명으로 답해요",
      "결과를 바로 볼 수 있어요",
      `한 명 답하면 ${PUBLIC_ROOM_EXTENSION_LABEL} 더 열려요`,
    ],
  },
] as const;

export function RoomKindsSection() {
  return (
    <section aria-labelledby="room-kinds-title" className="bg-white px-5 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <h2
          id="room-kinds-title"
          className="max-w-xl break-keep text-[26px] font-cute leading-tight text-stone-900 sm:text-4xl"
        >
          친구끼리도, 모르는 사람과도
        </h2>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {KINDS.map(({ tone, icon: Icon, name, lead, points }) => (
            <div
              key={name}
              className={cn("relative overflow-hidden rounded-[32px] p-6 sm:p-8", tone === "amber" ? "bg-amber-50" : "bg-teal-50")}
            >
              <p
                className={cn(
                  "flex items-center gap-2 text-base font-bold",
                  tone === "amber" ? "text-amber-800" : "text-teal-800"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {name}
              </p>
              <Fawn
                mood={tone === "amber" ? "happy" : "wow"}
                className="absolute -right-3 -top-2 h-24 w-24 rotate-12 sm:h-28 sm:w-28"
              />
              <p
                className={cn(
                  "font-cute mt-2 text-[28px] sm:text-[32px]",
                  tone === "amber" ? "text-amber-950" : "text-teal-950"
                )}
              >
                {lead}
              </p>
              <ul className="mt-6 space-y-3">
                {points.map((point) => (
                  <li
                    key={point}
                    className={cn(
                      "flex items-start gap-2.5 break-keep text-base leading-relaxed",
                      tone === "amber" ? "text-amber-950" : "text-teal-950"
                    )}
                  >
                    <Check
                      className={cn(
                        "mt-1 h-4 w-4 flex-shrink-0",
                        tone === "amber" ? "text-amber-700" : "text-teal-700"
                      )}
                      aria-hidden="true"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
