import Link from "next/link";

const links = [
  ["Shop", "/store"],
  ["Build Gallery", "/gallery"],
  ["Community", "/events"],
  ["Start a Project", "/intake"]
];

export function SiteHeader() {
  return <header className="border-b border-black/10 bg-ink text-bone">
    <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-5">
      <Link href="/" className="text-lg font-black uppercase tracking-[0.16em]">State 48 <span className="text-ember">Co-Op</span></Link>
      <nav className="hidden items-center gap-6 text-xs font-bold uppercase tracking-[0.12em] md:flex">
        {links.map(([label, href]) => <Link className="transition-colors hover:text-ember" href={href} key={href}>{label}</Link>)}
        <Link className="rounded-full border border-bone/30 px-4 py-2 hover:bg-bone hover:text-ink" href="/login">Member / Admin</Link>
      </nav>
    </div>
  </header>;
}
