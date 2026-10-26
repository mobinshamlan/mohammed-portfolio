import { Oswald, Plus_Jakarta_Sans } from "next/font/google";
import "./version-b.css";

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
