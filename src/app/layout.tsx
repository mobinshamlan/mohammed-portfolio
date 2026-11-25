import type { Metadata } from "next";
import {
  Alexandria,
  Readex_Pro,
  Schibsted_Grotesk,
  Source_Serif_4,
} from "next/font/google";
import "./globals.css";

// Version A (the frozen baseline) keeps its own two faces.
const grotesk = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source",
  display: "swap",
});

// The portfolio: one display face and one text face, both Arabic and Latin.
const display = Alexandria({
  subsets: ["arabic", "latin"],
  weight: ["500", "700", "800"],
  variable: "--font-vb-display",
  display: "swap",
});

const text = Readex_Pro({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500"],
  variable: "--font-vb-text",
  display: "swap",
});

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
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${grotesk.variable} ${sourceSerif.variable} ${display.variable} ${text.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
