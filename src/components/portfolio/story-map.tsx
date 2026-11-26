"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * On wide screens the planes follow the already visible route once it enters the viewport.
 */
export function RouteMap({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const route = ref.current;
    const motion = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    if (!route || !motion.matches || route.getBoundingClientRect().top < window.innerHeight) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          route.dataset.wait = "false";
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    route.dataset.wait = "true";
    observer.observe(route);

    return () => observer.disconnect();
  }, []);

  return (
    <ol ref={ref} className="vb-route" aria-label="Riyadh (RUH), London (LHR), Riyadh (RUH)">
      {children}
    </ol>
  );
}
