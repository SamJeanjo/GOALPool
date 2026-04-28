import { BracketCanvas } from "@/components/goalpool/BracketCanvas";

export default async function BracketPage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string }>;
}) {
  const params = await searchParams;

  return <BracketCanvas title={params.name || "Global Football Tournament"} />;
}
