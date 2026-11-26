import type { Metadata } from "next";
import { Redirect } from "@/components/redirect";
import { projectPage, projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Moved",
  robots: { index: false },
};

export function generateStaticParams() {
  return projects
    .filter((project) => !project.href)
    .map((project) => ({ slug: project.id }));
}

/** Old case-study links now open on the home page, or Gthrz's own page. */
export default async function VersionBProjectMovedPage({
  params,
}: PageProps<"/version-b/projects/[slug]">) {
  const { slug } = await params;
  const project = projects.find((item) => item.id === slug);
  return (
    <Redirect
      to={project ? projectPage(project) : "/"}
      label={project ? `${project.name}` : "the portfolio"}
    />
  );
}
