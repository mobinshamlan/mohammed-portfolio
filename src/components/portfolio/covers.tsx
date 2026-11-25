import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { gthrzShots } from "@/lib/gthrz";
import { fieldStyle, projectById, type Project, type ProjectId } from "@/lib/projects";
import { SeetChat } from "./artifacts";
import { CallDemo } from "./call-demo";
import { DayLine } from "./dayline";
import { AmanahClaimDemo } from "./demos/amanah-claim";
import { GthrzStatesDemo } from "./demos/gthrz-states";
import { KashtaScoreDemo } from "./demos/kashta-score";
import { TammeniScheduleDemo } from "./demos/tammeni-schedule";
import { DeviceFrame } from "./device-frame";
import { GthrzImg } from "./gthrz-img";
import { Reveal } from "./reveal";
import { ChapterMark } from "./chapter-mark";

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

/** Checked numbers from the public repository: tests and commits, each with its source. */
function Evidence({ project }: { project: Project }) {
  const items = project.proof.evidence?.filter((item) => item.kind !== "scope") ?? [];
  if (!items.length) return null;
  return (
    <ul className="vb-proj-evidence">
      {items.map((item) => (
        <li key={item.kind}>
          <strong>{item.value}</strong> {item.kind === "tests" ? "automated tests pass" : "commits are mine"}
          {" · "}
          <a href={item.run?.href ?? item.source.href} className="vb-link" target="_blank" rel="noreferrer">
            {item.run ? "passing run" : item.source.label}
            <span className="vb-sr"> (opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/** My part first, then the checked numbers, status, and where to go next. */
function Foot({ project }: { project: Project }) {
  return (
    <Reveal className="vb-proj-foot" delay={0.08}>
      <div className="vb-proj-part">
        <p className="vb-proj-label">My part</p>
        <p>{project.contribution}</p>
      </div>
      <Evidence project={project} />
      <p className="vb-proj-meta">
        <span className="vb-chip">{project.statusChip}</span>
        <span>{project.dates}</span>
      </p>
      <div className="vb-proj-actions">
        <Link href={projectHref(project)} prefetch={false} className="vb-btn vb-btn-field">
          Read the case study
        </Link>
        <ProjectLinks project={project} />
      </div>
    </Reveal>
  );
}

/** One real screen from the live product, with a caption saying what it shows. */
function Screen({
  shot,
  caption,
  sizes,
  phoneOnly = false,
}: {
  shot: Project["screens"][number];
  caption: string;
  sizes: string;
  phoneOnly?: boolean;
}) {
  return (
    <figure className="vb-proj-screen" data-phone-only={phoneOnly ? "true" : undefined}>
      <div className="vb-phone vb-phone-sm" data-ui="">
        <Image src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} sizes={sizes} className="vb-phone-img" />
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
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
      id={id}
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
      <Foot project={project} />
      <div className="vb-proj-art">
        <CallDemo compact id="naqah-demo" />
      </div>
      {project.coverPhone ? (
        <Screen
          shot={project.coverPhone}
          sizes="(max-width: 899px) 60vw, 220px"
          caption="The live site, in Arabic first: Naqah calls your worker at the time you choose, keeps the answers, then calls you with what matters."
        />
      ) : null}
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
      <Foot project={project} />
      <div className="vb-proj-demo">
        <TammeniScheduleDemo compact />
      </div>
      <div className="vb-proj-art vb-proj-phones" aria-hidden="true">
        {phones.map((shot) => (
          <Phone key={shot.src} shot={shot} sizes="(max-width: 899px) 42vw, 250px" />
        ))}
      </div>
      {phones[0] ? (
        <Screen
          phoneOnly
          shot={phones[0]}
          sizes="60vw"
          caption="The live demo, step 4 of 11: a parent chooses whether attendance news comes right away or after the school day."
        />
      ) : null}
    </Section>
  );
}

/* ---------- Seet: a masthead over the booking chat ---------- */

function Seet() {
  const project = projectById.seet;
  const how = project.screens.find((shot) => shot.src.includes("how")) ?? project.cover;
  return (
    <Section id="seet" layout="masthead">
      <Head project={project} hook="A slot is held first. Only the deposit confirms it." />
      <Foot project={project} />
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
      {how ? (
        <figure className="vb-proj-screen vb-proj-screen-wide">
          <DeviceFrame
            shot={{ ...how, caption: undefined }}
            sizes="(max-width: 899px) 100vw, 36vw"
            label="seet-puce.vercel.app"
          />
          <figcaption>
            From the live landing page: a slot moves from held to confirmed only after the deposit,
            and one calendar shows free and booked days.
          </figcaption>
        </figure>
      ) : null}
    </Section>
  );
}

/* ---------- Kashta: one real night, scored by the app's own rules ---------- */

function Kashta() {
  const project = projectById.kashta;
  return (
    <Section id="kashta" layout="score">
      <Head project={project} hook="The score is code, not AI. Llama explains a ranking it never computes." />
      <Foot project={project} />
      <div className="vb-proj-demo">
        <KashtaScoreDemo compact />
      </div>
      {project.coverPhone ? (
        <div className="vb-proj-art" aria-hidden="true">
          <Phone shot={project.coverPhone} sizes="240px" />
        </div>
      ) : null}
    </Section>
  );
}

/* ---------- Amanah: the same claim, seen from each side ---------- */

function Amanah() {
  const project = projectById.amanah;
  const ownership = project.screens.find((shot) => shot.src.includes("ownership")) ?? project.cover;
  return (
    <Section id="amanah" layout="views">
      <Head project={project} hook="One match, two different views." />
      <Foot project={project} />
      <div className="vb-proj-demo">
        <AmanahClaimDemo compact />
      </div>
      <div className="vb-proj-art">
        <DeviceFrame
          shot={{ ...ownership, caption: undefined }}
          sizes="(max-width: 899px) 100vw, 40vw"
          label="amanahz.vercel.app/demo"
        />
      </div>
    </Section>
  );
}

/* ---------- Gthrz: a phone app, so phones lead ---------- */

function Gthrz() {
  const project = projectById.gthrz;
  const shots = [gthrzShots.home, gthrzShots.details, gthrzShots.privacy];
  return (
    <Section id="gthrz" layout="fan">
      <Head project={project} hook="The host decides who sees the address, and when." />
      <Foot project={project} />
      <div className="vb-proj-art vb-proj-fan" aria-hidden="true">
        {shots.map((shot) => (
          <div key={shot.src} className="vb-capture" data-ui="">
            <GthrzImg shot={shot} sizes="(max-width: 899px) 30vw, 240px" decorative />
          </div>
        ))}
      </div>
      <div className="vb-proj-demo">
        <GthrzStatesDemo compact />
      </div>
    </Section>
  );
}

export function Covers() {
  return (
    <section id="work" className="vb-work" aria-labelledby="work-title">
      <div className="vb-work-head">
        <div className="vb-work-intro">
          <ChapterMark n={1} en="Work" ar="أعمالي" />
          <Reveal>
            <h2 id="work-title" className="vb-section-head">
              Six products, one decision each.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="vb-lead vb-work-lead">
              A ranch, a school, an ads inbox, a desert night, a lost umbrella and a private party.
              Each one shows the decision that shaped it, the part I built, and where to try it.
            </p>
          </Reveal>
        </div>
      </div>
      <Naqah />
      <Tammeni />
      <Seet />
      <Kashta />
      <Amanah />
      <Gthrz />
    </section>
  );
}
