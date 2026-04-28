import { BracketCanvas, ShareBracketButton } from "@/components/goalpool/BracketCanvas";
import { featuredBracket } from "@/lib/goalpool-data";

export default async function PublicBracketPage({
  params,
}: {
  params: Promise<{ share_slug: string }>;
}) {
  const { share_slug } = await params;

  return (
    <div>
      <div className="bg-white px-4 py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="text-[13px] font-bold uppercase tracking-wide text-blue-600">Shared bracket</p>
            <h1 className="text-xl font-black text-slate-950">{share_slug === featuredBracket.shareSlug ? featuredBracket.name : "GoalPool shared bracket"}</h1>
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
