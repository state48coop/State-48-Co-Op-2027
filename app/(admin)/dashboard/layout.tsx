import Link from "next/link";

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-screen bg-bone"><aside className="fixed inset-y-0 left-0 hidden w-64 bg-ink p-6 text-bone md:block"><Link href="/" className="text-sm font-black uppercase tracking-widest">State 48 <span className="text-ember">Admin</span></Link><nav className="mt-12 space-y-3 text-xs font-bold uppercase tracking-wider"><Link className="block py-2 hover:text-ember" href="/dashboard">Overview</Link><Link className="block py-2 hover:text-ember" href="/dashboard/products">Store Manager</Link><Link className="block py-2 hover:text-ember" href="/dashboard/attributes">Attributes</Link><Link className="block py-2 hover:text-ember" href="/gallery">View public site</Link></nav></aside><main className="md:pl-64">{children}</main></div>;
}
