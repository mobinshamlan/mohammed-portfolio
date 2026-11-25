import Link from "next/link";
import { gthrzShots } from "@/lib/gthrz";
import type { Project } from "@/lib/projects";
import { GthrzStatesDemo } from "../demos/gthrz-states";
import { GthrzImg } from "../gthrz-img";
import { Reveal } from "../reveal";

export function GthrzWorld({ project }: { project: Project }) {
  const titleId = `proj-${project.id}`;

  return (
    <section id={project.id} className="pw-gthrz" aria-labelledby={titleId}>
      <div className="pw-inner pw-gthrz-layout">
        <header className="pw-head">
          <p className="pw-kind">{project.kind} · {project.dates}</p>
          <h3 id={titleId} className="pw-name">
            {project.name}{" "}
            {project.arabic ? <span lang="ar" dir="rtl">{project.arabic}</span> : null}
          </h3>
          <p className="pw-pitch">{project.tagline}</p>
        </header>

        <div className="pw-gthrz-stage">
          <div className="pw-gthrz-invite">
            <GthrzStatesDemo compact />
          </div>
          <Reveal className="pw-gthrz-stub">
            <p>Only approved guests see the exact location, when the host reveals it.</p>
          </Reveal>
          <div className="pw-gthrz-screens">
            <figure className="pw-gthrz-details">
              <GthrzImg shot={gthrzShots.details} sizes="(max-width: 849px) 104px, 190px" />
              <figcaption>{gthrzShots.details.caption}</figcaption>
            </figure>
            <figure className="pw-gthrz-planner">
              <GthrzImg shot={gthrzShots.plannerSuggestions} sizes="220px" />
              <figcaption>{gthrzShots.plannerSuggestions.caption}</figcaption>
            </figure>
          </div>
        </div>

        <footer className="pw-foot">
          <p className="pw-status">{project.statusChip}</p>
          <ul className="pw-gthrz-proof">
            {project.proof.notes.map((note) => <li key={note}>{note}</li>)}
          </ul>
          <p className="pw-contribution">{project.contribution}</p>
          <ul className="pw-links">
            {project.links.map(({ href, label }) => (
              <li key={href}><Link href={href} prefetch={false}>{label}</Link></li>
            ))}
            <li><Link href={project.href ?? `/projects/${project.id}`} prefetch={false}>Read the case study</Link></li>
          </ul>
          {project.linkNote ? <p>{project.linkNote}</p> : null}
        </footer>
      </div>
    </section>
  );
}
