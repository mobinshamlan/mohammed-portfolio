"use client";

import Link from "next/link";
import { useState, type CSSProperties, type ReactNode } from "react";
import { projectById, type ProjectId } from "@/lib/projects";
import { studied, testsChecked, toolkit, toolkitProjects, type ResolvedJob } from "@/lib/toolkit";
import { useHydrated } from "@/lib/use-hydrated";
import { SectionTitle } from "./section-title";

type Selection = ProjectId | "all";

/** The project's field colour, and its column in the ledger on wide screens. */
function cellStyle(id: ProjectId) {
  return {
    "--swatch": projectById[id].field,
    "--col": toolkitProjects.indexOf(id) + 1,
  } as CSSProperties;
}

/** On when the selection is this project, off when another is selected, absent for "all". */
function lit(selected: Selection, id: ProjectId) {
  if (selected === "all") {
    return undefined;
  }
  return selected === id ? "on" : "off";
}

/** One project in a row: its swatch and name, with the test count where the row has one. */
function Cell({ job, id, selected, link }: { job: ResolvedJob; id: ProjectId; selected: Selection; link: boolean }) {
  const count = job.testCounts.find((item) => item.project === id);
  const body: ReactNode = (
    <>
      {count ? <span className="vb-tools-count">{count.value}</span> : null}
      <span className="vb-tools-cell-name">
        <span className="vb-tools-swatch" aria-hidden="true" />
        <span className="vb-tools-cell-label">{projectById[id].name}</span>
      </span>
    </>
  );
  return link ? (
    <a href={`#${id}`} className="vb-tools-cell" style={cellStyle(id)} data-lit={lit(selected, id)}>
      {body}
    </a>
  ) : (
    <span className="vb-tools-cell" style={cellStyle(id)}>
      {body}
    </span>
  );
}

/** What I work with: one row per skill, with the tools and the projects that show it. */
export function Toolkit() {
  // The project filter needs JavaScript; without it every job and project is still listed.
  const hydrated = useHydrated();
  const [selected, setSelected] = useState<Selection>("all");
  // Phones start with the first three skills; the rest open on request.
  const [showAll, setShowAll] = useState(false);
  const project = selected === "all" ? null : projectById[selected];
  const total = toolkit.reduce((sum, job) => sum + job.tools.length, 0);
  const used = project
    ? toolkit.reduce((sum, job) => sum + job.tools.filter((tool) => tool.projects.includes(project.id)).length, 0)
    : 0;
  // A selected project lists only the jobs it took part in.
  const jobs = project ? toolkit.filter((job) => job.projects.includes(project.id)) : toolkit;

  return (
    <section id="skills" className="vb-tools" data-sel={selected} aria-labelledby="skills-title">
      <div className="vb-tools-head">
        <SectionTitle id="skills-title" en="What I work with." />
        <p className="vb-tools-lead">One row per skill: what I did with it, the tools, and the projects that show it.</p>

        {hydrated ? (
          <div className="vb-tools-filter">
            <div className="vb-tools-picks" role="group" aria-label="Show one project's tools">
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
                  style={cellStyle(id)}
                >
                  <span className="vb-tools-swatch" aria-hidden="true" />
                  {projectById[id].name}
                </button>
              ))}
            </div>
            <p className="vb-tools-note" aria-live="polite">
              {project ? (
                <>
                  {project.name} used {used} of these {total} tools.{" "}
                  <Link href={`/projects/${project.id}`} className="vb-link">
                    Read the case study
                  </Link>
                </>
              ) : (
                `${total} tools across ${toolkit.length} skills. Pick a project to see what it used.`
              )}
            </p>
          </div>
        ) : null}
      </div>

      <div className="vb-tools-ledger">
        <div className="vb-tools-cols" aria-hidden="true">
          <span>The job</span>
          <span>Tools</span>
          <span className="vb-tools-cols-projects">
            {toolkitProjects.map((id) => (
              <span key={id} style={cellStyle(id)} data-lit={lit(selected, id)}>
                {projectById[id].name}
              </span>
            ))}
          </span>
        </div>

        <ul className="vb-tools-rows" data-collapsed={hydrated && !project && !showAll ? "true" : undefined}>
          {jobs.map((job) => {
            const tools = project ? job.tools.filter((tool) => tool.projects.includes(project.id)) : job.tools;
            const note = project ? job.notes?.find((item) => item.project === project.id) : undefined;
            // In "all", a row with notes opens them from its projects; a selected project shows its note in place.
            const fold = !project && job.notes;

            return (
              <li key={job.id} className="vb-tools-row" aria-labelledby={`tools-${job.id}`}>
                <div className="vb-tools-job">
                  <h3 id={`tools-${job.id}`} className="vb-tools-title">
                    {job.title}
                  </h3>
                  <p className="vb-tools-line">{job.line}</p>
                  {note ? (
                    <p className="vb-tools-how" style={cellStyle(note.project)}>
                      <span className="vb-tools-swatch" aria-hidden="true" />
                      <span>{note.text}</span>
                    </p>
                  ) : null}
                </div>

                <ul className="vb-tools-names" aria-label={`Tools for ${job.title.toLowerCase()}`}>
                  {tools.map((tool) => (
                    <li key={tool.name} className="vb-tools-name">
                      {tool.name}
                    </li>
                  ))}
                </ul>

                {fold ? (
                  <details className="vb-tools-fold">
                    <summary className="vb-tools-cells vb-tools-fold-summary">
                      <span className="vb-sr">How each project used them: </span>
                      {job.projects.map((id) => (
                        <Cell key={id} job={job} id={id} selected={selected} link={false} />
                      ))}
                      <span className="vb-tools-chev" aria-hidden="true" />
                    </summary>
                    <ul className="vb-tools-notes">
                      {job.notes?.map((item) => (
                        <li key={item.project} className="vb-tools-how" style={cellStyle(item.project)}>
                          <a href={`#${item.project}`} className="vb-tools-how-proj">
                            <span className="vb-tools-swatch" aria-hidden="true" />
                            {projectById[item.project].name}
                          </a>
                          <span>{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : (
                  <p className="vb-tools-cells">
                    <span className="vb-sr">Used in: </span>
                    {job.projects.map((id) => (
                      <Cell key={id} job={job} id={id} selected={selected} link />
                    ))}
                    {job.testCounts.length > 0 ? (
                      <span className="vb-tools-cells-note">Passing tests in each public repository, counted on {testsChecked}.</span>
                    ) : null}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
        {hydrated && !project && !showAll ? (
          <button type="button" className="vb-btn vb-btn-quiet vb-tools-more" onClick={() => setShowAll(true)}>
            Show the other {toolkit.length - 3} skills
          </button>
        ) : null}
      </div>

      <details className="vb-details vb-tools-rest">
        <summary className="vb-details-summary vb-tools-rest-summary">Studied, or still learning</summary>
        <div className="vb-details-body">
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
        </div>
      </details>
    </section>
  );
}
