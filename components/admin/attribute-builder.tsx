"use client";

import { useState, useTransition } from "react";
import { createAttributeGroup, saveProductAttributes } from "@/actions/catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Attribute = { name: string; values: string[] };

export function AttributeBuilder({ productId, initialAttributes = [] }: { productId?: string; initialAttributes?: Attribute[] }) {
  const [attributes, setAttributes] = useState<Attribute[]>(initialAttributes);
  const [groupName, setGroupName] = useState("");
  const [groupValues, setGroupValues] = useState("");
  const [status, setStatus] = useState("");
  const [pending, startTransition] = useTransition();
  function addAttribute() { if (!groupName.trim() || !groupValues.trim()) return; setAttributes(current => [...current, { name: groupName.trim(), values: groupValues.split(",").map(value => value.trim()).filter(Boolean) }]); setGroupName(""); setGroupValues(""); }
  function save() { startTransition(async () => { if (productId) { const form = new FormData(); form.set("productId", productId); form.set("attributes", JSON.stringify(attributes)); setStatus((await saveProductAttributes(form)).ok ? "Product attributes saved." : "Unable to save product attributes."); } else { const results = await Promise.all(attributes.map(attribute => { const form = new FormData(); form.set("name", attribute.name); form.set("values", attribute.values.join(",")); return createAttributeGroup(form); })); setStatus(results.every(result => result.ok) ? "Global attribute groups saved." : "Unable to save one or more attribute groups."); } }); }
  return <div className="space-y-8"><div><p className="text-xs font-bold uppercase tracking-widest text-ember">{productId ? "Product configuration" : "Global controller"}</p><h2 className="mt-2 text-2xl font-black uppercase">{productId ? "Choose the product branches" : "Add an attribute group"}</h2><p className="mt-2 text-sm text-black/60">Use comma-separated values. Example: Walnut, Maple, Oak.</p></div><div className="grid gap-3 md:grid-cols-[1fr_1.5fr_auto]"><Input value={groupName} onChange={event => setGroupName(event.target.value)} placeholder="Attribute name" /><Input value={groupValues} onChange={event => setGroupValues(event.target.value)} placeholder="Values, separated, by commas" /><Button type="button" onClick={addAttribute}>Add group</Button></div>{attributes.length > 0 && <div className="space-y-3">{attributes.map((attribute, index) => <div className="flex items-start justify-between gap-4 border border-black/10 bg-white p-4" key={`${attribute.name}-${index}`}><div><p className="font-bold uppercase">{attribute.name}</p><div className="mt-2 flex flex-wrap gap-2">{attribute.values.map(value => <span className="rounded-full bg-sand px-3 py-1 text-xs" key={value}>{value}</span>)}</div></div><button className="text-xs font-bold uppercase text-black/45 hover:text-ember" onClick={() => setAttributes(current => current.filter((_, currentIndex) => currentIndex !== index))} type="button">Remove</button></div>)}</div>}<div className="flex items-center gap-4"><Button disabled={pending} type="button" onClick={save}>{pending ? "Saving…" : "Save configuration"}</Button>{status && <p className="text-sm text-black/60">{status}</p>}</div></div>;
}
