"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { childhood, degree, graduation } from "@/lib/portrait";
import { useHydrated } from "@/lib/use-hydrated";
import { DocumentViewer } from "./document-viewer";

/*
 * The road from Riyadh to London and back. Land is drawn as rows of short
 * dashes, one per degree, so the coastlines are coarse on purpose: they only
 * need to be right to the dash.
 */

type Lonlat = readonly [number, number];

// The frame: 30°W to 60°E, 10°N to 58°N, ten units to a degree of latitude.
const LON0 = -30;
const LAT1 = 58;
const KX = 8.3; // cos(34°) × 10, so shapes keep their proportions mid-map.
const W = 747;
const H = 480;
const CELL = 10;

const project = ([lon, lat]: Lonlat): [number, number] => [(lon - LON0) * KX, (LAT1 - lat) * 10];

const water: Lonlat[][] = [
  // The Atlantic and the North Sea, down the coast of Africa and Europe.
  [
    [-40, 5], [-13.4, 9], [-15, 11], [-16.8, 13], [-17.5, 14.7], [-16.5, 20], [-13, 27.8], [-9.8, 30.4],
    [-9.2, 32.5], [-7.6, 33.6], [-5.9, 35.8], [-5.6, 36], [-6.3, 36.8], [-7.4, 37.2], [-8.9, 37], [-9.5, 38.7],
    [-8.8, 41.2], [-9.3, 43], [-8, 43.7], [-3.8, 43.5], [-1.8, 43.4], [-1.2, 44.6], [-1.2, 46.2], [-2.2, 47.2],
    [-4.7, 48], [-3, 48.8], [-1.6, 49.6], [0.1, 49.5], [1.6, 50.9], [3.2, 51.3], [4.5, 52.5], [5.5, 53.4],
    [8.5, 53.6], [8.6, 55.5], [8.2, 56.8], [10.5, 57.7], [9.5, 58.9], [8, 58.1], [5.6, 58.9], [5, 62], [-40, 62],
  ],
  // The Baltic, with the Kattegat.
  [
    [10.5, 57.6], [11.9, 57.7], [12.6, 56], [12.9, 55.4], [14.2, 55.4], [16.4, 56.6], [16.6, 57.8], [18.1, 59.3],
    [18.5, 60.5], [30, 60.5], [28, 59.5], [23.5, 59.3], [24, 57.2], [21.1, 56.9], [21, 55.6], [19.5, 54.4],
    [18.5, 54.8], [14.2, 53.9], [12, 54.2], [10.9, 54.4], [10.3, 56.5],
  ],
  // The Mediterranean.
  [
    [-5.6, 35.9], [-2, 35.1], [1, 36.5], [3, 36.8], [8.6, 36.9], [10.2, 37.3], [11, 36.8], [10.1, 33.8],
    [11.5, 33], [13.2, 32.9], [15.3, 32.3], [19.2, 30.3], [20.1, 31.9], [22.5, 32.8], [25, 32], [29.9, 31.2],
    [32.3, 31.3], [34.3, 31.4], [35, 32.9], [35.5, 34.5], [36, 35.8], [36.2, 36.6], [34.5, 36.8], [32.5, 36.1],
    [30.6, 36.8], [29, 36.6], [27.3, 37], [26.3, 38.3], [26.2, 39.4], [26.4, 40.2], [26, 40.8], [23, 40.6],
    [22.6, 40.3], [23.1, 39.1], [24, 38.2], [23, 36.5], [21.7, 36.8], [21.1, 37.8], [21.3, 38.4], [20.2, 39.6],
    [19.4, 40.4], [19.5, 41.8], [18.5, 42.5], [16, 43.5], [14, 44.9], [13.6, 45.6], [12.3, 45.4], [12.3, 44.3],
    [13.6, 43.6], [16.1, 41.4], [18.5, 40.1], [17.2, 40.4], [16.5, 39.6], [17.1, 39], [16.1, 38], [15.8, 40],
    [14.3, 40.8], [12.5, 41.7], [11, 42.4], [10.3, 43.5], [9, 44.4], [7.5, 43.8], [5.4, 43.3], [3.5, 43.3],
    [3.1, 42.4], [2.2, 41.4], [0.9, 41], [-0.3, 39.5], [0.2, 38.8], [-0.7, 37.6], [-2.1, 36.7], [-4.4, 36.7],
    [-5.4, 36.1],
  ],
  // The Black Sea.
  [
    [29, 41.1], [28, 41.6], [28, 43.5], [28.7, 44.2], [29.7, 45.2], [30.7, 46.5], [31.7, 46.6], [33.5, 46],
    [32.5, 45.4], [33.5, 44.5], [35, 44.8], [36.6, 45.2], [38, 44.4], [39.7, 43.5], [41.6, 41.6], [40, 40.9],
    [37, 41.1], [35, 42], [33, 42], [31, 41.1],
  ],
  // The Caspian.
  [
    [47.5, 46.7], [51, 47], [53, 46], [51.3, 45.2], [52.8, 42], [53, 40.5], [53.9, 38.5], [53.9, 37.3],
    [51, 36.8], [49, 37.5], [48.9, 38.4], [49.4, 40.2], [48, 42], [47.5, 43], [47, 44.5],
  ],
  // The Red Sea.
  [
    [32.5, 29.9], [33.5, 27.2], [35.5, 23.9], [37.2, 21], [37.4, 19.5], [38.6, 18], [39.5, 15.5], [41.7, 13.4],
    [43.3, 12.6], [43.4, 12.7], [42.8, 15.5], [42.5, 16.9], [41, 19.5], [39.2, 21.5], [38.1, 24.1], [36.6, 25.9],
    [35.1, 28.1], [34.9, 29.5], [34.3, 27.8], [33, 28.6],
  ],
  // The Gulf of Aden, the Arabian Sea and the Gulf.
  [
    [43.3, 12.6], [43.2, 11.6], [45, 10.4], [51.2, 11.8], [51, 5], [70, 5], [70, 25], [61.6, 25.2],
    [58.8, 25.5], [57, 26.8], [56.3, 27.1], [54, 26.7], [51.4, 27.9], [50.8, 28.9], [50.1, 30.1], [48.9, 30.4],
    [48, 29.9], [48.6, 28], [49.6, 27], [50.1, 26.2], [50.8, 24.8], [51.6, 25.9], [51.6, 24.3], [54.4, 24.4],
    [55.3, 25.3], [56.1, 26.2], [56.4, 24.8], [58.6, 23.6], [59.8, 22.4], [58.6, 20.5], [57.8, 19], [56.6, 18],
    [55.3, 17.3], [52.2, 15.6], [49, 14.5], [45, 12.8], [43.5, 12.7],
  ],
];

const britain: Lonlat[] = [
  [-5.7, 50.1], [-3.5, 50.3], [-1.3, 50.7], [0.3, 50.8], [1.4, 51.2], [1.7, 52.6], [0.3, 53.1], [-0.2, 53.6],
  [-1.2, 54.6], [-1.6, 55.6], [-2.6, 56.3], [-1.8, 57.5], [-3.5, 57.7], [-3.1, 58.6], [-5, 58.6], [-5.6, 57.5],
  [-6.2, 56.3], [-5.6, 55.3], [-4.9, 54.8], [-3.3, 54.9], [-3, 53.5], [-4.6, 53.3], [-4.1, 52.4], [-5.3, 51.8],
  [-4.2, 51.5], [-3.1, 51.4], [-4.2, 51.2],
];

const islands: Lonlat[][] = [
  britain,
  [[-6, 52.2], [-6.2, 53.4], [-6, 54.6], [-7.3, 55.3], [-8.4, 55.1], [-10, 54.2], [-9.9, 53.4], [-10.4, 52.1], [-9.6, 51.5], [-8, 51.8]],
  [[12.4, 37.8], [13.3, 38.2], [15.6, 38.3], [15.1, 37], [14.3, 36.8]],
  [[8.4, 39], [9.6, 39.1], [9.8, 41], [8.2, 41]],
];

const saudi: Lonlat[] = [
  [34.9, 29.4], [37, 31.5], [39.2, 32.2], [42, 31.1], [44.7, 29.2], [46.5, 29.1], [47.7, 28.5], [48.6, 28],
  [49.6, 27], [50.1, 26.2], [50.8, 24.8], [51.6, 24.2], [52, 23], [55.6, 22], [55, 20], [52, 19], [49, 18.6],
  [47.5, 17], [44.5, 17.4], [43.3, 17.5], [42.8, 16.4], [42.5, 16.9], [41, 19.5], [39.2, 21.5], [38.1, 24.1],
  [36.6, 25.9], [35.1, 28.1],
];

function inside([lon, lat]: Lonlat, ring: Lonlat[]) {
  let hit = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      hit = !hit;
    }
  }
  return hit;
}

type Tone = "land" | "home";

/** Rows of land: each run of land in a row becomes one stroke, split into cells by a dash pattern. */
function rasterize(
  cols: number,
  rows: number,
  cell: number,
  toLonlat: (x: number, y: number) => Lonlat,
  tone: (point: Lonlat) => Tone | null,
  [ox, oy] = [0, 0],
) {
  const paths: Record<Tone, string[][]> = { land: [[], []], home: [[], []] };
  for (let r = 0; r < rows; r++) {
    let start = 0;
    let current: Tone | null = null;
    for (let c = 0; c <= cols; c++) {
      const next = c < cols ? tone(toLonlat((c + 0.5) * cell, (r + 0.5) * cell)) : null;
      if (next !== current) {
        if (current) {
          paths[current][r % 2].push(`M${ox + start * cell} ${oy + (r + 0.5) * cell}h${(c - start) * cell}`);
        }
        start = c;
        current = next;
      }
    }
  }
  return paths;
}

const mapTone = (point: Lonlat): Tone | null => {
  if (inside(point, saudi) || inside(point, britain)) {
    return "home";
  }
  if (islands.some((ring) => inside(point, ring))) {
    return "land";
  }
  return water.some((ring) => inside(point, ring)) ? null : "land";
};

const map = rasterize(Math.ceil(W / CELL), H / CELL, CELL, (x, y) => [x / KX + LON0, LAT1 - y / 10], mapTone);

// South-east England, enlarged in a box over the Atlantic.
const INSET = { x: 14, y: 128, w: 154, h: 106, cell: 7 };
const INSET_LON0 = -1.5;
const INSET_LAT1 = 51.85;
const INSET_K = INSET.w / 1.88; // three degrees of longitude at 51°N span 1.88 degrees of latitude.
const southeast: Lonlat[] = [
  [-2, 50.7], [-0.8, 50.78], [-0.14, 50.8], [0.3, 50.77], [1, 50.93], [1.4, 51.15], [1.43, 51.38], [0.9, 51.45],
  [0.5, 51.5], [0.9, 51.6], [1.3, 51.8], [1.7, 52], [1.7, 52.4], [-2, 52.4],
];
const insetProject = ([lon, lat]: Lonlat): [number, number] => [
  INSET.x + (lon - INSET_LON0) * 0.626 * INSET_K,
  INSET.y + (INSET_LAT1 - lat) * INSET_K,
];
const insetMap = rasterize(
  Math.floor(INSET.w / INSET.cell),
  Math.floor(INSET.h / INSET.cell),
  INSET.cell,
  (x, y) => [x / (0.626 * INSET_K) + INSET_LON0, INSET_LAT1 - y / INSET_K],
  (point) => (inside(point, southeast) ? "land" : null),
  [INSET.x, INSET.y],
);

const riyadh = project([46.72, 24.69]);
const london = project([-0.12, 51.51]);
const nextEnd = project([57.5, 15.5]);
const brightonIn = insetProject([-0.14, 50.84]);
const londonIn = insetProject([-0.12, 51.51]);
const river: Lonlat[] = [[1.2, 51.47], [0.6, 51.46], [0.2, 51.49], [-0.12, 51.5], [-0.5, 51.45], [-1, 51.5]];
const thames = river.map((point) => insetProject(point).map((n) => n.toFixed(1)).join(" ")).join("L");

const f = (n: number) => n.toFixed(1);
const route = {
  out: `M${f(riyadh[0])} ${f(riyadh[1])}Q${f(project([12, 30])[0])} ${f(project([12, 30])[1])} ${f(london[0])} ${f(london[1])}`,
  inset: `M${f(brightonIn[0])} ${f(brightonIn[1])}C${f(brightonIn[0] + 26)} ${f(brightonIn[1] - 12)} ${f(londonIn[0] + 26)} ${f(londonIn[1] + 18)} ${f(londonIn[0])} ${f(londonIn[1])}`,
  home: `M${f(london[0])} ${f(london[1])}Q${f(project([36, 52])[0])} ${f(project([36, 52])[1])} ${f(riyadh[0])} ${f(riyadh[1])}`,
  next: `M${f(riyadh[0])} ${f(riyadh[1])}C${f(riyadh[0] + 40)} ${f(riyadh[1] + 6)} ${f(nextEnd[0] - 30)} ${f(nextEnd[1] - 50)} ${f(nextEnd[0])} ${f(nextEnd[1])}`,
};

type Stop = {
  id: string;
  when: string;
  place: string;
  title: string;
  lines: string[];
  note?: string;
  photo?: { src: string; alt: string; width: number; height: number; position?: string; caption: string };
  degree?: boolean;
  now?: boolean;
  link?: { href: string; label: string };
  /** Where the stop sits on the map, and which threads have been walked by then. */
  pin: "riyadh" | "england" | "next";
  inset?: "brighton" | "london";
  walked: number;
};

const stops: Stop[] = [
  {
    id: "riyadh",
    when: "Childhood",
    place: "Riyadh",
    title: "Growing up in Riyadh.",
    lines: ["Where it starts: home, in Saudi Arabia."],
    photo: { ...childhood, caption: "Saudi Arabia, early days." },
    pin: "riyadh",
    walked: 0,
  },
  {
    id: "brighton",
    when: "Six months",
    place: "Brighton",
    title: "English, by the sea.",
    lines: ["First, about six months of English language studies in Brighton."],
    pin: "england",
    inset: "brighton",
    walked: 1,
  },
  {
    id: "london",
    when: "2022–2026",
    place: "London",
    title: "The foundation, then the degree.",
    lines: [
      "Kaplan International College London, 2022–2023: Foundation Certificate for Science and Engineering.",
      "Queen Mary University of London, 2023–2026: BSc (Hons) Computer Science, Upper Second-Class Honours (2:1), graduated July 2026.",
    ],
    note: "Custodian of the Two Holy Mosques Scholarship Program, Imdad track.",
    photo: { ...graduation, caption: "Graduation, London, 2026." },
    degree: true,
    pin: "england",
    inset: "london",
    walked: 2,
  },
  {
    id: "home",
    when: "2026",
    place: "Saudi Arabia",
    title: "Building with AI.",
    lines: [
      "Tuwaiq Academy, AI Fundamentals Bootcamp using Meta tools.",
      "Four projects built so far: Naqah, Tammeni, Seet and Kashta.",
    ],
    now: true,
    link: { href: "/#work", label: "See the four projects" },
    pin: "riyadh",
    walked: 3,
  },
  {
    id: "next",
    when: "Next",
    place: "A first role",
    title: "A first role in software engineering and AI.",
    lines: [
      "Looking for a team in Saudi Arabia that ships Arabic-first products and takes AI seriously enough to keep it honest.",
    ],
    link: { href: "/#contact", label: "Get in touch" },
    pin: "next",
    walked: 4,
  },
];

const threads: { key: keyof typeof route; from: number }[] = [
  { key: "out", from: 1 },
  { key: "inset", from: 2 },
  { key: "home", from: 3 },
  { key: "next", from: 4 },
];

function LandRows({ rows, tone }: { rows: string[][]; tone: Tone }) {
  return (
    <>
      <path d={rows[0].join("")} className={`vb-jr-dash vb-jr-${tone}`} />
      <path d={rows[1].join("")} className={`vb-jr-dash vb-jr-${tone} vb-jr-offset`} />
    </>
  );
}

/** A marker for a place on the route, with its name. */
function Pin({ at, on, label, anchor = "start", dy = -14 }: { at: [number, number]; on: boolean; label?: string; anchor?: "start" | "end"; dy?: number }) {
  return (
    <g className="vb-jr-pin" data-on={on} transform={`translate(${f(at[0])} ${f(at[1])})`}>
      <circle className="vb-jr-pin-mark" r="6.5" />
      {label ? (
        <text className="vb-jr-label" x={anchor === "start" ? 12 : -12} y={dy} textAnchor={anchor}>
          {label}
        </text>
      ) : null}
    </g>
  );
}

function RouteMap({ selected }: { selected: number | null }) {
  const stop = selected === null ? null : stops[selected];
  const walked = (from: number) => selected === null || selected >= from;
  return (
    <svg className="vb-jr-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="journey-map-title">
      <title id="journey-map-title">
        Map of the route: from Riyadh to Brighton and London, then back to Saudi Arabia, with the next step still open.
      </title>
      <LandRows rows={map.land} tone="land" />
      <LandRows rows={map.home} tone="home" />

      <path d={`M${f(london[0])} ${f(london[1])}L${INSET.x + INSET.w} ${INSET.y}`} className="vb-jr-leader" />
      <g className="vb-jr-inset">
        <rect x={INSET.x} y={INSET.y} width={INSET.w} height={INSET.h} rx="3" className="vb-jr-inset-frame" />
        <LandRows rows={insetMap.land} tone="land" />
        <path d={`M${thames}`} className="vb-jr-river" />
        <text x={INSET.x} y={INSET.y + INSET.h + 16} className="vb-jr-caption">
          South-east England
        </text>
      </g>

      {threads.map(({ key, from }) => (
        <g key={key} className="vb-jr-thread" data-walked={walked(from)} data-next={key === "next" ? "true" : undefined}>
          <path d={route[key]} className="vb-jr-thread-ahead" />
          <path d={route[key]} className="vb-jr-thread-walked" />
        </g>
      ))}

      <Pin at={london} on={stop?.pin === "england"} />
      <Pin at={brightonIn} on={stop?.inset === "brighton"} label="Brighton" dy={5} />
      <Pin at={londonIn} on={stop?.inset === "london"} label="London" dy={-6} />
      <Pin at={riyadh} on={stop?.pin === "riyadh"} label="Riyadh" anchor="end" dy={24} />
      <g className="vb-jr-pin vb-jr-end" data-on={stop?.pin === "next"} transform={`translate(${f(nextEnd[0])} ${f(nextEnd[1])})`}>
        <circle r="6" className="vb-jr-pin-mark" />
        <text className="vb-jr-label" x="-12" y="22" textAnchor="end">
          Next
        </text>
      </g>
    </svg>
  );
}

function StopBody({ stop }: { stop: Stop }) {
  return (
    <>
      {stop.photo ? (
        <figure className="vb-jr-photo">
          <Image
            src={stop.photo.src}
            alt={stop.photo.alt}
            width={stop.photo.width}
            height={stop.photo.height}
            sizes="(max-width: 899px) 7rem, 11rem"
            style={stop.photo.position ? { objectPosition: stop.photo.position } : undefined}
          />
          <figcaption>{stop.photo.caption}</figcaption>
        </figure>
      ) : null}
      <div className="vb-jr-text">
        <p className="vb-jr-when">
          {stop.when}
          {stop.now ? <span className="vb-jr-now">Now</span> : null}
        </p>
        <h3 className="vb-jr-title">{stop.title}</h3>
        {stop.lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
        {stop.note ? <p className="vb-jr-note">{stop.note}</p> : null}
        {stop.degree ? (
          <DocumentViewer
            triggerClassName="vb-jr-degree"
            src={degree.src}
            width={degree.width}
            height={degree.height}
            alt={degree.alt}
            title="Degree certificate"
            subtitle="BSc Computer Science (Hons), Queen Mary University of London"
            href={degree.src}
          >
            <span className="vb-jr-degree-doc" aria-hidden="true">
              <Image src={degree.src} alt="" width={degree.width} height={degree.height} sizes="3rem" />
            </span>
            <span className="vb-jr-degree-text">
              <span>Degree awarded, 9 July 2026</span>
              <span className="vb-jr-degree-cta">View the certificate</span>
            </span>
          </DocumentViewer>
        ) : null}
        {stop.link ? (
          <Link href={stop.link.href} className="vb-link vb-jr-link">
            {stop.link.label}
          </Link>
        ) : null}
      </div>
    </>
  );
}

/**
 * The road here: a map with the route on it and the stops beside it. Pick a
 * stop to draw the route up to it. Without JavaScript every stop is listed in order.
 */
export function RouteStory() {
  const hydrated = useHydrated();
  const [selected, setSelected] = useState(3);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(event: React.KeyboardEvent, index: number) {
    const moves: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowDown: index + 1,
      ArrowLeft: index - 1,
      ArrowUp: index - 1,
      Home: 0,
      End: stops.length - 1,
    };
    if (event.key in moves) {
      event.preventDefault();
      const next = (moves[event.key] + stops.length) % stops.length;
      setSelected(next);
      tabs.current[next]?.focus();
    }
  }

  const stop = stops[selected];

  return (
    <div id="journey" className="vb-jr" data-mode={hydrated ? "tabs" : "list"}>
      <div className="vb-jr-map">
        <RouteMap selected={hydrated ? selected : null} />
      </div>

      {hydrated ? (
        <>
          <div className="vb-jr-tabs" role="tablist" aria-label="The road here">
            {stops.map((item, index) => (
              <button
                key={item.id}
                ref={(node) => {
                  tabs.current[index] = node;
                }}
                type="button"
                role="tab"
                id={`jr-tab-${item.id}`}
                aria-selected={selected === index}
                aria-controls="jr-panel"
                tabIndex={selected === index ? 0 : -1}
                className="vb-jr-tab"
                data-now={item.now ? "true" : undefined}
                onClick={() => setSelected(index)}
                onKeyDown={(event) => onKeyDown(event, index)}
              >
                <span className="vb-jr-tab-when">{item.when}</span>
                <span className="vb-jr-tab-place">{item.place}</span>
              </button>
            ))}
          </div>
          <div
            id="jr-panel"
            className="vb-jr-panel"
            role="tabpanel"
            aria-labelledby={`jr-tab-${stop.id}`}
            tabIndex={0}
            data-photo={stop.photo ? "true" : undefined}
            key={stop.id}
          >
            <StopBody stop={stop} />
          </div>
        </>
      ) : (
        <ol className="vb-jr-list" aria-label="The road here">
          {stops.map((item) => (
            <li key={item.id} className="vb-jr-panel" data-photo={item.photo ? "true" : undefined}>
              <StopBody stop={item} />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
