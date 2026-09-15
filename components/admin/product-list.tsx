"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { archiveProduct, duplicateProduct } from "@/actions/products";
import type { Product } from "@/lib/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ProductList({ products }: { products: Product[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [status, setStatus] = useState("");
  const [pending, startTransition] = useTransition();
  const filtered = useMemo(() => products.filter((product) => {
    const matchesQuery = [product.name, product.sku, product.category, product.collection].join(" ").toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === "all" || (filter === "published" && product.is_published && !product.archived) || (filter === "draft" && !product.is_published && !product.archived) || (filter === "archived" && product.archived);
    return matchesQuery && matchesFilter;
  }), [filter, products, query]);

  function runAction(action: (form: FormData) => Promise<{ ok: boolean; error?: string; id?: string }>, id: string, success: string) {
    const form = new FormData(); form.set("id", id);
    startTransition(async () => { const result = await action(form); setStatus(result.ok ? success : result.error ?? "Unable to complete action."); if (result.ok) router.refresh(); });
  }

  return <div className="panel mt-8 overflow-hidden"><div className="flex flex-col gap-3 border-b border-black/10 p-5 md:flex-row"><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products, SKUs, collections..." /><select value={filter} onChange={(event) => setFilter(event.target.value)} className="h-11 border border-black/15 bg-white px-3 text-sm md:w-48"><option value="all">All products</option><option value="published">Published</option><option value="draft">Drafts</option><option value="archived">Archived</option></select></div>{status && <p className="border-b border-black/10 bg-sand px-5 py-3 text-sm">{status}</p>}{filtered.length ? <div className="divide-y divide-black/10">{filtered.map((product) => <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between" key={product.id}><div className="flex min-w-0 items-center gap-4"><div className="h-16 w-16 shrink-0 overflow-hidden bg-sand">{product.images[0] && <img alt="" className="h-full w-full object-cover" src={product.images[0]} />}</div><div className="min-w-0"><p className="truncate font-bold uppercase">{product.name}</p><p className="mt-1 text-xs uppercase tracking-wider text-black/50">{product.category} · {product.collection} · {product.sku}</p><p className="mt-2 text-sm font-bold">${Number(product.base_price).toFixed(2)} <span className="ml-2 font-normal text-black/50">{product.archived ? "Archived" : product.is_published ? "Published" : "Draft"}</span></p></div></div><div className="flex flex-wrap items-center gap-2"><Link href={`/dashboard/products/${product.id}`} className="rounded-full border border-black/20 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:border-ember hover:text-ember">Edit</Link><Button disabled={pending} type="button" onClick={() => runAction(duplicateProduct, product.id, "Draft copy created.")}>Duplicate</Button>{!product.archived && <Button disabled={pending} type="button" onClick={() => runAction(archiveProduct, product.id, "Product archived.")}>Archive</Button>}</div></div>)}</div> : <div className="p-10 text-center text-sm text-black/60">No products match this view.</div>}</div>;
}
