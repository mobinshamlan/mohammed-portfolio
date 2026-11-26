"use client";

import { useState } from "react";
import { gthrzShots } from "@/lib/gthrz";
import { useHydrated } from "@/lib/use-hydrated";
import { GthrzImg } from "./gthrz-img";

// Positions are percentages of the create-event-settings screenshot.
const controls = [
  {
    id: "address",
    label: "When to share",
    note: "Share the address now or at a time you choose.",
    top: 44.2,
    height: 9.8,
  },
  {
    id: "exact",
    label: "Who can see",
    note: "Limit the exact address to guests you've approved.",
    top: 55,
    height: 9.8,
  },
  {
    id: "names",
    label: "Guest names",
    note: "Choose whether guests see each other’s names.",
    top: 65.6,
    height: 9.6,
  },
  {
    id: "photos",
    label: "Guest photos",
    note: "Choose whether guests see each other’s profile photos.",
    top: 76.2,
    height: 9.6,
  },
] as const;

export function GthrzPrivacy() {
  const hydrated = useHydrated();
  const [index, setIndex] = useState(0);
  const control = controls[index];

  function onTabKey(event: React.KeyboardEvent<HTMLButtonElement>, i: number) {
    const moves: Record<string, number> = {
      ArrowRight: i + 1,
      ArrowLeft: i - 1,
      Home: 0,
      End: controls.length - 1,
    };
    if (!(event.key in moves)) {
      return;
    }
    event.preventDefault();
    const next = (moves[event.key] + controls.length) % controls.length;
    setIndex(next);
    document.getElementById(`gp-tab-${controls[next].id}`)?.focus();
  }

  return (
    <section className="vb-gp" aria-labelledby="gp-title">
      <div className="vb-gp-copy">
        <h2 id="gp-title" className="vb-gs-title">
          Event privacy
        </h2>
        {hydrated ? (
          <>
            <div className="vb-gp-tabs" role="tablist" aria-label="Privacy settings">
              {controls.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  id={`gp-tab-${item.id}`}
                  aria-selected={i === index}
                  aria-controls="gp-panel"
                  tabIndex={i === index ? 0 : -1}
                  className="vb-gp-tab"
                  onClick={() => setIndex(i)}
                  onKeyDown={(event) => onTabKey(event, i)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <p
              id="gp-panel"
              role="tabpanel"
              tabIndex={0}
              aria-labelledby={`gp-tab-${control.id}`}
              className="vb-gp-note"
            >
              {control.note}
            </p>
          </>
        ) : (
          // Without JavaScript every setting is listed instead of tabbed.
          <dl className="vb-gp-list">
            {controls.map((item) => (
              <div key={item.id}>
                <dt>{item.label}</dt>
                <dd>{item.note}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      <div className="vb-gp-phones">
        <div className="vb-gp-main">
          <GthrzImg shot={gthrzShots.privacy} sizes="(max-width: 899px) 56vw, 330px" />
          {hydrated ? (
            <span
              key={control.id}
              className="vb-gp-hl"
              aria-hidden="true"
              style={{ top: `${control.top}%`, height: `${control.height}%` }}
            />
          ) : null}
        </div>
        <figure className="vb-gp-side">
          <GthrzImg shot={gthrzShots.details} sizes="(max-width: 899px) 40vw, 240px" />
          <figcaption>Guests see when they’ll get the address.</figcaption>
        </figure>
      </div>
    </section>
  );
}
