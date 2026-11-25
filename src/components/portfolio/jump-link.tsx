"use client";

import type { MouseEvent, ReactNode } from "react";
import { focusSection } from "./nav";

/**
 * A link to a section of this page: it scrolls there, adds a history entry
 * and moves focus to the section's heading. Modified clicks keep the browser's own behaviour.
 */
export function JumpLink({ to, className, children }: { to: string; className?: string; children: ReactNode }) {
  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    if (document.getElementById(to)) {
      event.preventDefault();
      window.history.pushState(null, "", `#${to}`);
      focusSection(to);
    }
  }
  return (
    <a href={`#${to}`} className={className} onClick={onClick}>
      {children}
    </a>
  );
}
