"use client";

import { FormEvent, useState, useTransition } from "react";

import { createProject, updateProject } from "@/actions/workspace";
import type { ProjectSummary } from "@/lib/catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ProjectForm({ project }: { project?: ProjectSummary | null }) {
  const [published, setPublished] = useState(project?.is_published ?? false);
  const [status, setStatus] = useState("");
  const [pending, startTransition] = useTransition();
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const form = new FormData(event.currentTarget); form.set("isPublished", String(published)); if (project) form.set("id", project.id); startTransition(async () => { const result = project ? await updateProject(form) : await createProject(form); setStatus(result.ok ? "Project saved." : result.error); if (!project && result.ok) window.location.assign(`/dashboard/projects/${result.id}`); }); }
  return <form onSubmit={submit} className="space-y-6"><div className="flex items-center justify-between gap-4"><div><p className="eyebrow">Gallery manager</p><h2 className="mt-2 text-2xl font-black uppercase">{project ? "Edit case study" : "New case study"}</h2></div><label className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest"><input checked={published} onChange={(event) => setPublished(event.target.checked)} type="checkbox" /> Published</label></div><div className="grid gap-4 md:grid-cols-2"><Field label="Title"><Input name="title" defaultValue={project?.title} required /></Field><Field label="Slug"><Input name="slug" defaultValue={project?.slug} placeholder="project-name" required /></Field><Field label="Category"><select name="category" defaultValue={project?.category ?? "Commercial"} className="h-11 w-full border border-black/15 bg-white px-3 text-sm"><option>Commercial</option><option>Event Activations</option><option>Heritage Furniture</option></select></Field><Field label="Tags"><Input name="tags" defaultValue={project?.tags?.join(", ")} placeholder="CNC, walnut, Arizona" /></Field><Field label="Blueprint image URL"><Input name="blueprintUrl" defaultValue={project?.blueprint_url ?? ""} placeholder="https://..." /></Field><Field label="Final image URL"><Input name="finalImgUrl" defaultValue={project?.final_img_url ?? ""} placeholder="https://..." /></Field><Field className="md:col-span-2" label="Challenge"><textarea name="challenge" defaultValue={project?.challenge ?? ""} className="min-h-24 w-full border border-black/15 bg-white px-4 py-3 text-sm" /></Field><Field className="md:col-span-2" label="Execution"><textarea name="execution" defaultValue={project?.execution ?? ""} className="min-h-24 w-full border border-black/15 bg-white px-4 py-3 text-sm" /></Field></div><div className="flex items-center gap-4"><Button disabled={pending} type="submit">{pending ? "Saving…" : "Save case study"}</Button>{status && <p className="text-sm text-black/60">{status}</p>}</div></form>;
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) { return <label className={`block space-y-2 ${className}`}><span className="text-[11px] font-bold uppercase tracking-widest text-black/60">{label}</span>{children}</label>; }
