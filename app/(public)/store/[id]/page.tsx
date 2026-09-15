"use client";

import { useState } from "react";

export default function StoreProductPage({ params }: { params: { id: string } }) {
  const [personalized, setPersonalized] = useState(false);
  return <main className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-2"><div className="aspect-square bg-gradient-to-br from-walnut to-ink" /><div><p className="eyebrow">The Store / Product</p><h1 className="display mt-4">{params.id.replaceAll("-", " ")}</h1><p className="mt-5 leading-8 text-black/65">A ready-to-order State 48 piece, configured for your material, finish, size, and personalization preferences.</p><div className="mt-8 space-y-5">{["Material", "Finish", "Size"].map(label => <label className="block" key={label}><span className="mb-2 block text-xs font-bold uppercase tracking-widest">{label}</span><select className="w-full rounded-none border border-black/15 bg-white px-4 py-3"><option>Choose {label}</option><option>Walnut</option><option>Maple</option></select></label>)}<label className="flex items-center gap-3 text-sm font-bold"><input checked={personalized} onChange={event => setPersonalized(event.target.checked)} type="checkbox" /> Add personalization (+$15)</label>{personalized && <input className="w-full border border-black/15 bg-white px-4 py-3" placeholder="Enter engraving text" />}</div><button className="mt-8 rounded-full bg-ember px-6 py-3 text-sm font-bold uppercase tracking-wider text-white">Add to cart</button></div></main>;
}
