import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { gthrzShots } from "@/lib/gthrz";
import { publicUrl } from "@/lib/site";
import { fieldStyle, projectById, type Project, type ProjectId } from "@/lib/projects";
import { SeetChat } from "./artifacts";
import { CallDemo } from "./call-demo";
import { AmanahClaimDemo } from "./demos/amanah-claim";
import { GthrzStatesDemo } from "./demos/gthrz-states";
import { KashtaScoreDemo } from "./demos/kashta-score";
import { TammeniScheduleDemo } from "./demos/tammeni-schedule";
import { DeviceFrame } from "./device-frame";
import { DocumentViewer } from "./document-viewer";
import { GthrzImg } from "./gthrz-img";
import { Reveal } from "./reveal";
import { SectionTitle } from "./section-title";
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
            <strong>{item.value}</strong> {item.kind === "tests" ? "tests pass" : "commits mine"}
            <span className="vb-sr"> (opens in a new tab)</span>
          </a>
        </span>
      ))}
    </span>
  );
}

/** The idea, my part and the evidence as three short rows, then where to go next. */
function Foot({ project, idea }: { project: Project; idea: ReactNode }) {
  return (
    <Reveal className="vb-proj-foot" delay={0.08}>
      <dl className="vb-proj-facts">
        <div>
          <dt>The idea</dt>
          <dd className="vb-proj-idea">{idea}</dd>
        </div>
        <div>
          <dt>My part</dt>
          <dd>{project.contribution}</dd>
        </div>
        <div>
          <dt>Where it stands</dt>
          <dd>
            {project.statusChip}, {project.dates}
            <Proof project={project} />
          </dd>
        </div>
      </dl>
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
      <DocumentViewer
        triggerClassName="vb-proj-zoom"
        src={shot.src}
        width={shot.width}
        height={shot.height}
        alt={shot.alt}
        title={shot.alt}
        subtitle="Screenshot from the live product"
        href={shot.src}
      >
        <span className="vb-phone vb-phone-sm" data-ui="">
          <Image src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} sizes={sizes} className="vb-phone-img" />
        </span>
        <span className="vb-proj-zoom-hint">Enlarge</span>
      </DocumentViewer>
      <figcaption>{caption}</figcaption>
    </figure>
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
    <Section id="naqah" scene={<NaqahScene />} layout="stage">
      <Head project={project} />
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
      <Foot project={project} idea="The worker types nothing. A daily call asks the owner's questions, keeps the answers as records and throws the audio away." />
    </Section>
  );
}

/* ---------- Tammeni: one family's rules, and the screens that set them ---------- */

function Tammeni() {
  const project = projectById.tammeni;
  const phones = project.screens.filter((shot) => shot.frame === "phone").slice(0, 2);
  return (
    <Section id="tammeni" scene={<TammeniScene />} layout="schedule">
      <Head project={project} />
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
      <Foot project={project} idea="Each parent chooses, per child and per topic, whether news comes by call or text, and when." />
    </Section>
  );
}

/* ---------- Seet: a masthead over the booking chat ---------- */

function Seet() {
  const project = projectById.seet;
  const dashboard = {
    src: publicUrl("/images/projects/seet/dashboard.webp"),
    alt: "Seet's booking dashboard on demo data: the ads manager's November 2026 calendar, with confirmed bookings on the 25th and 27th and ads already shown on the 13th, 20th and 21st.",
    width: 1440,
    height: 900,
    frame: "browser" as const,
  };
  return (
    <Section id="seet" scene={<SeetScene />} layout="masthead">
      <Head project={project} />
      <div className="vb-proj-art">
        <SeetChat compact />
      </div>
      <figure className="vb-proj-screen vb-proj-screen-wide">
        <DocumentViewer
          triggerClassName="vb-proj-zoom"
          src={dashboard.src}
          width={dashboard.width}
          height={dashboard.height}
          alt={dashboard.alt}
          title="Seet dashboard on demo data"
          subtitle="Screenshot from the app running locally"
          href={dashboard.src}
        >
          <DeviceFrame shot={dashboard} sizes="(max-width: 899px) 100vw, 36vw" label="Seet dashboard · demo data" />
          <span className="vb-proj-zoom-hint">Enlarge</span>
        </DocumentViewer>
        <figcaption>
          The dashboard I built, on its demo data: an ads manager&rsquo;s month, with confirmed
          bookings and ads already shown, in Arabic first.
        </figcaption>
      </figure>
      <Foot project={project} idea="A slot is held first. Only the deposit confirms it." />
    </Section>
  );
}

/* ---------- Kashta: one real night, scored by the app's own rules ---------- */

function Kashta() {
  const project = projectById.kashta;
  return (
    <Section id="kashta" scene={<KashtaScene />} layout="score">
      <Head project={project} />
      <div className="vb-proj-demo">
        <KashtaScoreDemo compact />
      </div>
      {project.coverPhone ? (
        <div className="vb-proj-art" aria-hidden="true">
          <Phone shot={project.coverPhone} sizes="240px" />
        </div>
      ) : null}
      <Foot project={project} idea="The score is code, not AI. Llama explains a ranking it never computes." />
    </Section>
  );
}

/* ---------- Amanah: the same claim, seen from each side ---------- */

function Amanah() {
  const project = projectById.amanah;
  const ownership = project.screens.find((shot) => shot.src.includes("ownership")) ?? project.cover;
  return (
    <Section id="amanah" scene={<AmanahScene />} layout="views">
      <Head project={project} />
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
      <Foot project={project} idea="One match, two different views." />
    </Section>
  );
}

/* ---------- Gthrz: a phone app, so phones lead ---------- */

function Gthrz() {
  const project = projectById.gthrz;
  const shots = [gthrzShots.home, gthrzShots.details, gthrzShots.privacy];
  return (
    <Section id="gthrz" scene={<GthrzScene />} layout="fan">
      <Head project={project} />
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
      <Foot project={project} idea="The host decides who sees the address, and when." />
    </Section>
  );
}

export function Covers() {
  return (
    <section id="work" className="vb-work" aria-labelledby="work-title">
      <div className="vb-work-head">
        <div className="vb-work-intro">
          <SectionTitle id="work-title" en="Six products." ar="أعمالي" />
          <Reveal delay={0.1}>
            <p className="vb-lead vb-work-lead">
              A ranch, a school, an ads inbox, a desert night, a lost umbrella and a private party.
              Each one: try the idea, see the real screen, and what I built.
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
