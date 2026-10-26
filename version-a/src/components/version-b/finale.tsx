"use client";

import { useEffect, useRef, useState } from "react";
import { contact } from "@/lib/contact";
import { Reveal } from "./reveal";

/** Lets long addresses wrap after a slash instead of mid-word. */
function Breakable({ text }: { text: string }) {
  return text.split("/").map((part, index, all) => (
    <span key={index}>
      {part}
      {index < all.length - 1 ? (
        <>
          /<wbr />
        </>
      ) : null}
    </span>
  ));
}

const headline = ["Let’s make", "something."];

function Headline() {
  const root = useRef<HTMLHeadingElement>(null);
  const frame = useRef(0);

  // Letters near the pointer rise a little and warm to rose. Transform and
  // colour only, so the lines never reflow.
  function move(event: React.PointerEvent<HTMLHeadingElement>) {
    if (event.pointerType !== "mouse" || frame.current) {
      return;
    }
    const { clientX, clientY } = event;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      root.current
        ?.querySelectorAll<HTMLElement>("[data-letter]")
        .forEach((node) => {
          const box = node.getBoundingClientRect();
          const dx = clientX - (box.left + box.width / 2);
          const dy = clientY - (box.top + box.height / 2);
          const near = Math.max(0, 1 - Math.hypot(dx, dy) / 240);
          node.style.setProperty("--near", near.toFixed(3));
        });
    });
  }

  function leave() {
    root.current
      ?.querySelectorAll<HTMLElement>("[data-letter]")
      .forEach((node) => {
        node.style.setProperty("--near", "0");
      });
  }

  return (
    <h2
      id="contact-title"
      ref={root}
      className="vb-fn-title"
      onPointerMove={move}
      onPointerLeave={leave}
      aria-label={headline.join(" ")}
    >
      {headline.map((line) => (
        <span key={line} className="vb-fn-line" aria-hidden="true">
          {Array.from(line).map((char, index) =>
            char === " " ? (
              <span key={index} className="vb-fn-space" />
            ) : (
              <span key={index} data-letter="" className="vb-fn-letter">
                {char}
              </span>
            ),
          )}
        </span>
      ))}
    </h2>
  );
}

function LocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: contact.timeZone,
    });
    const tick = () => setTime(format.format(new Date()));
    tick();
    const id = window.setInterval(tick, 20000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <p className="vb-fn-time">
      Saudi Arabia <span>{time ?? "--:--"}</span>
    </p>
  );
}

function CopyEmail() {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<number | undefined>(undefined);

  async function copy() {
    try {
      await navigator.clipboard.writeText(contact.email);
      setState("copied");
    } catch {
      setState("failed");
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 2200);
  }

  return (
    <>
      <button type="button" className="vb-fn-copy" onClick={copy}>
        {state === "copied" ? "Copied" : "Copy address"}
      </button>
      <span className="vb-fn-sr" role="status">
        {state === "copied"
          ? "Email address copied"
          : state === "failed"
            ? "Copy failed. Use the email link instead."
            : ""}
      </span>
    </>
  );
}

export function VersionBFinale() {
  function toTop() {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }

  return (
    <section id="contact" className="vb-fn" aria-labelledby="contact-title">
      <div className="vb-fn-top">
        <p className="vb-kicker">06 / Contact</p>
        <p className="vb-fn-status">
          <span className="vb-fn-dot" aria-hidden="true" />
          {contact.status}
        </p>
      </div>

      <Headline />

      <Reveal className="vb-fn-intro">
        <p>Write about a project, a role, or a question.</p>
      </Reveal>

      <ul className="vb-fn-rows">
        <li>
          <a href={`mailto:${contact.email}`} className="vb-fn-row">
            <span className="vb-fn-label">Email</span>
            <span className="vb-fn-value">{contact.email}</span>
            <span className="vb-fn-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
          <CopyEmail />
        </li>
        <li>
          <a
            href={contact.linkedin.href}
            className="vb-fn-row"
            target="_blank"
            rel="noreferrer"
          >
            <span className="vb-fn-label">LinkedIn</span>
            <span className="vb-fn-value">
              <Breakable text={contact.linkedin.label} />
            </span>
            <span className="vb-fn-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        </li>
        <li>
          <a
            href={contact.github.href}
            className="vb-fn-row"
            target="_blank"
            rel="noreferrer"
          >
            <span className="vb-fn-label">GitHub</span>
            <span className="vb-fn-value">
              <Breakable text={contact.github.label} />
            </span>
            <span className="vb-fn-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        </li>
      </ul>

      <footer className="vb-fn-foot">
        <p>Mohammed Bin Shamlan</p>
        <LocalTime />
        <p>Portfolio / 2026</p>
        <button type="button" className="vb-fn-top-link" onClick={toTop}>
          Back to top <span aria-hidden="true">↑</span>
        </button>
      </footer>
    </section>
  );
}
