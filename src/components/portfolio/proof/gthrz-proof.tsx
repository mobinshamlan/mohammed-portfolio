import { Reveal } from "../reveal";

/*
 * Gthrz on the home page: one invitation, as the guest sees it at each step.
 * The address stays hidden until the host approves, then shows the area, and
 * the exact pin only when the host reveals it (lib/gthrz.ts gthrzVisibility).
 * A made-up event, labelled as an example.
 */

type Stage = "hidden" | "area" | "pin";

const steps: { stage: Stage; when: string; sees: string; detail: string }[] = [
  {
    stage: "hidden",
    when: "Guest asks to join",
    sees: "Hidden until the host approves",
    detail: "No address, no guest list.",
  },
  {
    stage: "area",
    when: "Host approves",
    sees: "Al-Malqa, Riyadh",
    detail: "The area and who else is going.",
  },
  {
    stage: "pin",
    when: "Host reveals the pin",
    sees: "Gate 2, villa 14",
    detail: "The exact location, when the host chooses.",
  },
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

export function GthrzProof() {
  return (
    <Reveal className="vb-gz">
      <figure className="vb-gz-card">
        <div className="vb-gz-event">
          <p className="vb-gz-title">Rooftop dinner</p>
          <p className="vb-gz-meta">Thu 8:30 pm &middot; Location, as the guest sees it</p>
        </div>

        <ol className="vb-gz-steps">
          {steps.map((step) => (
            <li key={step.stage} data-stage={step.stage}>
              <MapTile stage={step.stage} />
              <div className="vb-gz-text">
                <p className="vb-gz-when">{step.when}</p>
                <p className="vb-gz-sees">{step.sees}</p>
                <p className="vb-gz-detail">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>

        <figcaption className="vb-gz-caption">Example event.</figcaption>
      </figure>
    </Reveal>
  );
}
