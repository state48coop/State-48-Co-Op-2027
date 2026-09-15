import { notFound } from "next/navigation";

import { AttributeBuilder } from "@/components/admin/attribute-builder";
import { PricingMatrix } from "@/components/admin/pricing-matrix";
import { getAdminProduct } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function ProductEditorPage({ params }: { params: { id: string } }) {
  const { product, attributes } = await getAdminProduct(params.id);
  if (!product) notFound();
  return <div className="mx-auto max-w-6xl px-5 py-12"><p className="eyebrow">Store Manager / Product Editor</p><h1 className="display mt-4">{product.name}</h1><p className="mt-3 max-w-2xl text-black/60">Configure the option branches, inventory, SKUs, and price modifiers for this ready-to-order product.</p><div className="panel mt-10 p-7"><AttributeBuilder productId={product.id} initialAttributes={attributes.map((attribute: { name: string; values: string[] }) => ({ name: attribute.name, values: attribute.values }))} /></div><div className="mt-10"><div className="mb-4"><p className="eyebrow">Variant inventory</p><h2 className="mt-2 text-2xl font-black uppercase">Pricing matrix</h2></div><PricingMatrix productId={product.id} basePrice={Number(product.base_price)} attributes={attributes.map((attribute: { name: string; values: string[] }) => ({ name: attribute.name, values: attribute.values }))} /></div></div>;
}
