import Link from "next/link";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { ProductList } from "@/components/admin/product-list";
import type { Product } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function ProductsManagerPage() {
  const supabase = createSupabaseServerClient() as any;
  const { data: products } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  return <div className="mx-auto max-w-6xl px-5 py-10"><div className="flex flex-wrap items-end justify-between gap-5 border-b border-black/10 pb-7"><div><p className="eyebrow">Store Manager</p><h1 className="mt-3 text-4xl font-black uppercase tracking-tight">Products & inventory</h1><p className="mt-2 max-w-xl text-sm text-black/60">Create listings, upload media, manage variants, duplicate products, and control what is visible in the public store.</p></div><div className="flex flex-wrap gap-2"><Link href="/dashboard/import" className="button-secondary">Import catalog</Link><Link href="/dashboard/products/new" className="button-primary">Create product</Link></div></div><ProductList products={(products ?? []) as Product[]} /></div>;
}
