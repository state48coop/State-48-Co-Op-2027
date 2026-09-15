import Link from "next/link";

import { ProjectForm } from "@/components/admin/project-form";

export default function NewProjectPage() {
  return <section className="min-h-screen p-6 md:p-10"><div className="mx-auto max-w-4xl"><Link href="/dashboard/projects" className="text-xs font-bold uppercase tracking-widest text-black/50 hover:text-ember">← Back to Gallery</Link><div className="mt-8 border border-black/10 bg-white p-6 md:p-10"><ProjectForm /></div></div></section>;
}
