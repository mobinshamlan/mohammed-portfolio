import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { fieldStyle, projectById, type Evidence, type Project, type ProjectId } from "@/lib/projects";
import { SeetChat } from "./artifacts";
import { CallDemo } from "./call-demo";
import { TammeniScheduleDemo } from "./demos/tammeni-schedule";
import { AmanahWorld } from "./worlds/amanah-world";
import { GthrzWorld } from "./worlds/gthrz-world";
import { KashtaWorld } from "./worlds/kashta-world";
import { Reveal } from "./reveal";
import {
  CallEndedSeam,
  LanternSeam,
  ReceiptSeam,
  StubSeam,
  TagSeam,
  TypingSeam,
} from "./seams";

/*
 * Every product is shown in its own world: its colours, its materials and the
 * one object it is about. What stays the same is the order inside each one:
 * kind and dates, the name in both scripts, the pitch, the working demo,
 * status and checked evidence, then the links. Between two worlds the colour
 * cuts hard, and one object sits on the line because it belongs to both
 * (seams.tsx); the seams stand between the sections, not inside them.
 */

function projectHref(project: Project) {
  return project.href ?? `/projects/${project.id}`;
}

/** The first clause of an evidence label, for the homepage; the full line is on the case page. */
function shortLabel(item: Evidence) {
  return item.label.split(/[:,.]/)[0].trim();
}

function Head({ project, line }: { project: Project; line?: ReactNode }) {
  return (
    <Reveal className="w-head">
      <p className="w-kind">
        {project.kind} · {project.dates}
      </p>
      <h3 id={`proj-${project.id}`} className="w-name">
        <Link href={projectHref(project)} prefetch={false}>
          <span className="w-name-en">{project.name}</span>
          {project.arabic ? <span lang="ar">{project.arabic}</span> : null}
        </Link>
      </h3>
      <p className="w-pitch">{project.tagline}</p>
      {line ? <p className="w-line">{line}</p> : null}
    </Reveal>
  );
}

/** Status in words, the checked numbers with their sources, and my part. */
function Proof({ project }: { project: Project }) {
  const evidence = project.proof.evidence ?? [];
  return (
    <Reveal className="w-proof" delay={0.14}>
      <p className="w-status">{project.statusChip}</p>
      {evidence.length > 0 ? (
        <ul className="w-ev" aria-label={`${project.name}, checked ${evidence[0].checked}`}>
          {evidence.map((item) => (
            <li key={item.kind}>
              <span className="w-ev-figure">{item.value}</span> <span className="w-ev-label">{shortLabel(item)}</span>
              <a
                className="w-ev-source"
                href={item.run?.href ?? item.source.href}
                target="_blank"
                rel="noreferrer"
              >
                {item.run ? `Passing CI run, ${item.run.date}` : `${item.source.label}, checked ${item.checked}`}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
      <p className="w-part">{project.contribution}</p>
    </Reveal>
  );
}

function Links({ project }: { project: Project }) {
  return (
    <Reveal className="w-links" delay={0.18}>
      <ul>
        <li>
          <Link href={projectHref(project)} prefetch={false} className="w-case">
            Read the case study<span className="vb-sr">: {project.name}</span>
          </Link>
        </li>
        {project.links.map((link) => (
          <li key={link.href}>
            {link.href.startsWith("/") ? (
              <Link href={link.href}>{link.label}</Link>
            ) : (
              <a href={link.href} target="_blank" rel="noreferrer">
                {link.label}
                <span className="vb-sr"> ({project.name})</span>
              </a>
            )}
          </li>
        ))}
      </ul>
      {project.linkNote ? <p className="w-linknote">{project.linkNote}</p> : null}
    </Reveal>
  );
}

function World({ id, children }: { id: ProjectId; children: ReactNode }) {
  const project = projectById[id];
  return (
    <article
      id={id}
      className="vb-world"
      data-id={id}
      data-light={project.light ? "true" : undefined}
      style={fieldStyle(project)}
      aria-labelledby={`proj-${id}`}
    >
      <div className="w-inner">{children}</div>
    </article>
  );
}

/* ---------- Naqah: the ranch at sunset, and the call it makes ---------- */

function Naqah() {
  const project = projectById.naqah;
  return (
    <World id="naqah">
      <div className="w-photo" aria-hidden="true">
        <Image src={project.cover.src} alt="" width={project.cover.width} height={project.cover.height} sizes="200vw" />
      </div>
      <Head
        project={project}
        line="The worker types nothing. A daily call asks the owner's questions, keeps the answers as records and throws the audio away."
      />
      <p className="w-motto" lang="ar">
        {project.arabicTagline}
      </p>
      <Reveal className="w-demo" delay={0.07}>
        <div className="w-callcard">
          <p className="w-callcard-bar" aria-hidden="true">
            <span className="w-callcard-dot" />
            Naqah is calling
            <span lang="ar">ناقة تتصل</span>
          </p>
          <CallDemo compact id="naqah-demo" />
        </div>
      </Reveal>
      <Proof project={project} />
      <Links project={project} />
    </World>
  );
}

/* ---------- Tammeni: the chalkboard, and one family's timetable ---------- */

function Tammeni() {
  const project = projectById.tammeni;
  const phone = project.screens.find((shot) => shot.src.endsWith("phone.jpg")) ?? project.coverPhone;
  return (
    <World id="tammeni">
      <Head project={project} line="Each parent chooses, per child and per topic, whether news comes by call or text, and when." />
      <figure className="w-chalk">
        <p lang="ar">{project.arabicTagline}</p>
        <figcaption>&ldquo;What happened with your kids today?&rdquo; Tammeni&rsquo;s own opening line.</figcaption>
      </figure>
      <Reveal className="w-demo" delay={0.07}>
        <TammeniScheduleDemo compact />
      </Reveal>
      <Reveal className="w-aside" delay={0.1}>
        <figure className="w-sms">
          <p className="w-sms-from">
            <span>Lulwa · Tammeni</span>
            <span>7:42 am</span>
          </p>
          <p lang="ar">صباح الخير، ريم وصلت المدرسة وسُجّل حضورها الساعة ٧:٣٠.</p>
          <p className="w-sms-en">Good morning, Reem arrived and was marked present at 7:30.</p>
          <figcaption>
            <span className="vb-demo-tag">Simulated</span>A text for an attendance rule. Fictional names.
          </figcaption>
        </figure>
        {phone ? (
          <div className="w-slim" aria-hidden="true">
            <Image src={phone.src} alt="" width={phone.width} height={phone.height} sizes="180px" />
          </div>
        ) : null}
      </Reveal>
      <Proof project={project} />
      <Links project={project} />
    </World>
  );
}

/* ---------- Seet: gold, and a WhatsApp thread in a dark phone ---------- */

function Seet() {
  const project = projectById.seet;
  return (
    <World id="seet">
      <Head project={project} line="A slot is held first. Only the deposit confirms it." />
      <p className="w-motto" lang="ar">
        {project.arabicTagline}
      </p>
      <Reveal className="w-demo" delay={0.07}>
        <div className="w-handset">
          <p className="w-handset-bar" aria-hidden="true">
            <span lang="ar">إعلانات</span>
            <span>Seet replies</span>
          </p>
          <SeetChat compact />
        </div>
      </Reveal>
      <Proof project={project} />
      <Links project={project} />
    </World>
  );
}

/* ---------- The experiment: a plain sheet, a smaller entry ---------- */

function Experiment() {
  const project = projectById.experiment;
  const previews = [
    { src: project.cover.src, label: "Version A: one prompt, one pass", width: 800, height: 2137 },
    { src: project.cover.src.replace("a-desktop", "b-desktop"), label: "Version B: this site", width: 800, height: 3333 },
  ];
  return (
    <aside className="vb-exp" data-id="experiment" aria-labelledby="exp-title" style={fieldStyle(project)}>
      <div className="vb-exp-copy">
        <p className="w-kind">The seventh project · {project.kind}</p>
        <h3 id="exp-title" className="vb-exp-name">
          <Link href={projectHref(project)} prefetch={false}>
            {project.name}
          </Link>
        </h3>
        <p className="vb-exp-tagline">{project.tagline}</p>
        <ul className="vb-exp-links">
          {project.links.map((link) => (
            <li key={link.href}>
              {link.href.startsWith("/") ? (
                <Link href={link.href} prefetch={false}>
                  {link.label}
                </Link>
              ) : (
                <a href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              )}
            </li>
          ))}
        </ul>
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
      <h2 id="work-title" className="vb-sr">
        Selected work
      </h2>
      <Naqah />
      <CallEndedSeam />
      <Tammeni />
      <TypingSeam />
      <Seet />
      <ReceiptSeam />
      <KashtaWorld project={projectById.kashta} />
      <LanternSeam />
      <AmanahWorld project={projectById.amanah} />
      <TagSeam />
      <GthrzWorld project={projectById.gthrz} />
      <StubSeam />
      <Experiment />
    </section>
  );
}
