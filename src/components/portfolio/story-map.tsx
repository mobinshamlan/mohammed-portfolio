"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * The route, drawn as one rail through the stops. Static HTML shows it whole;
 * once JavaScript runs, a rail still below the fold waits and is drawn stop by
 * stop when it comes into view. Reduced motion: drawn from the start.
 */
export function RouteMap({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }
    if (node.getBoundingClientRect().top < window.innerHeight * 0.9) {
      return;
    }
    node.dataset.wait = "true";
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          node.dataset.wait = "false";
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="vb-route-map">
      {children}
    </div>
  );
}
