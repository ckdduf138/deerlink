import { prisma } from "@/lib/prisma";
import { serializeAdminRoom } from "@/lib/serialize";
import { AdminClient } from "@/components/admin/AdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const rooms = await prisma.room.findMany({
    include: {
      questions: { orderBy: { order: "asc" } },
      participants: {
        include: { answers: true },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const serialized = rooms.map(serializeAdminRoom);

  return <AdminClient initialRooms={serialized} />;
}
