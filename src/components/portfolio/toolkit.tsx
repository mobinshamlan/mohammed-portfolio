"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { projectById, type ProjectId } from "@/lib/projects";
import { studied, testsChecked, toolkit, toolkitProjects, type ResolvedJob } from "@/lib/toolkit";
import { useHydrated } from "@/lib/use-hydrated";
import { SectionTitle } from "./section-title";

type Selection = ProjectId | "all";

function ProjectExample({ id }: { id: ProjectId }) {
  const project = projectById[id];
  return (
    <a href={`#${id}`} className="vb-tools-project">
      <span
        className="vb-tools-swatch"
        style={{ "--swatch": project.field } as CSSProperties}
        aria-hidden="true"
      />
      {project.name}
    </a>
  );
}

function SkillEntry({ job, project }: { job: ResolvedJob; project: ProjectId | null }) {
  const projects = project ? [project] : job.projects;
  const notes = job.notes?.filter((note) => projects.includes(note.project)) ?? [];
  const tools = job.tools.filter((tool) => !project || tool.projects.includes(project));
  const testCounts = job.testCounts.filter((count) => projects.includes(count.project));

  return (
    <li className="vb-tools-entry">
      <h3 className="vb-tools-title">{job.title}</h3>
      <p className="vb-tools-line">{job.line}</p>
      <details className="vb-tools-fold">
        <summary className="vb-tools-fold-summary">Tools and examples</summary>
        <div className="vb-tools-fold-body">
          <ul className="vb-tools-examples">
            {projects.map((id) => {
              const note = notes.find((item) => item.project === id);
              const count = testCounts.find((item) => item.project === id);
              return (
                <li key={id}>
                  <ProjectExample id={id} />
                  {note ? <p>{note.text}</p> : null}
                  {count ? <p>{count.value} automated checks passed</p> : null}
                </li>
              );
            })}
          </ul>
          {testCounts.length ? (
            <p className="vb-tools-small">Checks counted on {testsChecked}.</p>
          ) : null}
          {tools.length ? (
            <p className="vb-tools-used">
              <strong>Tools</strong>
              <span>{tools.map((tool) => tool.name).join(" · ")}</span>
            </p>
          ) : null}
        </div>
      </details>
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
        {hydrated ? (
          <div className="vb-tools-filter">
            <label htmlFor="tools-project">Show skills by project</label>
            <select
              id="tools-project"
              value={selected}
              onChange={(event) => setSelected(event.currentTarget.value as Selection)}
            >
              <option value="all">All projects</option>
              {toolkitProjects.map((id) => (
                <option key={id} value={id}>{projectById[id].name}</option>
              ))}
            </select>
            <p className="vb-tools-note" aria-live="polite">
              {project ? (
                <>
                  {jobs.length} {jobs.length === 1 ? "skill" : "skills"} used in {project.name}.{" "}
                  <Link href={`/projects/${project.id}`} className="vb-link">
                    See the project
                  </Link>
                </>
              ) : null}
            </p>
          </div>
        ) : null}
      </div>

      <div className="vb-tools-catalogue">
        <ul className="vb-tools-list">
          {jobs.map((job) => (
            <SkillEntry key={job.id} job={job} project={project?.id ?? null} />
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
