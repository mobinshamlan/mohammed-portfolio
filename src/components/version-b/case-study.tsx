import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { nextProject, previousProject, type Project } from "@/lib/projects";
import { DecisionArtifact } from "./artifacts";
import { DayLine } from "./dayline";
import { DeviceFrame } from "./device-frame";
import { VersionBFooter } from "./footer";
import { VersionBNav } from "./nav";
import { MotionRoot, Reveal } from "./reveal";

export function fieldStyle(project: Project) {
  return {
    "--field": project.field,
    "--field-ink": project.fieldInk,
    "--field-muted": project.fieldMuted,
    "--accent": project.accent,
  } as CSSProperties;
}

/** How it works: actors and actions drawn as a flow, left to right on wide screens. */
export function Flow({ project }: { project: Project }) {
  return (
    <ol className="vb-flow" aria-label={`How ${project.name} works`}>
      {project.how.map((step, index) => (
        <li key={`${step.actor}-${index}`} className="vb-flow-step">
          <span className="vb-flow-actor">{step.actor}</span>
          <span className="vb-flow-action">{step.action}</span>
          {step.note ? <span className="vb-flow-note">{step.note}</span> : null}
        </li>
      ))}
    </ol>
  );
}

export function CaseHero({
  project,
  art,
}: {
  project: Project;
  art?: ReactNode;
}) {
  return (
    <header
      className="vb-case-hero"
      style={fieldStyle(project)}
      data-light={project.light ? "true" : undefined}
    >
      <div className="vb-case-hero-copy">
        <h1 className="vb-case-name">
          {project.name}
          {project.arabic ? <span lang="ar">{project.arabic}</span> : null}
        </h1>
        <p className="vb-case-tagline">{project.tagline}</p>
        {project.arabicTagline ? (
          <p className="vb-case-arabic" lang="ar">
            {project.arabicTagline}
          </p>
        ) : null}
        <dl className="vb-case-facts">
          <div>
            <dt>Status</dt>
            <dd>{project.status}</dd>
          </div>
          <div>
            <dt>When</dt>
            <dd>{project.dates}</dd>
          </div>
          {project.team ? (
            <div>
              <dt>Team</dt>
              <dd>{project.team}</dd>
            </div>
          ) : null}
          <div className="vb-case-fact-wide">
            <dt>What I did</dt>
            <dd>{project.contribution}</dd>
          </div>
        </dl>
        <div className="vb-case-links">
          <span className="vb-chip">{project.statusChip}</span>
          {project.links.map((link) =>
            link.href.startsWith("/") ? (
              <Link key={link.href} href={link.href} className="vb-btn vb-btn-field">
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="vb-btn vb-btn-field"
                target="_blank"
                rel="noreferrer"
              >
                {link.label}
              </a>
            ),
          )}
          {project.linkNote ? (
            <p className="vb-case-linknote">{project.linkNote}</p>
          ) : null}
        </div>
        <p className="vb-crumbs">
          <Link href="/#work">All work</Link>
        </p>
      </div>
      <div className="vb-case-hero-art">
        {art ?? (
          <DeviceFrame
            shot={project.cover}
            sizes="(max-width: 900px) 100vw, 60vw"
            priority
            label={project.links[0]?.href.replace("https://", "")}
          />
        )}
      </div>
    </header>
  );
}

export function CaseBody({
  project,
  children,
  before,
}: {
  project: Project;
  /** Extra sections placed after the flow and before the screens. */
  children?: ReactNode;
  /** Extra sections placed before the flow. */
  before?: ReactNode;
}) {
  const next = nextProject(project.id);
  const previous = previousProject(project.id);
  const hrefOf = (item: Project) => item.href ?? `/projects/${item.id}`;
  // The cover already showed the first screen; do not repeat it unless it would leave one.
  const unrepeated = project.screens.filter((shot) => shot.src !== project.cover.src);
  const screens = unrepeated.length >= 2 ? unrepeated : project.screens;
  return (
    <>
      <section className="vb-case-section vb-case-problem" aria-labelledby="problem-title">
        <Reveal>
          <h2 id="problem-title" className="vb-case-h2">
            The problem
          </h2>
        </Reveal>
        <Reveal delay={0.06}>
          <p className="vb-case-statement">{project.problem}</p>
        </Reveal>
        <Reveal delay={0.12}>
          <h2 className="vb-case-h2">What it is</h2>
          <p className="vb-case-text">{project.what}</p>
        </Reveal>
      </section>

      {before}

      <section className="vb-case-section vb-case-how" aria-labelledby="how-title">
        <Reveal>
          <h2 id="how-title" className="vb-case-h2">
            How it works
          </h2>
        </Reveal>
        <Reveal delay={0.06}>
          <Flow project={project} />
        </Reveal>
      </section>

      <section className="vb-case-section vb-case-decision" aria-labelledby="decision-title">
        <Reveal>
          <h2 id="decision-title" className="vb-case-h2">
            The decision that shaped it
          </h2>
        </Reveal>
        <div className="vb-decision-pair">
        <Reveal delay={0.06}>
          <dl className="vb-decision">
            <div className="vb-decision-constraint">
              <dt>The constraint</dt>
              <dd>{project.decision.constraint}</dd>
            </div>
            <div>
              <dt>The tradeoff</dt>
              <dd>{project.decision.tradeoff}</dd>
            </div>
            <div>
              <dt>What I built</dt>
              <dd>{project.decision.shipped}</dd>
            </div>
            <div>
              <dt>What it changed</dt>
              <dd>{project.decision.changed}</dd>
            </div>
          </dl>
        </Reveal>
        <Reveal delay={0.12} className="vb-decision-artifact">
          <DecisionArtifact id={project.id} />
        </Reveal>
        </div>
      </section>

      <section className="vb-case-section vb-case-proof" aria-labelledby="proof-title">
        <Reveal>
          <h2 id="proof-title" className="vb-case-h2">
            {project.proof.title}
          </h2>
        </Reveal>
        <Reveal delay={0.06}>
          <figure className="vb-proof">
            <DayLine moments={project.proof.moments} label={project.proof.title} className="vb-proof-line" />
            <figcaption>
              <ul className="vb-proof-notes">
                {project.proof.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </figcaption>
          </figure>
        </Reveal>
      </section>

      {children}

      {screens.length > 0 ? (
        <section className="vb-case-section vb-case-screens" aria-labelledby="screens-title">
          <Reveal>
            <h2 id="screens-title" className="vb-case-h2">
              {project.id === "gthrz" ? "Screens from the app" : "Screens from the live app"}
            </h2>
          </Reveal>
          <div className="vb-screens" data-layout={project.id}>
            {screens.map((shot, index) => (
              <Reveal key={shot.src} delay={index * 0.05} className={`vb-screen vb-screen-${shot.frame}`}>
                <DeviceFrame
                  shot={shot}
                  sizes={
                    shot.frame === "phone"
                      ? "(max-width: 900px) 60vw, 260px"
                      : "(max-width: 900px) 100vw, 70vw"
                  }
                  label={project.links[0]?.href.replace("https://", "")}
                />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      <section className="vb-case-section vb-case-under" aria-labelledby="under-title">
        <div>
          <Reveal>
            <h2 id="under-title" className="vb-case-h2">
              Decisions worth knowing
            </h2>
          </Reveal>
          <Reveal delay={0.06}>
            <ul className="vb-decisions">
              {project.decisions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
        </div>
        <div>
          <Reveal>
            <h2 className="vb-case-h2">Stack</h2>
          </Reveal>
          <Reveal delay={0.06}>
            <ul className="vb-stack">
              {project.stack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <nav className="vb-case-next" aria-label="More projects">
        <Link
          href={hrefOf(previous)}
          className="vb-case-next-link"
          style={fieldStyle(previous)}
        >
          <span>Previous</span>
          <strong>
            {previous.name}{previous.arabic ? <span lang="ar">{previous.arabic}</span> : null}
          </strong>
          <em>{previous.tagline}</em>
        </Link>
        <Link
          href={hrefOf(next)}
          className="vb-case-next-link"
          style={fieldStyle(next)}
        >
          <span>Next</span>
          <strong>
            {next.name}{next.arabic ? <span lang="ar">{next.arabic}</span> : null}
          </strong>
          <em>{next.tagline}</em>
        </Link>
      </nav>
    </>
  );
}

export function CasePage({
  project,
  art,
  before,
  children,
}: {
  project: Project;
  art?: ReactNode;
  before?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <>
      <a href="#case" className="vb-skip">
        Skip to content
      </a>
      <MotionRoot />
      <VersionBNav
        tone={project.light ? "light" : "dark"}
        field={project.field}
        fieldInk={project.fieldInk}
      />
      <main id="case" className="vb-case">
        <CaseHero project={project} art={art} />
        <CaseBody project={project} before={before}>
          {children}
        </CaseBody>
      </main>
      <VersionBFooter />
    </>
  );
}
