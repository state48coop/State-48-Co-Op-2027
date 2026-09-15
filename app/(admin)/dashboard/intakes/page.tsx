import { IntakeStatus } from "@/components/admin/intake-status";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Intake = { id: string; name: string; email: string; phone: string | null; project_type: string; dimensions: string | null; materials: string[] | null; notes: string | null; status: "open" | "reviewing" | "quoted" | "closed"; created_at: string };

export default async function IntakesPage() {
  const supabase = createSupabaseServerClient() as any;
  const { data } = await supabase.from("project_intakes").select("*").order("created_at", { ascending: false });
  const intakes = (data ?? []) as Intake[];
  return <section className="min-h-screen p-6 md:p-10"><div className="mx-auto max-w-6xl"><div className="border-b border-black/10 pb-6"><p className="eyebrow">Operations</p><h1 className="mt-2 text-4xl font-black uppercase tracking-tight">Project intakes</h1><p className="mt-2 text-sm text-black/60">Review incoming build requests and keep each opportunity moving.</p></div><div className="mt-8 space-y-4">{intakes.length === 0 ? <div className="border border-black/10 bg-white p-8 text-sm text-black/55">No project requests yet.</div> : intakes.map((intake) => <article className="border border-black/10 bg-white p-5 md:p-6" key={intake.id}><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-lg font-black uppercase">{intake.name}</p><p className="mt-1 text-sm text-black/60">{intake.email}{intake.phone ? ` · ${intake.phone}` : ""}</p></div><IntakeStatus id={intake.id} initialStatus={intake.status} /></div><div className="mt-5 grid gap-4 border-t border-black/10 pt-5 text-sm md:grid-cols-3"><div><p className="label">Project type</p><p className="mt-1">{intake.project_type}</p></div><div><p className="label">Dimensions</p><p className="mt-1">{intake.dimensions || "—"}</p></div><div><p className="label">Materials</p><p className="mt-1">{intake.materials?.join(", ") || "—"}</p></div></div>{intake.notes && <p className="mt-4 border-l-2 border-ember pl-3 text-sm leading-6 text-black/70">{intake.notes}</p>}<p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-black/40">Received {new Date(intake.created_at).toLocaleString()}</p></article>)}</div></div></section>;
}
