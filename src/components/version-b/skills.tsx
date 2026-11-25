"use client";

import Link from "next/link";
import { useState } from "react";
import { projects, type ProjectId } from "@/lib/projects";
import { skillGroups } from "@/lib/skills";
import { Collapsible } from "./collapsible";
import { Reveal } from "./reveal";

type Selection = ProjectId | "all";

export function VersionBSkills() {
  const [selected, setSelected] = useState<Selection>("all");
  const project = projects.find((item) => item.id === selected);
  const count =
    selected === "all"
      ? null
      : skillGroups.reduce(
          (sum, group) =>
            sum +
            group.skills.filter((skill) => skill.projects?.includes(selected))
              .length,
          0,
        );

  return (
    <section
      id="skills"
      className="vb-skills"
      data-sel={selected}
      aria-labelledby="skills-title"
    >
      <div className="vb-skills-side">
        <Reveal>
          <h2 id="skills-title" className="vb-section-head">
            What I work with.
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="vb-lead">
            Pick a project to light up the tools it was built with. The rest
            come from the degree, the bootcamp, or the CV.
          </p>
        </Reveal>

        <div
          className="vb-skills-switch"
          role="group"
          aria-label="Show skills used in a project"
        >
          <button
            type="button"
            className="vb-skills-pick"
            aria-pressed={selected === "all"}
            onClick={() => setSelected("all")}
          >
            All
          </button>
          {projects.map((item) => (
            <button
              key={item.id}
              type="button"
              className="vb-skills-pick"
              aria-pressed={selected === item.id}
              onClick={() => setSelected(item.id)}
            >
              {item.name}
            </button>
          ))}
        </div>

        <p className="vb-skills-note" aria-live="polite">
          {project ? (
            <>
              {count} tools lit for {project.name}.{" "}
              <Link href={`/projects/${project.id}`} className="vb-link">
                Read the case study
              </Link>
            </>
          ) : (
            "Lit words were used in a project I built. Dimmer ones are learned or studied."
          )}
        </p>
      </div>

      <Collapsible
        className="vb-skills-groups"
        summary={<span className="vb-skills-summary">All the tools, by group</span>}
      >
        {skillGroups.map((group) => (
          <div key={group.title} className="vb-skills-group">
            <h3 className="vb-skills-label">{group.title}</h3>
            <ul className="vb-skills-words">
              {group.skills.map((skill) => {
                const used = skill.projects && skill.projects.length > 0;
                const lit =
                  selected === "all"
                    ? used
                    : skill.projects?.includes(selected) ?? false;
                return (
                  <li
                    key={skill.name}
                    className="vb-skills-word"
                    data-lit={lit ? "true" : undefined}
                    data-learning={skill.learning ? "true" : undefined}
                  >
                    {skill.name}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </Collapsible>
    </section>
  );
}
