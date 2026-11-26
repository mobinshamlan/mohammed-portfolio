"use client";

import { useState, type CSSProperties } from "react";
import { kashtaExample, kashtaLimits, kashtaNight, kashtaRating, kashtaScore } from "@/lib/kashta-example";
import { Reveal } from "../reveal";

/*
 * Kashta on the home page: tonight's camp, and the wind. Pick a gust and the
 * tent's cloth, the sand and the sky answer; so does the score, by the app's
 * own rule. Every other reading is the real 25 Nov forecast at Al-Rahmaniya.
 */
const winds = [
  { id: "calm", label: "Calm", gust: 12 },
  { id: "gusty", label: "Gusty", gust: 48 },
  { id: "storm", label: "Storm", gust: 60 },
] as const;

type WindId = (typeof winds)[number]["id"];

const ratingWords = { excellent: "Excellent night", good: "Good night", fair: "Fair night", poor: "Poor night" } as const;

function scoreFor(gust: number) {
  const result = kashtaScore({ wind: gust, dust: kashtaNight.dust, cloud: kashtaNight.cloud });
  const capped = result.dangers.length > 0;
  return {
    score: result.score,
    words: capped ? `Capped at ${kashtaLimits.cap}: dangerous wind` : ratingWords[kashtaRating(result.score)],
    capped,
  };
}

/** Where a gust sits on the wind rule: 0 at the good limit, 1 at the bad one. */
function ramp(gust: number) {
  const { good, bad } = kashtaLimits.wind;
  return Math.min(1, Math.max(0, (gust - good) / (bad - good)));
}

/** The camp tonight: a black hair tent with its door lit, a cloth on its pole, sand and stars. */
function Camp() {
  return (
    <svg className="vb-kp-camp" viewBox="0 0 560 230" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <g className="vb-kp-stars" fill="#eef0f6">
        <circle cx="40" cy="30" r="1.2" />
        <circle cx="96" cy="72" r="0.9" />
        <circle cx="150" cy="22" r="1.4" />
        <circle cx="210" cy="60" r="0.8" />
        <circle cx="262" cy="18" r="1.1" />
        <circle cx="330" cy="48" r="1" />
        <circle cx="388" cy="14" r="1.3" />
        <circle cx="430" cy="78" r="0.9" />
        <circle cx="486" cy="36" r="1.2" />
        <circle cx="528" cy="90" r="0.8" />
        <circle cx="470" cy="118" r="0.9" />
        <circle cx="60" cy="110" r="0.8" />
        <path d="M304 76 l1.4 6.6 6.6 1.4 -6.6 1.4 -1.4 6.6 -1.4 -6.6 -6.6 -1.4 6.6 -1.4z" />
      </g>
      {/* Dust lifted off the dunes; invisible when calm. */}
      <g className="vb-kp-dust" stroke="#d9c7b0" strokeLinecap="round" fill="none">
        <path d="M-40 150 Q 80 142 200 150 T 440 148 T 640 150" strokeWidth="1.2" opacity="0.5" />
        <path d="M-60 176 Q 120 168 260 176 T 520 174 T 700 176" strokeWidth="1.6" opacity="0.4" />
        <path d="M-20 196 Q 90 190 220 198 T 480 196 T 660 198" strokeWidth="1" opacity="0.35" />
        <path d="M-40 120 Q 60 116 180 122 T 400 120 T 600 122" strokeWidth="0.9" opacity="0.3" />
      </g>
      {/* The dunes. */}
      <path d="M0 186 C 90 172, 170 170, 260 178 C 350 186, 430 176, 560 170 L 560 230 L 0 230 Z" fill="#1c1a26" />
      <path d="M0 206 C 120 196, 240 200, 360 206 C 440 210, 500 204, 560 198 L 560 230 L 0 230 Z" fill="#141220" />
      {/* Guy ropes. */}
      <path d="M196 132 L 150 190 M 404 132 L 450 190" stroke="#3a3236" strokeWidth="1" />
      {/* The tent. */}
      <path d="M160 192 L 196 130 L 246 118 L 300 124 L 354 118 L 404 130 L 440 192 Z" fill="#0d0b0c" />
      <path d="M196 130 L 246 118 L 300 124 L 354 118 L 404 130" stroke="#2b2426" strokeWidth="1.5" fill="none" />
      <path d="M170 174 L 430 174" stroke="#94482f" strokeWidth="2.4" strokeDasharray="7 5" opacity="0.8" />
      <path className="vb-kp-door" d="M268 192 L 278 148 L 322 148 L 332 192 Z" fill="#e8894a" />
      <ellipse className="vb-kp-firelight" cx="300" cy="196" rx="70" ry="10" fill="#e8894a" />
      {/* The cloth on the pole: it hangs when calm, streams in a storm. */}
      <path d="M246 118 L 246 84" stroke="#3a3236" strokeWidth="2" />
      <g className="vb-kp-cloth">
        <path d="M247 86 C 262 88, 272 94, 284 92 L 282 104 C 270 106, 260 100, 247 104 Z" fill="#c9d6f0" />
        <path d="M247 86 C 258 87, 266 91, 276 90" stroke="#eef0f6" strokeWidth="1" fill="none" opacity="0.6" />
      </g>
    </svg>
  );
}

/**
 * Pick tonight's wind; the camp and the score answer. Without JavaScript it
 * shows the calm night, scored.
 */
export function KashtaProof() {
  const [wind, setWind] = useState<WindId>("calm");
  const current = winds.find((w) => w.id === wind) ?? winds[0];
  const { score, words, capped } = scoreFor(current.gust);
  const position = ramp(current.gust);

  return (
    <Reveal className="vb-kp">
      <figure className="vb-kp-card" data-wind={wind} data-ui="">
        <Camp />

        <div className="vb-kp-read">
          <p className="vb-kp-score" role="status" aria-atomic="true" data-capped={capped ? "true" : undefined}>
            <span className="vb-sr">Kashta Score </span>
            <strong key={score}>{score}</strong>
            <span>{words}</span>
          </p>

          <div className="vb-kp-pick" role="group" aria-label="Tonight's wind">
            <p className="vb-kp-pick-label">Tonight&rsquo;s wind</p>
            <div className="vb-kp-seg">
              {winds.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  aria-pressed={wind === w.id}
                  onClick={() => setWind(w.id)}
                >
                  {w.label}
                  <small>{w.gust} km/h</small>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* The wind rule, as score.ts has it: full marks to 30 km/h, nothing from 55. */}
        <div className="vb-kp-rule" style={{ "--at": position } as CSSProperties}>
          <p className="vb-kp-rule-title">
            How wind changes the score <span>no penalty up to {kashtaLimits.wind.good} km/h, zero from {kashtaLimits.wind.bad}</span>
          </p>
          <div className="vb-kp-track" aria-hidden="true">
            <span className="vb-kp-safe">Safe</span>
            <span className="vb-kp-danger">Dangerous</span>
            <i className="vb-kp-pin" data-capped={capped ? "true" : undefined}>
              {current.gust}
            </i>
          </div>
        </div>

        <figcaption className="vb-kp-foot">
          <p className="vb-kp-note">
            Example from a real forecast: {kashtaExample.site}, {kashtaExample.shortNight}. The app scores it; the AI only explains why.
          </p>
        </figcaption>
      </figure>
    </Reveal>
  );
}
