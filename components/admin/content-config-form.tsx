"use client";

import { FormEvent, useState, useTransition } from "react";
import { saveUiConfig } from "@/actions/workspace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ContentConfigForm() { const [status, setStatus] = useState(""); const [pending, startTransition] = useTransition(); function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const form = new FormData(event.currentTarget); startTransition(async () => { const result = await saveUiConfig(form); setStatus(result.ok ? "Site setting saved." : result.error); }); } return <form onSubmit={submit} className="grid gap-3 md:grid-cols-[1fr_2fr_auto] md:items-end"><label className="space-y-2"><span className="field-label">Setting key</span><Input name="key" placeholder="home_hero_title" required /></label><label className="space-y-2"><span className="field-label">Value</span><Input name="value" placeholder="Content or JSON value" required /></label><div><Button disabled={pending} type="submit">{pending ? "Saving…" : "Save setting"}</Button></div>{status && <p className="text-sm text-black/60 md:col-span-3">{status}</p>}</form>; }
