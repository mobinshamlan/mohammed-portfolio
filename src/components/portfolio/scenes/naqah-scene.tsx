"use client";

import { useEffect, useRef } from "react";

/*
 * Naqah's own world behind its chapter: the ranch at sundown. A caravan walks
 * the desert horizon, roped nose to tail, out from behind a near dune and
 * across a low sun. Drawn in the field's own ink at low strength, kept in the
 * band under the content. Reduced motion: the caravan stands in front of the sun.
 */

/** One dromedary facing right, feet on y = 46. Legs swing about the hip. */
function Camel({ x, scale = 1, delay }: { x: number; scale?: number; delay: number }) {
  const style = { animationDelay: `${delay}s` };
  return (
    <g transform={`translate(${x} ${128 - 46 * scale}) scale(${scale})`}>
      <rect className="naqah-leg naqah-leg-b" x="11" y="24" width="2.6" height="22" style={style} />
      <rect className="naqah-leg naqah-leg-a" x="39.5" y="24" width="2.6" height="22" style={style} />
      <path d="M8 17Q10 13 14 12Q22 0 30 9Q34 12 38 13L44 12Q48 11 50 4Q51 1 54 1.5L60 4Q62 5.5 60.5 7.5L55 8Q52 9 51 13Q49 22 44 25L42 27Q28 30 14 27Q9 26 8 22ZM9 15Q4 17 4.5 25L6 25Q6 19 10 17Z" />
      <rect className="naqah-leg naqah-leg-a" x="15.5" y="24" width="2.6" height="22" style={style} />
      <rect className="naqah-leg naqah-leg-b" x="43.5" y="24" width="2.6" height="22" style={style} />
    </g>
  );
}

/** Lead camel on the right; each follower's nose is roped to the tail ahead. */
const CARAVAN = [
  { x: 330, scale: 1.04 },
  { x: 244, scale: 0.98 },
  { x: 186, scale: 0.64 },
  { x: 96, scale: 1 },
  { x: 8, scale: 0.96 },
];

function rope(from: (typeof CARAVAN)[number], to: (typeof CARAVAN)[number]) {
  const noseX = from.x + 59 * from.scale;
  const noseY = 128 - 46 * from.scale + 8 * from.scale;
  const tailX = to.x + 7 * to.scale;
  const tailY = 128 - 46 * to.scale + 17 * to.scale;
  const sag = Math.max(noseY, tailY) + 7;
  return `M${noseX} ${noseY}Q${(noseX + tailX) / 2} ${sag} ${tailX} ${tailY}`;
}

export function NaqahScene() {
  const ref = useRef<SVGSVGElement>(null);

  // The caravan only walks while the chapter is on screen.
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
    <svg
      ref={ref}
      className="naqah-scene"
      viewBox="0 0 1440 240"
      preserveAspectRatio="xMidYMax slice"
      focusable="false"
    >
      <circle className="naqah-sun" cx="640" cy="128" r="72" />
      <path
        className="naqah-far"
        d="M0 128V112C90 104 170 92 250 96C330 100 380 112 450 110C560 106 600 84 700 86C800 88 860 108 960 106C1060 104 1110 90 1200 92C1290 94 1360 106 1440 104V128Z"
      />
      <g className="naqah-caravan">
        <g className="naqah-ropes">
          {CARAVAN.slice(1).map((camel, i) => (
            <path key={camel.x} d={rope(camel, CARAVAN[i])} />
          ))}
        </g>
        {CARAVAN.map((camel, i) => (
          <Camel key={camel.x} x={camel.x} scale={camel.scale} delay={-0.27 * i} />
        ))}
      </g>
      <rect className="naqah-ground" x="0" y="128" width="1440" height="112" />
      <path
        className="naqah-mid"
        d="M0 240V176C120 166 220 150 330 152C460 154 560 186 720 188C880 190 960 160 1100 158C1240 156 1340 172 1440 178V240Z"
      />
      <path className="naqah-near" d="M0 240V118C90 112 170 120 250 142C330 164 400 200 470 240Z" />
      <path className="naqah-near" d="M1440 240V122C1370 118 1300 128 1230 150C1160 172 1100 206 1050 240Z" />
    </svg>
  );
}
