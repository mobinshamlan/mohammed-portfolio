"use client";

import { useEffect, useId, useRef, useState } from "react";
import { callMoments, callScript } from "@/lib/naqah-call";
import { useHydrated } from "@/lib/use-hydrated";
import { DayLine } from "./dayline";

const STEP_MS = 1150;

/**
 * The Naqah call, played in about fifteen seconds. Play advances on a timer;
 * Previous and Next step through by hand; arrow keys and Space work when the
 * demo has focus. Under reduced motion nothing auto-advances.
 */
export function CallDemo({ compact = false, id }: { compact?: boolean; id?: string }) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);
  const mounted = useHydrated();
  const log = useRef<HTMLOListElement>(null);
  const titleId = useId();
  const last = callScript.length - 1;
  const done = step >= last;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setReduced(query.matches);
      if (query.matches) {
        setPlaying(false); // a running timer stops the moment reduced motion turns on
      }
    };
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!playing || done) {
      return;
    }
    const id = window.setTimeout(() => {
      setStep((s) => Math.min(last, s + 1));
    }, STEP_MS);
    return () => window.clearTimeout(id);
  }, [playing, step, done, last]);

  // When the last line is reached while playing, stop. Done in an event, not an effect.
  const stillPlaying = playing && !done;

  useEffect(() => {
    const node = log.current;
    if (!node) {
      return;
    }
    node.scrollTo({ top: node.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [step, reduced]);

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      setPlaying(false);
      setStep((s) => Math.min(last, s + 1));
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      setPlaying(false);
      setStep((s) => Math.max(0, s - 1));
    } else if (event.key === " " && event.target === event.currentTarget) {
      event.preventDefault();
      toggle();
    }
  }

  function toggle() {
    if (reduced) {
      setStep((s) => (done ? 0 : Math.min(last, s + 1)));
      return;
    }
    if (done) {
      setStep(0);
      setPlaying(true);
      return;
    }
    setPlaying((p) => !p);
  }

  void stillPlaying;

  // Before hydration the whole transcript is readable; after it, the demo steps.
  const visibleStep = mounted ? step : last;
  const activeMoment = callMoments.filter((m) => m.at <= visibleStep).length - 1;
  const shown = callScript.slice(0, visibleStep + 1);
  const facts = shown.filter((line) => line.kind === "fact");

  return (
    <div
      id={id}
      className={`vb-call ${compact ? "vb-call-compact" : ""}`}
      data-ui=""
      role="region"
      aria-labelledby={titleId}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <div className="vb-call-head">
        <p id={titleId} className="vb-call-title">
          The daily call, in fifteen seconds
        </p>
        <p className="vb-call-sub">
          Simulated transcript with made-up names and numbers.{" "}
          {reduced ? "Reduced motion is on: step with Next, or the arrow keys." : "Arrow keys step, Space plays."}
        </p>
      </div>

      <DayLine moments={callMoments} active={activeMoment} label="Moments of the call" />

      <div className="vb-call-body">
        <ol ref={log} className="vb-call-log" aria-live="polite">
          {shown.map((line, index) => {
            if (line.kind === "event") {
              return (
                <li key={index} className="vb-call-event">
                  <span className="vb-call-time">{line.time}</span> {line.text}
                </li>
              );
            }
            if (line.kind === "fact") {
              return null;
            }
            return (
              <li key={index} className="vb-call-line" data-who={line.kind}>
                <span className="vb-call-who">
                  {line.kind === "naqah" ? "Naqah" : "Worker"}
                </span>
                <span className="vb-call-ar" lang="ar">
                  {line.ar}
                </span>
                <span className="vb-call-en">{line.en}</span>
              </li>
            );
          })}
        </ol>

        <div className="vb-call-facts">
          <p className="vb-call-facts-title">Kept for the owner</p>
          {facts.length === 0 ? (
            <p className="vb-call-facts-empty">Nothing yet. Audio is never kept; facts appear here.</p>
          ) : (
            <ul>
              {facts.map((fact, index) =>
                fact.kind === "fact" ? (
                  <li key={index} data-flag={fact.flag ? "true" : undefined}>
                    <span>{fact.label}</span>
                    <strong>{fact.value}</strong>
                  </li>
                ) : null,
              )}
            </ul>
          )}
        </div>
      </div>

      <div className="vb-call-controls">
        <button type="button" className="vb-btn vb-btn-field" onClick={toggle}>
          {reduced
            ? done
              ? "Start again"
              : "Next line"
            : done
              ? "Play again"
              : stillPlaying
                ? "Pause"
                : step === 0
                  ? "Play the call"
                  : "Resume"}
        </button>
        <button
          type="button"
          className="vb-btn vb-btn-quiet"
          onClick={() => {
            setPlaying(false);
            setStep((s) => Math.max(0, s - 1));
          }}
          disabled={step === 0}
          aria-label="Previous line"
        >
          Back
        </button>
        <button
          type="button"
          className="vb-btn vb-btn-quiet"
          onClick={() => {
            setPlaying(false);
            setStep((s) => Math.min(last, s + 1));
          }}
          disabled={done}
          aria-label="Next line"
        >
          Next
        </button>
        <span className="vb-call-count" aria-hidden="true">
          {step + 1} / {callScript.length}
        </span>

      </div>
    </div>
  );
}
