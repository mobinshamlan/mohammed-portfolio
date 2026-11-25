import type { Metadata } from "next";
import "./globals.css";

// Each area loads only its own faces: the portfolio in src/app/(portfolio)/layout.tsx,
// the experiment in src/app/experiment/page.tsx, Version A in src/app/version-a/layout.tsx.

export const metadata: Metadata = {
  title: {
    default: "Mohammed Bin Shamlan",
    template: "%s — Mohammed Bin Shamlan",
  },
  description:
    "Software developer in Saudi Arabia building Arabic-first AI products for real Saudi life: Naqah, Tammeni, Seet, Kashta, Amanah and Gthrz.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
