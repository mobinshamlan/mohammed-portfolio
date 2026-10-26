import type { Metadata } from "next";
import { VersionBHero } from "@/components/version-b/hero";
import { VersionBNav } from "@/components/version-b/nav";

export const metadata: Metadata = {
  title: "Mohammed Bin Shamlan",
  description:
    "Software developer in Saudi Arabia exploring AI engineering. Building thoughtful digital products through software, creativity, and emerging technologies.",
};

export default function VersionBPage() {
  return (
    <>
      <a href="#content" className="vb-skip">
        Skip to content
      </a>
      <VersionBNav />
      <VersionBHero />
    </>
  );
}
