import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const rooms = await prisma.room.findMany({
    include: {
      questions: true,
      participants: {
        include: { answers: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(rooms);
}
