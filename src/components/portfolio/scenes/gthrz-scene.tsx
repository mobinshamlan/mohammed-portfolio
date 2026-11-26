/*
 * Gthrz keeps the address hidden until the host reveals it. Behind the phones
 * lies a quiet street map in the app's violet; one area of it is fogged and
 * ringed, with a dashed map pin. Approving the request brings the area into
 * view while the exact address still waits for the host’s chosen time.
 */

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

type Road = { at: number; major: boolean };

function makeRoads(seed: number, from: number, to: number): Road[] {
  const rand = seeded(seed);
  const roads: Road[] = [];
  let at = from;
  let index = 0;
  while (at < to) {
    roads.push({ at: Math.round(at), major: index % 4 === 2 });
    at += 52 + rand() * 70;
    index += 1;
  }
  return roads;
}

// A rotated street grid, like a planned Riyadh district, drawn past the edges.
const AVENUES = makeRoads(1107, -300, 1200);
const STREETS = makeRoads(2026, -300, 1500);

const PIN = "M0 0 C -4 -10, -16 -18, -16 -30 A 16 16 0 1 1 16 -30 C 16 -18, 4 -10, 0 0 Z";

export function GthrzScene() {
  return (
    <div className="gz">
      <svg className="gz-map" viewBox="0 0 900 1200" preserveAspectRatio="xMidYMin slice" focusable="false">
        <g transform="rotate(-14 450 600)" stroke="#8b6cf0" fill="none" strokeLinecap="square">
          {AVENUES.map((road) => (
            <line
              key={`a${road.at}`}
              x1={road.at}
              y1="-300"
              x2={road.at}
              y2="1500"
              strokeWidth={road.major ? 3 : 1.1}
              opacity={road.major ? 0.3 : 0.16}
            />
          ))}
          {STREETS.map((road) => (
            <line
              key={`s${road.at}`}
              x1="-300"
              y1={road.at}
              x2="1200"
              y2={road.at}
              strokeWidth={road.major ? 3 : 1.1}
              opacity={road.major ? 0.3 : 0.16}
            />
          ))}
        </g>
        {/* A curving ring road and one diagonal avenue break the grid. */}
        <path
          d="M-60 520 C 160 470, 360 610, 560 560 S 860 380, 980 420"
          stroke="#8b6cf0"
          strokeWidth="5"
          fill="none"
          opacity="0.28"
        />
        <path d="M-40 1150 L 980 250" stroke="#8b6cf0" strokeWidth="3.5" fill="none" opacity="0.22" />
      </svg>

      <div className="gz-spot">
        <div className="gz-fog" />
        <svg className="gz-ring" viewBox="-100 -100 200 200" focusable="false">
          <circle r="96" fill="rgb(139 108 240 / 0.07)" stroke="#8b6cf0" strokeWidth="1.6" strokeDasharray="3 7" />
          <circle r="62" fill="none" stroke="#8b6cf0" strokeWidth="1" opacity="0.3" />
        </svg>
        <svg className="gz-ghost" viewBox="-20 -50 40 54" focusable="false">
          <path d={PIN} fill="none" stroke="#a48ff5" strokeWidth="1.6" strokeDasharray="3 3" />
        </svg>
      </div>
    </div>
  );
}
