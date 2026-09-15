"use client";

import { useMemo, useState, useTransition } from "react";
import { saveProductVariants } from "@/actions/catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

type Branch = { combination: Record<string, string>; price_modifier: number; stock: number; sku: string };

export function PricingMatrix({ productId, basePrice, attributes }: { productId: string; basePrice: number; attributes: Array<{ name: string; values: string[] }> }) {
  const combinations = useMemo(() => attributes.reduce<Record<string, string>[]>((result, attribute) => result.flatMap(current => attribute.values.map(value => ({ ...current, [attribute.name]: value }))), [{}]), [attributes]);
  const [branches, setBranches] = useState<Branch[]>(combinations.map(combination => ({ combination, price_modifier: 0, stock: 0, sku: "" })));
  const [pending, startTransition] = useTransition();
  function update(index: number, field: "price_modifier" | "stock" | "sku", value: string) { setBranches(current => current.map((branch, branchIndex) => branchIndex === index ? { ...branch, [field]: field === "sku" ? value : Number(value) } : branch)); }
  function save() { const form = new FormData(); form.set("payload", JSON.stringify({ productId, variants: branches })); startTransition(async () => { await saveProductVariants(form); }); }
  return <div className="panel overflow-hidden"><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-ink text-[11px] uppercase tracking-widest text-bone"><tr><th className="p-4">Combination</th><th className="p-4">Price modifier</th><th className="p-4">Final price</th><th className="p-4">Stock</th><th className="p-4">SKU</th></tr></thead><tbody>{branches.map((branch, index) => <tr className="border-t border-black/10" key={JSON.stringify(branch.combination)}><td className="p-4 font-bold">{Object.entries(branch.combination).map(([name, value]) => <span className="mr-2 inline-block rounded-full bg-sand px-2 py-1 text-xs" key={name}>{name}: {value}</span>)}</td><td className="w-32 p-4"><Input type="number" value={branch.price_modifier} onChange={event => update(index, "price_modifier", event.target.value)} /></td><td className="p-4 font-bold">{formatCurrency(basePrice + branch.price_modifier)}</td><td className="w-28 p-4"><Input min="0" type="number" value={branch.stock} onChange={event => update(index, "stock", event.target.value)} /></td><td className="w-44 p-4"><Input value={branch.sku} onChange={event => update(index, "sku", event.target.value)} placeholder="S48-..." /></td></tr>)}</tbody></table></div><div className="flex justify-end border-t border-black/10 p-4"><Button disabled={pending} onClick={save}>{pending ? "Saving…" : "Save pricing matrix"}</Button></div></div>;
}
