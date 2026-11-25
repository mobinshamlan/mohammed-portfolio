import type { Metadata } from "next";
import { CasePage } from "@/components/version-b/case-study";
import { projectById } from "@/lib/projects";

const project = projectById.seet;

export const metadata: Metadata = {
  title: `${project.name} | ${project.arabic}`,
  description: project.tagline,
};

export default function SeetCaseStudyPage() {
  return <CasePage project={project} />;
}
