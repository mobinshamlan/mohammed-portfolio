"use client";

import { useEffect, useRef, useState } from "react";
import { useHydrated } from "@/lib/use-hydrated";
import { Reveal } from "../reveal";
import { CamelMark } from "../scenes/naqah-scene";

/*
 * Naqah on the home page: the owner's phone at seven in the evening. Answer
 * it, and Naqah reads tonight's report out of what the worker said at 5:40;
 * the herd board beside it lights up the one camel that didn't drink.
 * A sample evening; the real call is Twilio and Saudi Arabic.
 */

const HERD = 12;
const WADHA = 7;

const lines = [
  { at: 1, ar: "مساء الخير يا أبو فهد، تقرير الليلة.", en: "Good evening, Abu Fahad. Tonight's report." },
  { at: 4, ar: "وضحى ما شربت، والباقي بخير.", en: "Wadha hasn't drunk. The rest are fine.", flag: true },
  { at: 7, ar: "سجلت إحدى عشر من اثنا عشر شربت.", en: "Logged: 11 of 12 drank." },
] as const;

const CALL_LENGTH = 10;

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1L6.6 10.8Z"
      />
    </svg>
  );
}

export function NaqahProof() {
  const hydrated = useHydrated();
  // -1: the phone is ringing. 0..CALL_LENGTH: seconds into the call. Past that: ended.
  const [tick, setTick] = useState(-1);
  const timer = useRef<number | null>(null);

  const stop = () => {
    if (timer.current !== null) window.clearInterval(timer.current);
    timer.current = null;
  };

  useEffect(() => stop, []);

  const answer = () => {
    stop();
    setTick(0);
    timer.current = window.setInterval(() => {
      setTick((t) => {
        if (t + 1 >= CALL_LENGTH) stop();
        return t + 1;
      });
    }, 1000);
  };

  const ringing = tick < 0;
  const ended = tick >= CALL_LENGTH;
  const live = !ringing && !ended;
  const said = lines.filter((l) => !ringing && tick >= l.at);
  const flagged = said.some((l) => "flag" in l);
  const speaking = live && lines.some((l) => tick >= l.at && tick < l.at + 2);
  const clock = `${Math.floor(Math.min(tick, CALL_LENGTH) / 60)}:${String(Math.max(tick, 0) % 60).padStart(2, "0")}`;

  return (
    <Reveal className="pf-nq">
      <figure className="pf-nq-fig" data-state={ringing ? "ringing" : ended ? "ended" : "live"}>
        {/* The herd, as the ranch's record keeps it: one mark per camel. */}
        <div className="pf-nq-herd">
          <p className="pf-nq-herd-title">
            Tonight at the trough <span>12 camels · sample</span>
          </p>
          <ul className="pf-nq-marks" aria-label="Herd tonight">
            {Array.from({ length: HERD }, (_, i) => {
              const wadha = i === WADHA;
              return (
                <li key={i} data-wadha={wadha ? "true" : undefined} data-lit={wadha && flagged ? "true" : undefined}>
                  <CamelMark />
                  <span className="vb-sr">{wadha ? "Wadha, did not drink" : `Camel ${i + 1}, drank`}</span>
                  {wadha ? (
                    <span className="pf-nq-name" aria-hidden="true">
                      وضحى
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ul>
          <p className="pf-nq-source">
            <strong>5:40 pm</strong> the worker answered: <span lang="ar" dir="rtl">كلها شربت إلا وضحى.</span>
            <span className="pf-nq-source-en">All drank but Wadha.</span>
          </p>
        </div>

        {/* The owner's phone. */}
        <div className="pf-nq-phone" data-ui="">
          <p className="pf-nq-bar">
            <span>7:00 pm</span>
            <span className="pf-nq-live" aria-hidden="true">
              {live ? clock : ended ? "Ended" : "Incoming"}
            </span>
          </p>
          <div className="pf-nq-caller">
            <span className="pf-nq-avatar" aria-hidden="true">
              <CamelMark />
            </span>
            <p>
              <strong>Naqah</strong>
              <span>{ringing ? "Ranch report, every evening" : live ? `On the call · ${clock}` : `Call ended · ${clock}`}</span>
            </p>
          </div>

          <ol className="pf-nq-lines" aria-live="polite" aria-atomic="false">
            {ringing ? (
              <li className="pf-nq-saved">
                Tonight&rsquo;s report is ready. Answer to hear it, as the owner does every evening at seven.
              </li>
            ) : null}
            {said.map((l) => (
              <li key={l.at} data-flag={"flag" in l ? "true" : undefined}>
                <span lang="ar" dir="rtl">
                  {l.ar}
                </span>
                <span className="pf-nq-en">{l.en}</span>
              </li>
            ))}
            {ended ? (
              <li className="pf-nq-saved">Saved to the ranch&rsquo;s record. The owner&rsquo;s website has the full day.</li>
            ) : null}
          </ol>

          <div className="pf-nq-dock">
            <span className="pf-nq-wave" data-on={speaking ? "true" : undefined} aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <i />
            </span>
            {ringing ? (
              <button type="button" className="pf-nq-answer" onClick={answer} disabled={!hydrated}>
                <PhoneIcon />
                Answer
              </button>
            ) : live ? (
              <span className="pf-nq-status">Naqah is speaking in Saudi Arabic</span>
            ) : (
              <button type="button" className="pf-nq-again" onClick={answer}>
                Take the call again
              </button>
            )}
          </div>
        </div>
      </figure>
    </Reveal>
  );
}
