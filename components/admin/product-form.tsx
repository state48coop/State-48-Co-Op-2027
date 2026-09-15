"use client";

import { FormEvent, useState, useTransition } from "react";

import { createProduct, updateProduct } from "@/actions/products";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Product } from "@/lib/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const categories = ["Workshop Releases", "Laser Editions", "Marketplace", "Custom Gifts"];
const productTypes = ["Ready-to-order", "Personalized", "Made-to-order", "Marketplace listing"];

type ProductFormProps = { product?: Product | null };

export function ProductForm({ product }: ProductFormProps) {
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [shortDescription, setShortDescription] = useState(product?.short_description ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [basePrice, setBasePrice] = useState(String(product?.base_price ?? "0"));
  const [sku, setSku] = useState(product?.sku ?? "");
  const [category, setCategory] = useState(product?.category ?? categories[0]);
  const [collection, setCollection] = useState(product?.collection ?? "Workshop Releases");
  const [productType, setProductType] = useState(product?.product_type ?? productTypes[0]);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [newImage, setNewImage] = useState("");
  const [allowEngrave, setAllowEngrave] = useState(product?.allow_engrave ?? false);
  const [engraveCost, setEngraveCost] = useState(String(product?.engrave_cost ?? "0"));
  const [isPublished, setIsPublished] = useState(product?.is_published ?? false);
  const [status, setStatus] = useState("");
  const [pending, startTransition] = useTransition();

  function addImage() {
    if (!newImage.trim() || images.includes(newImage.trim())) return;
    setImages((current) => [...current, newImage.trim()]);
    setNewImage("");
  }

  async function uploadImages(files: FileList | null, productId: string) {
    if (!files?.length) return [] as string[];
    const supabase = createSupabaseBrowserClient();
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
      const path = `${productId}/${crypto.randomUUID()}-${safeName}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: false });
      if (error) throw error;
      uploaded.push(supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl);
    }
    return uploaded;
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    form.set("images", JSON.stringify(images));
    form.set("allowEngrave", String(allowEngrave));
    form.set("isPublished", String(isPublished));
    startTransition(async () => {
      try {
        let result = product ? await updateProduct(form) : await createProduct(form);
        if (!result.ok || !result.id) {
          setStatus(result.ok ? "Saved." : result.error);
          return;
        }
        const fileInput = formElement.elements.namedItem("imageFiles") as HTMLInputElement | null;
        const uploaded = await uploadImages(fileInput?.files ?? null, result.id);
        if (uploaded.length) {
          const imageForm = new FormData();
          imageForm.set("id", result.id);
          imageForm.set("name", name);
          imageForm.set("slug", slug);
          imageForm.set("shortDescription", shortDescription);
          imageForm.set("description", description);
          imageForm.set("basePrice", basePrice);
          imageForm.set("sku", sku);
          imageForm.set("category", category);
          imageForm.set("collection", collection);
          imageForm.set("productType", productType);
          imageForm.set("images", JSON.stringify([...images, ...uploaded]));
          imageForm.set("allowEngrave", String(allowEngrave));
          imageForm.set("engraveCost", engraveCost);
          imageForm.set("isPublished", String(isPublished));
          result = await updateProduct(imageForm);
          setImages((current) => [...current, ...uploaded]);
        }
        setStatus(result.ok ? "Product saved." : result.error);
        if (!product && result.ok) window.location.assign(`/dashboard/products/${result.id}`);
      } catch (error) {
        setStatus(error instanceof Error ? error.message : "Unable to upload product images.");
      }
    });
  }

  return <form onSubmit={submit} className="space-y-8">
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-black/10 pb-6">
      <div><p className="eyebrow">{product ? "Product details" : "New catalog record"}</p><h2 className="mt-2 text-2xl font-black uppercase">{product ? "Edit product" : "Create product"}</h2><p className="mt-2 max-w-xl text-sm text-black/60">Build the base listing first. Add option branches and inventory below it after saving.</p></div>
      <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest"><input checked={isPublished} onChange={(event) => setIsPublished(event.target.checked)} type="checkbox" /> Published</label>
    </div>
    <div className="grid gap-5 md:grid-cols-2">
      <Field label="Product name"><Input name="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Engraved whiskey glasses" required /></Field>
      <Field label="URL slug"><Input name="slug" value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="engraved-whiskey-glasses" required /></Field>
      <Field label="Short description" className="md:col-span-2"><Input name="shortDescription" value={shortDescription} onChange={(event) => setShortDescription(event.target.value)} placeholder="A concise line for cards and search results" /></Field>
      <Field label="Full description" className="md:col-span-2"><textarea name="description" value={description} onChange={(event) => setDescription(event.target.value)} className="min-h-36 w-full border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-ember" placeholder="Describe the materials, process, what is included, and care details." required /></Field>
      <Field label="Base price"><Input name="basePrice" min="0" step="0.01" type="number" value={basePrice} onChange={(event) => setBasePrice(event.target.value)} required /></Field>
      <Field label="Base SKU"><Input name="sku" value={sku} onChange={(event) => setSku(event.target.value)} placeholder="S48-GLASS-001" required /></Field>
      <Field label="Category"><select name="category" value={category} onChange={(event) => setCategory(event.target.value)} className="h-11 w-full border border-black/15 bg-white px-3 text-sm">{categories.map((item) => <option key={item}>{item}</option>)}</select></Field>
      <Field label="Collection"><Input name="collection" value={collection} onChange={(event) => setCollection(event.target.value)} placeholder="Wedding Gifts" required /></Field>
      <Field label="Product type"><select name="productType" value={productType} onChange={(event) => setProductType(event.target.value)} className="h-11 w-full border border-black/15 bg-white px-3 text-sm">{productTypes.map((item) => <option key={item}>{item}</option>)}</select></Field>
      <div className="flex items-end gap-4"><label className="flex h-11 items-center gap-3 text-sm font-bold"><input checked={allowEngrave} onChange={(event) => setAllowEngrave(event.target.checked)} type="checkbox" /> Allow personalization</label><Input name="engraveCost" min="0" step="0.01" type="number" value={engraveCost} onChange={(event) => setEngraveCost(event.target.value)} aria-label="Engraving premium" /></div>
    </div>
    <div className="border-t border-black/10 pt-7">
      <p className="eyebrow">Product media</p><h3 className="mt-2 text-xl font-black uppercase">Images and gallery order</h3><p className="mt-2 text-sm text-black/60">Upload product photos to Supabase Storage or paste a hosted image URL.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto] md:items-end"><Field label="Add image URL"><Input value={newImage} onChange={(event) => setNewImage(event.target.value)} placeholder="https://..." /></Field><Button type="button" onClick={addImage}>Add URL</Button></div>
      <div className="mt-4 flex flex-wrap gap-3">{images.map((image, index) => <div className="group relative h-24 w-24 overflow-hidden border border-black/10 bg-sand" key={image}><img alt={`Product image ${index + 1}`} className="h-full w-full object-cover" src={image} /><button type="button" onClick={() => setImages((current) => current.filter((item) => item !== image))} className="absolute inset-x-1 bottom-1 bg-ink/80 py-1 text-[10px] font-bold uppercase text-bone opacity-0 transition group-hover:opacity-100">Remove</button></div>)}<label className="flex h-24 w-48 cursor-pointer flex-col items-center justify-center border border-dashed border-black/25 bg-white text-center text-xs font-bold uppercase tracking-wider hover:border-ember"><span>Upload photos</span><span className="mt-1 text-[10px] font-normal normal-case tracking-normal text-black/50">PNG, JPG, WEBP</span><input className="sr-only" name="imageFiles" type="file" accept="image/png,image/jpeg,image/webp" multiple /></label></div>
    </div>
    <div className="flex flex-wrap items-center gap-4 border-t border-black/10 pt-6"><Button disabled={pending} type="submit">{pending ? "Saving…" : product ? "Save product" : "Create product"}</Button>{status && <p className="text-sm text-black/60">{status}</p>}</div>
  </form>;
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) { return <label className={`block space-y-2 ${className}`}><span className="text-[11px] font-bold uppercase tracking-widest text-black/60">{label}</span>{children}</label>; }
