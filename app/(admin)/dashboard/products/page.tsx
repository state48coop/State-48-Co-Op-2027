import Link from "next/link";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { ProductList } from "@/components/admin/product-list";
import type { Product } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function ProductsManagerPage() {
  const supabase = createSupabaseServerClient() as any;
  const { data: products } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  return <div className="mx-auto max-w-6xl px-5 py-12"><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="eyebrow">Store Manager</p><h1 className="display mt-4">Products and<br /><span className="text-ember">inventory.</span></h1><p className="mt-4 max-w-xl text-sm text-black/60">Create listings, upload media, manage variants, duplicate winning products, and control what is visible in the public store.</p></div><Link href="/dashboard/products/new" className="rounded-full bg-ember px-5 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-walnut">Create product</Link></div><ProductList products={(products ?? []) as Product[]} /></div>;
}
