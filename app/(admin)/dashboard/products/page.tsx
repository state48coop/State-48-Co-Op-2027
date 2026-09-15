import Link from "next/link";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export default async function ProductsManagerPage() {
  const supabase = createSupabaseServerClient() as any;
  const { data: products } = await supabase.from("products").select("id,name,slug,category,base_price,is_published").order("created_at", { ascending: false });
  return <div className="mx-auto max-w-6xl px-5 py-12"><p className="eyebrow">Store Manager</p><h1 className="display mt-4">Products and<br /><span className="text-ember">inventory.</span></h1><div className="panel mt-10 overflow-hidden"><div className="flex items-center justify-between border-b border-black/10 p-5"><h2 className="font-black uppercase">Catalog records</h2><span className="text-xs uppercase tracking-widest text-black/50">{products?.length ?? 0} products</span></div>{products?.length ? <div className="divide-y divide-black/10">{products.map((product: { id: string; name: string; slug: string; category: string; base_price: number; is_published: boolean }) => <Link className="flex items-center justify-between gap-4 p-5 hover:bg-sand" href={`/dashboard/products/${product.id}`} key={product.id}><div><p className="font-bold uppercase">{product.name}</p><p className="mt-1 text-xs uppercase tracking-wider text-black/50">{product.category} · ${product.base_price}</p></div><span className="text-xs font-bold uppercase tracking-widest text-ember">{product.is_published ? "Published" : "Draft"}</span></Link>)}</div> : <p className="p-7 text-black/60">Create the first product in Supabase, then its attribute mappings and pricing branches can be managed here.</p>}</div></div>;
}
