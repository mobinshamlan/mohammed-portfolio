"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Wraps a scene whose small loops (star glints, fire glow) should run only
 * while it is on screen. Sets data-live="true" while visible; CSS does the rest.
 */
export function KashtaLive({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      node.dataset.live = entry.isIntersecting ? "true" : "false";
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
