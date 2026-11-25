type Stop = {
  href: string;
  en: string;
  ar: string;
  when: string;
  /** Horizontal centre of the stop on the route, in percent. Matches the SVG below. */
  x: number;
  /** Height on the route: south (home) or north (the UK). */
  y: number;
  kind: "dot" | "long" | "now";
};

const stops: Stop[] = [
  { href: "#story-home", en: "Saudi Arabia", ar: "السعودية", when: "Early days", x: 11, y: 78, kind: "dot" },
  { href: "#story-brighton", en: "Brighton", ar: "برايتون", when: "6 months", x: 31, y: 22, kind: "dot" },
  { href: "#journey", en: "London", ar: "لندن", when: "2022–2026", x: 58, y: 22, kind: "long" },
  { href: "#story-now", en: "Saudi Arabia", ar: "السعودية", when: "2026 · Now", x: 88, y: 78, kind: "now" },
];

/**
 * The route as a schematic line, not a map: up from home to the UK, a short
 * stop in Brighton, four years along London, then back down to home. Each
 * label jumps to its stop below.
 */
export function StoryRoute() {
  return (
    <nav className="vb-story-route" aria-label="The route, stop by stop">
      <div className="vb-story-rail" aria-hidden="true">
        <svg viewBox="0 0 1000 100" preserveAspectRatio="none" focusable="false">
          <path className="vb-story-line" d="M110 78 C190 78 230 22 310 22 L455 22" />
          <path className="vb-story-line-london" d="M455 22 L705 22" />
          <path className="vb-story-line" d="M705 22 C790 22 810 78 880 78" />
          <path className="vb-story-line-next" d="M880 78 L1000 78" />
        </svg>
        {stops.map((stop) => (
          <span
            key={stop.href}
            className="vb-story-pin"
            data-kind={stop.kind}
            style={{ left: `${stop.x}%`, top: `${stop.y}%` }}
          />
        ))}
      </div>
      <ol className="vb-story-stops">
        {stops.map((stop) => (
          <li key={stop.href} data-kind={stop.kind}>
            <a href={stop.href}>
              <span className="vb-story-stop-en">{stop.en}</span>
              <span className="vb-story-stop-ar" lang="ar" dir="rtl">
                {stop.ar}
              </span>
              <span className="vb-story-stop-when">{stop.when}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
