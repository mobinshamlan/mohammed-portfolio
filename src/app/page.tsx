import type { Metadata } from "next";
import { Oswald, Plus_Jakarta_Sans } from "next/font/google";
import { Landing } from "@/components/landing/landing";
import "./landing.css";

const display = Oswald({
  subsets: ["latin"],
  variable: "--font-vl-display",
  display: "swap",
});

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-vl-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Two versions. One evolution.",
  description:
    "One portfolio, built twice: Version A from a single simple prompt, Version B through structured prompts, intentional design and iteration.",
};

export default function HomePage() {
  return (
    <div className={`vl ${display.variable} ${sans.variable}`}>
      <Landing />
    </div>
  );
}
