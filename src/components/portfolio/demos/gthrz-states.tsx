"use client";

import { useState } from "react";
import { gthrzVisibility } from "@/lib/gthrz";
import { useHydrated } from "@/lib/use-hydrated";

// A made-up event. What each field shows once the guest may read it.
const reveal = [
  { hidden: "Shown after approval", shown: "Al-Malqa, Riyadh" },
  { hidden: "Shown when the host reveals it", shown: "Pinned: gate 2, villa 14" },
  { hidden: "Shown after approval", shown: "Sara, Faisal, Nouf and 9 more" },
];

const steps = ["Request to join", "Host approves", "Host reveals the pin", "Start again"];

/**
 * A guest's view of one event at each state, from the visibility table in
 * lib/gthrz.ts. Before hydration the full table is shown instead.
 */
export function GthrzStatesDemo() {
  const hydrated = useHydrated();
  const [index, setIndex] = useState(0);
  const { rows, columns } = gthrzVisibility;
  const row = rows[index];
  const last = rows.length - 1;

  if (!hydrated) {
    return (
      <div className="vb-art vb-art-gthrz vb-demo" data-ui="">
        <p className="vb-demo-hint">
          <span className="vb-demo-tag">Simulated</span>
          What a guest can read at each state.
        </p>
        <table className="vb-art-table">
          <thead>
            <tr>
              <th scope="col">State</th>
              {columns.map((c) => (
                <th key={c} scope="col">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.state}>
                <th scope="row">{r.state}</th>
                {r.values.map((v, i) => (
                  <td key={i} data-label={columns[i]} data-on={v ? "true" : undefined}>
                    {v ? "Yes" : "No"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <Note />
      </div>
    );
  }

  return (
    <div className="vb-art vb-demo vb-demo-gthrz" data-ui="">
      <p className="vb-demo-hint">
        <span className="vb-demo-tag">Simulated</span>
        Move the guest along and watch what they can read.
      </p>

      <ol className="vb-demo-steps" aria-label="Guest state">
        {rows.map((r, i) => (
          <li key={r.state} data-on={i === index ? "true" : undefined} data-past={i < index ? "true" : undefined}>
            <button type="button" aria-current={i === index ? "step" : undefined} onClick={() => setIndex(i)}>
              {r.state}
            </button>
          </li>
        ))}
      </ol>

      <button
        type="button"
        className="vb-btn vb-demo-next"
        onClick={() => setIndex((i) => (i >= last ? 0 : i + 1))}
      >
        {steps[index]}
      </button>

      <div className="vb-demo-event">
        <p className="vb-demo-event-title">
          Rooftop dinner <span>Thu 8:30 pm · Food</span>
        </p>
        <dl aria-live="polite">
          {columns.map((c, i) => {
            const on = row.values[i];
            return (
              <div key={c} data-on={on ? "true" : undefined}>
                <dt>{c}</dt>
                <dd>
                  <span className="vb-demo-status">{on ? "Visible" : "Hidden"}</span>
                  {on ? reveal[i].shown : reveal[i].hidden}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>

      <Note />
    </div>
  );
}

function Note() {
  return (
    <p className="vb-art-note">
      Made-up event. Title, time and category are always visible. The host chose &ldquo;reveal the address
      later&rdquo; and left guest names on; row-level security enforces each state.
    </p>
  );
}
