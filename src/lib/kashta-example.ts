/**
 * Real limits and weights from Kashta's src/lib/score.ts, and every value the
 * live app showed for this night (destination page, forecast details, 25 Nov 2026).
 */
export const kashtaExample = {
  site: "Al-Rahmaniya Park, Al-Kharj",
  night: "Wednesday 25 November 2026",
  shortNight: "25 Nov 2026",
  liveScore: 99,
  rows: [
    {
      factor: "Temperature",
      short: "Temp.",
      value: "21.7° evening, 14.9° min feels-like",
      rule: "100 inside the 14–22° mild band, −8 per degree outside; −5 per degree of feels-like below 4°",
      score: 100,
      weight: 0.3,
    },
    {
      factor: "Wind",
      short: "Wind",
      value: "11.5 km/h strongest gust",
      rule: "100 at ≤30 km/h, 0 at ≥55, straight line between (medium tolerance)",
      score: 100,
      weight: 0.3,
    },
    {
      factor: "Rain",
      short: "Rain",
      value: "0% highest chance",
      rule: "100 at ≤10%, 0 at ≥70%",
      score: 100,
      weight: 0.2,
    },
    {
      factor: "Dust",
      short: "Dust",
      value: "85 µg/m³ peak",
      rule: "100 at ≤60, 0 at ≥400: 100 × (1 − 25⁄340) = 92.6, rounded 93",
      score: 93,
      weight: 0.15,
    },
    {
      factor: "Cloud",
      short: "Cloud",
      value: "0% mean, 20:00–04:00",
      rule: "100 at ≤10%, 0 at ≥80%",
      score: 100,
      weight: 0.05,
    },
  ],
};

/*
 * The parts of score.ts the interactive score needs, mirrored line for line
 * (kashta @2f29fad, src/lib/score.ts): the "kashta" weights, medium wind
 * tolerance, the straight-line ramp and the 35-point cap for a dangerous night.
 */
export const kashtaLimits = {
  wind: { good: 30, bad: 55 }, // strongest gust, km/h (medium tolerance)
  rain: { good: 10, bad: 70 }, // highest chance, %
  dust: { good: 60, bad: 400 }, // peak surface dust, µg/m³
  cloud: { good: 10, bad: 80 }, // mean cover 20:00–04:00, %
  cap: 35,
} as const;

export const kashtaWeights = { temp: 0.3, wind: 0.3, rain: 0.2, dust: 0.15, cloud: 0.05 } as const;

/** The 25 Nov night's raw readings, which the sliders start from. */
export const kashtaNight = { wind: 11.5, rain: 0, dust: 85, cloud: 0, tempScore: 100 } as const;

/** 100 at or below `good`, 0 at or above `bad`, linear between. */
export function kashtaRamp(value: number, good: number, bad: number) {
  if (value <= good) return 100;
  if (value >= bad) return 0;
  return Math.round(100 * (1 - (value - good) / (bad - good)));
}

export type KashtaInputs = { wind: number; dust: number; cloud: number };

export function kashtaScore({ wind, dust, cloud }: KashtaInputs) {
  const factors = {
    temp: kashtaNight.tempScore,
    wind: kashtaRamp(wind, kashtaLimits.wind.good, kashtaLimits.wind.bad),
    rain: kashtaRamp(kashtaNight.rain, kashtaLimits.rain.good, kashtaLimits.rain.bad),
    dust: kashtaRamp(dust, kashtaLimits.dust.good, kashtaLimits.dust.bad),
    cloud: kashtaRamp(cloud, kashtaLimits.cloud.good, kashtaLimits.cloud.bad),
  };
  const sum = (Object.keys(kashtaWeights) as (keyof typeof kashtaWeights)[]).reduce(
    (acc, k) => acc + factors[k] * kashtaWeights[k],
    0,
  );
  const dangers: string[] = [];
  if (wind >= kashtaLimits.wind.bad) dangers.push("wind");
  if (dust >= kashtaLimits.dust.bad) dangers.push("dust");
  const uncapped = Math.max(0, Math.min(100, Math.round(sum)));
  const score = dangers.length ? Math.min(uncapped, kashtaLimits.cap) : uncapped;
  return { factors, uncapped, score, dangers };
}

/** score.ts's rating() bands. */
export function kashtaRating(score: number) {
  if (score >= 80) return "excellent";
  if (score >= 65) return "good";
  if (score >= 50) return "fair";
  return "poor";
}
