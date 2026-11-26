"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { projectById, type ProjectId } from "@/lib/projects";
import {
  featuredJobId,
  studied,
  testsChecked,
  toolkit,
  toolkitProjects,
  type ResolvedJob,
} from "@/lib/toolkit";
import { useHydrated } from "@/lib/use-hydrated";
import { SectionTitle } from "./section-title";

/*
 * What I can build: one capability shown large, with the product it lives in
 * and a small picture of it working; the other five as a ledger of rows.
 * Every row keeps its example visible; tool names wait behind a toggle.
 */

type Selection = ProjectId | "all";

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

/** Which product's note a job shows, honouring the filter, then the lead. */
function pickExample(job: ResolvedJob, project: ProjectId | null) {
  const notes = job.notes ?? [];
  const id = project ?? (notes.find((note) => note.project === job.lead)?.project ?? notes[0]?.project ?? null);
  const note = notes.find((item) => item.project === id) ?? null;
  const count = id ? (job.testCounts.find((item) => item.project === id) ?? null) : null;
  return { id, note, count };
}

function ToolsUsed({ job, project }: { job: ResolvedJob; project: ProjectId | null }) {
  const tools = job.tools.filter((tool) => !project || tool.projects.includes(project));
  if (!tools.length) return null;
  return (
    <details className="vb-tools-used">
      <summary className="vb-tools-also-label">Tools used</summary>
      <span>{tools.map((tool) => tool.name).join(" · ")}</span>
    </details>
  );
}

function AlsoIn({ ids }: { ids: ProjectId[] }) {
  if (!ids.length) return null;
  return (
    <p className="vb-tools-also">
      <span className="vb-tools-also-label">Also in</span>
      {ids.map((id, index) => (
        <span key={id}>
          <a href={`#${id}`} className="vb-tools-also-link">
            <Mark id={id} />
            {projectById[id].name}
          </a>
          {index < ids.length - 1 ? ", " : null}
        </span>
      ))}
    </p>
  );
}

/* The featured picture: Naqah's morning call, drawn as a call sheet. The
   Arabic is sample product content, the worker's answer. */
function CallSheet() {
  const bars = [3, 6, 10, 7, 12, 9, 5, 8, 11, 6, 4, 9, 7, 3, 6, 10, 5, 8, 4, 7, 11, 6, 3, 5];
  return (
    <figure className="vb-tools-call" aria-label="Sample: Naqah's 5:40 pm call to the ranch worker, in Arabic">
      <div className="vb-tools-call-head">
        <span className="vb-tools-call-dot" aria-hidden="true" />
        <span className="vb-tools-call-time">5:40 pm</span>
        <span className="vb-tools-call-who">Naqah calls the ranch worker</span>
        <span className="vb-tools-call-sample">Sample</span>
      </div>
      <div className="vb-tools-call-wave" aria-hidden="true">
        {bars.map((h, index) => (
          <i key={index} style={{ "--h": h, "--i": index } as CSSProperties} />
        ))}
      </div>
      <dl className="vb-tools-call-qa">
        <div>
          <dt>Asked</dt>
          <dd>Did all the camels drink today?</dd>
        </div>
        <div>
          <dt>Answer</dt>
          <dd lang="ar" dir="rtl">
            كلها شربت إلا وضحى.
          </dd>
        </div>
      </dl>
      <figcaption className="vb-tools-call-foot">
        <span className="vb-tools-call-saved">Answer saved for the owner</span>
        <span className="vb-tools-call-gone">Audio discarded</span>
      </figcaption>
    </figure>
  );
}

function Featured({ job, project }: { job: ResolvedJob; project: ProjectId | null }) {
  const { id, note, count } = pickExample(job, project);
  const exampleProject = id ? projectById[id] : null;
  const others = project ? [] : job.projects.filter((item) => item !== id);
  return (
    <article
      className="vb-tools-feature"
      style={exampleProject ? ({ "--swatch": exampleProject.field } as CSSProperties) : undefined}
    >
      <div className="vb-tools-feature-text">
        <p className="vb-tools-kicker">Featured</p>
        <h3 className="vb-tools-feature-title">{job.title}</h3>
        <p className="vb-tools-line">{job.line}</p>
        {exampleProject && id ? (
          <div className="vb-tools-example">
            <a href={`#${id}`} className="vb-tools-project">
              <Mark id={id} />
              <span className="vb-tools-project-name">{exampleProject.name}</span>
              <span className="vb-tools-project-hint">See the chapter</span>
            </a>
            {note ? <p>{note.text}</p> : null}
            {count ? (
              <p className="vb-tools-count">
                <strong>{count.value}</strong> automated checks passed
                <span className="vb-tools-small"> · counted on {testsChecked}</span>
              </p>
            ) : null}
          </div>
        ) : null}
        <AlsoIn ids={others} />
        <ToolsUsed job={job} project={project} />
      </div>
      {job.id === "calls" ? <CallSheet /> : null}
    </article>
  );
}

function Row({ job, project, index }: { job: ResolvedJob; project: ProjectId | null; index: number }) {
  const { id, note, count } = pickExample(job, project);
  const exampleProject = id ? projectById[id] : null;
  const others = project ? [] : job.projects.filter((item) => item !== id);
  return (
    <li
      className="vb-tools-row"
      style={exampleProject ? ({ "--swatch": exampleProject.field } as CSSProperties) : undefined}
    >
      <span className="vb-tools-row-n" aria-hidden="true">
        {String(index).padStart(2, "0")}
      </span>
      <div className="vb-tools-row-what">
        <h3 className="vb-tools-row-title">{job.title}</h3>
        <p className="vb-tools-line">{job.line}</p>
      </div>
      <div className="vb-tools-row-example">
        {exampleProject && id ? (
          <a href={`#${id}`} className="vb-tools-project">
            <Mark id={id} />
            <span className="vb-tools-project-name">{exampleProject.name}</span>
            <span className="vb-tools-project-hint">See the chapter</span>
          </a>
        ) : null}
        {note ? <p>{note.text}</p> : null}
        {count ? (
          <p className="vb-tools-count">
            <strong>{count.value}</strong> automated checks passed
            <span className="vb-tools-small"> · counted on {testsChecked}</span>
          </p>
        ) : null}
        <AlsoIn ids={others} />
        <ToolsUsed job={job} project={project} />
      </div>
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
  // Featured: the phone-call job by default; under a filter, the job that
  // leads with that product, else the first match.
  const featured =
    (project
      ? (jobs.find((job) => job.lead === project.id) ?? jobs[0])
      : jobs.find((job) => job.id === featuredJobId)) ?? null;
  const rows = jobs.filter((job) => job !== featured);

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
        {featured ? <Featured job={featured} project={project?.id ?? null} /> : null}
        {rows.length ? (
          <ol className="vb-tools-ledger">
            {rows.map((job, index) => (
              <Row key={job.id} job={job} project={project?.id ?? null} index={index + 2} />
            ))}
          </ol>
        ) : null}
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
