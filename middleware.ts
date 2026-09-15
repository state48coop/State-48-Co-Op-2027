import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse, type NextRequest } from "next/server";

import type { Database } from "@/lib/supabase/types";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req: request, res: response });
  const { data: { session } } = await supabase.auth.getSession();

  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");
  const isAdmin = session ? Boolean((await supabase.from("admin_users").select("user_id").eq("user_id", session.user.id).maybeSingle()).data) : false;

  if (isDashboard && !isAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = { matcher: ["/dashboard/:path*"] };
