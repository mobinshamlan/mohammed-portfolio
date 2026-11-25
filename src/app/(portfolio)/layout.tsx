import { IBM_Plex_Sans, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./styles/base.css";
import "./styles/home.css";
import "./styles/work.css";
import "./styles/case.css";
import "./styles/demos.css";
import "./styles/journey.css";
import "./styles/credentials.css";
import "./styles/worlds.css";

// The portfolio is set in one family across both scripts.
const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-plex",
  display: "swap",
});

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "600"],
  variable: "--font-plex-arabic",
  display: "swap",
});

export default function PortfolioLayout({ children }: LayoutProps<"/">) {
  return <div className={`vb ${plex.variable} ${plexArabic.variable}`}>{children}</div>;
}
