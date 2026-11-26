import type { CSSProperties } from "react";
import { projectById } from "@/lib/projects";
import { toolkit, toolkitTools } from "@/lib/toolkit";

/** The product's own colour, or its accent where the field is too dark to see on navy. */
function markOf(id: keyof typeof projectById) {
  const project = projectById[id];
  return ["tammeni", "kashta", "gthrz"].includes(id) ? project.accent : project.field;
}

export function Toolkit() {
  return (
    <section id="skills" className="vb-tools" aria-labelledby="skills-title">
      <div className="vb-tools-heading">
        <h2 id="skills-title" className="vb-section-head vb-tools-title">
          Skills
        </h2>
        <p className="vb-tools-lead">
          From camel ranch calls to private events.
        </p>
      </div>

      <div className="vb-tools-index">
        <ul className="vb-tools-list" role="list">
          {toolkit.map(({ project: id, title, example }) => (
            <li key={id} style={{ "--mark": markOf(id) } as CSSProperties}>
              <a
                className="vb-tools-chapter"
                href={`#${id}`}
                aria-labelledby={`skill-${id}-title skill-${id}-project`}
                aria-describedby={`skill-${id}-example`}
              >
                <h3 id={`skill-${id}-title`}>{title}</h3>
                <p id={`skill-${id}-example`}>{example}</p>
                <span className="vb-tools-project">
                  <span id={`skill-${id}-project`}>{projectById[id].name}</span>
                  <svg
                    className="vb-tools-arrow"
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M8 13V3M4 7l4-4 4 4" />
                  </svg>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <details className="vb-details vb-tools-stack">
          <summary className="vb-details-summary">Tools I used</summary>
          <dl className="vb-tools-stack-list">
            {toolkitTools.map(({ title, names }) => (
              <div key={title}>
                <dt>{title}</dt>
                <dd>{names.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </details>
      </div>
    </section>
  );
}
