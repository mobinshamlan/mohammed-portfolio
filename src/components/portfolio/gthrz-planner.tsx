"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { gthrzShots } from "@/lib/gthrz";
import { useHydrated } from "@/lib/use-hydrated";

const cards = [
  { label: "Start", shot: gthrzShots.plannerStart, detail: "Open the planner from the new event form." },
  { label: "Describe", shot: gthrzShots.plannerPrompt, detail: "Write a short description of the gathering." },
  { label: "Suggestions", shot: gthrzShots.plannerSuggestions, detail: "Review and edit the draft before publishing." },
] as const;

export function GthrzPlanner() {
  const hydrated = useHydrated();
  const [active, setActive] = useState(0);

  if (!hydrated) {
    // Without JavaScript: the three steps side by side, each with its screen.
    return (
      <section className="vb-gl" aria-labelledby="gl-title">
        <div className="vb-gl-copy">
          <h2 id="gl-title" className="vb-gl-title">
            Smart Planner
          </h2>
        </div>
        <ol className="vb-gl-static">
          {cards.map((card) => (
            <li key={card.label}>
              <Image
                src={card.shot.src}
                alt={card.shot.alt}
                width={card.shot.width}
                height={card.shot.height}
                sizes="(max-width: 900px) 30vw, 200px"
              />
              <strong>{card.label}</strong>
              <span>{card.detail}</span>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  return (
    <section className="vb-gl" aria-labelledby="gl-title">
      <div className="vb-gl-copy">
        <h2 id="gl-title" className="vb-gl-title">
          Smart Planner
        </h2>
        <div className="vb-gl-steps" role="group" aria-label="Smart Planner steps">
          {cards.map((card, index) => (
            <button
              key={card.label}
              type="button"
              className="vb-gl-step"
              aria-pressed={index === active}
              onClick={() => setActive(index)}
            >
              {card.label}
            </button>
          ))}
        </div>
        <p className="vb-gl-note" role="status">{cards[active].detail}</p>
      </div>

      <button
        type="button"
        className="vb-gl-stack"
        onClick={() => setActive((active + 1) % cards.length)}
        aria-label="Show the next planner screen"
      >
        {cards.map((card, index) => (
          <Image
            key={card.label}
            src={card.shot.src}
            alt=""
            width={card.shot.width}
            height={card.shot.height}
            sizes="(max-width: 900px) 86vw, 460px"
            className="vb-gl-card"
            style={{ "--d": index - active } as CSSProperties}
            data-dist={Math.abs(index - active)}
          />
        ))}
      </button>
    </section>
  );
}
