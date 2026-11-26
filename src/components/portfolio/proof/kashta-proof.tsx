"use client";

import { useId, useState } from "react";
import { kashtaExample, kashtaLimits, kashtaNight, kashtaRating, kashtaScore } from "@/lib/kashta-example";
import { Reveal } from "../reveal";

/*
 * Three winds for the real 25 Nov night at Al-Rahmaniya. Everything else stays
 * as the forecast had it; score.ts's own rules (lib/kashta-example.ts) do the rest.
 */
const winds = [
  { id: "calm", label: "Calm", gust: 12 },
  { id: "gusty", label: "Gusty", gust: 48 },
  { id: "storm", label: "Storm", gust: 60 },
] as const;

const ratingWords = { excellent: "Excellent", good: "Good", fair: "Fair", poor: "Poor" } as const;

function scoreFor(gust: number) {
  const result = kashtaScore({ wind: gust, dust: kashtaNight.dust, cloud: kashtaNight.cloud });
  const capped = result.dangers.length > 0;
  return {
    score: result.score,
    words: capped ? `Capped at ${kashtaLimits.cap}: dangerous wind` : ratingWords[kashtaRating(result.score)],
    capped,
  };
}

/**
 * Kashta on the home page: pick tonight's wind and watch the score answer.
 * Without JavaScript it shows the calm night, scored.
 */
export function KashtaProof() {
  const [wind, setWind] = useState<(typeof winds)[number]["id"]>("calm");
  const id = useId();
  const gust = winds.find((w) => w.id === wind)?.gust ?? winds[0].gust;
  const { score, words, capped } = scoreFor(gust);

  return (
    <Reveal className="vb-kp">
      <figure className="vb-kp-card">
        <div className="vb-kp-main">
          <p className="vb-kp-score" role="status" aria-atomic="true" data-capped={capped ? "true" : undefined}>
            <span className="vb-sr">Kashta Score </span>
            <strong key={score}>{score}</strong>
            <span>
              <span className="vb-sr">, </span>
              {words}
            </span>
          </p>

          <fieldset className="vb-kp-wind">
            <legend>Tonight&rsquo;s wind</legend>
            <div className="vb-kp-seg">
              {winds.map((w) => (
                <label key={w.id}>
                  <input
                    type="radio"
                    name={`${id}-wind`}
                    value={w.id}
                    checked={wind === w.id}
                    onChange={() => setWind(w.id)}
                  />
                  <span>
                    {w.label}
                    <small>{w.gust} km/h</small>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <figcaption className="vb-kp-foot">
          <p className="vb-kp-rule">Code scores it. Llama only explains.</p>
          <p className="vb-kp-note">
            Real forecast: {kashtaExample.site}, {kashtaExample.shortNight}
          </p>
        </figcaption>
      </figure>
    </Reveal>
  );
}
