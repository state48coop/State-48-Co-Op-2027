import Link from "next/link";
import { getPublishedProjects } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const projects = await getPublishedProjects();
  return <main className="mx-auto max-w-7xl px-5 py-16"><p className="eyebrow">The Build Gallery</p><h1 className="display mt-4">Custom work,<br /><span className="text-ember">fully documented.</span></h1><div className="mt-10 grid gap-5 md:grid-cols-3">{projects.length ? projects.map((project, index) => <Link href={`/gallery/${project.slug}`} key={project.id} className="panel min-h-72 p-6"><span className="text-xs font-bold uppercase tracking-widest text-ember">{String(index + 1).padStart(2, "0")}</span><h2 className="mt-40 text-2xl font-black uppercase">{project.title}</h2><p className="mt-2 text-xs uppercase tracking-wider text-black/50">{project.category}</p></Link>) : <div className="panel col-span-full p-10"><p className="text-xs font-bold uppercase tracking-widest text-ember">Gallery opening soon</p><h2 className="mt-3 text-2xl font-black uppercase">The build stories are being documented.</h2><p className="mt-3 text-black/60">Published case studies added through the Admin Dashboard will appear here automatically.</p></div>}</div></main>;
}
