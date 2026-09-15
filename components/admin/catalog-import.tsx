"use client";

import { FormEvent, useState, useTransition } from "react";

import { importProductsCsv } from "@/actions/import-products";
import { Button } from "@/components/ui/button";

export function CatalogImport() {
  const [status, setStatus] = useState("");
  const [pending, startTransition] = useTransition();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await importProductsCsv(form);
      if (!result.ok) { setStatus(result.error); return; }
      setStatus(`Imported ${result.created} product${result.created === 1 ? "" : "s"}${result.failed.length ? `; ${result.failed.length} row${result.failed.length === 1 ? "" : "s"} need attention.` : "."}`);
    });
  }
  return <div className="border border-black/10 bg-white p-6"><p className="eyebrow">Catalog tools</p><h2 className="mt-2 text-2xl font-black uppercase">Load products by CSV</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">Use this for your initial catalog or marketplace uploads. One row creates one product, and duplicate SKUs are reported without stopping the rest of the import.</p><div className="mt-4 text-xs leading-5 text-black/55"><strong>Accepted columns:</strong> name, sku, base_price, description, short_description, category, collection, product_type, images, allow_engrave, engrave_cost, is_published. Separate multiple image URLs with a pipe.</div><a href="/product-import-template.csv" download className="mt-4 inline-block text-xs font-bold uppercase tracking-widest text-ember hover:underline">Download CSV template →</a><form onSubmit={submit} className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center"><input className="block w-full border border-black/15 bg-white px-3 py-2 text-sm" name="file" type="file" accept=".csv,text/csv" required /><Button disabled={pending} type="submit">{pending ? "Importing…" : "Import products"}</Button></form>{status && <p className="mt-4 text-sm text-black/65">{status}</p>}</div>;
}
