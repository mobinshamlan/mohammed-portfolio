import type { Metadata } from "next";
import { CasePage } from "@/components/version-b/case-study";
import { projectById } from "@/lib/projects";

const project = projectById.kashta;

export const metadata: Metadata = {
  title: `${project.name} | ${project.arabic}`,
  description: project.tagline,
};

export default function KashtaCaseStudyPage() {
  return <CasePage project={project} />;
}
