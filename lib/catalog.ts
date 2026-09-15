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
  const overview = await getAdminDashboardOverview();
  return overview.stats;
}

export async function getAdminDashboardOverview() {
  const supabase = createSupabaseServerClient() as any;
  const [{ data: products }, { count: projects }, { count: intakes }, { data: variants }, { data: events }] = await Promise.all([
    supabase.from("products").select("id,name,sku,base_price,images,is_published,archived,updated_at").order("updated_at", { ascending: false }),
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("project_intakes").select("id", { count: "exact", head: true }).eq("status", "open"),
    supabase.from("product_variants").select("id,product_id,sku,stock,combination").order("stock", { ascending: true }).limit(12),
    supabase.from("events").select("id,title,event_date,location,is_published").gte("event_date", new Date().toISOString()).order("event_date", { ascending: true }).limit(3)
  ]);
  const productRows = (products ?? []) as Array<{ id: string; name: string; sku: string; base_price: number; images: string[]; is_published: boolean; archived: boolean; updated_at: string }>;
  const productNames = new Map(productRows.map((product) => [product.id, product.name]));
  const lowStock = ((variants ?? []) as Array<{ id: string; product_id: string; sku: string; stock: number; combination: Record<string, string> }>).filter((variant) => variant.stock <= 2).slice(0, 6).map((variant) => ({ ...variant, product_name: productNames.get(variant.product_id) ?? "Product" }));
  return {
    stats: { products: productRows.filter((product) => !product.archived).length, projects: projects ?? 0, intakes: intakes ?? 0, drafts: productRows.filter((product) => !product.archived && !product.is_published).length, archived: productRows.filter((product) => product.archived).length, lowStock: lowStock.length },
    recentProducts: productRows.slice(0, 6),
    lowStock,
    upcomingEvents: events ?? []
  };
}
