"use client";

import { useEffect, useRef, useState } from "react";
import { gthrzShots } from "@/lib/gthrz";
import { GthrzImg } from "../gthrz-img";
import { Reveal } from "../reveal";

/*
 * Gthrz on the home page: the host's phone and the guest's phone, side by
 * side. Sara asked to join Pizza Night. On the guest's screen (the real app
 * screen, continued) the address is hidden. The host's one tap, Approve,
 * is what puts the area on Sara's screen; the exact pin still waits for the
 * host's reveal time. The street map behind the chapter answers the same tap.
 * Without JavaScript it shows the hidden state, which is the app's default.
 */

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M7.5 10.5V8a4.5 4.5 0 0 1 9 0v2.5M6.5 10.5h11a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19v-7a1.5 1.5 0 0 1 1.5-1.5Z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 21c-4.4-5.2-7-9-7-12a7 7 0 0 1 14 0c0 3-2.6 6.8-7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

export function GthrzProof() {
  const [approved, setApproved] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // The chapter's map scene answers the same tap.
  useEffect(() => {
    const chapter = ref.current?.closest<HTMLElement>(".vb-proj");
    if (!chapter) return;
    chapter.dataset.reveal = approved ? "true" : "false";
  }, [approved]);

  return (
    <Reveal className="vb-gz">
      <div ref={ref} className="vb-gz-pair">
        {/* The host's side: one request, one tap. */}
        <div className="vb-gz-host" data-ui="">
          <p className="vb-gz-host-head">
            <span>Host · Pizza Night</span>
            <span className="vb-gz-sample">Sample event</span>
          </p>
          <p className="vb-gz-rule">
            <LockIcon />
            Address: reveal later, going guests only
          </p>
          <div className="vb-gz-req" data-state={approved ? "approved" : "waiting"}>
            <span className="vb-gz-avatar" aria-hidden="true">
              S
            </span>
            <p className="vb-gz-req-who" role="status" aria-atomic="true">
              <strong>Sara A.</strong>
              <span key={approved ? "ok" : "ask"}>{approved ? "Approved · going, 7 of 7" : "Asked to join · 2 min ago"}</span>
            </p>
            <button
              type="button"
              className="vb-gz-approve"
              aria-pressed={approved}
              onClick={() => setApproved((a) => !a)}
            >
              {approved ? "Undo" : "Approve"}
            </button>
          </div>
        </div>

        {/* The guest's side: the real event screen, and what Sara can see under it. */}
        <div className="vb-gz-guest" data-ui="" data-state={approved ? "approved" : "waiting"}>
          <p className="vb-gz-guest-tag">Sara&rsquo;s phone</p>
          <div className="vb-gz-shot" aria-hidden="true">
            <GthrzImg shot={gthrzShots.details} sizes="(max-width: 599px) 70vw, 280px" decorative />
          </div>
          <div className="vb-gz-under">
            <p className="vb-gz-where" role="status" aria-atomic="true">
              {approved ? <PinIcon /> : <LockIcon />}
              <span className="vb-gz-where-text" key={approved ? "area" : "hidden"}>
                <span className="vb-gz-label">Location</span>
                <strong>{approved ? "Al-Malqa, Riyadh" : "Hidden until the host approves you"}</strong>
                {approved ? <span className="vb-gz-fine">Exact pin 2 h before, when the host reveals it</span> : null}
              </span>
            </p>
            <p className="vb-gz-going" aria-hidden="true">
              {approved ? "Going" : "Requested"}
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
