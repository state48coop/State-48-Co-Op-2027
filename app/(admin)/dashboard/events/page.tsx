import { EventForm } from "@/components/admin/event-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Event = { id: string; title: string; event_date: string; location: string; description: string | null; is_published: boolean };

export default async function EventsPage() {
  const supabase = createSupabaseServerClient() as any;
  const { data } = await supabase.from("events").select("*").order("event_date", { ascending: true });
  const events = (data ?? []) as Event[];
  return <section className="min-h-screen p-6 md:p-10"><div className="mx-auto max-w-6xl"><div className="border-b border-black/10 pb-6"><p className="eyebrow">Operations</p><h1 className="mt-2 text-4xl font-black uppercase tracking-tight">Events</h1><p className="mt-2 text-sm text-black/60">Publish food truck nights, openings, and community events.</p></div><div className="mt-8 grid gap-8 lg:grid-cols-[360px_1fr]"><div className="border border-black/10 bg-white p-6"><EventForm /></div><div className="space-y-3">{events.length === 0 ? <div className="border border-black/10 bg-white p-8 text-sm text-black/55">No events yet. Add the first event from the form.</div> : events.map((event) => <article className="border border-black/10 bg-white p-5" key={event.id}><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-black uppercase">{event.title}</p><p className="mt-1 text-sm text-black/60">{new Date(event.event_date).toLocaleString()} · {event.location}</p></div><span className={`text-[10px] font-bold uppercase tracking-widest ${event.is_published ? "text-emerald-700" : "text-black/40"}`}>{event.is_published ? "Published" : "Draft"}</span></div>{event.description && <p className="mt-3 text-sm leading-6 text-black/65">{event.description}</p>}</article>)}</div></div></div></section>;
}
