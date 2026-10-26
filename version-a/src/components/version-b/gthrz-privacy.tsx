"use client";

import Image from "next/image";
import { useState } from "react";
import { gthrzShots } from "@/lib/gthrz";

// Positions are percentages of the create-event-settings screenshot.
const controls = [
  {
    id: "address",
    label: "Address",
    note: "Show the address now, or choose to reveal it later.",
    top: 44.2,
    height: 9.8,
  },
  {
    id: "exact",
    label: "Exact location",
    note: "Limit the exact location to guests who are going.",
    top: 55,
    height: 9.8,
  },
  {
    id: "names",
    label: "Guest names",
    note: "Show or hide attendee names from other guests.",
    top: 65.6,
    height: 9.6,
  },
  {
    id: "photos",
    label: "Guest photos",
    note: "Show or hide attendee profile photos from other guests.",
    top: 76.2,
    height: 9.6,
  },
] as const;

export function GthrzPrivacy() {
  const [index, setIndex] = useState(0);
  const control = controls[index];

  return (
    <section className="vb-gp" aria-labelledby="gp-title">
      <div className="vb-gp-copy">
        <h2 id="gp-title" className="vb-gs-title">
          Privacy is set per event
        </h2>
        <p className="vb-gs-body">
          Hosts decide when guests see the address, and whether names and
          photos are visible to other guests.
        </p>
        <div className="vb-gp-tabs" role="tablist" aria-label="Privacy settings">
          {controls.map((item, i) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`gp-tab-${item.id}`}
              aria-selected={i === index}
              aria-controls="gp-panel"
              className="vb-gp-tab"
              onClick={() => setIndex(i)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p
          id="gp-panel"
          role="tabpanel"
          aria-labelledby={`gp-tab-${control.id}`}
          className="vb-gp-note"
        >
          {control.note}
        </p>
      </div>

      <div className="vb-gp-phones">
        <div className="vb-gp-main">
          <Image
            src={gthrzShots.privacy.src}
            alt={gthrzShots.privacy.alt}
            width={gthrzShots.privacy.width}
            height={gthrzShots.privacy.height}
            sizes="(max-width: 900px) 56vw, 330px"
          />
          <span
            className="vb-gp-hl"
            aria-hidden="true"
            style={{ top: `${control.top}%`, height: `${control.height}%` }}
          />
        </div>
        <figure className="vb-gp-side">
          <Image
            src={gthrzShots.details.src}
            alt={gthrzShots.details.alt}
            width={gthrzShots.details.width}
            height={gthrzShots.details.height}
            sizes="(max-width: 900px) 40vw, 240px"
          />
          <figcaption>The event page shows when the location is revealed.</figcaption>
        </figure>
      </div>
    </section>
  );
}
