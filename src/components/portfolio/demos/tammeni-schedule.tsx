"use client";

import { useId, useState } from "react";
import { useHydrated } from "@/lib/use-hydrated";

type Timing = "right away" | "daily" | "weekly" | "off";
type Channel = "call" | "text";
type Cell = { timing: Timing; channel: Channel };

const timings: Timing[] = ["right away", "daily", "weekly", "off"];
const channels: Channel[] = ["call", "text"];
const topics = ["Attendance", "Grades", "Exams"] as const;
const children = ["Reem", "Nawaf"] as const;

const initial: Record<string, Cell> = {
  "Reem:Attendance": { timing: "right away", channel: "text" },
  "Reem:Grades": { timing: "weekly", channel: "call" },
  "Reem:Exams": { timing: "daily", channel: "call" },
  "Nawaf:Attendance": { timing: "off", channel: "text" },
  "Nawaf:Grades": { timing: "weekly", channel: "text" },
  "Nawaf:Exams": { timing: "daily", channel: "call" },
};

function describe(cell: Cell) {
  return cell.timing === "off" ? "off" : `${cell.channel}, ${cell.timing}`;
}

function sentence(key: string, cell: Cell) {
  const [child, topic] = key.split(":");
  if (cell.timing === "off") {
    return `${child}\u2019s ${topic.toLowerCase()}: no alerts.`;
  }
  const how = cell.channel === "call" ? "a call" : "a text";
  const when = cell.timing === "right away" ? "right away" : `as a ${cell.timing} summary`;
  return `${child}\u2019s ${topic.toLowerCase()}: ${how}, ${when}.`;
}

/**
 * One family's alert rules: pick a child's topic in the grid, then how and
 * when. Before hydration the grid reads as a plain schedule. `compact` (the
 * homepage) leaves the storage note to the case study.
 */
export function TammeniScheduleDemo({ compact = false }: { compact?: boolean }) {
  const hydrated = useHydrated();
  const [cells, setCells] = useState(initial);
  const [selected, setSelected] = useState("Reem:Attendance");
  const id = useId();
  const cell = cells[selected];
  const [child, topic] = selected.split(":");

  function set(patch: Partial<Cell>) {
    setCells((c) => ({ ...c, [selected]: { ...c[selected], ...patch } }));
  }

  return (
    <div className="vb-art vb-demo vb-demo-tammeni" data-ui="" data-compact={compact ? "true" : undefined}>
      <p className="vb-demo-hint">
        <span className="vb-demo-tag">Simulated</span>
        {hydrated
          ? compact
            ? "Pick a cell, then set how and when."
            : "Pick a child\u2019s topic, then choose call or text and when."
          : "One family's rules, with the demo's fictional children."}
      </p>

      <table className="vb-demo-grid">
        <caption className="vb-art-sr">Alert schedule by child and topic</caption>
        <thead>
          <tr>
            <td />
            {children.map((c) => (
              <th key={c} scope="col">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {topics.map((t) => (
            <tr key={t}>
              <th scope="row">{t}</th>
              {children.map((c) => {
                const key = `${c}:${t}`;
                const value = cells[key];
                return (
                  <td key={key} data-off={value.timing === "off" ? "true" : undefined}>
                    {hydrated ? (
                      <button
                        type="button"
                        aria-pressed={key === selected}
                        onClick={() => setSelected(key)}
                        aria-label={`${c}, ${t}: ${describe(value)}`}
                      >
                        {describe(value)}
                      </button>
                    ) : (
                      describe(value)
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {hydrated ? (
        <div className="vb-demo-editor">
          <fieldset>
            <legend>
              How, for {child}&rsquo;s {topic.toLowerCase()}
            </legend>
            {channels.map((ch) => (
              <label key={ch} className="vb-demo-pill" data-disabled={cell.timing === "off" ? "true" : undefined}>
                <input
                  type="radio"
                  name={`${id}-channel`}
                  value={ch}
                  checked={cell.channel === ch}
                  disabled={cell.timing === "off"}
                  onChange={() => set({ channel: ch })}
                />
                <span>{ch === "call" ? "Call" : "Text"}</span>
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend>When</legend>
            {timings.map((tm) => (
              <label key={tm} className="vb-demo-pill">
                <input
                  type="radio"
                  name={`${id}-timing`}
                  value={tm}
                  checked={cell.timing === tm}
                  onChange={() => set({ timing: tm })}
                />
                <span>{tm === "right away" ? "Right away" : tm[0].toUpperCase() + tm.slice(1)}</span>
              </label>
            ))}
          </fieldset>
        </div>
      ) : null}

      <p className="vb-demo-result" aria-live="polite">
        {hydrated ? sentence(selected, cell) : "Each parent sets this per child and per topic."}
      </p>
      {compact ? null : (
        <p className="vb-art-note">
          Each cell is one row per parent, child and topic, kept private by row-level security.
        </p>
      )}
    </div>
  );
}
