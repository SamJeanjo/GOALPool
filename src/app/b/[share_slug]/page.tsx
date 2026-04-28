import { BracketCanvas, ShareBracketButton } from "@/components/goalpool/BracketCanvas";
import { featuredBracket } from "@/lib/tournament-data";

export default async function PublicBracketPage({
  params,
}: {
  params: Promise<{ share_slug: string }>;
}) {
  const { share_slug } = await params;

  return (
    <div className="bg-[#05070A] text-white">
      <div className="border-b border-white/10 bg-[#07111F]/90 px-4 py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="text-[13px] font-bold uppercase tracking-wide text-[#D4AF37]">Shared bracket</p>
            <h1 className="text-xl font-semibold text-white">
              {share_slug === featuredBracket.shareSlug ? featuredBracket.name : "GoalPool shared bracket"}
            </h1>
          </div>
          <ShareBracketButton bracket={{ ...featuredBracket, shareSlug: share_slug }} />
        </div>
      </div>
      <BracketCanvas
        readonly
        showSaveBar={false}
        initialPicks={featuredBracket.picks}
        title={share_slug === featuredBracket.shareSlug ? featuredBracket.name : "Shared GoalPool Bracket"}
      />
    </div>
  );
}
