"use client";

import { useState, type CSSProperties } from "react";
import { kashtaExample, kashtaLimits, kashtaRamp, kashtaRating, kashtaWeights } from "@/lib/kashta-example";
import { useHydrated } from "@/lib/use-hydrated";
import { Reveal } from "../reveal";

/*
 * Kashta on the home page: one campsite, the next seven nights. Tap a night and
 * the camp shows that night's weather, the score lands and the reason appears,
 * the way the app does it: code ranks the nights, the AI only explains. The
 * first night is the real 25 Nov forecast at Al-Rahmaniya; the other six are a
 * sample, all scored by the app's own rule (score.ts, mirrored in kashta-example).
 */
type Night = {
  day: string;
  /** Strongest gust, km/h. */
  wind: number;
  /** Highest chance of rain, %. */
  rain: number;
  /** Peak surface dust, µg/m³. */
  dust: number;
  /** Mean cloud cover 20:00–04:00, %. */
  cloud: number;
  why: string;
};

const nights: Night[] = [
  { day: "Wed", wind: 11.5, rain: 0, dust: 85, cloud: 0, why: "Calm wind, no rain, a clear sky. The best night of the week." },
  { day: "Thu", wind: 38, rain: 0, dust: 220, cloud: 15, why: "Gusts near 38 km/h and some dust take a few points. Still a good kashta." },
  { day: "Fri", wind: 58, rain: 0, dust: 390, cloud: 40, why: "Gusts reach 58 km/h. Kashta caps the score at 35 for safety." },
  { day: "Sat", wind: 44, rain: 45, dust: 300, cloud: 60, why: "Gusty, dusty, and a 45% chance of rain. Possible, not pleasant." },
  { day: "Sun", wind: 18, rain: 0, dust: 120, cloud: 70, why: "Overcast, which counts little for a kashta. Calm and dry otherwise." },
  { day: "Mon", wind: 34, rain: 0, dust: 110, cloud: 5, why: "A light breeze and little dust. Nearly as good as Wednesday." },
  { day: "Tue", wind: 26, rain: 65, dust: 90, cloud: 85, why: "A 65% chance of rain under heavy cloud. Stay home." },
];

const ratingWords = { excellent: "Excellent night", good: "Good night", fair: "Fair night", poor: "Poor night" } as const;

/** The app's Kashta Score for one night: temperature is mild all week, so it scores 100. */
function scoreNight(night: Night) {
  const { wind, rain, dust, cloud } = kashtaLimits;
  const factors = {
    temp: 100,
    wind: kashtaRamp(night.wind, wind.good, wind.bad),
    rain: kashtaRamp(night.rain, rain.good, rain.bad),
    dust: kashtaRamp(night.dust, dust.good, dust.bad),
    cloud: kashtaRamp(night.cloud, cloud.good, cloud.bad),
  };
  const sum = (Object.keys(kashtaWeights) as (keyof typeof kashtaWeights)[]).reduce(
    (acc, key) => acc + factors[key] * kashtaWeights[key],
    0,
  );
  const dangerous = night.wind >= wind.bad || night.dust >= dust.bad;
  const uncapped = Math.max(0, Math.min(100, Math.round(sum)));
  return { score: dangerous ? Math.min(uncapped, kashtaLimits.cap) : uncapped, dangerous };
}

const scored = nights.map((night) => ({ ...night, ...scoreNight(night) }));
const bestIndex = scored.reduce((best, night, index) => (night.score > scored[best].score ? index : best), 0);

function windWord(gust: number) {
  if (gust >= kashtaLimits.wind.bad) return "storm";
  if (gust > kashtaLimits.wind.good) return "gusty";
  return "calm";
}

/** 0 at the good limit, 1 at the bad one: how much of a reading the picture should show. */
function fraction(value: number, good: number, bad: number) {
  return Math.min(1, Math.max(0, (value - good) / (bad - good)));
}

/** The camp tonight: a black hair tent with its door lit, a cloth on its pole, sand, sky and weather. */
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
      {/* Cloud cover: a low bank that thickens with the forecast. */}
      <g className="vb-kp-cloud" fill="#2a3150">
        <ellipse cx="120" cy="52" rx="150" ry="26" />
        <ellipse cx="330" cy="34" rx="190" ry="30" />
        <ellipse cx="500" cy="70" rx="140" ry="24" />
        <ellipse cx="240" cy="92" rx="220" ry="22" opacity="0.7" />
      </g>
      {/* Rain, when the chance is high. */}
      <g className="vb-kp-rain" stroke="#9fb3e0" strokeWidth="1" strokeLinecap="round">
        {Array.from({ length: 14 }, (_, i) => (
          <path key={i} d={`M${30 + i * 40} ${60 + (i % 3) * 18} l -6 24`} />
        ))}
      </g>
      {/* Dust lifted off the dunes; invisible when the air is clean. */}
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
 * Pick a night; the camp, the score and the reason answer. Without JavaScript
 * it shows the best night, scored.
 */
export function KashtaProof() {
  const hydrated = useHydrated();
  const [picked, setPicked] = useState(bestIndex);
  const night = scored[picked];
  const weather = {
    "--dust": fraction(night.dust, kashtaLimits.dust.good, kashtaLimits.dust.bad),
    "--cloud": fraction(night.cloud, kashtaLimits.cloud.good, kashtaLimits.cloud.bad),
    "--rain": fraction(night.rain, kashtaLimits.rain.good, kashtaLimits.rain.bad),
  } as CSSProperties;

  return (
    <Reveal className="vb-kp">
      <figure className="vb-kp-card" data-wind={windWord(night.wind)} data-rain={night.rain > 0 || undefined} data-ui="" style={weather}>
        <p className="vb-kp-site">
          <strong>{kashtaExample.site}</strong>
          <span>Sample AI forecast</span>
        </p>

        <Camp />

        <div className="vb-kp-week" role="group" aria-label="Forecast nights">
          {scored.map((n, index) => (
            <button
              key={n.day}
              type="button"
              disabled={!hydrated}
              aria-pressed={picked === index}
              data-capped={n.dangerous ? "true" : undefined}
              onClick={() => setPicked(index)}
            >
              <span>{n.day}</span>
              <b>{n.score}</b>
              {index === bestIndex ? <small className="vb-kp-best">Best</small> : null}
              {n.dangerous ? <span className="vb-sr">Dangerous night</span> : null}
            </button>
          ))}
        </div>

        <div className="vb-kp-read" role="status" aria-atomic="true">
          <p className="vb-kp-score" data-capped={night.dangerous ? "true" : undefined}>
            <span className="vb-sr">{night.day}: Kashta Score </span>
            <strong key={night.score}>{night.score}</strong>
            <span>{night.dangerous ? "Dangerous night" : ratingWords[kashtaRating(night.score)]}</span>
          </p>
          <p className="vb-kp-why" key={picked}>
            <span className="vb-kp-why-label">AI forecast summary · Scripted example</span>
            {night.why}
          </p>
        </div>

        <figcaption className="vb-kp-foot">
          <span>Wednesday uses a recorded forecast and the other nights use example readings.</span>
          {hydrated ? (
            <button type="button" onClick={() => setPicked(bestIndex)}>
              Reset to {scored[bestIndex].day}
            </button>
          ) : null}
        </figcaption>
      </figure>
    </Reveal>
  );
}
