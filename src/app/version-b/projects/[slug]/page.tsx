import type { Metadata } from "next";
import { Redirect } from "@/components/redirect";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Moved",
  robots: { index: false },
};

export function generateStaticParams() {
  return projects
    .filter((project) => !project.href)
    .map((project) => ({ slug: project.id }));
}

/** Case studies moved from /version-b/projects/<slug> to /projects/<slug>. */
export default async function VersionBProjectMovedPage({
  params,
}: PageProps<"/version-b/projects/[slug]">) {
  const { slug } = await params;
  const project = projects.find((item) => item.id === slug);
  return (
    <Redirect
      to={`/projects/${slug}`}
      label={project ? `the ${project.name} case study` : "the case study"}
    />
  );
}
