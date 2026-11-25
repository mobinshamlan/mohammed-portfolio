import type { Metadata } from "next";
import { CallDemo } from "@/components/portfolio/call-demo";
import { CasePage } from "@/components/portfolio/case-study";
import { Reveal } from "@/components/portfolio/reveal";
import { projectById } from "@/lib/projects";

const project = projectById.naqah;

export const metadata: Metadata = {
  title: `${project.name} | ${project.arabic}`,
  description: project.tagline,
};

export default function NaqahCaseStudyPage() {
  return (
    <CasePage
      project={project}
      lead={
        <section className="vb-case-section vb-case-demo" aria-labelledby="demo-title">
          <Reveal>
            <h2 id="demo-title" className="vb-case-h2">
              Hear the shape of the call
            </h2>
            <p className="vb-case-text">
              A short, made-up sample of the daily call. The questions are the
              owner&rsquo;s; the answers come back as records, never as audio.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <CallDemo />
          </Reveal>
        </section>
      }
    />
  );
}
