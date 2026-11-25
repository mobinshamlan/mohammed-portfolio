"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * A native <details> that opens itself on wide screens after mount and stays
 * collapsed on phones, where the page must be short. Without JavaScript it
 * is closed but fully readable once opened.
 */
export function Collapsible({
  summary,
  children,
  className = "",
  openAbove = 900,
}: {
  summary: ReactNode;
  children: ReactNode;
  className?: string;
  openAbove?: number;
}) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }
    if (window.matchMedia(`(min-width: ${openAbove}px)`).matches) {
      node.open = true;
    }
  }, [openAbove]);

  return (
    <details ref={ref} className={`vb-details ${className}`}>
      <summary className="vb-details-summary">{summary}</summary>
      <div className="vb-details-body">{children}</div>
    </details>
  );
}
