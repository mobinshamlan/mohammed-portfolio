"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { contact } from "@/lib/contact";
import { useHydrated } from "@/lib/use-hydrated";
import { Reveal } from "./reveal";

const riyadhClock = new Intl.DateTimeFormat("en-GB", {
  timeZone: contact.timeZone,
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

function subscribeMinute(listener: () => void) {
  const timer = window.setInterval(listener, 30000);
  return () => window.clearInterval(timer);
}

function useRiyadhTime() {
  return useSyncExternalStore(
    subscribeMinute,
    () => riyadhClock.format(new Date()),
    () => null,
  );
}

export function Contact() {
  const hydrated = useHydrated();
  const time = useRiyadhTime();
  const address = useRef<HTMLParagraphElement>(null);
  const [feedback, setFeedback] = useState("");

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(contact.email);
      setFeedback("Email address copied.");
    } catch {
      if (address.current) window.getSelection()?.selectAllChildren(address.current);
      setFeedback("The address is selected. Copy it manually.");
    }
  }

  return (
    <section id="contact" className="vb-contact vb-talk" aria-labelledby="contact-title">
      <Reveal className="vb-talk-panel">
        <div className="vb-talk-main">
          <h2 id="contact-title" className="vb-talk-title">Get in touch.</h2>
          <p className="vb-talk-lead">
            I’m looking for my first role building software or AI.
            Write to me in Arabic or English about a job, a project or a question.
          </p>
          <div className="vb-talk-actions">
            <a href={`mailto:${contact.email}`} className="vb-btn vb-talk-mail">
              Email me
            </a>
            {hydrated ? (
              <button type="button" className="vb-talk-copy" onClick={copyEmail}>
                Copy address
              </button>
            ) : null}
          </div>
          <div className="vb-talk-mailbox">
            <p ref={address} className="vb-talk-address">{contact.email}</p>
            <p className="vb-talk-feedback" role="status">{feedback}</p>
          </div>
        </div>

        <div className="vb-talk-postmark">
          <p className="vb-talk-city">
            Riyadh<span>Saudi Arabia</span>
          </p>
          {time ? <p className="vb-talk-time">{time} local time</p> : null}
          <ul className="vb-talk-links">
            <li>
              <a href={contact.linkedin.href} target="_blank" rel="noreferrer">
                LinkedIn profile
                <span className="vb-sr"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href={contact.github.href} target="_blank" rel="noreferrer">
                Code on GitHub
                <span className="vb-sr"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
