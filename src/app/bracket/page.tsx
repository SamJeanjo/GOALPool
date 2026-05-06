import { BracketCanvas } from "@/components/goalpool/BracketCanvas";

export default async function BracketPage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string; teams?: string }>;
}) {
  const params = await searchParams;
  const favoriteTeamIds = params.teams?.split(",").filter(Boolean) ?? [];

  return <BracketCanvas title={params.name || "Enter your prediction"} favoriteTeamIds={favoriteTeamIds} />;
}
