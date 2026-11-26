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
  { at: 7, ar: "سجلت إحدى عشر من اثنا عشر شربت.", en: "Logged: 11 of 12 drank." },
] as const;

const CALL_LENGTH = 10;

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
  const state = ringing ? "ringing" : ended ? "ended" : "live";

  return (
    <Reveal className="pf-nq">
      <figure className="pf-nq-fig" data-state={state}>
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

        {/* The owner's phone: the iOS call screen. */}
        <IPhone time="7:00" label="The owner's phone" className="pf-nq-phone" screenProps={{ className: "pf-nq-screen" }}>
          <div className="pf-nq-caller">
            <span className="pf-nq-avatar" aria-hidden="true">
              <CamelMark />
            </span>
            <strong>Naqah</strong>
            <span className="pf-nq-sub" role="status" aria-atomic="true">
              {ringing ? "Ranch report · incoming call" : live ? `On the call · ${clock}` : `Call ended · ${clock}`}
            </span>
          </div>

          <ol className="pf-nq-lines" aria-live="polite" aria-atomic="false">
            {ringing ? <li className="pf-nq-note">Tonight&rsquo;s report is ready. The owner gets this call every evening at seven.</li> : null}
            {said.map((l) => (
              <li key={l.at} data-flag={"flag" in l ? "true" : undefined}>
                <span lang="ar" dir="rtl">
                  {l.ar}
                </span>
                <span className="pf-nq-en">{l.en}</span>
              </li>
            ))}
            {ended ? <li className="pf-nq-note">Saved to the ranch&rsquo;s record. The website has the full day.</li> : null}
          </ol>

          <div className="pf-nq-dock">
            {live ? (
              <>
                <span className="pf-nq-wave" data-on={speaking ? "true" : undefined} aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
                <span className="pf-nq-status">Naqah is speaking in Saudi Arabic</span>
              </>
            ) : null}
            <div className="pf-ip-calls">
              {ringing ? (
                <>
                  <span className="pf-ip-call pf-ip-call-end" aria-hidden="true">
                    <i>
                      <CallEndIcon />
                    </i>
                    Decline
                  </span>
                  <button type="button" className="pf-ip-call pf-ip-call-go" onClick={answer} disabled={!hydrated}>
                    <i>
                      <CallIcon />
                    </i>
                    Accept
                  </button>
                </>
              ) : live ? (
                <span className="pf-ip-call pf-ip-call-end" aria-hidden="true">
                  <i>
                    <CallEndIcon />
                  </i>
                  End
                </span>
              ) : (
                <button type="button" className="pf-ip-call pf-ip-call-go" onClick={answer}>
                  <i>
                    <CallIcon />
                  </i>
                  Call again
                </button>
              )}
            </div>
          </div>
        </IPhone>
      </figure>
    </Reveal>
  );
}
