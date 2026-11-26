"use client";

import { useEffect, useRef, useState } from "react";
import { gthrzShots } from "@/lib/gthrz";
import { useHydrated } from "@/lib/use-hydrated";
import { GthrzImg } from "../gthrz-img";
import { Reveal } from "../reveal";
import { IPhone } from "./iphone";

/*
 * Gthrz on the home page: the host's request card and the guest's iPhone,
 * side by side. Sara asked to join Pizza Night. On her screen (the real app
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

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

export function GthrzProof() {
  const hydrated = useHydrated();
  const [approved, setApproved] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // The chapter's map scene answers the same tap.
  useEffect(() => {
    const chapter = ref.current?.closest<HTMLElement>(".vb-proj");
    if (!chapter) return;
    chapter.dataset.reveal = approved ? "true" : "false";
  }, [approved]);

  const state = approved ? "approved" : "waiting";

  return (
    <Reveal className="vb-gz">
      <div ref={ref} className="vb-gz-pair">
        <div className="vb-gz-host" data-ui="">
          <p className="vb-gz-host-head">
            <span>Host view</span>
            <span className="vb-gz-sample">Sample event</span>
          </p>
          <div className="vb-gz-req" data-state={state}>
            <p className="vb-gz-req-who">
              <strong>Sara A.</strong>
              <span>{approved ? "Approved" : "Asked to join"}</span>
            </p>
            <button
              type="button"
              className="vb-gz-approve"
              disabled={!hydrated}
              aria-label={approved ? "Undo approval for Sara" : "Approve Sara"}
              onClick={() => setApproved((a) => !a)}
            >
              {approved ? "Undo" : "Approve"}
            </button>
          </div>
          <p className="vb-gz-status" role="status">
            {approved ? <PinIcon /> : <LockIcon />}
            <span>
              {approved
                ? "Sara sees the area. The exact address is still hidden."
                : "Approved guests get the address 2 hours before the event."}
            </span>
          </p>
        </div>

        <IPhone time="6:45" label="Sara's phone" className="vb-gz-guest" screenProps={{ className: "vb-gz-screen", "data-state": state }}>
          <div className="vb-gz-shot">
            <div className="vb-gz-slice vb-gz-slice-cover">
              <GthrzImg shot={gthrzShots.details} sizes="(max-width: 599px) 70vw, 280px" decorative />
            </div>
            <div className="vb-gz-rows">
              <p className="vb-gz-title">Pizza Night</p>
              <p className="vb-gz-when">Sunday, 10 pm</p>
            </div>
          </div>
          <dl className="vb-gz-address">
            <div className="vb-gz-where" data-visible={approved || undefined}>
              <dt>{approved ? <PinIcon /> : <LockIcon />} Area</dt>
              <dd key={state}>{approved ? "Al-Malqa, Riyadh" : "Hidden until approved"}</dd>
            </div>
            <div className="vb-gz-where">
              <dt><LockIcon /> Exact address</dt>
              <dd>
                Hidden
                <span className="vb-gz-address-time">Shared 2 hours before</span>
              </dd>
            </div>
          </dl>
          <p className="vb-gz-going">
            {approved ? <CheckIcon /> : null}
            {approved ? "Going" : "Request sent"}
          </p>
        </IPhone>
      </div>
    </Reveal>
  );
}
