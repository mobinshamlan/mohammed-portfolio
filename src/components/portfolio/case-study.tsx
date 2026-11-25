import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { fieldStyle, nextProject, previousProject, type Project, type ProjectId } from "@/lib/projects";
import { amanahViews } from "@/lib/amanah-views";
import { kashtaExample } from "@/lib/kashta-example";
import { callScript } from "@/lib/naqah-call";
import { DecisionArtifact } from "./artifacts";
import { DayLine } from "./dayline";
import { DeviceFrame } from "./device-frame";
import { Footer } from "./footer";
import { Nav } from "./nav";
import { MotionRoot, Reveal } from "./reveal";
import { SaduBand, type SaduVariant } from "./sadu";

/** One reading on a step: a time, a state, or who can see it. `off` dims it; `all` covers every lane. */
type Cue = { text: string; tone?: "off" | "held" | "done"; all?: boolean };

/**
 * What changes as each case's steps go by, read the way the product reads it:
 * the evening's times, the booking's state, who can see what. Each lane holds
 * one cue per step; `null` leaves that step without one.
 */
type HowView = {
  kind: "timetable" | "states" | "nights" | "views" | "guest" | "children";
  caption?: string;
  lanes: { label: string; cues: (Cue | null)[] }[];
};

const callTimes = callScript.flatMap((line) => (line.kind === "event" ? [line.time] : []));

const howViews: Partial<Record<ProjectId, HowView>> = {
  naqah: {
    kind: "timetable",
    caption: "Times from the simulated sample call.",
    lanes: [
      {
        label: "When",
        cues: [
          { text: "Set once" },
          { text: callTimes[0] },
          { text: `${callTimes[0].replace(" pm", "")}–${callTimes[1]}` },
          { text: callTimes[1] },
          { text: callTimes[2] },
        ],
      },
    ],
  },
  seet: {
    kind: "states",
    caption: "The booking after each step.",
    lanes: [
      {
        label: "Booking",
        cues: [
          { text: "No booking", tone: "off" },
          { text: "No booking", tone: "off" },
          { text: "Held", tone: "held" },
          { text: "Held", tone: "held" },
          { text: "Confirmed", tone: "done" },
        ],
      },
    ],
  },
  kashta: {
    kind: "nights",
    lanes: [
      {
        label: "Carries",
        cues: [
          { text: "Your words" },
          { text: "Settings" },
          { text: "7 nights" },
          { text: "Nights ranked" },
          { text: "Best night, explained" },
        ],
      },
    ],
  },
  amanah: {
    kind: "views",
    caption: "Who can see each step. The public never can.",
    lanes: [
      {
        label: "Owner",
        cues: [
          { text: "Owner sees" },
          { text: "Hidden from owner", tone: "off" },
          { text: "Hidden from owner", tone: "off" },
          { text: "Owner sees" },
          { text: "Hidden from owner", tone: "off" },
        ],
      },
      {
        label: "Staff",
        cues: Array.from({ length: 5 }, () => ({ text: "Staff see" })),
      },
      {
        label: "Public",
        cues: Array.from({ length: 5 }, () => ({ text: "Hidden from public", tone: "off" as const })),
      },
    ],
  },
  gthrz: {
    kind: "guest",
    caption: "What a guest can read, for one made-up event.",
    lanes: [
      {
        label: "Guest",
        cues: [
          { text: "No guest yet", tone: "off" },
          { text: "No guest yet", tone: "off" },
          { text: "Requested: title and time" },
          { text: "Approved: address, guest list", tone: "done" },
          { text: "Host only", tone: "off" },
        ],
      },
    ],
  },
  tammeni: {
    kind: "children",
    caption: "Attendance alerts for the fictional children above.",
    lanes: [
      {
        label: "Reem",
        cues: [{ text: "Text, right away" }, { text: "Absent", all: true }, { text: "Texted now" }, null, null],
      },
      {
        label: "Nawaf",
        cues: [
          { text: "Off", tone: "off" },
          null,
          { text: "No alert", tone: "off" },
          null,
          null,
        ],
      },
    ],
  },
};

/** Kashta's forecast at a step: seven nights, then the same nights ranked, then the best one picked. */
function Nights({ stage }: { stage: number }) {
  if (stage < 2) return null;
  return (
    <span className="vb-nights" data-stage={stage} aria-hidden="true">
      {Array.from({ length: 7 }, (_, night) => (
        <i key={night} style={stage > 2 ? ({ "--rank": 7 - night } as CSSProperties) : undefined} />
      ))}
    </span>
  );
}

/** How it works: actors and actions as a run of blocks, with what changes at each one. */
export function Flow({ project }: { project: Project }) {
  const view = howViews[project.id];
  return (
    <>
      <ol
        className="vb-flow"
        data-view={view?.kind}
        data-lanes={view?.lanes.length}
        aria-label={`How ${project.name} works`}
      >
        {project.how.map((step, index) => {
          const shared = view?.lanes.find((lane) => lane.cues[index]?.all)?.cues[index];
          const cues = shared
            ? [{ lane: "Both", cue: shared }]
            : view?.lanes.map((lane) => ({ lane: lane.label, cue: lane.cues[index] }));
          return (
            <li key={`${step.actor}-${index}`} className="vb-flow-step">
              <span className="vb-flow-actor">{step.actor}</span>
              {view ? (
                <span className="vb-flow-cues">
                  {cues?.map(({ lane, cue }) =>
                    cue ? (
                      <span key={lane} className="vb-flow-cue" data-tone={cue.tone} data-all={cue.all}>
                        {view.kind === "children" ? <span className="vb-flow-lane">{lane}: </span> : null}
                        {cue.text}
                      </span>
                    ) : (
                      // Keeps the lanes level across the row on wide screens.
                      <span key={lane} className="vb-flow-cue" data-empty="true" aria-hidden="true" />
                    ),
                  )}
                  {view.kind === "nights" ? <Nights stage={index} /> : null}
                </span>
              ) : null}
              <span className="vb-flow-action">{step.action}</span>
              {step.note ? <span className="vb-flow-note">{step.note}</span> : null}
            </li>
          );
        })}
      </ol>
      {view?.caption ? <p className="vb-flow-caption">{view.caption}</p> : null}
    </>
  );
}

/** The live link a case points to first, or its repository. */
function evidenceLink(project: Project, match: RegExp) {
  return project.links.find((link) => match.test(link.label)) ?? project.links[0];
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="vb-link" target="_blank" rel="noreferrer">
      {children}
      <span className="vb-sr"> (opens in a new tab)</span>
    </a>
  );
}

const openings: ReadonlySet<string> = new Set(["kashta", "seet", "amanah"]);

/**
 * How a case departs from the default order, when its own demo or artifact
 * tells the story better than the standard sections would.
 */
type Arrangement = {
  /** The decision's demo opens the case in place of the cover. */
  demoInHero?: boolean;
  /** Draw the proof's line of moments; off when the demo already shows the same states. */
  proofLine?: boolean;
  /** The proof sits beside the demo in the decision, instead of a section of its own. */
  proofWithDecision?: boolean;
  /** Browser screenshots stand behind a dune at night rather than in a window. */
  plates?: boolean;
};

const arrangements: Partial<Record<ProjectId, Arrangement>> = {
  // Each family's rules are the product; the grid itself is the clearest opening.
  tammeni: { demoInHero: true, proofLine: false },
  // The chat steps through the same four states the proof would draw.
  seet: { proofWithDecision: true, plates: true },
  kashta: { plates: true },
};

function arrangementOf(project: Project): Arrangement {
  return arrangements[project.id] ?? {};
}

function hasOpening(project: Project) {
  return openings.has(project.id);
}

/**
 * What each case leads with, before the metadata: the one thing that shows
 * how the product thinks, and a link to the strongest evidence for it.
 */
function CaseOpening({ project }: { project: Project }) {
  if (project.id === "kashta") {
    const total = kashtaExample.rows.reduce((sum, r) => sum + r.score * r.weight, 0);
    const live = evidenceLink(project, /live/i);
    return (
      <section className="vb-case-open vb-open-kashta" aria-labelledby="open-title">
        <h2 id="open-title" className="vb-open-title">
          One real night, scored by code: <strong>{Math.round(total)}</strong>
        </h2>
        <p className="vb-open-sub">
          {kashtaExample.site}, {kashtaExample.shortNight}. The live app showed{" "}
          {kashtaExample.liveScore}.
        </p>
        <ol className="vb-open-factors">
          {kashtaExample.rows.map((row) => (
            <li key={row.factor}>
              <span>
                <abbr title={row.factor}>{row.short}</abbr>
              </span>
              <strong>{row.score}</strong>
              <em>×&nbsp;{row.weight}</em>
            </li>
          ))}
        </ol>
        <p className="vb-open-links">
          <Link href="#decision-title" className="vb-link">
            See the working
          </Link>
          <ExternalLink href={live.href}>Open the live app</ExternalLink>
        </p>
      </section>
    );
  }
  if (project.id === "seet") {
    const live = evidenceLink(project, /live/i);
    return (
      <section className="vb-case-open vb-open-seet" aria-labelledby="open-title">
        <h2 id="open-title" className="vb-open-title">
          A slot is held first. Only the deposit confirms it.
        </h2>
        <DayLine
          className="vb-open-line"
          label="One booking, simulated with made-up prices"
          moments={[
            { time: "Held", label: "Tuesday, for two hours" },
            { time: "Deposit", label: "2,250 SAR link sent" },
            { time: "Confirmed", label: "Payment callback only" },
          ]}
        />
        <p className="vb-open-sub">
          Built and running locally on demo data, with an in-app simulator. Only the landing page is live: no
          real WhatsApp number or payments yet.
        </p>
        <p className="vb-open-links">
          <Link href="#decision-title" className="vb-link">
            Step through the chat
          </Link>
          <ExternalLink href={live.href}>Live landing page</ExternalLink>
        </p>
      </section>
    );
  }
  if (project.id === "amanah") {
    const demo = evidenceLink(project, /demo/i);
    return (
      <section className="vb-case-open vb-open-amanah" aria-labelledby="open-title">
        <h2 id="open-title" className="vb-open-title">
          One match, two different views
        </h2>
        <div className="vb-open-views">
          {amanahViews.map((view) => (
            <div key={view.who}>
              <h3>{view.who}</h3>
              <ul>
                {view.items.map((item) => (
                  <li key={item.text}>
                    {item.text}
                    {"ar" in item ? (
                      <>
                        {" "}
                        <span lang="ar">{item.ar}</span>
                      </>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="vb-open-links">
          <ExternalLink href={demo.href}>Walk through the guided demo</ExternalLink>
        </p>
      </section>
    );
  }
  return null;
}

/** The cover as one legible crop: the phone capture on phones, the window on wide screens. */
function CoverShot({ project }: { project: Project }) {
  const { cover, coverPhone } = project;
  const label = project.links[0]?.href.replace("https://", "");
  return (
    <figure className="vb-window vb-case-shot" data-ui="" data-crop={project.id}>
      <span className="vb-window-bar" aria-hidden="true">
        <span className="vb-window-dots" />
        {label ? <span className="vb-window-url">{label}</span> : null}
      </span>
      <picture>
        {coverPhone ? <source media="(max-width: 899px)" srcSet={coverPhone.src} /> : null}
        <img
          src={cover.src}
          alt={cover.alt}
          width={cover.width}
          height={cover.height}
          fetchPriority="high"
          className="vb-window-img"
        />
      </picture>
    </figure>
  );
}

export function CaseHero({
  project,
  art,
}: {
  project: Project;
  art?: ReactNode;
}) {
  // Cases with an opening lead with it and keep their links with the metadata.
  const opening = hasOpening(project) ? <CaseOpening project={project} /> : null;
  const links = (
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
  );
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
        {opening ?? links}
      </div>
      <div className="vb-case-hero-art">{art ?? <CoverShot project={project} />}</div>
      <div className="vb-case-hero-meta">
        {project.arabicTagline ? (
          <p className="vb-case-arabic" lang="ar">
            {project.arabicTagline}
          </p>
        ) : null}
        {opening ? links : null}
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
        <p className="vb-crumbs">
          <Link href="/#work">All work</Link>
        </p>
      </div>
    </header>
  );
}

export function CaseBody({
  project,
  children,
  before,
  lead,
  coverShown = true,
}: {
  project: Project;
  /** Extra sections placed after the flow and before the screens. */
  children?: ReactNode;
  /** Extra sections placed before the flow. */
  before?: ReactNode;
  /** A section that opens the body, ahead of the problem. */
  lead?: ReactNode;
  /** Whether the hero showed the cover, so the gallery need not repeat it. */
  coverShown?: boolean;
}) {
  const arrangement = arrangementOf(project);
  const next = nextProject(project.id);
  const previous = previousProject(project.id);
  const hrefOf = (item: Project) => item.href ?? `/projects/${item.id}`;
  // The experiment page brings its own fonts; only fetch them when someone goes there.
  // The cover already showed the first screen; do not repeat it unless it would leave one.
  const unrepeated = project.screens.filter((shot) => shot.src !== project.cover.src);
  const screens = coverShown && unrepeated.length >= 2 ? unrepeated : project.screens;
  const proofNotes = (
    <ul className="vb-proof-notes">
      {project.proof.notes.map((note) => (
        <li key={note}>{note}</li>
      ))}
    </ul>
  );
  const hasProofSection =
    !arrangement.proofWithDecision || Boolean(project.proof.outcome || project.proof.evidence);
  return (
    <>
      {lead}

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
        <div className="vb-decision-pair" data-solo={arrangement.demoInHero ? "true" : undefined}>
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
          {arrangement.proofWithDecision ? (
            <section className="vb-decision-proof" aria-labelledby="proof-title">
              <h3 id="proof-title" className="vb-decision-proof-title">
                {project.proof.title}
              </h3>
              {proofNotes}
            </section>
          ) : null}
        </Reveal>
        {arrangement.demoInHero ? null : (
          <Reveal delay={0.12} className="vb-decision-artifact">
            <DecisionArtifact id={project.id} />
          </Reveal>
        )}
        </div>
      </section>

      {hasProofSection ? (
      <section className="vb-case-section vb-case-proof" aria-labelledby={arrangement.proofWithDecision ? undefined : "proof-title"}>
        {arrangement.proofWithDecision ? null : (
        <Reveal>
          <h2 id="proof-title" className="vb-case-h2">
            {project.proof.title}
          </h2>
        </Reveal>
        )}
        {project.proof.outcome ? (
          <Reveal delay={0.03}>
            <p className="vb-outcome">
              {project.proof.outcome.text}{" "}
              <a href={project.proof.outcome.source.href} className="vb-evidence-source" target="_blank" rel="noreferrer">
                {project.proof.outcome.source.label}
              </a>
              , {project.proof.outcome.date}.
            </p>
          </Reveal>
        ) : null}
        {arrangement.proofWithDecision ? null : (
          <Reveal delay={0.06}>
            {arrangement.proofLine === false ? (
              proofNotes
            ) : (
              <figure className="vb-proof">
                <DayLine moments={project.proof.moments} label={project.proof.title} className="vb-proof-line" />
                <figcaption>{proofNotes}</figcaption>
              </figure>
            )}
          </Reveal>
        )}
        {project.proof.evidence ? (
          <Reveal delay={0.1}>
            <section className="vb-evidence" aria-labelledby="evidence-title">
              <h3 id="evidence-title" className="vb-evidence-title">
                Checked in the public repository, {project.proof.evidence[0].checked}
              </h3>
              <dl className="vb-evidence-list">
                {project.proof.evidence.map((item) => (
                  <div key={item.label} className="vb-evidence-row">
                    <dt>{item.value}</dt>
                    <dd>
                      {item.label}{" "}
                      <a href={item.source.href} className="vb-evidence-source" target="_blank" rel="noreferrer">
                        {item.source.label}
                      </a>
                      {item.kind === "tests" ? (
                        item.run ? (
                          <>
                            {" · "}
                            <a href={item.run.href} className="vb-evidence-source" target="_blank" rel="noreferrer">
                              Passing CI run, {item.run.date}
                            </a>
                          </>
                        ) : (
                          <span>
                            . Counted locally on {item.checked} from a fresh clone; the repo has no CI for these tests.
                          </span>
                        )
                      ) : null}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </Reveal>
        ) : null}
      </section>
      ) : null}

      {children}

      {screens.length > 0 ? (
        <section className="vb-case-section vb-case-screens" aria-labelledby="screens-title">
          <Reveal>
            <h2 id="screens-title" className="vb-case-h2">
              {project.id === "seet"
                ? "The live landing page"
                : project.id === "gthrz"
                  ? "Screens from the app"
                  : "Screens from the live app"}
            </h2>
          </Reveal>
          <div className="vb-screens" data-layout={project.id}>
            {screens.map((shot, index) => (
              <Reveal key={shot.src} delay={index * 0.05} className={`vb-screen vb-screen-${shot.frame}`}>
                <DeviceFrame
                  shot={shot}
                  plate={arrangement.plates}
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
          prefetch={previous.id === "experiment" ? false : undefined}
          className="vb-case-next-link"
          data-id={previous.id}
          style={fieldStyle(previous)}
        >
          <SaduBand variant={previous.id as SaduVariant} size="s" className="vb-case-next-band" />
          <span>Previous</span>
          <strong>
            {previous.name}{previous.arabic ? <span lang="ar">{previous.arabic}</span> : null}
          </strong>
          <em>{previous.tagline}</em>
        </Link>
        <Link
          href={hrefOf(next)}
          prefetch={next.id === "experiment" ? false : undefined}
          className="vb-case-next-link"
          data-id={next.id}
          style={fieldStyle(next)}
        >
          <SaduBand variant={next.id as SaduVariant} size="s" className="vb-case-next-band" />
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
  lead,
  children,
}: {
  project: Project;
  art?: ReactNode;
  before?: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
}) {
  const heroArt =
    art ??
    (arrangementOf(project).demoInHero ? (
      <div className="vb-case-hero-demo">
        <DecisionArtifact id={project.id} />
      </div>
    ) : undefined);
  return (
    <>
      <a href="#case" className="vb-skip">
        Skip to content
      </a>
      <MotionRoot />
      <Nav
        tone={project.light ? "light" : "dark"}
        field={project.field}
        fieldInk={project.fieldInk}
      />
      <main id="case" className="vb-case" data-id={project.id}>
        <CaseHero project={project} art={heroArt} />
        <SaduBand variant={project.id as SaduVariant} className="vb-case-band" />
        <CaseBody project={project} before={before} lead={lead} coverShown={!heroArt}>
          {children}
        </CaseBody>
      </main>
      <Footer />
    </>
  );
}
