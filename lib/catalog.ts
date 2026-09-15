import { createSupabaseServerClient } from "@/utils/supabase/server";

export type ProductSummary = {
  id: string;
  name: string;
  slug: string;
  description: string;
  base_price: number;
  images: string[];
  category: string;
  allow_engrave: boolean;
  engrave_cost: number;
};

export type ProjectSummary = {
  id: string;
  title: string;
  slug: string;
  category: string;
  blueprint_url: string | null;
  final_img_url: string | null;
  tags: string[];
};

export async function getPublishedProducts() {
  const supabase = createSupabaseServerClient() as any;
  const { data, error } = await supabase.from("products").select("id,name,slug,description,base_price,images,category,allow_engrave,engrave_cost").eq("is_published", true).order("created_at", { ascending: false });
  if (error) { console.error("Unable to load published products", error); return [] as ProductSummary[]; }
  return (data ?? []) as ProductSummary[];
}

export async function getPublishedProjects() {
  const supabase = createSupabaseServerClient() as any;
  const { data, error } = await supabase.from("projects").select("id,title,slug,category,blueprint_url,final_img_url,tags").eq("is_published", true).order("created_at", { ascending: false });
  if (error) { console.error("Unable to load published projects", error); return [] as ProjectSummary[]; }
  return (data ?? []) as ProjectSummary[];
}

export async function getAdminProduct(id: string) {
  const supabase = createSupabaseServerClient() as any;
  const [{ data: product }, { data: attributes }, { data: variants }] = await Promise.all([
    supabase.from("products").select("id,name,slug,description,base_price,images,category,allow_engrave,engrave_cost").eq("id", id).maybeSingle(),
    supabase.from("product_attributes").select("id,product_id,name,values").eq("product_id", id).order("name"),
    supabase.from("product_variants").select("id,product_id,combination,price_modifier,stock,variant_image,sku").eq("product_id", id).order("sku")
  ]);
  return { product: product as ProductSummary | null, attributes: attributes ?? [], variants: variants ?? [] };
}
