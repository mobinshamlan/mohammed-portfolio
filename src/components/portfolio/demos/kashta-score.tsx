"use client";

import { useId, useState } from "react";
import {
  kashtaExample,
  kashtaLimits,
  kashtaNight,
  kashtaRating,
  kashtaScore,
  kashtaWeights,
  type KashtaInputs,
} from "@/lib/kashta-example";
import { useHydrated } from "@/lib/use-hydrated";

const start: KashtaInputs = { wind: kashtaNight.wind, dust: kashtaNight.dust, cloud: kashtaNight.cloud };

const sliders = [
  {
    key: "wind",
    label: "Wind",
    unit: "km/h gust",
    max: 80,
    step: 0.5,
    limits: kashtaLimits.wind,
    rule: `full marks up to ${kashtaLimits.wind.good}, zero and dangerous from ${kashtaLimits.wind.bad}`,
  },
  {
    key: "dust",
    label: "Dust",
    unit: "µg/m³",
    max: 600,
    step: 5,
    limits: kashtaLimits.dust,
    rule: `full marks up to ${kashtaLimits.dust.good}, zero and dangerous from ${kashtaLimits.dust.bad}`,
  },
  {
    key: "cloud",
    label: "Cloud",
    unit: "% cover",
    max: 100,
    step: 5,
    limits: kashtaLimits.cloud,
    rule: `full marks up to ${kashtaLimits.cloud.good}%, zero from ${kashtaLimits.cloud.bad}%`,
  },
] as const;

function format(value: number, unit: string) {
  return unit.startsWith("%") ? `${value}${unit}` : `${value} ${unit}`;
}

/**
 * The Kashta Score, live. Wind, dust and cloud move; temperature and rain stay
 * at the real night's readings. The maths is score.ts's own, mirrored in
 * lib/kashta-example.ts. Before hydration it shows the real night, worked.
 * `compact` (the homepage) keeps the score and the sliders; the limits stay
 * for screen readers and the held factors are left to the case study.
 */
export function KashtaScoreDemo({ compact = false }: { compact?: boolean }) {
  const hydrated = useHydrated();
  const [inputs, setInputs] = useState(start);
  const id = useId();
  const result = kashtaScore(inputs);
  const at25Nov = inputs.wind === start.wind && inputs.dust === start.dust && inputs.cloud === start.cloud;
  const capped = result.dangers.length > 0;
  const rating = kashtaRating(result.score);

  return (
    <div className="vb-art vb-demo vb-demo-kashta" data-ui="" data-compact={compact ? "true" : undefined}>
      <p className="vb-demo-hint">
        <span className="vb-demo-tag">Simulated</span>
        {hydrated
          ? compact
            ? `Move a slider. Dangerous wind or dust caps the night at ${kashtaLimits.cap}.`
            : "Drag the wind or the dust and watch the score answer."
          : "The real night, worked by score.ts\u2019s rules."}
      </p>

      <div className="vb-demo-kashta-top">
        <p className="vb-demo-kashta-score" data-capped={capped ? "true" : undefined}>
          {compact ? (
            // The score as a half dial; the needle turns with it.
            <svg className="vb-demo-gauge" viewBox="0 0 200 112" aria-hidden="true">
              <path className="vb-demo-gauge-track" d="M18 100 A82 82 0 0 1 182 100" pathLength={100} />
              <path
                className="vb-demo-gauge-cap"
                d="M18 100 A82 82 0 0 1 182 100"
                pathLength={100}
                strokeDasharray={`${kashtaLimits.cap} 100`}
              />
              <g
                className="vb-demo-gauge-needle"
                style={{ "--needle": `${result.score * 1.8 - 90}deg` } as React.CSSProperties}
              >
                <line x1="100" y1="100" x2="100" y2="30" />
              </g>
              <circle className="vb-demo-gauge-hub" cx="100" cy="100" r="7" />
            </svg>
          ) : null}
          <strong>{result.score}</strong>
          <span>{compact && capped ? `capped: dangerous ${result.dangers.join(" and ")}` : rating}</span>
        </p>
        <p className="vb-demo-kashta-where">
          {compact ? (
            <>
              {kashtaExample.site}, {kashtaExample.shortNight}. The live app showed {kashtaExample.liveScore}.
            </>
          ) : (
            <>
              {kashtaExample.site}. Starts from {kashtaExample.night}, when the live app showed{" "}
              {kashtaExample.liveScore}.
            </>
          )}
        </p>
        {hydrated ? (
          <button
            type="button"
            className="vb-btn vb-btn-quiet vb-demo-reset"
            onClick={() => setInputs(start)}
            disabled={at25Nov}
          >
            Back to 25 Nov
          </button>
        ) : null}
      </div>

      <p className="vb-art-sr" aria-live="polite">
        {`Kashta Score ${result.score}, ${rating}.`}
        {capped ? ` Capped at ${kashtaLimits.cap}: ${result.dangers.join(" and ")} at a dangerous level.` : ""}
      </p>

      <div className="vb-demo-sliders">
        {sliders.map((s) => {
          const value = inputs[s.key];
          const danger = s.key !== "cloud" && value >= s.limits.bad;
          return (
            <div key={s.key} className="vb-demo-slider" data-danger={danger ? "true" : undefined}>
              <label htmlFor={`${id}-${s.key}`}>
                <span>
                  {s.label} <output htmlFor={`${id}-${s.key}`}>{format(value, s.unit)}</output>
                </span>
                <span className="vb-demo-points">
                  <strong>{result.factors[s.key]}</strong> ×&nbsp;{kashtaWeights[s.key]}
                </span>
              </label>
              {hydrated ? (
                <input
                  id={`${id}-${s.key}`}
                  type="range"
                  min={0}
                  max={s.max}
                  step={s.step}
                  value={value}
                  aria-valuetext={`${format(value, s.unit)}, factor score ${result.factors[s.key]}`}
                  aria-describedby={`${id}-${s.key}-rule`}
                  style={
                    {
                      "--good": `${(s.limits.good / s.max) * 100}%`,
                      "--bad": `${(s.limits.bad / s.max) * 100}%`,
                    } as React.CSSProperties
                  }
                  onChange={(e) => setInputs((v) => ({ ...v, [s.key]: Number(e.target.value) }))}
                />
              ) : null}
              <p id={`${id}-${s.key}-rule`} className={compact ? "vb-art-sr" : "vb-demo-rule"}>
                {s.rule}
              </p>
            </div>
          );
        })}
        {compact ? null : (
          <p className="vb-demo-held">
            Held at the night&rsquo;s readings: temperature 21.7° evening, 14.9° feels-like,{" "}
            <span className="vb-demo-points">
              <strong>{result.factors.temp}</strong> ×&nbsp;{kashtaWeights.temp}
            </span>
            ; rain 0% chance,{" "}
            <span className="vb-demo-points">
              <strong>{result.factors.rain}</strong> ×&nbsp;{kashtaWeights.rain}
            </span>
            .
          </p>
        )}
      </div>

      {compact ? null : (
        <p className="vb-art-sum">
          {capped ? (
            <>
              Dangerous {result.dangers.join(" and ")}: the night is capped at{" "}
              <strong>{kashtaLimits.cap}</strong> however good the rest looks (weighted sum{" "}
              {result.uncapped}).
            </>
          ) : (
            <>
              Weighted sum, rounded: <strong>{result.score}</strong>. Any gust from {kashtaLimits.wind.bad} km/h or
              dust from {kashtaLimits.dust.bad} µg/m³ caps the night at {kashtaLimits.cap}.
            </>
          )}{" "}
          Limits and weights are the app&rsquo;s own (src/lib/score.ts).
        </p>
      )}
    </div>
  );
}
