"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { projects, type ProjectId } from "@/lib/projects";
import { skillGroups, type Skill } from "@/lib/skills";
import { useHydrated } from "@/lib/use-hydrated";

type Selection =
  | { kind: "project"; id: ProjectId }
  | { kind: "tool"; name: string }
  | null;

const used = (skill: Skill) => (skill.projects?.length ?? 0) > 0;
const allSkills = skillGroups.flatMap((group) => group.skills);
const usedCount = allSkills.filter(used).length;
const restCount = allSkills.length - usedCount;

/** Projects that at least one tool maps to, in portfolio order, with their tools. */
const builtWith = projects
  .map((project) => ({
    project,
    tools: allSkills.filter((skill) => skill.projects?.includes(project.id)),
  }))
  .filter((entry) => entry.tools.length > 0);

/** Areas in three columns of similar height on wide screens; reading order stays by column. */
const columns = [
  ["Languages", "Web and mobile"],
  ["Backend and data", "Tools and testing"],
  ["AI", "Coursework at QMUL"],
].map((titles) => skillGroups.filter((group) => titles.includes(group.title)));

const nameOf = (id: ProjectId) => projects.find((item) => item.id === id)?.name ?? id;

const keyOf = (selection: Selection) =>
  selection ? (selection.kind === "project" ? selection.id : `tool:${selection.name}`) : "";

function list(words: string[]) {
  if (words.length < 2) {
    return words.join("");
  }
  return `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`;
}

export function Skills() {
  const hydrated = useHydrated();
  const [selected, setSelected] = useState<Selection>(null);
  const map = useRef<HTMLDetailsElement>(null);

  // The full map is open in the static HTML; phones fold it once the page runs.
  useEffect(() => {
    if (map.current && !window.matchMedia("(min-width: 900px)").matches) {
      map.current.open = false;
    }
  }, []);

  const pickedProject = selected?.kind === "project" ? selected.id : null;
  const pickedTool =
    selected?.kind === "tool"
      ? allSkills.find((skill) => skill.name === selected.name)
      : undefined;
  const entry = builtWith.find((item) => item.project.id === pickedProject);

  // Picking the same project or tool again clears the selection.
  function toggle(next: NonNullable<Selection>) {
    setSelected((current) => (keyOf(current) === keyOf(next) ? null : next));
  }

  return (
    <section
      id="skills"
      className="vb-skills cr-skills"
      data-picked={selected?.kind}
      aria-labelledby="skills-title"
    >
      <div className="cr-skills-side">
        <h2 id="skills-title" className="vb-section-head cr-head">
          What I work with.
        </h2>

        {hydrated ? (
          <>
            <div className="cr-picker" role="group" aria-label="Show the tools a project used">
              {builtWith.map(({ project, tools }) => (
                <button
                  key={project.id}
                  type="button"
                  className="cr-pick"
                  aria-pressed={pickedProject === project.id}
                  data-lit={
                    pickedTool?.projects?.includes(project.id) ? "true" : undefined
                  }
                  onClick={() => toggle({ kind: "project", id: project.id })}
                >
                  {project.name}
                  <span className="cr-pick-count">
                    {tools.length}
                    <span className="vb-sr"> tools</span>
                  </span>
                </button>
              ))}
            </div>

            <p className="cr-note" aria-live="polite">
              {entry ? (
                <>
                  <strong>{entry.project.name}</strong> used {entry.tools.length} of them:{" "}
                  {entry.tools.map((tool) => tool.name).join(" · ")}.{" "}
                  <Link href={`/projects/${entry.project.id}`} className="cr-note-link">
                    Read the case study
                  </Link>
                </>
              ) : pickedTool ? (
                <>
                  <strong>{pickedTool.name}</strong> was used in{" "}
                  {list((pickedTool.projects ?? []).map(nameOf))}.
                </>
              ) : (
                <>
                  {usedCount} tools across {builtWith.length} projects, {restCount} more
                  learned or studied. Pick a project or a tool to trace it.
                </>
              )}
            </p>
          </>
        ) : (
          <p className="cr-note">
            Each tool lists the projects that used it. {restCount} more are
            learned or studied, and labelled that way.
          </p>
        )}
      </div>

      <details ref={map} className="cr-map" open>
        <summary className="vb-details-summary cr-map-summary">
          All {allSkills.length} tools, by area
        </summary>
        <div className="cr-areas">
          {columns.map((column, index) => (
            <div key={index} className="cr-column">
              {column.map((group) => {
                const tools = group.skills.filter(used);
                const learning = group.skills.filter((skill) => skill.learning);
                const rest = group.skills.filter((skill) => !used(skill) && !skill.learning);
                return (
                  <div key={group.title} className="cr-area">
                    <h3 className="cr-area-title">{group.title}</h3>
                    {tools.length > 0 ? (
                      <ul className="cr-tools">
                        {tools.map((skill) => {
                          const lit = pickedProject
                            ? skill.projects?.includes(pickedProject)
                            : pickedTool?.name === skill.name;
                          const body = (
                            <>
                              <span className="cr-tool-name">{skill.name}</span>
                              <span className="cr-tool-projects">
                                {skill.projects?.map((id) => (
                                  <span
                                    key={id}
                                    data-on={pickedProject === id ? "true" : undefined}
                                  >
                                    {nameOf(id)}
                                  </span>
                                ))}
                              </span>
                            </>
                          );
                          return (
                            <li key={skill.name} data-lit={lit ? "true" : undefined}>
                              {hydrated ? (
                                <button
                                  type="button"
                                  className="cr-tool"
                                  aria-pressed={pickedTool?.name === skill.name}
                                  onClick={() => toggle({ kind: "tool", name: skill.name })}
                                >
                                  {body}
                                </button>
                              ) : (
                                <div className="cr-tool">{body}</div>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                    {learning.length > 0 ? (
                      <p className="cr-rest" data-learning="true">
                        <span className="cr-rest-label">Learning now at Tuwaiq Academy</span>
                        {learning.map((skill) => skill.name).join(" · ")}
                      </p>
                    ) : null}
                    {rest.length > 0 ? (
                      <p className="cr-rest">
                        <span className="cr-rest-label">{group.restLabel}</span>
                        {rest.map((skill) => skill.name).join(" · ")}
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </details>
    </section>
  );
}
