"use client";

import { useState } from "react";
import { useHydrated } from "@/lib/use-hydrated";
import { Reveal } from "../reveal";

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="8.25" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M7.5 10.5V8a4.5 4.5 0 0 1 9 0v2.5M6.5 10.5h11a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19v-7a1.5 1.5 0 0 1 1.5-1.5Z" />
    </svg>
  );
}

/**
 * Seet on the home page: the AI has held Tuesday on WhatsApp. Pressing "Pay
 * the deposit" is the only thing that turns Held into Confirmed. Without
 * JavaScript it shows the hold.
 */
export function SeetProof() {
  const hydrated = useHydrated();
  const [paid, setPaid] = useState(false);

  return (
    <Reveal className="pf-seet">
      <figure className="pf-seet-card">
        <div className="pf-seet-bubble">
          <p className="pf-seet-from">
            Seet on WhatsApp
            <span className="pf-seet-note">
              <span className="vb-sr">. </span>Example
            </span>
          </p>
          <p className="pf-seet-ar" lang="ar" dir="rtl">
            تم، حجزت لكم الثلاثاء مؤقتًا. يتأكد الحجز بعد العربون.
          </p>
          <p className="pf-seet-gloss">Done, Tuesday is held for you. It&rsquo;s confirmed once the deposit is paid.</p>
        </div>

        <figcaption className="pf-seet-foot">
          <p className="pf-seet-status" role="status" aria-atomic="true" data-paid={paid ? "true" : undefined}>
            <span className="vb-sr">Tuesday: </span>
            <strong key={paid ? "paid" : "held"}>
              {paid ? <LockIcon /> : <ClockIcon />}
              {paid ? "Confirmed" : "Held"}
            </strong>
            <span className="vb-sr">, </span>
            <span className="pf-seet-by">{paid ? "by the payment, not the AI" : "waiting for the deposit"}</span>
          </p>
          <button
            type="button"
            className="pf-seet-pay"
            onClick={() => setPaid((p) => !p)}
            disabled={!hydrated}
            aria-hidden={hydrated ? undefined : "true"}
          >
            {paid ? "Start again" : "Pay the deposit"}
          </button>
        </figcaption>
      </figure>
    </Reveal>
  );
}
