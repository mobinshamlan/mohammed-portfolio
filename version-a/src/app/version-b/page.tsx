import type { Metadata } from "next";
import { VersionBAbout } from "@/components/version-b/about";
import { VersionBCerts } from "@/components/version-b/certs";
import { VersionBFinale } from "@/components/version-b/finale";
import { VersionBCover } from "@/components/version-b/cover";
import { DuotoneDefs } from "@/components/version-b/duotone";
import { VersionBJourney } from "@/components/version-b/journey";
import { VersionBNav } from "@/components/version-b/nav";
import { VersionBSkills } from "@/components/version-b/skills";

export const metadata: Metadata = {
  title: "Mohammed Bin Shamlan",
  description:
    "Software developer in Saudi Arabia exploring AI engineering. Building thoughtful digital products through software, creativity, and emerging technologies.",
};

export default function VersionBPage() {
  return (
    <>
      <a href="#home" className="vb-skip">
        Skip to content
      </a>
      <VersionBNav />
      <DuotoneDefs />
      <main>
        <VersionBCover />
        <VersionBAbout />
        <VersionBJourney />
        <VersionBSkills />
        <VersionBCerts />
        <VersionBFinale />
      </main>
    </>
  );
}
