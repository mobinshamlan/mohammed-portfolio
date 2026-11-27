"use client";

import { useEffect, useRef, useState } from "react";
import { useHydrated } from "@/lib/use-hydrated";
import { Reveal } from "../reveal";
import { CamelMark } from "../scenes/naqah-scene";
import { CallEndIcon, CallIcon, IPhone } from "./iphone";

/*
 * Naqah on the home page: the owner's iPhone at seven in the evening, with
 * Naqah calling. Accept, and Naqah reads tonight's report out of what the
 * worker said at 5:40; the herd board beside it lights up the one camel that
 * didn't drink. A sample evening; the real call is Twilio and Saudi Arabic.
 */

const HERD = 12;
const WADHA = 7;

const lines = [
  { at: 1, ar: "مساء الخير يا أبو فهد، تقرير الليلة.", en: "Good evening, Abu Fahad. Tonight's report." },
  { at: 4, ar: "وضحى ما شربت، والباقي بخير.", en: "Wadha hasn't drunk. The rest are fine.", flag: true },
  { at: 7, ar: "سجّلت إن ١١ من ١٢ شربت.", en: "Logged: 11 of 12 drank." },
] as const;

const CALL_LENGTH = 10;

type Call = { phase: "ringing" | "live" | "ended"; tick: number };

export function NaqahProof() {
  const hydrated = useHydrated();
  const [call, setCall] = useState<Call>({ phase: "ringing", tick: 0 });
  const transcript = useRef<HTMLOListElement>(null);
  const { phase, tick } = call;
  const ringing = phase === "ringing";
  const ended = phase === "ended";
  const live = phase === "live";

  useEffect(() => {
    if (!live) return;
    const timer = window.setInterval(() => {
      setCall((current) => {
        if (current.phase !== "live") return current;
        const nextTick = current.tick + 1;
        return { phase: nextTick >= CALL_LENGTH ? "ended" : "live", tick: nextTick };
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [live]);

  const said = lines.filter((line) => tick >= line.at);
  const lineCount = said.length;
  useEffect(() => {
    const log = transcript.current;
    if (log && lineCount > 0) log.scrollTop = log.scrollHeight;
  }, [lineCount, ended]);

  const flagged = said.some((l) => "flag" in l);
  const speaking = live && lines.some((l) => tick >= l.at && tick < l.at + 2);
  const clock = `0:${String(tick).padStart(2, "0")}`;

  function handleCall() {
    setCall((current) => {
      if (current.phase === "live") return { ...current, phase: "ended" };
      return { phase: "live", tick: 0 };
    });
  }

  return (
    <Reveal className="pf-nq">
      <figure className="pf-nq-fig" data-state={phase}>
        {/* The herd, as the ranch's record keeps it: one mark per camel. */}
        <div className="pf-nq-herd">
          <p className="pf-nq-herd-title">
            Tonight at the trough <span>12 camels · sample</span>
          </p>
          <ul className="pf-nq-marks" role="list" aria-label="Herd tonight">
            {Array.from({ length: HERD }, (_, i) => {
              const wadha = flagged && i === WADHA;
              return (
                <li key={i} data-lit={wadha ? "true" : undefined}>
                  <CamelMark />
                  <span className="vb-sr">
                    {wadha ? "Wadha, did not drink" : `Camel ${i + 1}${flagged ? ", drank" : ""}`}
                  </span>
                  {wadha ? (
                    <span className="pf-nq-name" lang="ar" aria-hidden="true">
                      وضحى
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ul>
          <p className="pf-nq-source">
            {flagged ? (
              <>
                <strong><time dateTime="17:40">5:40 pm</time></strong> · Worker&rsquo;s report
                <span className="pf-nq-source-ar" lang="ar" dir="rtl">كلها شربت إلا وضحى.</span>
                <span className="pf-nq-source-en">All drank but Wadha.</span>
              </>
            ) : ended ? "The call ended before the report." : "Waiting for tonight’s report."}
          </p>
        </div>

        {/* The owner's phone: the iOS call screen. */}
        <IPhone time="7:00" label="The owner's phone" className="pf-nq-phone" screenProps={{ className: "pf-nq-screen" }}>
          <div className="pf-nq-caller">
            <span className="pf-nq-avatar" aria-hidden="true">
              <CamelMark />
            </span>
            <strong>Naqah</strong>
            <span className="pf-nq-sub" role="status" aria-atomic="true">
              {ringing ? "Sample incoming call" : live ? "Call in progress" : "Call ended"}
            </span>
            {live ? <span className="pf-nq-clock" aria-hidden="true">{clock}</span> : null}
          </div>

          <ol
            ref={transcript}
            className="pf-nq-lines"
            tabIndex={lineCount > 0 ? 0 : undefined}
            aria-label="Call transcript"
            aria-live="polite"
          >
            {ringing ? <li className="pf-nq-note">The evening report for Abu Fahad&rsquo;s ranch.</li> : null}
            {said.map((l) => (
              <li key={l.at} data-flag={"flag" in l ? "true" : undefined}>
                <span lang="ar" dir="rtl">
                  {l.ar}
                </span>
                <span className="pf-nq-en">{l.en}</span>
              </li>
            ))}
            {ended && lineCount === lines.length ? (
              <li className="pf-nq-note">Saved to the ranch&rsquo;s record.</li>
            ) : null}
          </ol>

          <div className="pf-nq-dock">
            {live ? (
              <span className="pf-nq-wave" data-on={speaking ? "true" : undefined} aria-hidden="true">
                <i /><i /><i /><i /><i />
              </span>
            ) : null}
            <div className="pf-ip-calls">
              {hydrated ? (
                <button
                  type="button"
                  className={`pf-ip-call ${live ? "pf-ip-call-end" : "pf-ip-call-go"}`}
                  onClick={handleCall}
                >
                  <i>{live ? <CallEndIcon /> : <CallIcon />}</i>
                  {ringing ? "Accept" : live ? "End call" : "Call again"}
                </button>
              ) : null}
            </div>
          </div>
        </IPhone>
      </figure>
    </Reveal>
  );
}
