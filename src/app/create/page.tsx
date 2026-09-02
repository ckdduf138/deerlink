import { CreatePageClient } from "@/components/create/create-page-client";

export default async function CreateRoomPage({
  searchParams,
}: {
  searchParams: Promise<{ question?: string }>;
}) {
  const { question } = await searchParams;
  return <CreatePageClient initialQuestionId={typeof question === "string" ? question : null} />;
}
