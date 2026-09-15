"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { attributeGroupSchema, variantsPayloadSchema } from "@/lib/validations/catalog";

type ActionResult = { ok: true } | { ok: false; error: string };

async function requireAdmin() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in.");
  const { data: admin } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!admin) throw new Error("Admin access is required.");
  return supabase;
}

export async function createAttributeGroup(formData: FormData): Promise<ActionResult> {
  try {
    const name = String(formData.get("name") ?? "");
    const values = String(formData.get("values") ?? "").split(",").map(value => value.trim()).filter(Boolean);
    const input = attributeGroupSchema.parse({ name, values });
    const supabase = await requireAdmin() as any;
    const { error } = await supabase.from("attribute_groups").insert({ name: input.name, values: input.values, sort_order: 0 });
    if (error) throw error;
    revalidatePath("/dashboard/attributes");
    return { ok: true };
  } catch (error) { return { ok: false, error: error instanceof Error ? error.message : "Unable to save attribute group." }; }
}

export async function saveProductAttributes(formData: FormData): Promise<ActionResult> {
  try {
    const productId = String(formData.get("productId") ?? "");
    const attributes = JSON.parse(String(formData.get("attributes") ?? "[]")) as Array<{ name: string; values: string[] }>;
    if (!productId || !Array.isArray(attributes)) throw new Error("Invalid attribute payload.");
    const supabase = await requireAdmin() as any;
    const { error: deleteError } = await supabase.from("product_attributes").delete().eq("product_id", productId);
    if (deleteError) throw deleteError;
    if (attributes.length) {
      const { error } = await supabase.from("product_attributes").insert(attributes.map(attribute => ({ product_id: productId, name: attribute.name, values: attribute.values })));
      if (error) throw error;
    }
    revalidatePath(`/dashboard/products/${productId}`);
    return { ok: true };
  } catch (error) { return { ok: false, error: error instanceof Error ? error.message : "Unable to save product attributes." }; }
}

export async function saveProductVariants(formData: FormData): Promise<ActionResult> {
  try {
    const payload = variantsPayloadSchema.parse(JSON.parse(String(formData.get("payload") ?? "{}")));
    const supabase = await requireAdmin() as any;
    const { error: deleteError } = await supabase.from("product_variants").delete().eq("product_id", payload.productId);
    if (deleteError) throw deleteError;
    if (payload.variants.length) {
      const { error } = await supabase.from("product_variants").insert(payload.variants.map(({ id: _id, ...variant }) => ({ ...variant, product_id: payload.productId, variant_image: variant.variant_image ?? null })));
      if (error) throw error;
    }
    revalidatePath(`/dashboard/products/${payload.productId}`);
    return { ok: true };
  } catch (error) { return { ok: false, error: error instanceof Error ? error.message : "Unable to save variants." }; }
}
