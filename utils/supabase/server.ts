import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import type { Database } from "@/lib/supabase/types";

/** Canonical server helper for App Router server components and actions. */
export function createSupabaseServerClient() {
  return createServerComponentClient<Database>({ cookies });
}
