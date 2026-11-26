"use client";

import type { CSSProperties, MouseEvent, ReactNode } from "react";

/**
 * A link to a section of this page: it scrolls there, adds a history entry
 * and moves focus to the section's heading. Modified clicks keep the browser's own behaviour.
 */
export function focusSection(id: string, behavior?: ScrollBehavior) {
  const target = document.getElementById(id);
  if (!target) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: behavior ?? (reduced ? "instant" : "smooth"), block: "start" });
  const heading = target.querySelector<HTMLElement>("h1, h2, h3") ?? target;
  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
}

export function jumpToSection(id: string) {
  if (window.location.hash !== "#" + id) window.history.pushState(null, "", "#" + id);
  focusSection(id);
}

export function JumpLink({
  to,
  className,
  style,
  children,
}: {
  to: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    if (document.getElementById(to)) {
      event.preventDefault();
      jumpToSection(to);
    }
  }
  return (
    <a href={`#${to}`} className={className} style={style} onClick={onClick}>
      {children}
    </a>
  );
}
