import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { amanahViews } from "@/lib/amanah-views";
import { gthrzShots, gthrzVisibility } from "@/lib/gthrz";
import { kashtaExample } from "@/lib/kashta-example";
import { fieldStyle, projectById, type Project, type ProjectId } from "@/lib/projects";
import { SeetChat } from "./artifacts";
import { CallDemo } from "./call-demo";
import { Collapsible } from "./collapsible";
import { DayLine } from "./dayline";
import { DeviceFrame } from "./device-frame";
import { GthrzImg } from "./gthrz-img";
import { Reveal } from "./reveal";
import { WorkLine } from "./workline";

function projectHref(project: Project) {
  return project.href ?? `/projects/${project.id}`;
}

/*
 * Every project gets its own section on its own colour field. The parts are
 * shared (name, the decision in one line, status, actions); the composition
 * comes from the product: a call, a schedule, a chat, a score, two views, phones.
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
            </a>
          </li>
        ),
      )}
      {project.linkNote ? <li className="vb-proj-linknote">{project.linkNote}</li> : null}
    </ul>
  );
}

/** Kind, name and tagline: what the product is. */
function Head({ project, hook }: { project: Project; hook: ReactNode }) {
  return (
    <Reveal className="vb-proj-head">
      <p className="vb-proj-kind">{project.kind}</p>
      <h3 id={`proj-${project.id}`} className="vb-proj-name">
        <Link href={projectHref(project)} prefetch={false}>
          {project.name}
          {project.arabic ? <span lang="ar">{project.arabic}</span> : null}
        </Link>
      </h3>
      <p className="vb-proj-tagline">{project.tagline}</p>
      <p className="vb-proj-hook">{hook}</p>
    </Reveal>
  );
}

/** Status, dates, my part and where to go next. */
function Foot({ project }: { project: Project }) {
  return (
    <Reveal className="vb-proj-foot" delay={0.08}>
      <p className="vb-proj-meta">
        <span className="vb-chip">{project.statusChip}</span>
        <span>{project.dates}</span>
      </p>
      <p className="vb-proj-part">{project.contribution}</p>
      <div className="vb-proj-actions">
        <Link href={projectHref(project)} prefetch={false} className="vb-btn vb-btn-field">
          Read the case study
        </Link>
        <ProjectLinks project={project} />
      </div>
    </Reveal>
  );
}

function Section({
  id,
  layout,
  children,
}: {
  id: ProjectId;
  layout: string;
  children: ReactNode;
}) {
  const project = projectById[id];
  return (
    <article
      className="vb-proj"
      data-layout={layout}
      data-id={id}
      data-light={project.light ? "true" : undefined}
      style={fieldStyle(project)}
      aria-labelledby={`proj-${id}`}
    >
      <div className="vb-proj-inner">{children}</div>
    </article>
  );
}

function Phone({ shot, sizes }: { shot: Project["screens"][number]; sizes: string }) {
  return (
    <div className="vb-phone vb-phone-sm" data-ui="">
      <Image src={shot.src} alt="" width={shot.width} height={shot.height} sizes={sizes} className="vb-phone-img" />
    </div>
  );
}

/* ---------- Naqah: the call itself is the picture ---------- */

function Naqah() {
  const project = projectById.naqah;
  return (
    <Section id="naqah" layout="stage">
      <Head
        project={project}
        hook="The worker types nothing. A daily call asks the owner's questions, keeps the answers as records and throws the audio away."
      />
      <div className="vb-proj-art">
        <CallDemo compact id="naqah-demo" />
      </div>
      <Foot project={project} />
    </Section>
  );
}

/* ---------- Tammeni: one family's rules, and the screens that set them ---------- */

function Tammeni() {
  const project = projectById.tammeni;
  const phones = project.screens.filter((shot) => shot.frame === "phone").slice(0, 2);
  return (
    <Section id="tammeni" layout="schedule">
      <Head
        project={project}
        hook="Each parent chooses, per child and per topic, whether news comes by call or text, and when."
      />
      <Reveal className="vb-proj-rules" delay={0.1}>
        <p className="vb-proj-label">{project.proof.title}. Fictional demo family.</p>
        <ul>
          {project.proof.moments.map((m) => (
            <li key={m.time + m.label}>
              <span>{m.time}</span>
              <strong>{m.label}</strong>
            </li>
          ))}
        </ul>
      </Reveal>
      <div className="vb-proj-art vb-proj-phones" aria-hidden="true">
        {phones.map((shot) => (
          <Phone key={shot.src} shot={shot} sizes="(max-width: 899px) 42vw, 250px" />
        ))}
      </div>
      <Foot project={project} />
    </Section>
  );
}

/* ---------- Seet: a masthead over the booking chat ---------- */

function Seet() {
  const project = projectById.seet;
  return (
    <Section id="seet" layout="masthead">
      <Head project={project} hook="A slot is held first. Only the deposit confirms it." />
      <Reveal className="vb-proj-states" delay={0.1}>
        <DayLine
          label="One booking, simulated with made-up prices"
          moments={[
            { time: "Held", label: "Tuesday, for two hours" },
            { time: "Deposit", label: "2,250 SAR link sent" },
            { time: "Confirmed", label: "Payment callback only" },
          ]}
        />
      </Reveal>
      <div className="vb-proj-art">
        <SeetChat compact />
      </div>
      <Foot project={project} />
    </Section>
  );
}

/* ---------- Kashta: one real night, scored by hand ---------- */

function Kashta() {
  const project = projectById.kashta;
  const total = kashtaExample.rows.reduce((sum, r) => sum + r.score * r.weight, 0);
  return (
    <Section id="kashta" layout="score">
      <Head project={project} hook="The score is code, not AI. Llama explains a ranking it never computes." />
      <Reveal className="vb-proj-score" delay={0.1}>
        <figure>
          <figcaption className="vb-proj-label">
            {kashtaExample.site}, {kashtaExample.shortNight}.
          </figcaption>
          <p className="vb-score-total">
            <strong>{Math.round(total)}</strong>
            <span>
              Worked by hand: {total.toFixed(2)}, rounded. The live app showed {kashtaExample.liveScore}.
            </span>
          </p>
          <Collapsible className="vb-proj-more" summary="The five factors behind it">
            <ol className="vb-score-bars">
              {kashtaExample.rows.map((row) => (
                <li key={row.factor} style={{ "--score": `${row.score}%` } as CSSProperties}>
                  <span className="vb-score-factor">{row.factor}</span>
                  <span className="vb-score-bar" aria-hidden="true" />
                  <strong>{row.score}</strong>
                  <em>×&nbsp;{row.weight}</em>
                </li>
              ))}
            </ol>
            <p className="vb-proj-label vb-score-source">
              Limits and weights from the app&rsquo;s score.ts; values from its live forecast.
            </p>
          </Collapsible>
        </figure>
      </Reveal>
      {project.coverPhone ? (
        <div className="vb-proj-art" aria-hidden="true">
          <Phone shot={project.coverPhone} sizes="240px" />
        </div>
      ) : null}
      <Foot project={project} />
    </Section>
  );
}

/* ---------- Amanah: the same match, seen from each side ---------- */

function Amanah() {
  const project = projectById.amanah;
  const ownership = project.screens.find((shot) => shot.src.includes("ownership")) ?? project.cover;
  return (
    <Section id="amanah" layout="views">
      <Head project={project} hook="One match, two different views." />
      {amanahViews.map((view, index) => (
        <Reveal key={view.who} className="vb-proj-view" delay={0.08 + index * 0.06}>
          <h4>{view.who}</h4>
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
        </Reveal>
      ))}
      <div className="vb-proj-art">
        <DeviceFrame
          shot={{ ...ownership, caption: undefined }}
          sizes="(max-width: 899px) 100vw, 46vw"
          label="amanahz.vercel.app/demo"
        />
      </div>
      <Foot project={project} />
    </Section>
  );
}

/* ---------- Gthrz: a phone app, so phones lead ---------- */

function Gthrz() {
  const project = projectById.gthrz;
  const shots = [gthrzShots.home, gthrzShots.details, gthrzShots.privacy];
  return (
    <Section id="gthrz" layout="fan">
      <div className="vb-proj-art vb-proj-fan" aria-hidden="true">
        {shots.map((shot) => (
          <div key={shot.src} className="vb-capture" data-ui="">
            <GthrzImg shot={shot} sizes="(max-width: 899px) 30vw, 240px" decorative />
          </div>
        ))}
      </div>
      <Head project={project} hook="The host decides who sees the address, and when." />
      <Reveal className="vb-proj-ladder" delay={0.1}>
        <Collapsible className="vb-proj-more" summary="Address, pin and guest list, by state">
          <table>
            <caption className="vb-proj-label">
              What a guest can read, by state. Host chose &ldquo;reveal later&rdquo;.
            </caption>
            <thead>
              <tr>
                <th scope="col">State</th>
                {gthrzVisibility.columns.map((c) => (
                  <th key={c} scope="col">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {gthrzVisibility.rows.map((r) => (
                <tr key={r.state}>
                  <th scope="row">{r.state}</th>
                  {r.values.map((v, i) => (
                    <td key={i} data-on={v ? "true" : undefined}>
                      <span aria-hidden="true" className="vb-ladder-dot" />
                      {v ? "Yes" : "No"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Collapsible>
      </Reveal>
      <Foot project={project} />
    </Section>
  );
}

/* ---------- The experiment: a smaller, secondary entry ---------- */

function Experiment() {
  const project = projectById.experiment;
  const previews = [
    { src: project.cover.src, label: "Version A: one prompt, one pass", width: 800, height: 2137 },
    { src: project.cover.src.replace("a-desktop", "b-desktop"), label: "Version B: this site", width: 800, height: 3333 },
  ];
  return (
    <aside className="vb-exp" aria-labelledby="exp-title" style={fieldStyle(project)}>
      <div className="vb-exp-copy">
        <p className="vb-proj-kind">Also on the work line</p>
        <h3 id="exp-title" className="vb-exp-name">
          <Link href={projectHref(project)} prefetch={false}>
            {project.name}
          </Link>
        </h3>
        <p className="vb-exp-tagline">{project.tagline}</p>
        <ProjectLinks project={project} />
      </div>
      <Link href={projectHref(project)} prefetch={false} className="vb-exp-pair" aria-hidden="true" tabIndex={-1}>
        {previews.map((p) => (
          <span key={p.src} className="vb-exp-shot">
            <Image src={p.src} alt="" width={p.width} height={p.height} sizes="(max-width: 899px) 44vw, 300px" />
            <span className="vb-exp-label">{p.label}</span>
          </span>
        ))}
      </Link>
    </aside>
  );
}

export function Covers() {
  return (
    <section id="work" className="vb-work" aria-labelledby="work-title">
      <div className="vb-work-head">
        <Reveal>
          <h2 id="work-title" className="vb-section-head">
            Six products, one decision each.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="vb-lead vb-work-lead">
            A ranch, a school, an ads inbox, a desert night, a lost umbrella and a private party.
            Each section shows the choice that shaped the product.{" "}
            <Link href="#all-projects" className="vb-link vb-work-all">
              All seven projects on one line
            </Link>
          </p>
        </Reveal>
      </div>
      <Naqah />
      <WorkLine />
      <Tammeni />
      <Seet />
      <Kashta />
      <Amanah />
      <Gthrz />
      <Experiment />
    </section>
  );
}
