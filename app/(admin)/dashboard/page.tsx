import Link from "next/link";
import { getAdminDashboardStats } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const stats = await getAdminDashboardStats();
  return <div className="mx-auto max-w-6xl px-5 py-12"><p className="eyebrow">Admin Dashboard</p><h1 className="display mt-4">Control the<br /><span className="text-ember">whole shop.</span></h1><p className="mt-4 max-w-xl text-sm text-black/60">One workspace for products, custom work, community activity, and the content customers see.</p><div className="mt-10 grid gap-4 md:grid-cols-3">{[[String(stats.products), "Active products", "/dashboard/products"], [String(stats.projects), "Gallery projects", "/dashboard/projects"], [String(stats.intakes), "Open project intakes", "/dashboard/intakes"]].map(([value, label, href]) => <Link className="panel p-6 transition hover:-translate-y-1 hover:border-ember" href={href} key={label}><p className="text-4xl font-black">{value}</p><p className="mt-5 text-xs font-bold uppercase tracking-widest text-black/60">{label}</p><p className="mt-5 text-xs font-bold uppercase tracking-widest text-ember">Open manager →</p></Link>)}</div><div className="panel mt-8 p-6"><p className="eyebrow">Build status</p><h2 className="mt-2 text-xl font-black uppercase">Product operations are the first priority</h2><p className="mt-2 max-w-2xl text-sm text-black/60">Create the product, add photos, define options, generate the pricing matrix, and publish only when the listing is ready.</p><Link href="/dashboard/products/new" className="mt-5 inline-flex rounded-full bg-ember px-5 py-3 text-xs font-bold uppercase tracking-wider text-white">Create first product</Link></div></div>;
}
