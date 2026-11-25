"use client";

import Link from "next/link";
import { useRef } from "react";
import { projects } from "@/lib/projects";

/**
 * Every project in the order it was built, set like a timetable: the months
 * in the first column, the name in Latin and Arabic, then where it stands.
 * Up and down arrows move between rows; Home and End jump to the ends.
 */
export function NightTable() {
  const refs = useRef<(HTMLAnchorElement | null)[]>([]);
  const ordered = [...projects].sort((a, b) => order(a) - order(b));

  function onKeyDown(event: React.KeyboardEvent<HTMLElement>, index: number) {
    const moves: Record<string, number> = {
      ArrowDown: index + 1,
      ArrowUp: index - 1,
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
    <nav id="all-projects" className="vb-table" aria-label="All projects, in the order they were built">
      <ol className="vb-table-list">
        {ordered.map((project, index) => (
          <li
            key={project.id}
            className="vb-table-row"
            style={{ "--field": project.field, "--field-ink": project.fieldInk } as React.CSSProperties}
          >
            <Link
              ref={(node) => {
                refs.current[index] = node;
              }}
              href={project.href ?? `/projects/${project.id}`}
              prefetch={false}
              className="vb-table-link"
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              <span className="vb-table-date">{project.dates}</span>
              <span className="vb-table-name">{project.name}</span>
              {project.arabic ? (
                <span className="vb-table-ar" lang="ar">
                  {project.arabic}
                </span>
              ) : (
                <span className="vb-table-ar" aria-hidden="true" />
              )}
              <span className="vb-table-status">{project.statusChip}</span>
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
