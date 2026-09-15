import Link from "next/link";

const navGroups = [
  { label: "Workspace", links: [["Overview", "/dashboard"], ["Products", "/dashboard/products"], ["Attributes", "/dashboard/attributes"]] }
];

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-screen bg-bone"><aside className="fixed inset-y-0 left-0 hidden w-64 bg-ink p-6 text-bone md:block"><Link href="/" className="text-sm font-black uppercase tracking-widest">State 48 <span className="text-ember">Admin</span></Link>{navGroups.map((group) => <div className="mt-10" key={group.label}><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-bone/40">{group.label}</p><nav className="mt-3 space-y-1 text-xs font-bold uppercase tracking-wider">{group.links.map(([label, href]) => <Link className="block py-2 hover:text-ember" href={href} key={href}>{label}</Link>)}</nav></div>)}<div className="mt-10 border-t border-bone/10 pt-6"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-bone/40">Next admin modules</p><p className="mt-3 text-xs leading-5 text-bone/55">Gallery projects<br />Project intakes<br />Events<br />Site content</p></div><Link className="mt-10 block text-xs font-bold uppercase tracking-wider text-bone/60 hover:text-ember" href="/">View public site →</Link></aside><main className="md:pl-64">{children}</main></div>;
}
