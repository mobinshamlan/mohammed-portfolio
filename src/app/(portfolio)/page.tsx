import type { Metadata } from "next";
import { Certs } from "@/components/portfolio/certs";
import { Contact } from "@/components/portfolio/contact";
import { Covers } from "@/components/portfolio/covers";
import { Footer } from "@/components/portfolio/footer";
import { Hero } from "@/components/portfolio/hero";
import { Nav } from "@/components/portfolio/nav";
import { MotionRoot } from "@/components/portfolio/reveal";
import { Story } from "@/components/portfolio/story";
import { Toolkit } from "@/components/portfolio/toolkit";

export const metadata: Metadata = {
  title: { absolute: "Mohammed Bin Shamlan — AI products for real Saudi life" },
  description:
    "Software developer in Saudi Arabia building Arabic-first AI products: Naqah, Tammeni, Seet, Kashta, Amanah and Gthrz. Case studies, journey, skills and contact.",
};

export default function HomePage() {
  return (
    <>
      <a href="#home" className="vb-skip">
        Skip to content
      </a>
      <MotionRoot />
      <Nav />
      <main>
        <Hero />
        <Covers />
        <Story />
        <Toolkit />
        <Certs />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
