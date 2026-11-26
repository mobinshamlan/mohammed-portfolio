"use client";

import { useState, type CSSProperties } from "react";
import { Reveal } from "../reveal";
import { Tag } from "../scenes/amanah-scene";

/*
 * Amanah on the home page: a found umbrella hangs on its tag. Gemini matched it
 * to a lost report; before it leaves the desk, the owner answers one thing only
 * they would know. Staff see the finder's note and stamp the tag. A sample claim.
 */
const answers = [
  { id: "yellow", label: "Yellow", swatch: "#e2b23a" },
  { id: "black", label: "Black", swatch: "#1c1c1c" },
  { id: "wooden", label: "Wooden", swatch: "#8a5a2e" },
] as const;

type AnswerId = (typeof answers)[number]["id"];

const truth: AnswerId = "yellow";

export function AmanahProof() {
  const [answer, setAnswer] = useState<AnswerId | null>(null);
  const verdict = answer === null ? "open" : answer === truth ? "match" : "miss";

  return (
    <Reveal className="vb-ap">
      <figure className="vb-ap-figure" data-verdict={verdict}>
        {/* The found item, on the desk. */}
        <div className="vb-ap-found">
          <span className="vb-ap-string" aria-hidden="true" />
          <div className="vb-ap-tagart" aria-hidden="true">
            <Tag item="umbrella" label="مظلة زرقاء" code="A-0142" />
          </div>
          <span className="vb-ap-stamp" aria-hidden="true">
            {verdict === "match" ? "Approved" : verdict === "miss" ? "Held" : ""}
          </span>
          <p className="vb-ap-finder">
            <span>Finder&rsquo;s note, staff only</span>
            <strong>Yellow handle</strong>
          </p>
        </div>

        {/* The owner's claim. */}
        <div className="vb-ap-claim" data-ui="">
          <p className="vb-ap-item">
            Gemini matched your report to a found blue umbrella
            <span className="vb-ap-note">Sample claim</span>
          </p>
          <p className="vb-ap-q" id="amanah-q">
            <span lang="ar" dir="rtl">
              وش لون المقبض؟
            </span>
            <span>What colour is the handle?</span>
          </p>
          <div className="vb-ap-chips" role="group" aria-labelledby="amanah-q">
            {answers.map((a) => (
              <button
                key={a.id}
                type="button"
                aria-pressed={answer === a.id}
                onClick={() => setAnswer(a.id)}
                style={{ "--swatch": a.swatch } as CSSProperties}
              >
                {a.label}
              </button>
            ))}
          </div>

          <figcaption className="vb-ap-result" role="status" aria-atomic="true">
            {verdict === "open" ? (
              <>
                <strong>Waiting for your answer.</strong> Staff decide; Gemini only suggests.
              </>
            ) : verdict === "match" ? (
              <>
                <strong>Matches the finder&rsquo;s note.</strong> Staff approve and hand it over.
              </>
            ) : (
              <>
                <strong>Doesn&rsquo;t match.</strong> Staff keep it; your report stays open.
              </>
            )}
          </figcaption>
        </div>
      </figure>
    </Reveal>
  );
}
