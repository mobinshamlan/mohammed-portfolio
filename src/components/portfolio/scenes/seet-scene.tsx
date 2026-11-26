"use client";

import { useEffect, useRef } from "react";

/*
 * Seet's own world behind its chapter: Riyadh at dusk, the skyline from the
 * live landing page turned to silhouette against the gold, standing on a Sadu
 * band. The lit windows are bookings: a few are held (outlined) and later
 * confirmed (filled), the one rule the product keeps. Reduced motion: still city.
 */

/** Stepped blocks as [width, height] pairs, laid left to right from x = 0. */
const FAR: [number, number][] = [
  [44, 46], [38, 58], [30, 40], [46, 70], [28, 52], [54, 62], [30, 44], [42, 84], [36, 50],
  [48, 66], [32, 42], [40, 74], [42, 56], [52, 92], [30, 60], [46, 48], [38, 72], [50, 54],
  [36, 64], [42, 46], [48, 80], [54, 58], [36, 44], [42, 66], [40, 50], [50, 76], [44, 52],
  [46, 62], [40, 46], [52, 70], [40, 54], [44, 60], [38, 48], [50, 68], [42, 44], [48, 58],
  [36, 72], [44, 50], [52, 64], [40, 46], [46, 56], [38, 70], [50, 48], [44, 62], [40, 52],
  [48, 66], [42, 44], [52, 58], [40, 50], [46, 64], [44, 46], [50, 56], [42, 60],
];

const NEAR: [number, number][] = [
  [70, 22], [60, 30], [80, 18], [90, 26], [120, 14], [100, 24], [140, 16], [110, 28], [120, 20],
  [100, 26], [110, 12], [100, 22], [130, 18], [90, 24], [120, 16], [110, 26], [140, 14], [100, 22],
  [120, 18], [90, 24],
];

/** Past the towers the city keeps low, clear of the caption above it. */
function blocks(steps: [number, number][]) {
  let d = "M0 300";
  let x = 0;
  for (const [w, h] of steps) {
    d += `V${300 - (x > 640 ? Math.round(h * 0.6) : h)}h${w}`;
    x += w;
  }
  return `${d}V300Z`;
}

/** Windows: [x, y, state]. Held windows are outlined until confirmed. */
const WINDOWS: [number, number, "lit" | "held"][] = [
  [304, 196, "lit"], [314, 236, "held"], [350, 176, "lit"], [342, 256, "lit"], [326, 150, "held"],
  [168, 210, "lit"], [176, 254, "held"], [162, 176, "lit"],
  [470, 156, "lit"], [482, 204, "held"], [470, 244, "lit"],
  [60, 262, "lit"], [118, 252, "held"],
  [606, 258, "lit"], [700, 274, "held"], [782, 278, "lit"], [902, 280, "held"],
  [1012, 276, "lit"], [1128, 269, "lit"], [1236, 264, "held"], [1338, 277, "lit"],
];

export function SeetScene() {
  const ref = useRef<HTMLDivElement>(null);

  // Windows only change while the chapter is on screen.
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      node.dataset.play = entry.isIntersecting ? "true" : "false";
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="seet-scene">
      <svg className="seet-city" viewBox="0 0 1440 300" preserveAspectRatio="xMinYMax meet" focusable="false">
        <path className="seet-far" d={blocks(FAR)} />
        <g className="seet-towers">
          {/* Al Faisaliah: four legs drawn in to the spire, the sphere held between them. */}
          <path d="M140 300 162 108h16l22 192zM169 40h2v60h-2z" />
          {/* Kingdom Centre: the parabola open to the sky, the skybridge across it. */}
          <path d="M296 300V170C296 118 306 74 318 34h4C322 76 325 102 330 116 335 102 338 76 338 34h4C354 74 364 118 364 170V300zM322 52h16v4h-16z" />
          {/* A slanted crown further along the road. */}
          <path d="M452 300V150l44-26v176z" />
          <path d="M520 300V214h34v86zM570 300V196h26v104z" />
        </g>
        <circle className="seet-beacon-halo" cx="170" cy="100" r="15" />
        <circle className="seet-beacon" cx="170" cy="100" r="10" />
        <path className="seet-near" d={blocks(NEAR)} />
        <g className="seet-windows">
          {WINDOWS.map(([x, y, state], i) =>
            state === "lit" ? (
              <rect key={`${x}-${y}`} className="seet-lit" x={x} y={y} width="5" height="7" />
            ) : (
              <g key={`${x}-${y}`}>
                <rect className="seet-held" x={x + 0.5} y={y + 0.5} width="4" height="6" />
                <rect className="seet-confirm" x={x} y={y} width="5" height="7" style={{ animationDelay: `${i * -1.3}s` }} />
              </g>
            ),
          )}
        </g>
      </svg>
      <svg className="seet-sadu" width="100%" height="16" focusable="false">
        <defs>
          <pattern id="seet-sadu" width="28" height="16" patternUnits="userSpaceOnUse">
            <rect className="seet-sadu-ground" width="28" height="16" />
            <path className="seet-sadu-teeth" d="M0 0h28l-3.5 3-3.5-3-3.5 3L14 0l-3.5 3L7 0 3.5 3zM0 16h28l-3.5-3-3.5 3-3.5-3-3.5 3-3.5-3L7 16l-3.5-3z" />
            <path className="seet-sadu-diamond" fillRule="evenodd" d="M14 4l4.5 4-4.5 4-4.5-4zm0 2.3L16 8l-2 1.7L12 8z" />
            <path className="seet-sadu-half" d="M0 5.5 2.8 8 0 10.5zM28 5.5 25.2 8 28 10.5z" />
          </pattern>
        </defs>
        <rect width="100%" height="16" fill="url(#seet-sadu)" />
      </svg>
    </div>
  );
}
