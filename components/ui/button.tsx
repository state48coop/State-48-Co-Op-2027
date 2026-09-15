import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn("inline-flex h-11 items-center justify-center rounded-full bg-ember px-5 text-xs font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40", className)} {...props} />;
}
