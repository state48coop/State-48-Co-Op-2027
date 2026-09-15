import Link from "next/link";
import { getPublishedProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

const categories = ["Laser Engraving", "CNC Woodshop", "Farm Tables", "Events", "Signs"];

export default async function StorePage() {
  const products = await getPublishedProducts();
  return <main className="mx-auto max-w-7xl px-5 py-16"><p className="eyebrow">The Store</p><h1 className="display mt-4">Ready-to-order<br /><span className="text-ember">workshop releases.</span></h1><div className="mt-8 flex flex-wrap gap-2">{categories.map(category => <span className="rounded-full border border-black/15 px-4 py-2 text-xs font-bold uppercase tracking-wider" key={category}>{category}</span>)}</div><div className="mt-10 grid gap-5 md:grid-cols-3">{products.length ? products.map(product => <Link href={`/store/${product.slug}`} className="panel group" key={product.id}><div className="aspect-[4/3] bg-gradient-to-br from-walnut to-ink" /><div className="p-5"><p className="text-xs font-bold uppercase tracking-wider text-ember">{product.category}</p><h2 className="mt-2 text-xl font-black uppercase group-hover:text-ember">{product.name}</h2><p className="mt-4 text-sm text-black/60">{product.description}</p></div></Link>) : <div className="panel col-span-full p-10"><p className="text-xs font-bold uppercase tracking-widest text-ember">Store opening soon</p><h2 className="mt-3 text-2xl font-black uppercase">The first workshop releases are being prepared.</h2><p className="mt-3 text-black/60">Published products added through the Admin Dashboard will appear here automatically.</p></div>}</div></main>;
}
