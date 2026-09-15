import Link from "next/link";

import { ProjectForm } from "@/components/admin/project-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Project = {
  id: string;
  title: string;
  slug: string;
  category: string;
  is_published: boolean;
  created_at: string;
};

export default async function ProjectsPage() {
  const supabase = createSupabaseServerClient() as any;
  const { data } = await supabase.from("projects").select("id,title,slug,category,is_published,created_at").order("created_at", { ascending: false });
  const projects = (data ?? []) as Project[];

  return <section className="min-h-screen p-6 md:p-10"><div className="mx-auto max-w-6xl"><div className="flex flex-wrap items-end justify-between gap-4 border-b border-black/10 pb-6"><div><p className="eyebrow">Gallery manager</p><h1 className="mt-2 text-4xl font-black uppercase tracking-tight">Build gallery</h1><p className="mt-2 max-w-xl text-sm text-black/60">Create and maintain the case studies customers use to understand what the Co-Op can build.</p></div><Link href="/dashboard/projects/new" className="button-primary">New case study</Link></div><div className="mt-8 overflow-hidden border border-black/10 bg-white"><div className="grid grid-cols-[1fr_180px_120px] gap-4 border-b border-black/10 px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-black/45"><span>Project</span><span>Category</span><span>Status</span></div>{projects.length === 0 ? <p className="px-5 py-10 text-sm text-black/55">No case studies yet. Add the first project to bring the Gallery to life.</p> : projects.map((project) => <Link href={`/dashboard/projects/${project.id}`} key={project.id} className="grid grid-cols-[1fr_180px_120px] gap-4 border-b border-black/10 px-5 py-5 last:border-0 hover:bg-bone"><div><p className="font-bold uppercase">{project.title}</p><p className="mt-1 text-xs text-black/45">/{project.slug}</p></div><span className="text-sm text-black/65">{project.category}</span><span className={`text-xs font-bold uppercase tracking-widest ${project.is_published ? "text-emerald-700" : "text-black/45"}`}>{project.is_published ? "Published" : "Draft"}</span></Link>)}</div></div></section>;
}
