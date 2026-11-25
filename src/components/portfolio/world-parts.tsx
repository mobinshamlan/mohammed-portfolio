import Link from "next/link";
import type { ReactNode } from "react";
import type { Evidence, Project } from "@/lib/projects";
import { Collapsible } from "./collapsible";
import { Reveal } from "./reveal";

/*
 * The order every product world shares, whatever it looks like: kind and
 * dates, the name in both scripts, the pitch (Head); the world's own demo;
 * status and checked evidence (Proof); then the links (Links). Each world
 * colours these through --field-ink, --field-muted, --accent and --pill.
 */

export function projectHref(project: Project) {
  return project.href ?? `/projects/${project.id}`;
}

/** The first clause of an evidence label, for the homepage; the full line is on the case page. */
function shortLabel(item: Evidence) {
  return item.label.split(/[:,.]/)[0].trim();
}

export function Head({ project, line }: { project: Project; line?: ReactNode }) {
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

/**
 * Status in words, then the checked figures as one line. The sources and my
 * part open beneath it: open on wide screens, one tap away on phones.
 */
export function Proof({ project }: { project: Project }) {
  const evidence = project.proof.evidence ?? [];
  return (
    <Reveal className="w-proof" delay={0.14}>
      <p className="w-status">{project.statusChip}</p>
      <Collapsible
        className="w-ev"
        summary={
          evidence.length > 0 ? (
            <span className="w-ev-figures">
              {evidence.map((item) => (
                <span key={item.kind}>
                  <strong className="w-ev-figure">{item.value}</strong> {shortLabel(item)}
                </span>
              ))}
            </span>
          ) : (
            "What I built"
          )
        }
      >
        {evidence.length > 0 ? (
          <ul className="w-ev-src" aria-label={`Sources, checked ${evidence[0].checked}`}>
            {evidence.map((item) => (
              <li key={item.kind}>
                {item.value} {shortLabel(item)}:{" "}
                <a href={item.run?.href ?? item.source.href} target="_blank" rel="noreferrer">
                  {item.run ? `passing CI run, ${item.run.date}` : `${item.source.label}, checked ${item.checked}`}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
        <p className="w-part">{project.contribution}</p>
      </Collapsible>
    </Reveal>
  );
}

export function Links({ project }: { project: Project }) {
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
