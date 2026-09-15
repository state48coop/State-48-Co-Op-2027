"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { productSchema } from "@/lib/validations/catalog";

type ProductActionResult = { ok: true; id?: string } | { ok: false; error: string };

async function requireAdmin() {
  const supabase = createSupabaseServerClient() as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in.");
  const { data: admin } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!admin) throw new Error("Admin access is required.");
  return supabase;
}

function parseBoolean(value: FormDataEntryValue | null) {
  return value === "true" || value === "on" || value === "1";
}

function parseImages(value: FormDataEntryValue | null) {
  try {
    const parsed = JSON.parse(String(value ?? "[]"));
    return Array.isArray(parsed) ? parsed.filter((image): image is string => typeof image === "string") : [];
  } catch {
    return [];
  }
}

function parseProduct(formData: FormData) {
  return productSchema.parse({
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    description: String(formData.get("description") ?? ""),
    shortDescription: String(formData.get("shortDescription") ?? ""),
    basePrice: String(formData.get("basePrice") ?? "0"),
    sku: String(formData.get("sku") ?? ""),
    category: String(formData.get("category") ?? ""),
    collection: String(formData.get("collection") ?? ""),
    productType: String(formData.get("productType") ?? ""),
    images: parseImages(formData.get("images")),
    allowEngrave: parseBoolean(formData.get("allowEngrave")),
    engraveCost: String(formData.get("engraveCost") ?? "0"),
    isPublished: parseBoolean(formData.get("isPublished"))
  });
}

function toRow(input: z.infer<typeof productSchema>) {
  return {
    name: input.name,
    slug: input.slug,
    description: input.description,
    short_description: input.shortDescription,
    base_price: input.basePrice,
    sku: input.sku,
    images: input.images,
    category: input.category,
    collection: input.collection,
    product_type: input.productType,
    allow_engrave: input.allowEngrave,
    engrave_cost: input.engraveCost,
    is_published: input.isPublished
  };
}

export async function createProduct(formData: FormData): Promise<ProductActionResult> {
  try {
    const input = parseProduct(formData);
    const supabase = await requireAdmin();
    const { data, error } = await supabase.from("products").insert({ ...toRow(input), archived: false }).select("id").single();
    if (error) throw error;
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/products");
    return { ok: true, id: data.id };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Unable to create product." };
  }
}

export async function updateProduct(formData: FormData): Promise<ProductActionResult> {
  try {
    const id = z.string().uuid().parse(String(formData.get("id") ?? ""));
    const input = parseProduct(formData);
    const supabase = await requireAdmin();
    const { error } = await supabase.from("products").update(toRow(input)).eq("id", id);
    if (error) throw error;
    revalidatePath("/");
    revalidatePath("/store");
    revalidatePath(`/store/${id}`);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/products");
    revalidatePath(`/dashboard/products/${id}`);
    return { ok: true, id };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Unable to update product." };
  }
}

export async function duplicateProduct(formData: FormData): Promise<ProductActionResult> {
  try {
    const id = z.string().uuid().parse(String(formData.get("id") ?? ""));
    const supabase = await requireAdmin();
    const { data: source, error: sourceError } = await supabase.from("products").select("*").eq("id", id).single();
    if (sourceError || !source) throw sourceError ?? new Error("Product not found.");
    const suffix = Math.random().toString(36).slice(2, 8);
    const { id: _sourceId, created_at: _createdAt, updated_at: _updatedAt, ...sourceFields } = source;
    const { data: copy, error: copyError } = await supabase.from("products").insert({
      ...sourceFields,
      name: `${source.name} Copy`,
      slug: `${source.slug}-copy-${suffix}`,
      sku: `${source.sku}-COPY-${suffix.toUpperCase()}`,
      is_published: false,
      archived: false
    }).select("id").single();
    if (copyError || !copy) throw copyError ?? new Error("Unable to duplicate product.");

    const [{ data: attributes }, { data: variants }] = await Promise.all([
      supabase.from("product_attributes").select("name,values").eq("product_id", id),
      supabase.from("product_variants").select("combination,price_modifier,stock,variant_image,sku").eq("product_id", id)
    ]);
    if (attributes?.length) await supabase.from("product_attributes").insert(attributes.map((attribute: { name: string; values: string[] }) => ({ ...attribute, product_id: copy.id })));
    if (variants?.length) await supabase.from("product_variants").insert(variants.map((variant: { combination: unknown; price_modifier: number; stock: number; variant_image: string | null; sku: string }) => ({ ...variant, product_id: copy.id, sku: `${variant.sku}-COPY-${suffix.toUpperCase()}` })));
    revalidatePath("/dashboard/products");
    return { ok: true, id: copy.id };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Unable to duplicate product." };
  }
}

export async function archiveProduct(formData: FormData): Promise<ProductActionResult> {
  try {
    const id = z.string().uuid().parse(String(formData.get("id") ?? ""));
    const supabase = await requireAdmin();
    const { error } = await supabase.from("products").update({ archived: true, is_published: false }).eq("id", id);
    if (error) throw error;
    revalidatePath("/");
    revalidatePath("/store");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/products");
    return { ok: true, id };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Unable to archive product." };
  }
}
