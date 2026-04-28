import { PlusCircle } from "lucide-react";

export function EmptyState({
  title,
  description,
  href = "/create",
  action = "Create your bracket",
}: {
  title: string;
  description: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-white/15 bg-[#07111F]/70 p-8 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 text-[#D4AF37]">
        <PlusCircle className="h-7 w-7" />
      </div>
      <h2 className="mt-5 text-2xl font-semibold text-white">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-slate-400">{description}</p>
      <a
        href={href}
        className="goal-gradient mt-6 inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-black text-[#05070A]"
      >
        {action}
      </a>
    </div>
  );
}
