"use client";

import { useId, useState } from "react";
import { Reveal } from "../reveal";

/*
 * Gthrz on the home page: one invitation, and what the guest can see of the
 * address at each of the host's decisions (lib/gthrz.ts gthrzVisibility):
 * hidden until approved, then the area, then the exact pin. A made-up event.
 */

type Stage = "hidden" | "area" | "pin";

const stages: { id: Stage; label: string; sees: string }[] = [
  { id: "hidden", label: "Waiting", sees: "Hidden until the host approves" },
  { id: "area", label: "Approved", sees: "Al-Malqa, Riyadh" },
  { id: "pin", label: "Pin revealed", sees: "Gate 2, villa 14" },
];

/** A small map tile: the same streets each time, and what the guest can see on them. */
function MapTile({ stage }: { stage: Stage }) {
  return (
    <svg className="vb-gz-map" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="12" className="vb-gz-map-ground" />
      <g className="vb-gz-map-streets">
        <path d="M-2 22 C 20 18, 40 28, 66 20" />
        <path d="M-2 46 C 22 44, 42 50, 66 42" />
        <path d="M20 -2 C 22 20, 18 42, 24 66" />
        <path d="M46 -2 C 44 24, 50 44, 44 66" />
      </g>
      {stage === "hidden" ? (
        <g className="vb-gz-map-lock">
          <rect x="18" y="14" width="28" height="36" rx="8" className="vb-gz-map-veil" />
          <path d="M26.5 30v-4a5.5 5.5 0 0 1 11 0v4" />
          <rect x="24" y="30" width="16" height="12" rx="3" />
        </g>
      ) : null}
      {stage === "area" ? <circle cx="34" cy="33" r="15" className="vb-gz-map-area" /> : null}
      {stage === "pin" ? (
        <g className="vb-gz-map-pin">
          <circle cx="34" cy="33" r="15" className="vb-gz-map-area" />
          <path d="M34 44c-5-6.2-8-10.4-8-14.2a8 8 0 0 1 16 0c0 3.8-3 8-8 14.2Z" />
          <circle cx="34" cy="29.8" r="2.8" className="vb-gz-map-dot" />
        </g>
      ) : null}
    </svg>
  );
}

/**
 * The host's three decisions as one control; the address line under the
 * invitation answers. Without JavaScript it shows the hidden address.
 */
export function GthrzProof() {
  const [stage, setStage] = useState<Stage>("hidden");
  const id = useId();
  const shown = stages.find((s) => s.id === stage) ?? stages[0];

  return (
    <Reveal className="vb-gz">
      <figure className="vb-gz-card">
        <figcaption className="vb-gz-event">
          <p className="vb-gz-title">Rooftop dinner</p>
          <p className="vb-gz-meta">
            Thu 8:30 pm
            <span className="vb-gz-note">
              <span className="vb-sr">. </span>Example
            </span>
          </p>
        </figcaption>

        <p className="vb-gz-where" role="status" aria-atomic="true" data-stage={stage}>
          <MapTile stage={stage} />
          <span className="vb-gz-text" key={stage}>
            <span className="vb-gz-label">Location</span>
            <span className="vb-sr">: </span>
            <strong>{shown.sees}</strong>
          </span>
        </p>

        <fieldset className="vb-gz-host">
          <legend>The host&rsquo;s decision</legend>
          <div className="vb-gz-seg">
            {stages.map((s) => (
              <label key={s.id}>
                <input type="radio" name={`${id}-stage`} value={s.id} checked={stage === s.id} onChange={() => setStage(s.id)} />
                <span>{s.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </figure>
    </Reveal>
  );
}
