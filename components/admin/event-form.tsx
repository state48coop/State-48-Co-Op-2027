"use client";

import { FormEvent, useState, useTransition } from "react";

import { createEvent } from "@/actions/workspace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function EventForm() {
  const [published, setPublished] = useState(false); const [status, setStatus] = useState(""); const [pending, startTransition] = useTransition();
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const formElement = event.currentTarget; const form = new FormData(formElement); form.set("isPublished", String(published)); startTransition(async () => { const result = await createEvent(form); setStatus(result.ok ? "Event saved." : result.error); if (result.ok) { formElement.reset(); setPublished(false); } }); }
  return <form onSubmit={submit} className="space-y-5"><div className="flex items-center justify-between"><div><p className="eyebrow">Events manager</p><h2 className="mt-2 text-xl font-black uppercase">Add an event</h2></div><label className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest"><input checked={published} onChange={(event) => setPublished(event.target.checked)} type="checkbox" /> Published</label></div><div className="grid gap-4 md:grid-cols-2"><label className="space-y-2"><span className="field-label">Event title</span><Input name="title" required /></label><label className="space-y-2"><span className="field-label">Date and time</span><Input name="eventDate" type="datetime-local" required /></label><label className="space-y-2"><span className="field-label">Location</span><Input name="location" defaultValue="The Barn at State 48 Co-Op" required /></label><label className="space-y-2 md:col-span-2"><span className="field-label">Description</span><textarea name="description" className="min-h-24 w-full border border-black/15 bg-white px-4 py-3 text-sm" /></label></div><div className="flex items-center gap-4"><Button disabled={pending} type="submit">{pending ? "Saving…" : "Save event"}</Button>{status && <p className="text-sm text-black/60">{status}</p>}</div></form>;
}
