"use client";

import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent) { event.preventDefault(); const supabase = createSupabaseBrowserClient(); const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/auth/callback` } }); setMessage(error?.message ?? "Check your email for a secure sign-in link."); }
  return <main className="flex min-h-screen items-center justify-center bg-ink px-5 text-bone"><form onSubmit={submit} className="w-full max-w-md"><p className="eyebrow">State 48 Co-Op</p><h1 className="mt-4 text-4xl font-black uppercase">Member / Admin sign in</h1><input value={email} onChange={event => setEmail(event.target.value)} className="mt-8 w-full bg-white px-4 py-3 text-ink" type="email" placeholder="you@example.com" required /><button className="mt-4 w-full rounded-full bg-ember px-5 py-3 text-sm font-bold uppercase tracking-wider" type="submit">Send sign-in link</button>{message && <p className="mt-5 text-sm text-bone/70">{message}</p>}</form></main>;
}
