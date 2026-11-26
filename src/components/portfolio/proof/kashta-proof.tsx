import type { CSSProperties } from "react";
import { kashtaExample, kashtaRating } from "@/lib/kashta-example";
import { Reveal } from "../reveal";

// The forecast in a few words per row; the scores and weights come from the example.
const readings: Record<string, string> = {
  Temperature: "21.7° in the evening",
  Wind: "11.5 km/h strongest gust",
  Rain: "0% chance",
  Dust: "85 µg/m³ peak",
  Cloud: "0% cover overnight",
};

const ratingWords = { excellent: "Excellent", good: "Good", fair: "Fair", poor: "Poor" } as const;

/**
 * Kashta on the home page: one real night and how its score was made. Each
 * reading earns points up to its weight; the points add up to the score.
 * Nothing to press: the arithmetic is the explanation.
 */
export function KashtaProof() {
  const { site, shortNight, liveScore, rows } = kashtaExample;
  const maxWeight = Math.max(...rows.map((row) => row.weight));
  const points = rows.map((row) => ({
    ...row,
    possible: Math.round(row.weight * 100),
    earned: Math.round(row.score * row.weight),
  }));
  const rating = ratingWords[kashtaRating(liveScore)];

  return (
    <Reveal className="vb-kp">
      <figure className="vb-kp-card">
        <div className="vb-kp-top">
          <p className="vb-kp-score">
            <strong>{liveScore}</strong>
            <span>
              out of 100
              <br />
              <span className="vb-kp-rating">{rating}</span>
            </span>
          </p>
          <div className="vb-kp-where">
            <p lang="ar" dir="rtl" className="vb-kp-ar">
              متنزه الرحمانية البري
            </p>
            <p className="vb-kp-site">
              {site}
            </p>
            <p className="vb-kp-date">Best night of the week &middot; <span>Wed {shortNight}</span></p>
          </div>
        </div>

        <ul className="vb-kp-rows" aria-label="Points each reading earned">
          {points.map((row, i) => (
            <li
              key={row.factor}
              style={
                {
                  "--track": `${(row.weight / maxWeight) * 100}%`,
                  "--fill": `${row.score}%`,
                  "--i": i,
                } as CSSProperties
              }
            >
              <span className="vb-kp-factor">
                {row.factor}
                <span>{readings[row.factor]}</span>
              </span>
              <span className="vb-kp-track" aria-hidden="true">
                <span />
              </span>
              <span className="vb-kp-points" data-short={row.earned < row.possible ? "true" : undefined}>
                {row.earned}
                <span>/{row.possible}</span>
              </span>
            </li>
          ))}
        </ul>

        <p className="vb-kp-sum">
          {points.map((row) => row.earned).join(" + ")} = <strong>{liveScore}</strong>
        </p>

        <div className="vb-kp-rule">
          <p lang="ar" dir="rtl">
            الكود يحسب، و Llama يشرح بس.
          </p>
          <p>Code computes the score; Llama only explains it.</p>
        </div>

        <figcaption className="vb-kp-caption">
          A real forecast, as the live app scored it for {shortNight}.
        </figcaption>
      </figure>
    </Reveal>
  );
}
