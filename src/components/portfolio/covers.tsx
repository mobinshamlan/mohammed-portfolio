import Link from "next/link";
import type { ReactNode } from "react";
import { fieldStyle, projectById, projectPage, type Project, type ProjectId } from "@/lib/projects";
import { FlowLine } from "./flow-line";
import { Reveal } from "./reveal";
import { NaqahProof } from "./proof/naqah-proof";
import { TammeniProof } from "./proof/tammeni-proof";
import { SeetProof } from "./proof/seet-proof";
import { KashtaProof } from "./proof/kashta-proof";
import { AmanahProof } from "./proof/amanah-proof";
import { GthrzProof } from "./proof/gthrz-proof";

import { NaqahScene } from "./scenes/naqah-scene";
import { TammeniScene } from "./scenes/tammeni-scene";
import { SeetScene } from "./scenes/seet-scene";
import { KashtaScene } from "./scenes/kashta-scene";
import { AmanahScene } from "./scenes/amanah-scene";
import { GthrzScene } from "./scenes/gthrz-scene";



/*
 * Every project gets its own section on its own colour field. The parts are
 * shared (name, the decision in one line, status, actions); the composition
 * comes from the product: a call, a schedule, a chat, a score, two views, phones.
 * Each section's centrepiece is a small working demo of that one decision.
 */

function ProjectLinks({ project }: { project: Project }) {
  return (
    <ul className="vb-proj-links">
      {project.links.map((link) =>
        link.href.startsWith("/") ? (
          <li key={link.href}>
            <Link href={link.href} className="vb-link">
              {link.label}
            </Link>
          </li>
        ) : (
          <li key={link.href}>
            <a href={link.href} className="vb-link" target="_blank" rel="noreferrer">
              {link.label}
              <span className="vb-sr"> (opens in a new tab)</span>
            </a>
          </li>
        ),
      )}
      {project.linkNote ? <li className="vb-proj-linknote">{project.linkNote}</li> : null}
    </ul>
  );
}

/** The name in both scripts and what the product is, in one line. */
function Head({ project }: { project: Project }) {
  return (
    <Reveal className="vb-proj-head">
      <h3 id={`proj-${project.id}`} className="vb-proj-name">
        {project.name}
        {project.arabic ? <span lang="ar">{project.arabic}</span> : null}
      </h3>
      <p className="vb-proj-tagline">{project.tagline}</p>
    </Reveal>
  );
}

/**
 * The chapter answered in a few short lines, each hanging off one stitched
 * seam: the trouble, what it does, my part, the line I drew. Then the links.
 */
function Foot({ project }: { project: Project }) {
  const answers = project.answers ?? [{ label: "My part", text: project.contribution }];
  return (
    <Reveal className="vb-proj-foot" delay={0.08}>
      <dl className="vb-proj-answers">
        {answers.map((answer) => (
          <div key={answer.label}>
            <dt>{answer.label}</dt>
            <dd>{answer.text}</dd>
          </div>
        ))}
      </dl>
      <div className="vb-proj-actions">
        {project.id === "gthrz" ? (
          <Link href={projectPage(project)} prefetch={false} className="vb-btn vb-btn-field">
            How {project.name} works
          </Link>
        ) : null}
        <ProjectLinks project={project} />
      </div>
    </Reveal>
  );
}

function Section({
  id,
  layout,
  scene,
  children,
}: {
  id: ProjectId;
  layout: string;
  scene?: ReactNode;
  children: ReactNode;
}) {
  const project = projectById[id];
  return (
    <article
      id={id}
      className="vb-proj"
      data-layout={layout}
      data-id={id}
      data-light={project.light ? "true" : undefined}
      style={fieldStyle(project)}
      aria-labelledby={`proj-${id}`}
    >
      {scene ? (
        <div className="vb-proj-scene" aria-hidden="true">
          {scene}
        </div>
      ) : null}
      <div className="vb-proj-inner">{children}</div>
    </article>
  );
}

/*
 * Every chapter has the same parts (name, try-it, answers, links) and its own
 * room: Naqah and Kashta keep the try-it on the right, Tammeni and Gthrz on
 * the left, Seet opens on a masthead and Amanah stands its claim on the desk.
 * The sizes differ on purpose: Tammeni and Gthrz are short, Kashta fills the
 * window, Seet and Amanah run long. The layout name is only a note.
 */
function Chapter({ id, layout, scene, proof }: { id: ProjectId; layout: string; scene: ReactNode; proof: ReactNode }) {
  const project = projectById[id];
  return (
    <Section id={id} scene={scene} layout={layout}>
      <Head project={project} />
      <div className="vb-proj-visual">{proof}</div>
      <Foot project={project} />
    </Section>
  );
}

export function Covers() {
  return (
    <section id="work" className="vb-work" aria-labelledby="work-title">
      <h2 id="work-title" className="vb-sr">
        Work
      </h2>
      <FlowLine />
      <Chapter id="naqah" layout="trough" scene={<NaqahScene />} proof={<NaqahProof />} />
      <Chapter id="tammeni" layout="page" scene={<TammeniScene />} proof={<TammeniProof />} />
      <Chapter id="seet" layout="banner" scene={<SeetScene />} proof={<SeetProof />} />
      <Chapter id="kashta" layout="night" scene={<KashtaScene />} proof={<KashtaProof />} />
      <Chapter id="amanah" layout="counter" scene={<AmanahScene />} proof={<AmanahProof />} />
      <Chapter id="gthrz" layout="close" scene={<GthrzScene />} proof={<GthrzProof />} />
    </section>
  );
}
