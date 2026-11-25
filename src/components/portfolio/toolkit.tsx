"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { projectById, type ProjectId } from "@/lib/projects";
import { studied, testsChecked, toolkit, toolkitProjects } from "@/lib/toolkit";
import { useHydrated } from "@/lib/use-hydrated";
import { ChapterMark } from "./chapter-mark";
import { Collapsible } from "./collapsible";
import { Reveal } from "./reveal";

type Selection = ProjectId | "all";

function swatch(id: ProjectId) {
  return { "--swatch": projectById[id].field } as CSSProperties;
}

/** A state for CSS: on when the selection uses it, off when it does not, absent for "all". */
function lit(selected: Selection, projects: ProjectId[]) {
  if (selected === "all") {
    return undefined;
  }
  return projects.includes(selected) ? "on" : "off";
}

/** What I work with: the tools grouped by the job they did, and where. */
export function Toolkit() {
  // The project filter needs JavaScript; without it every job and project is still listed.
  const hydrated = useHydrated();
  const [selected, setSelected] = useState<Selection>("all");
  const project = selected === "all" ? null : projectById[selected];
  const used = project
    ? new Set(
        toolkit.flatMap((job) =>
          job.tools.filter((tool) => tool.projects.includes(project.id)).map((tool) => tool.name),
        ),
      ).size
    : 0;
  const total = toolkit.reduce((sum, job) => sum + job.tools.length, 0);

  return (
    <section id="skills" className="vb-tools" data-sel={selected} aria-labelledby="skills-title">
      <div className="vb-tools-head">
        <Reveal>
          <ChapterMark n={3} en="What I work with" ar="أدواتي" />
          <h2 id="skills-title" className="vb-section-head">
            What I work with.
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="vb-tools-lead">
            Grouped by the job each tool did, with the projects where I used it.
          </p>
        </Reveal>

        {hydrated ? (
          <div className="vb-tools-filter">
            <div className="vb-tools-picks" role="group" aria-label="Show the tools used in one project">
              <button
                type="button"
                className="vb-tools-pick"
                aria-pressed={selected === "all"}
                onClick={() => setSelected("all")}
              >
                All
              </button>
              {toolkitProjects.map((id) => (
                <button
                  key={id}
                  type="button"
                  className="vb-tools-pick"
                  aria-pressed={selected === id}
                  onClick={() => setSelected(id)}
                  style={swatch(id)}
                >
                  <span className="vb-tools-swatch" aria-hidden="true" />
                  {projectById[id].name}
                </button>
              ))}
            </div>
            <p className="vb-tools-note" aria-live="polite">
              {project ? (
                <>
                  {project.name} used {used} of these {total}.{" "}
                  <Link href={`/projects/${project.id}`} className="vb-link">
                    Read the case study
                  </Link>
                </>
              ) : (
                `${total} tools across ${toolkit.length} jobs. Pick a project to see its share.`
              )}
            </p>
          </div>
        ) : null}
      </div>

      <ol className="vb-tools-grid">
        {toolkit.map((job, index) => (
          <li
            key={job.id}
            className="vb-tools-job"
            data-wide={job.wide ? "true" : undefined}
            data-lit={lit(selected, job.projects)}
          >
            <p className="vb-tools-n" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 id={`tools-${job.id}`} className="vb-tools-title">
              {job.title}
            </h3>
            <p className="vb-tools-line">{job.line}</p>

            <ul className="vb-tools-names" aria-label="Tools">
              {job.tools.map((tool) => (
                <li key={tool.name} className="vb-tools-name" data-lit={lit(selected, tool.projects)}>
                  {tool.name}
                </li>
              ))}
            </ul>

            {job.notes ? (
              <ul className="vb-tools-notes">
                {job.notes.map((note) => (
                  <li
                    key={note.project}
                    className="vb-tools-how"
                    style={swatch(note.project)}
                    data-lit={lit(selected, [note.project])}
                  >
                    <a href={`#${note.project}`} className="vb-tools-proj">
                      <span className="vb-tools-swatch" aria-hidden="true" />
                      {projectById[note.project].name}
                    </a>
                    <span className="vb-tools-how-text">{note.text}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            {job.testCounts.length > 0 ? (
              <>
                <ul className="vb-tools-counts">
                  {job.testCounts.map((count) => (
                    <li
                      key={count.project}
                      className="vb-tools-count"
                      style={swatch(count.project)}
                      data-lit={lit(selected, [count.project])}
                    >
                      <span className="vb-tools-count-n">{count.value}</span>
                      <a href={`#${count.project}`} className="vb-tools-proj">
                        <span className="vb-tools-swatch" aria-hidden="true" />
                        {projectById[count.project].name}
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="vb-tools-small">
                  Passing tests in each public repository, counted on {testsChecked}.
                </p>
              </>
            ) : null}

            {job.notes || job.testCounts.length > 0 ? null : (
              <p className="vb-tools-where">
                <span className="vb-sr">Used in: </span>
                {job.projects.map((id) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    className="vb-tools-proj"
                    style={swatch(id)}
                    data-lit={lit(selected, [id])}
                  >
                    <span className="vb-tools-swatch" aria-hidden="true" />
                    {projectById[id].name}
                  </a>
                ))}
              </p>
            )}
          </li>
        ))}
      </ol>

      <Collapsible
        className="vb-tools-rest"
        summary={<span className="vb-tools-rest-summary">Studied, or still learning</span>}
      >
        <p className="vb-tools-small">Not tied to a project on this site.</p>
        <div className="vb-tools-rest-grid">
          {studied.groups.map((group) => (
            <div key={group.title}>
              <h3 className="vb-tools-rest-label">
                {group.title === "Coursework at QMUL" ? group.title : `${group.title}, studied or on my CV`}
              </h3>
              <p className="vb-tools-rest-list">{group.skills.join(" · ")}</p>
            </div>
          ))}
          <div>
            <h3 className="vb-tools-rest-label">Learning at the Tuwaiq Academy bootcamp</h3>
            <p className="vb-tools-rest-list">{studied.learning.join(" · ")}</p>
          </div>
        </div>
      </Collapsible>
    </section>
  );
}
