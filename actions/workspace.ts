"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = createSupabaseServerClient() as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in.");
  const { data: admin } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!admin) throw new Error("Admin access is required.");
  return supabase;
}

type Result = { ok: true; id?: string } | { ok: false; error: string };

const projectSchema = z.object({ title: z.string().trim().min(1).max(160), slug: z.string().trim().min(1).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), category: z.enum(["Commercial", "Event Activations", "Heritage Furniture"]), blueprintUrl: z.string().url().optional().or(z.literal("")), finalImgUrl: z.string().url().optional().or(z.literal("")), challenge: z.string().max(10000), execution: z.string().max(10000), tags: z.array(z.string().min(1).max(60)).max(30), isPublished: z.boolean() });
const eventSchema = z.object({ title: z.string().trim().min(1).max(160), eventDate: z.string().min(1), description: z.string().max(10000), location: z.string().trim().min(1).max(240), isPublished: z.boolean() });

function bool(value: FormDataEntryValue | null) { return value === "true" || value === "on" || value === "1"; }
function list(value: FormDataEntryValue | null) { return String(value ?? "").split(",").map((item) => item.trim()).filter(Boolean); }

export async function createProject(formData: FormData): Promise<Result> {
  try {
    const input = projectSchema.parse({ title: String(formData.get("title") ?? ""), slug: String(formData.get("slug") ?? ""), category: String(formData.get("category") ?? ""), blueprintUrl: String(formData.get("blueprintUrl") ?? ""), finalImgUrl: String(formData.get("finalImgUrl") ?? ""), challenge: String(formData.get("challenge") ?? ""), execution: String(formData.get("execution") ?? ""), tags: list(formData.get("tags")), isPublished: bool(formData.get("isPublished")) });
    const supabase = await requireAdmin();
    const { data, error } = await supabase.from("projects").insert({ title: input.title, slug: input.slug, category: input.category, blueprint_url: input.blueprintUrl || null, final_img_url: input.finalImgUrl || null, challenge: input.challenge, execution: input.execution, tags: input.tags, is_published: input.isPublished }).select("id").single();
    if (error) throw error;
    revalidatePath("/gallery"); revalidatePath("/dashboard"); revalidatePath("/dashboard/projects");
    return { ok: true, id: data.id };
  } catch (error) { return { ok: false, error: error instanceof Error ? error.message : "Unable to create project." }; }
}

export async function updateProject(formData: FormData): Promise<Result> {
  try {
    const id = z.string().uuid().parse(String(formData.get("id") ?? ""));
    const input = projectSchema.parse({ title: String(formData.get("title") ?? ""), slug: String(formData.get("slug") ?? ""), category: String(formData.get("category") ?? ""), blueprintUrl: String(formData.get("blueprintUrl") ?? ""), finalImgUrl: String(formData.get("finalImgUrl") ?? ""), challenge: String(formData.get("challenge") ?? ""), execution: String(formData.get("execution") ?? ""), tags: list(formData.get("tags")), isPublished: bool(formData.get("isPublished")) });
    const supabase = await requireAdmin();
    const { error } = await supabase.from("projects").update({ title: input.title, slug: input.slug, category: input.category, blueprint_url: input.blueprintUrl || null, final_img_url: input.finalImgUrl || null, challenge: input.challenge, execution: input.execution, tags: input.tags, is_published: input.isPublished }).eq("id", id);
    if (error) throw error;
    revalidatePath("/gallery"); revalidatePath(`/gallery/${id}`); revalidatePath("/dashboard/projects");
    return { ok: true, id };
  } catch (error) { return { ok: false, error: error instanceof Error ? error.message : "Unable to update project." }; }
}

export async function createEvent(formData: FormData): Promise<Result> {
  try {
    const input = eventSchema.parse({ title: String(formData.get("title") ?? ""), eventDate: String(formData.get("eventDate") ?? ""), description: String(formData.get("description") ?? ""), location: String(formData.get("location") ?? ""), isPublished: bool(formData.get("isPublished")) });
    const supabase = await requireAdmin();
    const { data, error } = await supabase.from("events").insert({ title: input.title, event_date: new Date(input.eventDate).toISOString(), description: input.description, location: input.location, is_published: input.isPublished }).select("id").single();
    if (error) throw error;
    revalidatePath("/events"); revalidatePath("/dashboard/events");
    return { ok: true, id: data.id };
  } catch (error) { return { ok: false, error: error instanceof Error ? error.message : "Unable to create event." }; }
}

export async function updateIntakeStatus(formData: FormData): Promise<Result> {
  try {
    const id = z.string().uuid().parse(String(formData.get("id") ?? ""));
    const status = z.enum(["open", "reviewing", "quoted", "closed"]).parse(String(formData.get("status") ?? "open"));
    const supabase = await requireAdmin();
    const { error } = await supabase.from("project_intakes").update({ status }).eq("id", id);
    if (error) throw error;
    revalidatePath("/dashboard"); revalidatePath("/dashboard/intakes");
    return { ok: true, id };
  } catch (error) { return { ok: false, error: error instanceof Error ? error.message : "Unable to update intake." }; }
}

export async function saveUiConfig(formData: FormData): Promise<Result> {
  try {
    const key = z.string().trim().min(1).max(120).parse(String(formData.get("key") ?? ""));
    const rawValue = String(formData.get("value") ?? "");
    let value: unknown = rawValue;
    try { value = JSON.parse(rawValue); } catch { /* Plain text is valid UI content. */ }
    const supabase = await requireAdmin();
    const { error } = await supabase.from("ui_config").upsert({ key, value }, { onConflict: "key" });
    if (error) throw error;
    revalidatePath("/"); revalidatePath("/dashboard/content");
    return { ok: true };
  } catch (error) { return { ok: false, error: error instanceof Error ? error.message : "Unable to save site content." }; }
}
