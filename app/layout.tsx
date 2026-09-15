import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "State 48 Co-Op | Make. Build. Collaborate.",
  description: "Arizona fabrication, maker work, products, events, and creative collaboration."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
