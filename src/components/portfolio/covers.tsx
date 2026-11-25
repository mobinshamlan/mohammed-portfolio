import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { fieldStyle, projectById, type ProjectId } from "@/lib/projects";
import { SeetChat } from "./artifacts";
import { CallDemo } from "./call-demo";
import { TammeniScheduleDemo } from "./demos/tammeni-schedule";
import { AmanahWorld } from "./worlds/amanah-world";
import { GthrzWorld } from "./worlds/gthrz-world";
import { KashtaWorld } from "./worlds/kashta-world";
import { Reveal } from "./reveal";
import { Head, Links, Proof, projectHref } from "./world-parts";
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
 * (seams.tsx); the seams stand between the sections, not inside them. The
 * shared parts live in world-parts.tsx; Kashta, Amanah and Gthrz are built
 * from them in worlds/.
 */

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
