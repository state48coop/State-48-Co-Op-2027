"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { productSchema } from "@/lib/validations/catalog";

type ImportResult = { ok: true; created: number; failed: Array<{ row: number; message: string }> } | { ok: false; error: string };

async function requireAdmin() {
  const supabase = createSupabaseServerClient() as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in.");
  const { data: admin } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!admin) throw new Error("Admin access is required.");
  return supabase;
}

function parseCsv(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const next = text[index + 1];
    if (character === '"' && quoted && next === '"') { cell += '"'; index += 1; continue; }
    if (character === '"') { quoted = !quoted; continue; }
    if (character === "," && !quoted) { row.push(cell.trim()); cell = ""; continue; }
    if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && next === "\n") index += 1;
      row.push(cell.trim()); cell = "";
      if (row.some(Boolean)) rows.push(row);
      row = [];
      continue;
    }
    cell += character;
  }
  if (cell || row.length) { row.push(cell.trim()); if (row.some(Boolean)) rows.push(row); }
  if (rows.length < 2) throw new Error("The CSV needs a header row and at least one product row.");
  const headers = rows[0].map((header) => header.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, ""));
  return rows.slice(1).map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])));
}

function slugify(value: string) { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 140); }
function truthy(value: string) { return ["true", "yes", "1", "published"].includes(value.toLowerCase().trim()); }

export async function importProductsCsv(formData: FormData): Promise<ImportResult> {
  try {
    const file = formData.get("file");
    if (!(file instanceof File)) return { ok: false, error: "Choose a CSV file first." };
    if (file.size > 2_000_000) return { ok: false, error: "CSV files must be smaller than 2 MB." };
    const rows = parseCsv(await file.text());
    if (rows.length > 250) return { ok: false, error: "Import up to 250 products at a time." };
    const supabase = await requireAdmin();
    let created = 0;
    const failed: Array<{ row: number; message: string }> = [];
    for (let index = 0; index < rows.length; index += 1) {
      const row = rows[index];
      const input = productSchema.safeParse({
        name: row.name,
        slug: slugify(row.slug || row.name),
        description: row.description || row.short_description || row.name,
        shortDescription: row.short_description || "",
        basePrice: row.base_price || row.price || "0",
        sku: row.sku,
        category: row.category || "Workshop Releases",
        collection: row.collection || "Workshop Releases",
        productType: row.product_type || "Ready-to-order",
        images: (row.images || "").split(/[|;]/).map((image: string) => image.trim()).filter(Boolean),
        allowEngrave: truthy(row.allow_engrave || row.allow_personalization || ""),
        engraveCost: row.engrave_cost || "0",
        isPublished: truthy(row.is_published || row.status || "")
      });
      if (!input.success) { failed.push({ row: index + 2, message: input.error.issues[0]?.message || "Invalid product data." }); continue; }
      const { error } = await supabase.from("products").insert({ name: input.data.name, slug: input.data.slug, description: input.data.description, short_description: input.data.shortDescription, base_price: input.data.basePrice, sku: input.data.sku, images: input.data.images, category: input.data.category, collection: input.data.collection, product_type: input.data.productType, allow_engrave: input.data.allowEngrave, engrave_cost: input.data.engraveCost, is_published: input.data.isPublished, archived: false }).select("id").single();
      if (error) failed.push({ row: index + 2, message: error.message });
      else created += 1;
    }
    revalidatePath("/"); revalidatePath("/store"); revalidatePath("/dashboard"); revalidatePath("/dashboard/products");
    return { ok: true, created, failed };
  } catch (error) { return { ok: false, error: error instanceof Error ? error.message : "Unable to import products." }; }
}
