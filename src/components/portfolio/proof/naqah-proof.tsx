"use client";

import { useEffect, useRef, useState } from "react";
import { useHydrated } from "@/lib/use-hydrated";
import { Reveal } from "../reveal";

/** One evening at the ranch: what each moment says, in the fewest words. */
const moments = [
  {
    time: "5:40 pm",
    who: "Worker answers",
    ar: "كلها شربت إلا وضحى.",
    en: "All drank but Wadha.",
    status: "5:40 pm. The worker answers: all drank but Wadha.",
  },
  {
    time: "5:44 pm",
    who: "Facts saved",
    status: "5:44 pm. Saved: water, 11 of 12. Wadha, none since morning.",
  },
  {
    time: "7:00 pm",
    who: "Owner hears",
    ar: "وضحى ما شربت، والباقي بخير.",
    en: "Wadha hasn’t drunk. The rest are fine.",
    status: "7:00 pm. The owner hears: Wadha hasn’t drunk, the rest are fine.",
  },
] as const;

const STEP_MS = 1500;

function PlayIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M5 3.2v9.6a.6.6 0 0 0 .9.5l7.6-4.8a.6.6 0 0 0 0-1L5.9 2.7a.6.6 0 0 0-.9.5Z" />
    </svg>
  );
}

/**
 * Naqah on the home page: tonight's call in three moments. At rest the whole
 * evening is shown; "Play" walks through it one moment at a time.
 */
export function NaqahProof() {
  const hydrated = useHydrated();
  // null: the finished evening, nothing playing. 0–2: that moment is on. 3: played through.
  const [step, setStep] = useState<number | null>(null);
  const timers = useRef<number[]>([]);

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  useEffect(() => clear, []);

  const play = () => {
    clear();
    setStep(0);
    for (let i = 1; i <= moments.length; i++) {
      timers.current.push(window.setTimeout(() => setStep(i), i * STEP_MS));
    }
  };

  const playing = step !== null && step < moments.length;
  const stateOf = (i: number) => (step === null || step >= moments.length ? undefined : i < step ? "past" : i === step ? "now" : "wait");

  return (
    <Reveal className="pf-naqah">
      <figure className="pf-naqah-fig" data-playing={playing ? "true" : undefined}>
        <ol className="pf-naqah-day">
          {moments.map((m, i) => (
            <li key={m.time} className="pf-naqah-step" data-state={stateOf(i)} data-owner={i === 2 ? "true" : undefined}>
              <p className="pf-naqah-when">
                <span className="pf-naqah-dot" aria-hidden="true" />
                <strong>{m.time}</strong> {m.who}
              </p>
              {"ar" in m ? (
                <blockquote className="pf-naqah-say">
                  <p lang="ar" dir="rtl">
                    {m.ar}
                  </p>
                  <p className="pf-naqah-gloss">{m.en}</p>
                </blockquote>
              ) : (
                <dl className="pf-naqah-facts">
                  <div>
                    <dt>Water</dt>
                    <dd>11 of 12</dd>
                  </div>
                  <div data-flag="true">
                    <dt>Wadha</dt>
                    <dd>none since morning</dd>
                  </div>
                </dl>
              )}
            </li>
          ))}
        </ol>

        <figcaption className="pf-naqah-foot">
          <button
            type="button"
            className="pf-naqah-play"
            onClick={play}
            disabled={!hydrated}
            aria-hidden={hydrated ? undefined : "true"}
          >
            <PlayIcon />
            {step === null ? "Step through tonight’s call" : playing ? "Stepping through…" : "Step through again"}
          </button>
          <span className="pf-naqah-note">Sample call</span>
        </figcaption>

        <p className="vb-sr" role="status" aria-atomic="true">
          {playing && step !== null ? moments[step].status : ""}
        </p>
      </figure>
    </Reveal>
  );
}
