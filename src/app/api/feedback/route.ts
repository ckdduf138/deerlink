import { checkRateLimit, clientKey } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

const MESSAGE_MAX = 1000;
const CONTACT_MAX = 100;

export async function POST(request: Request) {
  const limit = checkRateLimit(`feedback:${clientKey(request)}`, 3, 10 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "너무 많이 시도했어요. 잠시 후 다시 시도해주세요." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  const body = await request.json().catch(() => null);
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "잘못된 요청이에요" }, { status: 400 });
  }

  const { message, contact } = body as { message: unknown; contact?: unknown };

  if (typeof message !== "string" || !message.trim() || message.length > MESSAGE_MAX) {
    return NextResponse.json({ error: "내용을 확인해주세요" }, { status: 400 });
  }
  if (contact !== undefined && (typeof contact !== "string" || contact.length > CONTACT_MAX)) {
    return NextResponse.json({ error: "연락처를 확인해주세요" }, { status: 400 });
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ ok: true });
  }

  const fields: { name: string; value: string; inline?: boolean }[] = [
    { name: "내용", value: message.trim() },
  ];
  if (contact?.trim()) {
    fields.push({ name: "연락처", value: contact.trim(), inline: true });
  }

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [
          {
            title: "Deerlink 피드백",
            color: 0xe8a038,
            fields,
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });
  } catch {
    // Discord가 죽어 있어도 사용자에게는 피드백이 접수된 것처럼 보여야 한다 —
    // 재시도를 유도해봐야 같은 이유로 또 실패할 뿐이다.
  }

  return NextResponse.json({ ok: true });
}
