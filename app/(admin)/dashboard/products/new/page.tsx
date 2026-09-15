import Link from "next/link";

import { ProductForm } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

export default function NewProductPage() {
  return <div className="mx-auto max-w-6xl px-5 py-12"><Link href="/dashboard/products" className="text-xs font-bold uppercase tracking-widest text-black/50 hover:text-ember">← Back to products</Link><h1 className="display mt-5">Add a<br /><span className="text-ember">new product.</span></h1><div className="panel mt-10 p-7"><ProductForm /></div></div>;
}
