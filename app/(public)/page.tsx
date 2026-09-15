import Link from "next/link";

const entries = [
  { title: "Shop Products", text: "Ready-to-order pieces, personalized goods, and workshop releases.", href: "/store" },
  { title: "Start a Custom Project", text: "Bring a concept, a need, or a rough sketch. We’ll help shape the build.", href: "/intake" },
  { title: "Join the Community", text: "Food truck nights, creative events, makers, and Arizona collaboration.", href: "/events" }
];

export default function HomePage() {
  return <main>
    <section className="bg-ink px-5 py-20 text-bone md:py-32">
      <div className="mx-auto max-w-7xl">
        <p className="eyebrow">Arizona design + fabrication studio</p>
        <h1 className="display mt-5 max-w-4xl">Built by hand.<br /><span className="text-ember">Made to matter.</span></h1>
        <p className="mt-7 max-w-xl text-lg leading-8 text-bone/70">State 48 Co-Op brings together woodworking, CNC, laser engraving, signage, custom products, event pieces, and creative collaboration under one roof.</p>
        <div className="mt-9 flex flex-wrap gap-3"><Link className="rounded-full bg-ember px-6 py-3 text-sm font-bold uppercase tracking-wider" href="/store">Explore the Store</Link><Link className="rounded-full border border-bone/30 px-6 py-3 text-sm font-bold uppercase tracking-wider" href="/gallery">View the Gallery</Link></div>
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-5 py-16"><p className="eyebrow">Choose your way in</p><div className="mt-6 grid gap-4 md:grid-cols-3">{entries.map((entry, index) => <Link href={entry.href} key={entry.href} className="panel group p-7 transition-transform hover:-translate-y-1"><span className="text-sm font-bold text-ember">0{index + 1}</span><h2 className="mt-14 text-2xl font-black uppercase tracking-tight group-hover:text-ember">{entry.title}</h2><p className="mt-3 leading-7 text-black/60">{entry.text}</p></Link>)}</div></section>
    <section className="bg-sand px-5 py-16"><div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1fr_1.2fr] md:items-end"><div><p className="eyebrow">Two distinct experiences</p><h2 className="mt-4 text-4xl font-black uppercase tracking-tight">The Gallery is what we can build.<br />The Store is what you can order.</h2></div><p className="max-w-xl leading-8 text-black/65">Custom fabrication gets the full project treatment—concept, materials, drawings, and build story. Store products are configured, priced, and ready for checkout.</p></div></section>
  </main>;
}
