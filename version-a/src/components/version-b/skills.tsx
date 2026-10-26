"use client";

import Link from "next/link";
import { useState } from "react";
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
                <Link href={project.href} className="vb-text-link">
                  Read the case study
                </Link>
              ) : null}
            </>
          ) : (
            <p className="vb-sk-legend">
              <span className="vb-sk-key" aria-hidden="true" />
              Marked skills were used in one of these projects. Choose a project
              to see which.
            </p>
          )}
        </div>
      </div>

      <div className="vb-sk-groups">
        {skillGroups.map((group, groupIndex) => (
          <div key={group.title} className="vb-sk-group">
            <h3 className="vb-sk-label">{group.title}</h3>
            <ul className="vb-sk-words">
              {group.skills.map((skill, index) => (
                <li
                  key={skill.name}
                  className="vb-sk-word"
                  data-p={skill.projects?.join(" ")}
                  style={{
                    transitionDelay: `${(groupIndex * 3 + index) * 18}ms`,
                  }}
                >
                  {skill.name}
                  {skill.detail ? (
                    <span className="vb-sk-detail">{skill.detail}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
