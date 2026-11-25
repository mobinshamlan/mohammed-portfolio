import type { CSSProperties } from "react";
import { KashtaLive } from "./kashta-live";

/*
 * Kashta's desert night, drawn from the app's own hero: the same sky, dunes and
 * black hair tent with its lit door. Here the camp is a whole row of tents set
 * out in real depth (CSS 3D), and as the chapter scrolls by the camera pulls
 * back the way the app does for stargazing: the tents fall away into the dark
 * and the sky opens. Stars come from a fixed seed, so every render matches.
 */

type Star = { x: number; y: number; r: number; o: number };

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function makeStars(count: number, seed: number): Star[] {
  const rand = seeded(seed);
  return Array.from({ length: count }, () => {
    const x = rand() * 1440;
    // Denser toward the top of the sky, thinning toward the horizon.
    const y = Math.pow(rand(), 1.4) * 820;
    return { x, y, r: 0.45 + rand() * 1.15, o: 0.25 + rand() * 0.7 };
  });
}

const STARS = makeStars(190, 20261126);

// The bright four-pointed stars from the app's stargazing sky; a few glint.
const GLINTS: { x: number; y: number; s: number; twinkle?: number }[] = [
  { x: 214, y: 46, s: 0.8, twinkle: 1 },
  { x: 610, y: 120, s: 1 },
  { x: 742, y: 40, s: 0.7, twinkle: 2 },
  { x: 930, y: 196, s: 1.1, twinkle: 3 },
  { x: 1090, y: 70, s: 0.8 },
  { x: 1212, y: 250, s: 0.9, twinkle: 1 },
  { x: 1336, y: 128, s: 1.2, twinkle: 2 },
  { x: 1400, y: 420, s: 0.7 },
  { x: 1110, y: 560, s: 0.8, twinkle: 3 },
  { x: 820, y: 600, s: 0.6 },
];

const GLINT_PATH = "M0 -9 L 0.9 0 L 0 9 L -0.9 0 Z M -9 0 L 0 0.9 L 9 0 L 0 -0.9 Z";

/*
 * The camp, in world units: dx is the sideways distance from the vanishing
 * point (px at depth 0), z how far back the tent stands (px). Two rows face
 * each other across a lantern-lit path that runs off to the horizon.
 */
const TENTS: { dx: number; z: number; lit?: boolean }[] = [
  { dx: 470, z: 0, lit: true },
  { dx: -190, z: 260, lit: true },
  { dx: 470, z: 560 },
  { dx: -190, z: 860, lit: true },
  { dx: 470, z: 1180 },
  { dx: -190, z: 1520 },
  { dx: 470, z: 1880, lit: true },
  { dx: -190, z: 2280 },
  { dx: 470, z: 2700 },
  { dx: -190, z: 3150 },
  { dx: 470, z: 3650 },
  { dx: -190, z: 4200 },
  { dx: 470, z: 4800 },
  { dx: -190, z: 5450 },
  { dx: 470, z: 6150 },
  { dx: -190, z: 6900 },
];

// A low lantern on the path side of each tent, a little in front of the door.
const LANTERNS = TENTS.map((tent) => ({ dx: tent.dx + (tent.dx > 0 ? -150 : 150), z: tent.z - 90 }));

function depth(dx: number, z: number): CSSProperties {
  return { "--dx": dx, "--z": z } as CSSProperties;
}

/** The app's tent, drawn once: black hair roof, guy ropes, sadu stripe, lit door. */
function Tent({ lit }: { lit?: boolean }) {
  return (
    <svg viewBox="-30 0 322 66" focusable="false">
      <path d="M14 20 L -26 64 M 246 22 L 290 64" stroke="#3a3236" strokeWidth="1" />
      <path d="M0 62 L 14 20 L 52 8 L 92 14 L 132 6 L 172 14 L 212 8 L 246 22 L 262 62 Z" fill="#0d0b0c" />
      <path d="M14 20 L 52 8 L 92 14 L 132 6 L 172 14 L 212 8 L 246 22" stroke="#2b2426" strokeWidth="1.5" fill="none" />
      <path d="M30 62 L 30 30 M 236 62 L 236 30" stroke="#2b2426" strokeWidth="1.2" />
      <path d="M6 50 L 256 50" stroke="#94482f" strokeWidth="2.2" strokeDasharray="6 4" opacity="0.8" />
      <path d="M70 62 L 82 30 L 150 30 L 160 62 Z" fill="#3b2418" />
      <path d="M70 62 L 82 30 L 150 30 L 160 62 Z" fill="#e8894a" opacity={lit ? 0.42 : 0.16} />
    </svg>
  );
}

export function KashtaScene() {
  return (
    <KashtaLive className="ks">
      <svg className="ks-band" viewBox="0 0 1440 900" preserveAspectRatio="xMaxYMin slice" focusable="false">
        <defs>
          <linearGradient id="ks-band" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#a9c4e8" stopOpacity="0.04" />
            <stop offset="0.4" stopColor="#c9d6f0" stopOpacity="0.26" />
            <stop offset="0.6" stopColor="#efe2cf" stopOpacity="0.32" />
            <stop offset="0.8" stopColor="#c9d6f0" stopOpacity="0.2" />
            <stop offset="1" stopColor="#a9c4e8" stopOpacity="0.05" />
          </linearGradient>
          <radialGradient id="ks-core" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#f6e6cc" stopOpacity="0.4" />
            <stop offset="0.5" stopColor="#d9c7b0" stopOpacity="0.12" />
            <stop offset="1" stopColor="#d9c7b0" stopOpacity="0" />
          </radialGradient>
          <filter id="ks-blur-wide" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="40" />
          </filter>
          <filter id="ks-blur-mid" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="16" />
          </filter>
        </defs>
        <path
          d="M420 960 C 700 700, 1000 420, 1560 -40 L 1560 180 C 1100 520, 820 780, 640 980 Z"
          fill="url(#ks-band)"
          filter="url(#ks-blur-wide)"
        />
        <path
          d="M500 940 C 760 700, 1040 440, 1540 20 L 1540 100 C 1060 500, 800 760, 600 960 Z"
          fill="url(#ks-band)"
          filter="url(#ks-blur-mid)"
        />
        <ellipse cx="1060" cy="380" rx="240" ry="90" transform="rotate(-40 1060 380)" fill="url(#ks-core)" filter="url(#ks-blur-mid)" />
        <path
          d="M640 860 C 820 680, 1000 520, 1180 360 C 1290 260, 1380 180, 1480 100"
          stroke="#0b0f1c"
          strokeWidth="18"
          fill="none"
          opacity="0.45"
          filter="url(#ks-blur-mid)"
        />
      </svg>

      <svg className="ks-sky" viewBox="0 0 1440 900" preserveAspectRatio="xMaxYMin slice" focusable="false">
        <g fill="#eef0f6">
          {STARS.map((star, index) => (
            <circle
              key={index}
              cx={star.x.toFixed(1)}
              cy={star.y.toFixed(1)}
              r={star.r.toFixed(2)}
              opacity={star.o.toFixed(2)}
            />
          ))}
        </g>
        {GLINTS.map((glint, index) => (
          <g key={index} transform={`translate(${glint.x} ${glint.y}) scale(${glint.s})`}>
            <path
              className="ks-glint"
              data-twinkle={glint.twinkle}
              d={GLINT_PATH}
              fill="#ffffff"
              opacity="0.8"
            />
          </g>
        ))}
      </svg>

      <div className="ks-camp">
        <div className="ks-horizon" />
        <svg className="ks-dunes" viewBox="0 0 1440 400" preserveAspectRatio="none" focusable="false">
          <path
            d="M0 40 L 140 37 L 210 31 L 420 30 L 470 34 L 700 32 L 760 27 L 1010 26 L 1060 32 L 1300 30 L 1440 33 L 1440 400 L 0 400 Z"
            fill="#141a2e"
          />
          <path
            d="M0 82 C 180 66, 340 66, 520 76 C 690 86, 820 72, 980 64 C 1130 58, 1290 70, 1440 78 L 1440 400 L 0 400 Z"
            fill="#191a2a"
          />
          <path
            d="M0 250 C 220 228, 420 236, 640 246 C 860 258, 1080 240, 1260 230 C 1350 224, 1400 226, 1440 230 L 1440 400 L 0 400 Z"
            fill="#17151f"
          />
          <g opacity="0.5" fill="#2a2633">
            <path d="M-60 244 C 120 234, 300 238, 480 246 C 700 256, 900 244, 1100 236 C 1260 230, 1400 232, 1500 236 L 1500 246 C 1300 244, 1120 242, 940 250 C 720 260, 500 252, 300 246 C 140 242, 20 244, -60 248 Z" />
            <path d="M-60 300 C 160 294, 360 300, 560 306 C 760 312, 960 300, 1180 296 C 1320 294, 1420 296, 1500 298 L 1500 306 C 1360 304, 1200 306, 1020 310 C 820 314, 620 306, 420 302 C 240 298, 60 302, -60 306 Z" />
          </g>
        </svg>

        <div className="ks-row">
          {LANTERNS.map((lantern, index) => (
            <span key={`l${index}`} className="ks-obj ks-lantern" style={depth(lantern.dx, lantern.z)} />
          ))}
          {TENTS.map((tent, index) => (
            <span key={`t${index}`} className="ks-obj ks-tent" style={depth(tent.dx, tent.z)}>
              {tent.lit ? <span className="ks-glow" /> : null}
              <Tent lit={tent.lit} />
            </span>
          ))}
        </div>
      </div>
    </KashtaLive>
  );
}
