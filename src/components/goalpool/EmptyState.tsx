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
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-blue-600">
        <PlusCircle className="h-7 w-7" />
      </div>
      <h2 className="mt-5 text-2xl font-black text-slate-950">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-slate-600">{description}</p>
      <a
        href={href}
        className="goal-gradient mt-6 inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-black text-white"
      >
        {action}
      </a>
    </div>
  );
}
