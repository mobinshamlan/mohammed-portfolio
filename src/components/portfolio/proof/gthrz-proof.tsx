"use client";

import { useEffect, useRef, useState } from "react";
import { gthrzShots } from "@/lib/gthrz";
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

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 3v12M8 7l4-4 4 4M6 11v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-8" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.4-7 10-7 10Z" />
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
        {/* The host's side: one request, one tap. */}
        <div className="vb-gz-host" data-ui="">
          <p className="vb-gz-host-head">
            <span>Host · Pizza Night</span>
            <span className="vb-gz-sample">Sample event</span>
          </p>
          <p className="vb-gz-rule">
            <LockIcon />
            Only approved guests get the address, 2 hours before the event.
          </p>
          <div className="vb-gz-req" data-state={state}>
            <span className="vb-gz-avatar" aria-hidden="true">
              S
            </span>
            <p className="vb-gz-req-who" role="status" aria-atomic="true">
              <strong>Sara A.</strong>
              <span key={approved ? "ok" : "ask"}>{approved ? "Approved to attend" : "Asked to join"}</span>
            </p>
            <button
              type="button"
              className="vb-gz-approve"
              aria-label={approved ? "Undo approval for Sara" : "Approve Sara"}
              onClick={() => setApproved((a) => !a)}
            >
              {approved ? "Undo" : "Approve"}
            </button>
          </div>
        </div>

        {/* The guest's side: Sara's iPhone on the real event screen. */}
        <IPhone time="6:45" label="Sara's phone" className="vb-gz-guest" screenProps={{ className: "vb-gz-screen", "data-state": state }}>
          <div className="vb-gz-top" aria-hidden="true">
            <span className="vb-gz-back">‹ Back</span>
            <span className="vb-gz-top-icons">
              <i>
                <ShareIcon />
              </i>
              <i>
                <HeartIcon />
              </i>
            </span>
          </div>
          {/* The real Pizza Night cover photo, then the screen's chips, title
              and date set as live text from the same screen so they stay sharp
              at any size. */}
          <div className="vb-gz-shot" aria-hidden="true">
            <div className="vb-gz-slice vb-gz-slice-cover">
              <GthrzImg shot={gthrzShots.details} sizes="(max-width: 599px) 70vw, 280px" decorative />
            </div>
            <div className="vb-gz-rows">
              <p className="vb-gz-chips">
                <span>Host: MO</span>
                <span>Public</span>
                <span>7/7</span>
                <span>Approval</span>
              </p>
              <p className="vb-gz-title">Pizza Night</p>
              <p className="vb-gz-when">Gathering · Sun · SEP 5 · 10:00 PM</p>
              <p className="vb-gz-reveal">Location revealed 2h before</p>
            </div>
          </div>
          <div className="vb-gz-under">
            <p className="vb-gz-where" role="status" aria-atomic="true">
              {approved ? <PinIcon /> : <LockIcon />}
              <span className="vb-gz-where-text" key={approved ? "area" : "hidden"}>
                <span className="vb-gz-label">Location</span>
                <strong>{approved ? "Al-Malqa, Riyadh" : "Hidden until the host approves Sara"}</strong>
                {approved ? <span className="vb-gz-fine">Exact address appears 2 hours before the event</span> : null}
              </span>
            </p>
            <p className="vb-gz-going" aria-hidden="true">
              {approved ? <CheckIcon /> : null}
              {approved ? "Going" : "Requested"}
            </p>
          </div>
        </IPhone>
      </div>
    </Reveal>
  );
}
