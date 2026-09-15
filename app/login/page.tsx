"use client";

import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"password" | "link">("password");
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    const supabase = createSupabaseBrowserClient();
    const result = mode === "password"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/auth/callback` } });
    if (result.error) { setMessage(result.error.message); return; }
    if (mode === "password") {
      const next = new URLSearchParams(window.location.search).get("next") || "/dashboard";
      window.location.assign(next);
    } else setMessage("Check your email for a secure sign-in link.");
  }
  return <main className="flex min-h-screen items-center justify-center bg-ink px-5 text-bone"><form onSubmit={submit} className="w-full max-w-md"><p className="eyebrow">State 48 Co-Op</p><h1 className="mt-4 text-4xl font-black uppercase">Member / Admin sign in</h1><div className="mt-8 grid grid-cols-2 border-b border-bone/20"><button type="button" onClick={() => { setMode("password"); setMessage(""); }} className={`pb-3 text-left text-xs font-bold uppercase tracking-widest ${mode === "password" ? "border-b-2 border-ember text-bone" : "text-bone/45"}`}>Password</button><button type="button" onClick={() => { setMode("link"); setMessage(""); }} className={`pb-3 text-left text-xs font-bold uppercase tracking-widest ${mode === "link" ? "border-b-2 border-ember text-bone" : "text-bone/45"}`}>Email link</button></div><input value={email} onChange={event => setEmail(event.target.value)} className="mt-6 w-full bg-white px-4 py-3 text-ink" type="email" placeholder="you@example.com" required />{mode === "password" && <input value={password} onChange={event => setPassword(event.target.value)} className="mt-3 w-full bg-white px-4 py-3 text-ink" type="password" placeholder="Password" required />}{mode === "password" && <p className="mt-3 text-xs leading-5 text-bone/55">Use the password assigned to your Supabase Auth user. This avoids the email rate limit.</p>}<button className="mt-4 w-full rounded-full bg-ember px-5 py-3 text-sm font-bold uppercase tracking-wider" type="submit">{mode === "password" ? "Sign in" : "Send sign-in link"}</button>{message && <p className="mt-5 text-sm text-bone/70">{message}</p>}</form></main>;
}
