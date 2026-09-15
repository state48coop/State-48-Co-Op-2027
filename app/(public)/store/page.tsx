import Link from "next/link";

const categories = ["Laser Engraving", "CNC Woodshop", "Farm Tables", "Events", "Signs"];

export default function StorePage() {
  return <main className="mx-auto max-w-7xl px-5 py-16"><p className="eyebrow">The Store</p><h1 className="display mt-4">Ready-to-order<br /><span className="text-ember">workshop releases.</span></h1><div className="mt-8 flex flex-wrap gap-2">{categories.map(category => <span className="rounded-full border border-black/15 px-4 py-2 text-xs font-bold uppercase tracking-wider" key={category}>{category}</span>)}</div><div className="mt-10 grid gap-5 md:grid-cols-3">{["Engraved Whiskey Glasses", "Arizona Flight Tray", "Custom Business Sign"].map((name, index) => <Link href={`/store/product-${index + 1}`} className="panel group" key={name}><div className="aspect-[4/3] bg-gradient-to-br from-walnut to-ink" /><div className="p-5"><p className="text-xs font-bold uppercase tracking-wider text-ember">Workshop Release</p><h2 className="mt-2 text-xl font-black uppercase group-hover:text-ember">{name}</h2><p className="mt-4 text-sm text-black/60">Configurable materials, finishes, personalization, and quantity options.</p></div></Link>)}</div></main>;
}
