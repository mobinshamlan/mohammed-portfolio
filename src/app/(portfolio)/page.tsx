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
  title: { absolute: "Mohammed Bin Shamlan — Software & AI product developer" },
  description:
    "Software and AI products by Mohammed Bin Shamlan in Riyadh. Explore Naqah, Gthrz, Amanah, Kashta, Seet and Tammeni.",
};

export default function HomePage() {
  return (
    <>
      <a href="#main-content" className="vb-skip">
        Skip to content
      </a>
      <MotionRoot />
      <Nav />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <Covers />
        <Story />
        <Certs />
        <Toolkit />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
