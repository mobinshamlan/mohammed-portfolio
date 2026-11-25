"use client";

import Link from "next/link";
import { nightParts, type NightPart } from "@/lib/riyadh";
import { useNight } from "@/lib/use-night";

/** The moon drawn from its real phase: a dark disc and the lit part. Before the sky is read, a plain disc. */
export function Moon({ className = "vb-moon", size = 36 }: { className?: string; size?: number }) {
  const night = useNight();
  const phase = night?.moon.phase ?? 0.5;
  const illumination = night?.moon.illumination ?? 1;
  const waxing = phase < 0.5;
  const r = 16;
  const k = Math.cos(phase * 2 * Math.PI);
  const tx = Math.abs(k) * r;
  const outer = `M 18 2 A ${r} ${r} 0 0 1 18 34`;
  const inner = k >= 0 ? `A ${tx} ${r} 0 0 0 18 2` : `A ${tx} ${r} 0 0 1 18 2`;
  return (
    <svg className={className} viewBox="0 0 36 36" width={size} height={size} aria-hidden="true" focusable="false">
      <circle cx="18" cy="18" r={r} className="vb-moon-dark" />
      <path
        d={`${outer} ${inner} Z`}
        className="vb-moon-lit"
        style={{ opacity: Math.max(0.15, illumination) }}
        transform={waxing ? undefined : "scale(-1,1) translate(-36,0)"}
      />
    </svg>
  );
}

/**
 * A part of tonight: its Arabic name, its English name and its clock time in
 * Riyadh, with the moon at the height it has reached. The time appears once
 * the page has read tonight's sky; the names are there without it.
 */
export function NightMark({ part, className = "" }: { part: NightPart; className?: string }) {
  const night = useNight();
  const { ar, en } = nightParts[part];
  return (
    <p className={`vb-hour ${className}`} data-part={part}>
      <span className="vb-hour-sky" aria-hidden="true">
        {part === "sunrise" ? <span className="vb-hour-sun" /> : <Moon className="vb-moon vb-hour-moon" size={28} />}
      </span>
      <span className="vb-hour-ar" lang="ar">
        {ar}
      </span>
      <span className="vb-hour-en">
        {en} in Riyadh{night ? <>, <time>{night.times[part]}</time></> : null}
      </span>
    </p>
  );
}

/*
 * Dune lines for the horizon: a long windward slope, a sharp crest and a
 * short slip face, the profile wind gives a dune. Drawn in a 1200 × 100 box
 * and stretched to the width.
 */
export const dunes = {
  far: "M0 100V48C120 44 260 30 380 20Q396 18 408 22C470 40 560 50 700 46C860 42 1020 30 1120 22Q1140 20 1152 26C1170 36 1186 40 1200 42V100Z",
  near: "M0 100V74C220 66 470 40 690 12Q712 7 726 12C770 34 820 54 920 62C1030 70 1120 66 1200 62V100Z",
};

/** The edge of the desert under a sky: two dune lines, the near one in the colour of what comes next. */
export function Horizon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`vb-horizon ${className}`}
      viewBox="0 0 1200 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d={dunes.far} className="vb-horizon-far" />
      <path d={dunes.near} className="vb-horizon-near" />
    </svg>
  );
}

/** Tonight's moon in words: its phase, how much is lit, and the Hijri date it keeps. */
export function MoonFacts() {
  const night = useNight();
  const percent = night ? Math.round(night.moon.illumination * 100) : null;
  return (
    <p className="vb-moon-facts">
      {night ? (
        <>
          <strong>
            {night.moon.name}, {percent}% lit.
          </strong>{" "}
          <span>
            {night.hijri.en}, <span lang="ar">{night.hijri.ar}</span>.
          </span>{" "}
        </>
      ) : (
        <>
          <strong>Tonight&rsquo;s moon over Riyadh.</strong>{" "}
        </>
      )}
      <span className="vb-moon-facts-how">
        Worked out from the date in your browser, for the city Kashta forecasts.
      </span>{" "}
      <span>
        <Link href="/projects/kashta#how-title" prefetch={false} className="vb-link">
          How Kashta scores a night
        </Link>
      </span>
    </p>
  );
}
