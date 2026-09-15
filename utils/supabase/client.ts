"use client";

import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";

import type { Database } from "@/lib/supabase/types";

/** Canonical browser helper for Auth and client-side reads. */
export function createSupabaseBrowserClient() {
  return createBrowserSupabaseClient<Database>();
}
