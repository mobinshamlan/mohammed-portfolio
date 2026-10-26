import { Oswald, Plus_Jakarta_Sans } from "next/font/google";
import "./version-b.css";
import "./showcase.css";
import "./cover.css";
import "./journey.css";
import "./finale.css";
import "./skills.css";
import "./about.css";
import "./folio.css";

const display = Oswald({
  subsets: ["latin"],
  variable: "--font-vb-display",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-vb-sans",
  display: "swap",
});

export default function VersionBLayout({
  children,
}: LayoutProps<"/version-b">) {
  return (
    <div className={`vb ${display.variable} ${jakarta.variable}`}>{children}</div>
  );
}
