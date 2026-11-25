import type { Metadata } from "next";
import { Oswald, Plus_Jakarta_Sans } from "next/font/google";
import { Landing } from "@/components/landing/landing";
import "./landing.css";

const display = Oswald({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-vl-display",
  display: "swap",
});

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-vl-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Prompt experiment: one brief, two prompts",
  description:
    "The same portfolio built twice: Version A from one simple prompt, Version B through structured prompts, design direction and iteration.",
};

export default function ExperimentPage() {
  return (
    <div className={`vl ${display.variable} ${sans.variable}`}>
      <Landing />
    </div>
  );
}
