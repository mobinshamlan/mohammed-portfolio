import Link from "next/link";
import type { ReactNode } from "react";
import { fieldStyle, projectById, type Project, type ProjectId } from "@/lib/projects";
import { FlowLine } from "./flow-line";
import { gthrzShots } from "@/lib/gthrz";
import { GthrzImg } from "./gthrz-img";
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


function projectHref(project: Project) {
  return project.href ?? `/projects/${project.id}`;
}

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
        <Link href={projectHref(project)} prefetch={false}>
          {project.name}
          {project.arabic ? <span lang="ar">{project.arabic}</span> : null}
        </Link>
      </h3>
      <p className="vb-proj-tagline">{project.tagline}</p>
    </Reveal>
  );
}

/** Checked numbers from the public repository, in one line, each linked to its source. */
function Proof({ project }: { project: Project }) {
  const items = project.proof.evidence?.filter((item) => item.kind !== "scope") ?? [];
  if (!items.length) return null;
  return (
    <span className="vb-proj-proof">
      {items.map((item) => (
        <span key={item.kind}>
          <a href={item.run?.href ?? item.source.href} className="vb-link" target="_blank" rel="noreferrer">
            <strong>{item.value}</strong> {item.kind === "tests" ? "tests" : "commits"}
            <span className="vb-sr"> (opens in a new tab)</span>
          </a>
        </span>
      ))}
    </span>
  );
}

/** My part in a few words, where it stands, and where to go next. */
const role: Record<string, string> = {
  naqah: "Lead of a team of 3: the call flow, the owner's site, the tests.",
  tammeni: "Team of 3: the parent dashboard, alert schedules and Lulwa's calls.",
  seet: "Solo: the WhatsApp agent, the booking rules and the dashboard.",
  kashta: "Solo: the scoring model, the forecast pipeline and the Llama guards.",
  amanah: "Solo: Gemini matching, private tracking links and staff review.",
  gthrz: "Solo: the React Native app, its privacy rules and the AI planner.",
};

function Foot({ project }: { project: Project }) {
  return (
    <Reveal className="vb-proj-foot" delay={0.08}>
      <p className="vb-proj-role">{role[project.id] ?? project.contribution}</p>
      <p className="vb-proj-stand">
        {project.statusChip} · {project.dates}
        <Proof project={project} />
      </p>
      <div className="vb-proj-actions">
        <Link href={projectHref(project)} prefetch={false} className="vb-btn vb-btn-field">
          Read the case study<span className="vb-sr">: {project.name}</span>
        </Link>
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
 * Every chapter reads the same way: the name and what it is, then my part and
 * the links, beside one picture of how the product works. Real screens and the
 * full demos are in each case study.
 */
function Naqah() {
  const project = projectById.naqah;
  return (
    <Section id="naqah" scene={<NaqahScene />} layout="uniform">
      <Head project={project} />
      <Foot project={project} />
      <div className="vb-proj-visual">
        <NaqahProof />
      </div>
    </Section>
  );
}

function Tammeni() {
  const project = projectById.tammeni;
  return (
    <Section id="tammeni" scene={<TammeniScene />} layout="uniform">
      <Head project={project} />
      <Foot project={project} />
      <div className="vb-proj-visual">
        <TammeniProof />
      </div>
    </Section>
  );
}

function Seet() {
  const project = projectById.seet;
  return (
    <Section id="seet" scene={<SeetScene />} layout="uniform">
      <Head project={project} />
      <Foot project={project} />
      <div className="vb-proj-visual">
        <SeetProof />
      </div>
    </Section>
  );
}

function Kashta() {
  const project = projectById.kashta;
  return (
    <Section id="kashta" scene={<KashtaScene />} layout="uniform">
      <Head project={project} />
      <Foot project={project} />
      <div className="vb-proj-visual">
        <KashtaProof />
      </div>
    </Section>
  );
}

function Amanah() {
  const project = projectById.amanah;
  return (
    <Section id="amanah" scene={<AmanahScene />} layout="uniform">
      <Head project={project} />
      <Foot project={project} />
      <div className="vb-proj-visual">
        <AmanahProof />
      </div>
    </Section>
  );
}

function Gthrz() {
  const project = projectById.gthrz;
  return (
    <Section id="gthrz" scene={<GthrzScene />} layout="uniform">
      <Head project={project} />
      <Foot project={project} />
      <div className="vb-proj-visual vb-gz-combo">
        <div className="vb-gz-phones" aria-hidden="true">
          {[gthrzShots.home, gthrzShots.details, gthrzShots.discover].map((shot) => (
            <div key={shot.src} className="vb-capture" data-ui="">
              <GthrzImg shot={shot} sizes="(max-width: 899px) 40vw, 220px" decorative />
            </div>
          ))}
        </div>
        <GthrzProof />
      </div>
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
      <Naqah />
      <Tammeni />
      <Seet />
      <Kashta />
      <Amanah />
      <Gthrz />
    </section>
  );
}
