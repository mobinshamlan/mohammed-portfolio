"use client";

import Image from "next/image";
import { useEffect, useId, useLayoutEffect, useRef, useState, type Ref } from "react";
import { publicUrl } from "@/lib/site";
import { useHydrated } from "@/lib/use-hydrated";
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

const eventChips = [
  {
    label: "Host: MO",
    icon: <><circle cx="12" cy="7" r="3" /><path d="M5 21v-2a7 7 0 0 1 14 0v2Z" /></>,
  },
  {
    label: "Public",
    icon: <><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18" /></>,
  },
  {
    label: "Capacity",
    icon: <><circle cx="9" cy="7" r="3" /><path d="M3 21v-2a6 6 0 0 1 12 0v2ZM16 4a3 3 0 0 1 0 6m2 4a6 6 0 0 1 3 5v2h-3" /></>,
  },
  {
    label: "Approval",
    icon: <><circle cx="9" cy="7" r="3" /><path d="M3 21v-2a6 6 0 0 1 12 0v2Zm12-12 2 2 4-4" /></>,
  },
];

function EventScreen({ approved, guests }: { approved: boolean; guests: Ref<HTMLDivElement> }) {
  const state = approved ? "approved" : "waiting";
  const details = useRef<HTMLDivElement>(null);
  const scrollHint = useId();
  const guestCount = approved ? 7 : 6;

  useLayoutEffect(() => {
    details.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [approved]);

  return (
    <IPhone
      time="6:45"
      label="Sara’s phone"
      className="vb-gz-guest"
      screenProps={{ className: "vb-gz-screen", "data-state": state }}
    >
      <div className="vb-gz-event-nav" aria-hidden="true">
        <span className="vb-gz-event-back">
          <svg viewBox="0 0 24 24"><path d="m14 6-6 6 6 6" /></svg>
          Back
        </span>
        <span className="vb-gz-event-icon">
          <svg viewBox="0 0 24 24">
            <path d="M12 16V2m-4 4 4-4 4 4M7 9H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-2" />
          </svg>
        </span>
        <span className="vb-gz-event-icon">
          <svg viewBox="0 0 24 24">
            <path d="M12 21s-8.5-5.8-8.5-11.8a4.6 4.6 0 0 1 8.5-2.4 4.6 4.6 0 0 1 8.5 2.4C20.5 15.2 12 21 12 21Z" />
          </svg>
        </span>
      </div>

      <div
        ref={details}
        className="vb-gz-event-scroll"
        role="region"
        aria-label="Pizza Night event details"
        aria-describedby={scrollHint}
        tabIndex={0}
      >
        <Image
          className="vb-gz-event-cover"
          src={publicUrl("/images/projects/gthrz/pizza-night-cover.webp")}
          alt=""
          width={344}
          height={344}
        />
        <div className="vb-gz-event-details">
          <ul className="vb-gz-event-chips" role="list" aria-label="Event settings">
            {eventChips.map(({ label, icon }) => (
              <li key={label}>
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">{icon}</svg>
                {label === "Capacity" ? `${guestCount}/7 going` : label}
              </li>
            ))}
          </ul>

          <p className="vb-gz-title">Pizza Night</p>
          <p className="vb-gz-when">Gathering · Sun · SEP 5 · 10:00 PM</p>
          <p className="vb-gz-where">
            {approved ? <PinIcon /> : <LockIcon />}
            {approved ? "Al-Malqa, Riyadh · exact pin 2h before" : "Location hidden until the host approves"}
          </p>

          <div ref={guests} className="vb-gz-event-guests" role="group" aria-label="Pizza Night guests" tabIndex={-1}>
            <p className="vb-gz-event-label">Guests</p>
            <div className="vb-gz-guest-row">
              {approved ? (
                <Image
                  className="vb-gz-guest-photos"
                  src={publicUrl("/images/projects/gthrz/pizza-night-guests.webp")}
                  alt=""
                  width={174}
                  height={37}
                />
              ) : (
                <span className="vb-gz-guest-lock" aria-hidden="true">
                  {Array.from({ length: 6 }, (_, index) => <span key={index} />)}
                </span>
              )}
              <span className="vb-gz-guest-label">{approved ? "Guest photos" : "Photos hidden"}</span>
            </div>
          </div>

          <div className="vb-gz-event-about">
            <p className="vb-gz-event-label">About</p>
            <p>A simple pizza night at home with friends. We’ll order a few different pizzas, put something on to watch, and keep it casual. Please RSVP so we can order enough food.</p>
          </div>
        </div>
      </div>

      <div className="vb-gz-event-footer">
        <p id={scrollHint} className="vb-gz-scroll-hint">↓ Scroll for event details</p>
        <p className="vb-gz-going">
          {approved ? <CheckIcon /> : null}
          {approved ? "Going" : "Requested"}
        </p>
      </div>
    </IPhone>
  );
}

export function GthrzProof() {
  const hydrated = useHydrated();
  const [approved, setApproved] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const guests = useRef<HTMLDivElement>(null);

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
          {approved ? (
            <button
              type="button"
              className="vb-gz-view-guests"
              onClick={() => {
                guests.current?.focus({ preventScroll: true });
                guests.current?.scrollIntoView({ block: "center", behavior: "instant" });
              }}
            >
              View guest photos ↓
            </button>
          ) : null}
        </div>

        <EventScreen approved={approved} guests={guests} />
      </div>
    </Reveal>
  );
}
