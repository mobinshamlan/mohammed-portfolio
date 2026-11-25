import { Schibsted_Grotesk, Source_Serif_4 } from "next/font/google";

// Version A keeps its own two faces, loaded only on this route.
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

export default function VersionALayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${grotesk.variable} ${sourceSerif.variable}`} style={{ display: "contents" }}>
      {children}
    </div>
  );
}
