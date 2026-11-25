"use client";

import { useId, useState } from "react";
import { useHydrated } from "@/lib/use-hydrated";

// A made-up match: the finder reported a yellow handle. Only staff see that.
const finderSaid = "Yellow";
const answers = ["Yellow", "Black", "Wooden"] as const;

function Verdict({ answer }: { answer: string | null }) {
  if (!answer) {
    return <p className="vb-demo-verdict">Waiting for the owner&rsquo;s answer.</p>;
  }
  const supports = answer === finderSaid;
  return (
    <p className="vb-demo-verdict" data-verdict={supports ? "supports" : "conflicts"}>
      <span className="vb-demo-verdict-word">{supports ? "Supports the claim" : "Conflicts"}</span>
      Owner said {answer.toLowerCase()}; the finder reported {finderSaid.toLowerCase()}.{" "}
      <strong>{supports ? "Approve for hand-over." : "Reject the claim."}</strong>
    </p>
  );
}

/**
 * The claim step: the owner answers one question, staff compare it with the
 * finder's report and decide. Before hydration it shows a matching answer.
 */
export function AmanahClaimDemo() {
  const hydrated = useHydrated();
  const [answer, setAnswer] = useState<string | null>(null);
  const shown = hydrated ? answer : finderSaid;
  const id = useId();

  return (
    <div className="vb-art vb-demo vb-demo-amanah" data-ui="">
      <p className="vb-demo-hint">
        <span className="vb-demo-tag">Simulated</span>
        {hydrated ? "Answer as the owner, then see what staff decide." : "A made-up claim, answered correctly."}
      </p>

      <div className="vb-demo-amanah-views">
        <section className="vb-demo-view" aria-labelledby={`${id}-owner`}>
          <h3 id={`${id}-owner`}>The owner sees</h3>
          <p className="vb-art-h">
            <span lang="ar">وش لون المقبض؟</span> What colour is the handle?
          </p>
          {hydrated ? (
            <div className="vb-art-options" role="group" aria-label="The owner's answer">
              {answers.map((a) => (
                <button
                  key={a}
                  type="button"
                  className="vb-btn vb-btn-quiet"
                  aria-pressed={answer === a}
                  onClick={() => setAnswer(a)}
                >
                  {a}
                </button>
              ))}
            </div>
          ) : (
            <p className="vb-art-sum">Answer: {finderSaid}.</p>
          )}
          <p className="vb-art-note">Never the finder&rsquo;s report, only their own claim on a private link.</p>
        </section>

        <section className="vb-demo-view" aria-labelledby={`${id}-staff`}>
          <h3 id={`${id}-staff`}>Staff see</h3>
          <p className="vb-art-sum">Finder&rsquo;s report: umbrella, {finderSaid.toLowerCase()} handle.</p>
          <div aria-live="polite">
            <Verdict answer={shown} />
          </div>
        </section>
      </div>

      <p className="vb-art-note">
        Staff can ask one more question when unsure. Every approve or reject is logged; the link credential is
        stored only as a SHA-256 hash.
      </p>
    </div>
  );
}
