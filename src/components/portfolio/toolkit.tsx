"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { projectById, type ProjectId } from "@/lib/projects";
import { studied, testsChecked, toolkit, toolkitProjects, type ResolvedJob } from "@/lib/toolkit";
import { useHydrated } from "@/lib/use-hydrated";
import { SectionTitle } from "./section-title";

/*
 * What I can build: six outcomes, each shown through one product it lives in.
 * The example is visible by default; the other products are chips; the tool
 * names come last, small, for the people who want them.
 */

type Selection = ProjectId | "all";

function JobIcon({ id }: { id: string }) {
  const path: Record<string, React.ReactNode> = {
    ai: (
      <>
        <path d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2" />
        <circle cx="12" cy="12" r="3.2" />
      </>
    ),
    calls: (
      <path d="M5.5 4.5h3l1.6 4-2 1.3a10.5 10.5 0 0 0 5.6 5.6l1.3-2 4 1.6v3a1.5 1.5 0 0 1-1.6 1.5C9.9 19 5 14.1 4 6.1a1.5 1.5 0 0 1 1.5-1.6Z" />
    ),
    data: (
      <>
        <path d="M12 3.5 5 6.2v5.3c0 4.2 2.9 7.4 7 9 4.1-1.6 7-4.8 7-9V6.2L12 3.5Z" />
        <path d="M9.2 12.2l2 2 3.8-4" />
      </>
    ),
    web: (
      <>
        <rect x="3.5" y="5" width="17" height="14" rx="2" />
        <path d="M3.5 9h17M16.5 13.5h-9M10 11.5l-2.5 2 2.5 2" />
      </>
    ),
    mobile: (
      <>
        <rect x="7" y="3" width="10" height="18" rx="2.2" />
        <path d="M10.5 18h3" />
      </>
    ),
    tests: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="m8.3 12.3 2.5 2.5 5-5.2" />
      </>
    ),
  };
  return (
    <svg className="vb-tools-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {path[id]}
    </svg>
  );
}

function Mark({ id }: { id: ProjectId }) {
  const project = projectById[id];
  return (
    <span
      className="vb-tools-swatch"
      style={{ "--swatch": project.field } as CSSProperties}
      aria-hidden="true"
    />
  );
}

function SkillCard({ job, project }: { job: ResolvedJob; project: ProjectId | null }) {
  const notes = job.notes ?? [];
  const exampleId =
    project ?? (notes.find((note) => note.project === job.lead)?.project ?? notes[0]?.project ?? null);
  const example = notes.find((note) => note.project === exampleId) ?? null;
  const count = exampleId ? job.testCounts.find((item) => item.project === exampleId) : null;
  const others = job.projects.filter((id) => id !== exampleId);
  const tools = job.tools.filter((tool) => !project || tool.projects.includes(project));
  const exampleProject = exampleId ? projectById[exampleId] : null;

  return (
    <li className="vb-tools-card">
      <div className="vb-tools-card-head">
        <JobIcon id={job.id} />
        <h3 className="vb-tools-title">{job.title}</h3>
      </div>
      <p className="vb-tools-line">{job.line}</p>

      {exampleProject ? (
        <div
          className="vb-tools-example"
          style={{ "--swatch": exampleProject.field } as CSSProperties}
        >
          <a href={`#${exampleId}`} className="vb-tools-project">
            <Mark id={exampleId as ProjectId} />
            <span className="vb-tools-project-name">{exampleProject.name}</span>
            <span className="vb-tools-project-hint">See the chapter</span>
          </a>
          {example ? <p>{example.text}</p> : null}
          {count ? (
            <p className="vb-tools-count">
              <strong>{count.value}</strong> automated checks passed
              <span className="vb-tools-small"> · counted on {testsChecked}</span>
            </p>
          ) : null}
        </div>
      ) : null}

      {others.length && !project ? (
        <p className="vb-tools-also">
          <span className="vb-tools-also-label">Also in</span>
          {others.map((id) => (
            <a key={id} href={`#${id}`} className="vb-tools-chip">
              <Mark id={id} />
              {projectById[id].name}
            </a>
          ))}
        </p>
      ) : null}

      {tools.length ? (
        <details className="vb-tools-used">
          <summary className="vb-tools-also-label">Tools used</summary>
          <span>{tools.map((tool) => tool.name).join(" · ")}</span>
        </details>
      ) : null}
    </li>
  );
}

const subjectNames: Record<string, string> = {
  "Languages": "Programming languages",
  "Backend and data": "Data and behind-the-scenes tools",
  "Coursework at QMUL": "University coursework",
};

export function Toolkit() {
  const hydrated = useHydrated();
  const [selected, setSelected] = useState<Selection>("all");
  const project = selected === "all" ? null : projectById[selected];
  const jobs = project ? toolkit.filter((job) => job.projects.includes(project.id)) : toolkit;

  return (
    <section id="skills" className="vb-tools" aria-labelledby="skills-title">
      <div className="vb-tools-head">
        <SectionTitle id="skills-title" en="What I can build." />
        <p className="vb-tools-lead">
          Six things I do, each shown in a product where it already works.
        </p>
        {hydrated ? (
          <div className="vb-tools-filter" role="group" aria-labelledby="tools-filter-label">
            <span id="tools-filter-label" className="vb-tools-filter-label">Show by product</span>
            <div className="vb-tools-chips">
              <button
                type="button"
                className="vb-tools-chip vb-tools-chip-btn"
                aria-pressed={selected === "all"}
                onClick={() => setSelected("all")}
              >
                All
              </button>
              {toolkitProjects.map((id) => (
                <button
                  key={id}
                  type="button"
                  className="vb-tools-chip vb-tools-chip-btn"
                  aria-pressed={selected === id}
                  onClick={() => setSelected(id)}
                >
                  <Mark id={id} />
                  {projectById[id].name}
                </button>
              ))}
            </div>
            <p className="vb-tools-note" aria-live="polite">
              {project ? (
                <>
                  {jobs.length} of {toolkit.length} skills show up in {project.name}.{" "}
                  <Link href={`/projects/${project.id}`} className="vb-link">
                    Read the case study
                  </Link>
                </>
              ) : null}
            </p>
          </div>
        ) : null}
      </div>

      <div className="vb-tools-board">
        <ul className="vb-tools-list">
          {jobs.map((job) => (
            <SkillCard key={job.id} job={job} project={project?.id ?? null} />
          ))}
        </ul>
        <details className="vb-details vb-tools-rest">
          <summary className="vb-details-summary">Other training and coursework</summary>
          <div className="vb-details-body vb-tools-rest-grid">
            {studied.groups.map((group) => (
              <div key={group.title}>
                <h3 className="vb-tools-rest-label">{subjectNames[group.title] ?? group.title}</h3>
                <p>{group.skills.join(" · ")}</p>
              </div>
            ))}
            <div>
              <h3 className="vb-tools-rest-label">Currently learning at Tuwaiq Academy</h3>
              <p>Writing clearer instructions for AI and checking its answers.</p>
              <p className="vb-tools-small">{studied.learning.join(" · ")}</p>
            </div>
          </div>
        </details>
      </div>
    </section>
  );
}
