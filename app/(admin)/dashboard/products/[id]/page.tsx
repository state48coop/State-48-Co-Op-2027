import { notFound } from "next/navigation";
import Link from "next/link";

import { AttributeBuilder } from "@/components/admin/attribute-builder";
import { PricingMatrix } from "@/components/admin/pricing-matrix";
import { ProductForm } from "@/components/admin/product-form";
import { getAdminProduct } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function ProductEditorPage({ params }: { params: { id: string } }) {
  const { product, attributes } = await getAdminProduct(params.id);
  if (!product) notFound();
  return <div className="mx-auto max-w-6xl px-5 py-12"><Link href="/dashboard/products" className="text-xs font-bold uppercase tracking-widest text-black/50 hover:text-ember">← Back to products</Link><p className="eyebrow mt-5">Store Manager / Product Editor</p><h1 className="display mt-4">{product.name}</h1><div className="panel mt-10 p-7"><ProductForm product={product} /></div><div className="panel mt-10 p-7"><AttributeBuilder productId={product.id} initialAttributes={attributes.map((attribute: { name: string; values: string[] }) => ({ name: attribute.name, values: attribute.values }))} /></div><div className="mt-10"><div className="mb-4"><p className="eyebrow">Variant inventory</p><h2 className="mt-2 text-2xl font-black uppercase">Pricing matrix</h2></div><PricingMatrix productId={product.id} basePrice={Number(product.base_price)} attributes={attributes.map((attribute: { name: string; values: string[] }) => ({ name: attribute.name, values: attribute.values }))} /></div></div>;
}
