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
