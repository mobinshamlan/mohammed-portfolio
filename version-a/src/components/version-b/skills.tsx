"use client";

import Link from "next/link";
import { useState } from "react";
import { gthrzRepo } from "@/lib/gthrz";
import { skillGroups, skillProjects, type SkillProjectId } from "@/lib/skills";
import { Reveal } from "./reveal";

type Selection = SkillProjectId | "all";

export function VersionBSkills() {
  const [selected, setSelected] = useState<Selection>("all");
  const project = skillProjects.find((item) => item.id === selected);

  return (
    <section
      id="skills"
      className="vb-sk"
      data-sel={selected}
      aria-labelledby="sk-title"
    >
      <div className="vb-sk-side">
        <Reveal>
          <p className="vb-kicker">04 / Skills</p>
          <h2 id="sk-title" className="vb-sk-title">
            What I work with.
          </h2>
        </Reveal>

        <div
          className="vb-sk-switch"
          role="group"
          aria-label="Show skills used in a project"
        >
          <button
            type="button"
            className="vb-sk-pick"
            aria-pressed={selected === "all"}
            onClick={() => setSelected("all")}
          >
            All skills
          </button>
          {skillProjects.map((item) => (
            <button
              key={item.id}
              type="button"
              className="vb-sk-pick"
              aria-pressed={selected === item.id}
              onClick={() => setSelected(item.id)}
            >
              {item.name}
            </button>
          ))}
        </div>

        <div className="vb-sk-note" aria-live="polite">
          {project ? (
            <>
              <p>{project.note}</p>
              <p className="vb-sk-legend">
                Highlighted: technologies used in {project.name}.
              </p>
              {project.href ? (
                project.external ? (
                  <a
                    href={project.href}
                    className="vb-text-link"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {project.linkLabel ?? "View on GitHub"}
                  </a>
                ) : (
                  <Link href={project.href} className="vb-text-link">
                    {project.linkLabel ?? "Read the case study"}
                  </Link>
                )
              ) : null}
              {project.id === "gthrz" ? (
                <a
                  href={gthrzRepo}
                  className="vb-text-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  View on GitHub
                </a>
              ) : null}
            </>
          ) : (
            <ul className="vb-sk-keys">
              <li>
                <span className="vb-sk-key" aria-hidden="true" />
                Used in Gthrz or Amanah. Choose a project to see which.
              </li>
              <li>
                <span
                  className="vb-sk-key vb-sk-key-learn"
                  aria-hidden="true"
                />
                Currently learning at Tuwaiq Academy.
              </li>
              <li>
                <span
                  className="vb-sk-key vb-sk-key-course"
                  aria-hidden="true"
                />
                Studied in my Computer Science degree.
              </li>
            </ul>
          )}
        </div>
      </div>

      <div className="vb-sk-groups">
        {skillGroups.map((group, groupIndex) => (
          <div
            key={group.title}
            className="vb-sk-group"
            data-coursework={group.coursework ? "true" : undefined}
          >
            <h3 className="vb-sk-label">{group.title}</h3>
            <ul className="vb-sk-words">
              {group.skills.map((skill, index) => (
                <li
                  key={skill.name}
                  className="vb-sk-word"
                  data-p={skill.projects?.join(" ")}
                  data-learning={skill.learning ? "true" : undefined}
                  style={{
                    transitionDelay: `${(groupIndex * 3 + index) * 18}ms`,
                  }}
                >
                  {skill.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
