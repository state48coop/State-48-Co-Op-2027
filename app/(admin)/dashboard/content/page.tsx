import { ContentConfigForm } from "@/components/admin/content-config-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Config = { id: string; key: string; value: unknown };

export default async function ContentPage() {
  const supabase = createSupabaseServerClient() as any;
  const { data } = await supabase.from("ui_config").select("*").order("key");
  const configs = (data ?? []) as Config[];
  return <section className="min-h-screen p-6 md:p-10"><div className="mx-auto max-w-6xl"><div className="border-b border-black/10 pb-6"><p className="eyebrow">Site controls</p><h1 className="mt-2 text-4xl font-black uppercase tracking-tight">Site content</h1><p className="mt-2 text-sm text-black/60">Manage reusable homepage and theme values without changing code.</p></div><div className="mt-8 grid gap-8 lg:grid-cols-[360px_1fr]"><div className="border border-black/10 bg-white p-6"><ContentConfigForm /></div><div className="space-y-3">{configs.length === 0 ? <div className="border border-black/10 bg-white p-8 text-sm text-black/55">No content settings yet. Add a key such as <code>home_hero_title</code>.</div> : configs.map((config) => <article className="border border-black/10 bg-white p-5" key={config.id}><p className="font-mono text-xs font-bold text-ember">{config.key}</p><pre className="mt-3 whitespace-pre-wrap text-sm leading-6 text-black/70">{typeof config.value === "string" ? config.value : JSON.stringify(config.value, null, 2)}</pre></article>)}</div></div></div></section>;
}
