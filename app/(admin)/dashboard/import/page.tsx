import Link from "next/link";

import { CatalogImport } from "@/components/admin/catalog-import";

export const dynamic = "force-dynamic";

export default function ImportPage() {
  return <section className="min-h-screen p-6 md:p-10"><div className="mx-auto max-w-5xl"><Link href="/dashboard/products" className="text-xs font-bold uppercase tracking-widest text-black/50 hover:text-ember">← Back to products</Link><div className="mt-8"><p className="eyebrow">Store manager</p><h1 className="mt-2 text-4xl font-black uppercase tracking-tight">Catalog import</h1><p className="mt-2 max-w-2xl text-sm text-black/60">Prepare your product catalog in a spreadsheet, then bring it into the Co-Op in one pass.</p></div><div className="mt-8"><CatalogImport /></div></div></section>;
}
