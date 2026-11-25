"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { gthrzShots } from "@/lib/gthrz";
import { useHydrated } from "@/lib/use-hydrated";

const cards = [
  { label: "Start", shot: gthrzShots.plannerStart },
  { label: "Describe", shot: gthrzShots.plannerPrompt },
  { label: "Suggestions", shot: gthrzShots.plannerSuggestions },
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
          <p className="vb-gl-body">
            Describe your event and Smart Planner prepares the first draft.
          </p>
        </div>
        <ol className="vb-gl-static">
          {cards.map((card, index) => (
            <li key={card.label}>
              <Image
                src={card.shot.src}
                alt={card.shot.alt}
                width={card.shot.width}
                height={card.shot.height}
                sizes="(max-width: 900px) 30vw, 200px"
              />
              <span>
                {index + 1}. {card.label}
              </span>
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
        <p className="vb-gl-body">
          Describe your event and Smart Planner prepares the first draft.
        </p>
        <div className="vb-gl-steps" role="group" aria-label="Smart Planner steps">
          {cards.map((card, index) => (
            <button
              key={card.label}
              type="button"
              className="vb-gl-step"
              aria-pressed={index === active}
              onClick={() => setActive(index)}
            >
              <span className="vb-gl-num">{index + 1}</span>
              {card.label}
            </button>
          ))}
        </div>
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
            alt={card.shot.alt}
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
