"use client";

import { useEffect, useRef, type ReactNode } from "react";

/*
 * The arc is drawn in a 1000-wide box whose stops sit at the left edge of each
 * route column (1 : 0.8 : 2.2 : 1.35 : 0.75), so every point lands above its stop.
 * Up from home, the long top stretch is London, then down to home again.
 */
const POINTS = [
  { x: 0, y: 100, kind: "home" },
  { x: 164, y: 62, kind: "short" },
  { x: 295, y: 30, kind: "long" },
  { x: 656, y: 40, kind: "now" },
  { x: 877, y: 80, kind: "next" },
] as const;

const FLOOR = 112;

/**
 * The route drawn as one arc above the stops. Static HTML shows it whole; once
 * JavaScript runs, an arc still below the fold waits and is drawn left to right
 * when it comes into view. Reduced motion: drawn from the start.
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
      <svg
        className="vb-route-arc"
        viewBox={`0 0 1000 ${FLOOR}`}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="vb-route-ahead" gradientUnits="userSpaceOnUse" x1="877" x2="1000" y1="0" y2="0">
            <stop offset="0" stopColor="currentColor" stopOpacity="0.6" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        {POINTS.map((point) => (
          <line
            key={`drop-${point.kind}`}
            className="vb-route-drop"
            data-kind={point.kind}
            x1={point.x}
            x2={point.x}
            y1={point.y}
            y2={FLOOR}
          />
        ))}
        <path className="vb-route-trip" d="M0 100C60 88 115 76 164 62C210 50 252 40 295 30" />
        <path className="vb-route-london" d="M295 30C380 8 560 0 656 40" />
        <path className="vb-route-trip" d="M656 40C740 74 810 78 877 80" />
        <path className="vb-route-ahead" d="M877 80C920 82 960 90 1000 98" />
        {POINTS.map((point, index) => (
          <g
            key={point.kind}
            className="vb-route-dot"
            data-kind={point.kind}
            style={{ transitionDelay: `${0.15 + index * 0.28}s` }}
          >
            {point.kind === "now" ? <circle className="vb-route-halo" cx={point.x} cy={point.y} r="12" /> : null}
            <circle cx={point.x} cy={point.y} r="6" />
          </g>
        ))}
      </svg>
      {children}
    </div>
  );
}
