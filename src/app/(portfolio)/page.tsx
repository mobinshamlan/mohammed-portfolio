import type { Metadata } from "next";
import { VersionBAbout } from "@/components/version-b/about";
import { VersionBCerts } from "@/components/version-b/certs";
import { VersionBContact } from "@/components/version-b/contact";
import { VersionBCovers } from "@/components/version-b/covers";
import { VersionBFooter } from "@/components/version-b/footer";
import { VersionBHero } from "@/components/version-b/hero";
import { VersionBJourney } from "@/components/version-b/journey";
import { VersionBNav } from "@/components/version-b/nav";
import { MotionRoot } from "@/components/version-b/reveal";
import { VersionBSkills } from "@/components/version-b/skills";

export const metadata: Metadata = {
  title: { absolute: "Mohammed Bin Shamlan — AI products for real Saudi life" },
  description:
    "Software developer in Saudi Arabia building Arabic-first AI products: Naqah, Tammeni, Seet, Kashta, Amanah and Gthrz. Case studies, journey, skills and contact.",
};

export default function VersionBPage() {
  return (
    <>
      <a href="#home" className="vb-skip">
        Skip to content
      </a>
      <MotionRoot />
      <VersionBNav />
      <main>
        <VersionBHero />
        <VersionBCovers />
        <VersionBAbout />
        <VersionBJourney />
        <VersionBSkills />
        <VersionBCerts />
        <VersionBContact />
      </main>
      <VersionBFooter />
    </>
  );
}
