import { Alexandria, Readex_Pro } from "next/font/google";
import "./styles/base.css";
import "./styles/home.css";
import "./styles/case.css";
import "./styles/demos.css";
import "./styles/journey.css";

// The portfolio: one display face and one text face, both Arabic and Latin.
const display = Alexandria({
  subsets: ["arabic", "latin"],
  weight: ["700", "800"],
  variable: "--font-vb-display",
  display: "swap",
});

const text = Readex_Pro({
  subsets: ["arabic", "latin"],
  weight: ["400"],
  variable: "--font-vb-text",
  display: "swap",
});

export default function PortfolioLayout({ children }: LayoutProps<"/">) {
  return <div className={`vb ${display.variable} ${text.variable}`}>{children}</div>;
}
