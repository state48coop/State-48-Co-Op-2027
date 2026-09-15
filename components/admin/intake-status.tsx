"use client";

import { useTransition } from "react";
import { updateIntakeStatus } from "@/actions/workspace";

export function IntakeStatus({ id, initialStatus }: { id: string; initialStatus: string }) { const [pending, startTransition] = useTransition(); return <select disabled={pending} defaultValue={initialStatus} onChange={(event) => { const form = new FormData(); form.set("id", id); form.set("status", event.target.value); startTransition(async () => { await updateIntakeStatus(form); }); }} className="h-9 border border-black/15 bg-white px-2 text-xs font-bold uppercase tracking-wider"><option value="open">Open</option><option value="reviewing">Reviewing</option><option value="quoted">Quoted</option><option value="closed">Closed</option></select>; }
