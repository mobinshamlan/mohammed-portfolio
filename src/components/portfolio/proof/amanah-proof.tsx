"use client";

import { useId, useState, type CSSProperties } from "react";
import { Reveal } from "../reveal";

/*
 * Amanah on the home page: Gemini has suggested a found umbrella; the owner
 * proves it by answering what only they would know, and staff decide. The
 * finder's report says the handle is yellow. A made-up claim.
 */
const answers = [
  { id: "yellow", label: "Yellow", swatch: "#e2b23a" },
  { id: "black", label: "Black", swatch: "#1c1c1c" },
  { id: "wooden", label: "Wooden", swatch: "#8a5a2e" },
] as const;

const truth = "yellow";

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <circle cx="10" cy="10" r="9" fill="currentColor" />
      <path d="M6 10.4 8.6 13 14 7.4" fill="none" stroke="var(--field)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <circle cx="10" cy="10" r="8.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="m7 7 6 6m0-6-6 6" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function AmanahProof() {
  const [answer, setAnswer] = useState<(typeof answers)[number]["id"]>(truth);
  const id = useId();
  const match = answer === truth;

  return (
    <Reveal className="vb-ap">
      <figure className="vb-ap-figure">
        <div className="vb-ap-tag">
          <p className="vb-ap-item">
            Gemini&rsquo;s match: blue umbrella
            <span className="vb-ap-note">Example</span>
          </p>
          <p className="vb-ap-q" id={`${id}-q`}>
            <span lang="ar" dir="rtl">
              وش لون المقبض؟
            </span>
            <span>What colour is the handle?</span>
          </p>
          <div className="vb-ap-chips" role="radiogroup" aria-labelledby={`${id}-q`}>
            {answers.map((a) => (
              <label key={a.id} style={{ "--swatch": a.swatch } as CSSProperties}>
                <input
                  type="radio"
                  name={`${id}-handle`}
                  value={a.id}
                  checked={answer === a.id}
                  onChange={() => setAnswer(a.id)}
                />
                <span>{a.label}</span>
              </label>
            ))}
          </div>
        </div>

        <figcaption className="vb-ap-result">
          <p className="vb-ap-verdict" role="status" aria-atomic="true" data-match={match ? "true" : "false"}>
            {match ? <CheckIcon /> : <CrossIcon />}
            <strong key={match ? "match" : "miss"}>{match ? "Match \u2014 staff approve" : "Doesn\u2019t match \u2014 stays with staff"}</strong>
            <span className="vb-sr">. </span>
            <span className="vb-ap-found">Found: yellow handle</span>
          </p>
        </figcaption>
      </figure>
    </Reveal>
  );
}
