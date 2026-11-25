"use client";

import Link from "next/link";
import { useRef } from "react";
import { projects } from "@/lib/projects";

/**
 * The work as a line of moments: every project is a point on one night line,
 * in the order it was built, with its month and status. Arrow keys move along
 * the line; Home and End jump to the ends.
 */
export function WorkLine() {
  const refs = useRef<(HTMLAnchorElement | null)[]>([]);
  const ordered = [...projects].sort((a, b) => order(a) - order(b));

  function onKeyDown(event: React.KeyboardEvent<HTMLElement>, index: number) {
    const moves: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: ordered.length - 1,
    };
    if (event.key in moves) {
      event.preventDefault();
      const next = Math.max(0, Math.min(ordered.length - 1, moves[event.key]));
      refs.current[next]?.focus();
    }
  }

  return (
    <nav className="vb-workline" aria-label="All projects, in the order they were built">
      <ol className="vb-workline-list">
        {ordered.map((project, index) => (
          <li
            key={project.id}
            className="vb-workline-point"
            style={{ "--field": project.field } as React.CSSProperties}
          >
            <Link
              ref={(node) => {
                refs.current[index] = node;
              }}
              href={project.href ?? `/projects/${project.id}`}
              className="vb-workline-link"
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              <span className="vb-workline-dot" aria-hidden="true" />
              <span className="vb-workline-date">{project.dates}</span>
              <span className="vb-workline-name">
                {project.name}
                {project.arabic ? <span lang="ar">{project.arabic}</span> : null}
              </span>
              <span className="vb-workline-status">{project.statusChip}</span>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Sort key from a "Mon–Mon YYYY" label: the start month. The experiment sits last. */
function order(project: (typeof projects)[number]) {
  if (project.id === "experiment") {
    return Number.MAX_SAFE_INTEGER;
  }
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const year = Number(project.dates.match(/\d{4}/)?.[0] ?? 0);
  const month = months.findIndex((m) => project.dates.startsWith(m));
  return year * 12 + (month < 0 ? 0 : month);
}
