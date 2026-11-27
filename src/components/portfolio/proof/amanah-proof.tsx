"use client";

import { useRef, useState, type CSSProperties } from "react";
import { useHydrated } from "@/lib/use-hydrated";
import { Reveal } from "../reveal";
import { Tag } from "../scenes/amanah-scene";

/*
 * Amanah on the home page: the staff review, on the desk. A found umbrella
 * hangs on its paper tag; the AI has matched it to a lost report, and the
 * owner is asked one thing only they would know. The finder's note stays
 * sealed until they answer. Then the tag is stamped: approved and handed
 * over, or held. A sample claim; staff decide, the AI only suggests.
 */
const answers = [
  { id: "yellow", label: "Yellow", swatch: "#e2b23a" },
  { id: "black", label: "Black", swatch: "#1c1c1c" },
  { id: "brown", label: "Brown", swatch: "#8a5a2e" },
] as const;

type AnswerId = (typeof answers)[number]["id"];

const truth: AnswerId = "yellow";

function Lock() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
      <rect x="3" y="7" width="10" height="7" rx="1.5" fill="currentColor" />
      <path d="M5.5 7 V 5 a 2.5 2.5 0 0 1 5 0 V 7" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function AmanahProof() {
  const hydrated = useHydrated();
  const [answer, setAnswer] = useState<AnswerId | null>(null);
  const firstAnswer = useRef<HTMLButtonElement>(null);
  const verdict = answer === null ? "open" : answer === truth ? "match" : "miss";
  const chosen = answers.find((a) => a.id === answer);

  function resetClaim() {
    setAnswer(null);
    requestAnimationFrame(() => firstAnswer.current?.focus({ preventScroll: true }));
  }

  return (
    <Reveal className="vb-ap">
      <figure className="vb-ap-desk" data-verdict={verdict}>
        {/* The found item, hanging on its tag, and the finder's note pinned under it. */}
        <div className="vb-ap-found">
          <span className="vb-ap-string" aria-hidden="true" />
          <div className="vb-ap-tagart" aria-hidden="true">
            <Tag item="umbrella" label="مظلة زرقاء" code="A-0142" />
            <span className="vb-ap-stamp">{verdict === "match" ? "Approved" : verdict === "miss" ? "Held" : ""}</span>
          </div>
          <p className="vb-ap-note">
            <span className="vb-ap-note-head">
              <Lock />
              Finder&rsquo;s note, staff only
            </span>
            <strong>{verdict === "open" ? "Sealed until the owner answers" : "Handle: yellow"}</strong>
          </p>
        </div>

        {/* The claim, in the product's own screen. */}
        <div className="vb-ap-screen" data-ui="">
          <p className="vb-ap-top">
            <span className="vb-ap-mark">
              <span lang="ar">أمانة</span> Amanah
            </span>
            <span>Sample claim</span>
          </p>

          <ol className="vb-ap-chat" aria-label="Sample claim conversation">
            <li className="vb-ap-msg" data-from="amanah">
              <span>We found a blue umbrella at the library desk that might be yours.</span>
            </li>
            <li className="vb-ap-msg vb-ap-ask" data-from="amanah">
              <span lang="ar" dir="rtl">
                وش لون المقبض؟
              </span>
              <span id="amanah-q">What colour is the handle?</span>
            </li>
            {chosen ? (
              <li className="vb-ap-msg" data-from="owner" key={chosen.id}>
                <span>{chosen.label}</span>
              </li>
            ) : null}
          </ol>

          <div className="vb-ap-chips" role="group" aria-labelledby="amanah-q">
            {answers.map((a) => (
              <button
                key={a.id}
                ref={a === answers[0] ? firstAnswer : undefined}
                type="button"
                disabled={!hydrated || (chosen !== undefined && answer !== a.id)}
                aria-pressed={answer === a.id}
                aria-disabled={answer === a.id ? true : undefined}
                onClick={() => setAnswer((current) => current ?? a.id)}
                style={{ "--swatch": a.swatch } as CSSProperties}
              >
                {a.label}
              </button>
            ))}
          </div>

          <div className="vb-ap-result">
            <p role="status" aria-atomic="true">
              {verdict === "open" ? (
                <strong>Waiting for the owner&rsquo;s answer.</strong>
              ) : verdict === "match" ? (
                <>
                  <strong>Matches the finder&rsquo;s note.</strong> Staff stamp the tag and hand it over.
                </>
              ) : (
                <>
                  <strong>Doesn&rsquo;t match the note.</strong> Staff keep the umbrella and leave the report open.
                </>
              )}
            </p>
            {chosen ? <button className="vb-ap-reset" type="button" onClick={resetClaim}>Start a new claim</button> : null}
          </div>
        </div>
      </figure>
    </Reveal>
  );
}
