"use client";

import { useState, useSyncExternalStore } from "react";
import { contact } from "@/lib/contact";
import { projects } from "@/lib/projects";
import { useHydrated } from "@/lib/use-hydrated";
import { Reveal } from "./reveal";

const work = projects.filter((project) => project.id !== "experiment");

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

/** The time in Riyadh, refreshed while the page is open; null during server rendering. */
function useRiyadhTime() {
  return useSyncExternalStore(
    subscribeMinute,
    () => riyadhClock.format(new Date()),
    () => null,
  );
}

/**
 * The close of the page: one line, one way to write, two places to look,
 * and where I am right now. The six product colours close the line that
 * joined the work.
 */
export function Contact() {
  const hydrated = useHydrated();
  const time = useRiyadhTime();
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section id="contact" className="vb-contact vb-talk" aria-labelledby="contact-title">
      <Reveal className="vb-talk-panel">
        <span className="vb-talk-glow" aria-hidden="true" />
        <ul className="vb-talk-swatches" aria-hidden="true">
          {work.map((project) => (
            <li key={project.id} style={{ background: project.field }} />
          ))}
        </ul>

        <h2 id="contact-title" className="vb-talk-title">
          Let&rsquo;s build something.
        </h2>
        <p className="vb-talk-lead">A role, a project or a question. Arabic or English.</p>

        <div className="vb-talk-actions">
          <a href={`mailto:${contact.email}`} className="vb-btn vb-talk-mail">
            Email me
          </a>
          {hydrated ? (
            <button type="button" className="vb-talk-copy" onClick={copyEmail}>
              <span>{contact.email}</span>
              <span className="vb-talk-copy-hint" aria-live="polite">
                {copied ? "Copied" : "Copy"}
              </span>
            </button>
          ) : (
            <span className="vb-talk-copy">{contact.email}</span>
          )}
        </div>

        <ul className="vb-talk-links">
          <li>
            <a href={contact.linkedin.href} target="_blank" rel="noreferrer">
              LinkedIn
              <span className="vb-sr"> (opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a href={contact.github.href} target="_blank" rel="noreferrer">
              GitHub
              <span className="vb-sr"> (opens in a new tab)</span>
            </a>
          </li>
        </ul>

        <p className="vb-talk-status">
          <span className="vb-hero-dot" aria-hidden="true" />
          {contact.status}
        </p>
        {time ? <p className="vb-talk-time">It&rsquo;s {time} in Riyadh right now.</p> : null}
      </Reveal>
    </section>
  );
}
