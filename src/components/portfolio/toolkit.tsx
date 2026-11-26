import type { CSSProperties } from "react";
import { projectById } from "@/lib/projects";
import { toolkit, toolkitTools } from "@/lib/toolkit";

export function Toolkit() {
  return (
    <section id="skills" className="vb-tools" aria-labelledby="skills-title">
      <h2 id="skills-title" className="vb-section-head vb-tools-title">
        What I can build.
      </h2>

      <ul className="vb-tools-list" role="list">
        {toolkit.map(({ project: id, title, example }) => {
          const project = projectById[id];

          return (
            <li key={id} className="vb-tools-item">
              <div className="vb-tools-copy">
                <h3>{title}</h3>
                <p>{example}</p>
              </div>
              <a
                className="vb-tools-chapter"
                href={`#${id}`}
                aria-label={`${project.name} project chapter`}
                style={
                  {
                    "--chapter-field": project.field,
                    "--chapter-ink": project.fieldInk,
                  } as CSSProperties
                }
              >
                <span>{project.name}</span>
                <span className="vb-tools-arrow" aria-hidden="true">
                  ↑
                </span>
              </a>
            </li>
          );
        })}
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
    </section>
  );
}
