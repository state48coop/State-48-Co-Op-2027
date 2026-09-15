import { createSupabaseServerClient } from "@/utils/supabase/server";
import type { Product } from "@/lib/supabase/types";

export type ProductSummary = Product;

export type ProjectSummary = {
  id: string;
  title: string;
  slug: string;
  category: string;
  blueprint_url: string | null;
  final_img_url: string | null;
  tags: string[];
  challenge: string | null;
  execution: string | null;
  is_published: boolean;
  created_at: string;
};

export async function getPublishedProducts() {
  const supabase = createSupabaseServerClient() as any;
  const { data, error } = await supabase.from("products").select("*").eq("is_published", true).eq("archived", false).order("created_at", { ascending: false });
  if (error) { console.error("Unable to load published products", error); return [] as ProductSummary[]; }
  return (data ?? []) as ProductSummary[];
}

export async function getPublishedProjects() {
  const supabase = createSupabaseServerClient() as any;
  const { data, error } = await supabase.from("projects").select("*").eq("is_published", true).order("created_at", { ascending: false });
  if (error) { console.error("Unable to load published projects", error); return [] as ProjectSummary[]; }
  return (data ?? []) as ProjectSummary[];
}

export async function getAdminProject(id: string) {
  const supabase = createSupabaseServerClient() as any;
  const { data, error } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  if (error) { console.error("Unable to load admin project", error); return null; }
  return data as ProjectSummary | null;
}

export async function getAdminProduct(id: string) {
  const supabase = createSupabaseServerClient() as any;
  const [{ data: product }, { data: attributes }, { data: variants }] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).maybeSingle(),
    supabase.from("product_attributes").select("id,product_id,name,values").eq("product_id", id).order("name"),
    supabase.from("product_variants").select("id,product_id,combination,price_modifier,stock,variant_image,sku").eq("product_id", id).order("sku")
  ]);
  return { product: product as ProductSummary | null, attributes: attributes ?? [], variants: variants ?? [] };
}

export async function getAdminDashboardStats() {
  const supabase = createSupabaseServerClient() as any;
  const [{ count: products }, { count: projects }, { count: intakes }] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }).eq("archived", false),
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("project_intakes").select("id", { count: "exact", head: true }).eq("status", "open")
  ]);
  return { products: products ?? 0, projects: projects ?? 0, intakes: intakes ?? 0 };
}
