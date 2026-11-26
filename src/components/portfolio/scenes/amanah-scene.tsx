import type { CSSProperties, ReactNode } from "react";

/*
 * Amanah's lost-property desk at closing time, drawn from the app's own hero:
 * the deep green office wall, the cabinet of wrapped, tagged items, the brass
 * bell, and the wooden counter the claim is settled on. One desk lamp lights
 * the counter; as the chapter scrolls in the lamp comes on and the tags on the
 * shelf settle. Everything here is decorative; the chapter's text sits over
 * the quiet left of the wall.
 */

type Item = "umbrella" | "key" | "watch" | "glasses";

const INK = "#0e3b2e";
const PAPER = "#f6f0e2";
const BRASS = "#c9a052";
const BRASS_DARK = "#8f6a2a";

function ItemArt({ item }: { item: Item }): ReactNode {
  switch (item) {
    case "umbrella":
      return (
        <g>
          <path d="M60 42 V 48" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
          <path
            d="M24 82 A 36 36 0 0 1 96 82 Q 90 77 84 82 Q 78 77 72 82 Q 66 77 60 82 Q 54 77 48 82 Q 42 77 36 82 Q 30 77 24 82 Z"
            fill="#3d6aa3"
          />
          <path d="M60 47 L 60 81 M 60 47 C 50 56, 46 68, 48 81 M 60 47 C 70 56, 74 68, 72 81" stroke="#2c5285" strokeWidth="1.4" fill="none" />
          <path d="M60 82 V 101" stroke={INK} strokeWidth="2.4" />
          <path d="M60 100 a 5.5 5.5 0 0 0 11 0" stroke="#d9a62e" strokeWidth="4" strokeLinecap="round" fill="none" />
        </g>
      );
    case "key":
      return (
        <g fill="#b08a3e">
          <circle cx="40" cy="74" r="12" fill="none" stroke="#b08a3e" strokeWidth="6" />
          <rect x="51" y="71" width="44" height="6" rx="1" />
          <rect x="80" y="76" width="5" height="10" />
          <rect x="88" y="76" width="5" height="7" />
        </g>
      );
    case "watch":
      return (
        <g>
          <rect x="52" y="44" width="16" height="22" rx="3" fill="#6b4a2e" />
          <rect x="52" y="90" width="16" height="22" rx="3" fill="#6b4a2e" />
          <circle cx="60" cy="78" r="17" fill="#fbf8f0" stroke={INK} strokeWidth="3.2" />
          <path d="M60 78 V 68 M 60 78 L 67 82" stroke={INK} strokeWidth="2" strokeLinecap="round" />
          <rect x="77" y="75" width="4" height="6" rx="1" fill={INK} />
        </g>
      );
    case "glasses":
      return (
        <g fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round">
          <circle cx="45" cy="80" r="11" />
          <circle cx="75" cy="80" r="11" />
          <path d="M56 79 Q 60 74 64 79" />
          <path d="M34 77 L 24 70 M 86 77 L 96 70" />
        </g>
      );
  }
}

/** The app's paper tag: clipped corner, brass-rimmed eyelet, the item and its name. */
export function Tag({ item, label, code }: { item: Item; label: string; code: string }) {
  return (
    <svg viewBox="0 0 120 176" focusable="false">
      <path d="M18 0 H 102 L 120 18 V 176 H 0 V 18 Z" fill={PAPER} stroke="rgb(14 59 46 / 0.14)" />
      <circle cx="60" cy="18" r="8.5" fill="#f1ead9" stroke={INK} strokeWidth="3.5" />
      <circle cx="60" cy="18" r="11" fill="none" stroke="#b08a3e" strokeWidth="1" />
      <ItemArt item={item} />
      <text x="60" y="132" textAnchor="middle" direction="rtl" fontSize="14" fontWeight="700" fill={INK}>
        {label}
      </text>
      <path d="M16 146 H 104" stroke="#6b7f74" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="0.1 5" />
      <text x="60" y="164" textAnchor="middle" fontSize="10.5" letterSpacing="0.08em" fill="#3b5546">
        {code}
      </text>
    </svg>
  );
}

/** A small tag on a string, hanging from the shelf's lip. */
function ShelfTag({ x, len, swing }: { x: number; len: number; swing: number }) {
  return (
    <g className="am-shelf-tag" style={{ transformOrigin: `${x}px 168px`, "--swing": swing } as CSSProperties}>
      <path d={`M${x} 168 V ${168 + len}`} stroke={BRASS} strokeWidth="1.2" />
      <g transform={`translate(${x - 14} ${168 + len - 6})`}>
        <path d="M4 0 H 24 L 28 4 V 40 H 0 V 4 Z" fill={PAPER} />
        <circle cx="14" cy="5" r="2.6" fill="none" stroke={INK} strokeWidth="1.4" />
        <path d="M6 20 H 22 M 6 26 H 18 M 6 32 H 20" stroke="rgb(14 59 46 / 0.35)" strokeWidth="1.4" strokeLinecap="round" />
      </g>
    </g>
  );
}

/** The cabinet on the wall: three cubbies of logged items, each with its tag. */
function Shelf() {
  return (
    <svg className="am-shelf" viewBox="0 0 440 240" focusable="false">
      {/* Back wall of the cabinet, a step lighter than the room. */}
      <rect x="10" y="10" width="420" height="152" fill="#174a3a" />
      {/* Inner shadow at the top and left of every cubby, so they read as deep. */}
      <rect x="10" y="10" width="420" height="20" fill="rgb(0 0 0 / 0.22)" />
      <rect x="10" y="10" width="14" height="152" fill="rgb(0 0 0 / 0.18)" />
      <rect x="150" y="10" width="14" height="152" fill="rgb(0 0 0 / 0.18)" />
      <rect x="290" y="10" width="14" height="152" fill="rgb(0 0 0 / 0.18)" />

      {/* Cubby 1: a wrapped parcel and a small box. */}
      <g>
        <rect x="42" y="78" width="78" height="72" fill="#e3d6bb" />
        <rect x="42" y="78" width="78" height="10" fill="#cdbf9f" />
        <path d="M81 78 V 150 M 42 114 H 120" stroke="#9c8a62" strokeWidth="2" />
        <path d="M70 110 l 11 -8 l 11 8 l -11 8 z" fill="none" stroke="#9c8a62" strokeWidth="1.6" />
        <rect x="24" y="118" width="26" height="32" fill="#cfbf9c" />
      </g>
      {/* Cubby 2: a stack of notebooks and a water bottle. */}
      <g>
        <rect x="176" y="104" width="86" height="12" rx="2" fill="#20553f" />
        <rect x="180" y="118" width="78" height="12" rx="2" fill="#2d6a52" />
        <rect x="174" y="132" width="90" height="18" rx="2" fill="#1c4b39" />
        <path d="M176 112 H 262 M 180 126 H 258" stroke="rgb(246 240 226 / 0.35)" strokeWidth="1.2" />
        <rect x="246" y="60" width="22" height="90" rx="6" fill="#a9c7d6" />
        <rect x="251" y="52" width="12" height="12" rx="3" fill="#3f6f84" />
      </g>
      {/* Cubby 3: a canvas bag with its tag, and a helmet. */}
      <g>
        <path d="M322 150 V 96 Q 322 78 340 78 H 386 Q 404 78 404 96 V 150 Z" fill="#8b6a46" />
        <path d="M340 78 Q 340 56 363 56 Q 386 56 386 78" fill="none" stroke="#6e5133" strokeWidth="5" strokeLinecap="round" />
        <path d="M322 96 H 404" stroke="rgb(0 0 0 / 0.18)" strokeWidth="2" />
        <circle cx="330" cy="140" r="12" fill="#f0e8d6" />
        <circle cx="330" cy="140" r="12" fill="none" stroke="#1a1a1a" strokeWidth="3" />
      </g>

      {/* The frame: thick green planks with a lighter top edge. */}
      <path d="M0 0 H 440 V 12 H 0 Z" fill="#2c6650" />
      <path d="M0 12 H 440 V 172 H 0 Z" fill="none" stroke="#0b2820" strokeWidth="12" />
      <rect x="150" y="12" width="14" height="150" fill="#0b2820" />
      <rect x="290" y="12" width="14" height="150" fill="#0b2820" />
      <rect x="0" y="162" width="440" height="12" fill="#0b2820" />
      <rect x="0" y="162" width="440" height="3" fill="#2c6650" />

      {/* Tags clipped to the lip, each with a little swing. */}
      <ShelfTag x={92} len={34} swing={1} />
      <ShelfTag x={226} len={22} swing={-0.8} />
      <ShelfTag x={360} len={40} swing={0.9} />
    </svg>
  );
}

/** A brass wall clock at five to closing. */
function Clock() {
  return (
    <svg className="am-clock" viewBox="0 0 80 80" focusable="false">
      <circle cx="40" cy="40" r="37" fill="#0b2820" stroke={BRASS} strokeWidth="4" />
      <circle cx="40" cy="40" r="31" fill={PAPER} />
      <g stroke={INK} strokeWidth="2" strokeLinecap="round">
        <path d="M40 12 V 17 M 40 63 V 68 M 12 40 H 17 M 63 40 H 68" />
        <path d="M40 40 L 40 22" strokeWidth="3" />
        <path d="M40 40 L 24 46" strokeWidth="2.4" />
      </g>
      <circle cx="40" cy="40" r="2.4" fill={INK} />
    </svg>
  );
}

/** What sits on the counter beside the claim: the bell, a key on its tag, a pair of glasses. */
function DeskItems() {
  return (
    <svg className="am-desk" viewBox="0 0 360 120" focusable="false">
      {/* Bell: a flat ellipse of shadow, the base, the dome, the knob. */}
      <ellipse cx="78" cy="104" rx="42" ry="7" fill="rgb(0 0 0 / 0.28)" />
      <ellipse cx="78" cy="98" rx="36" ry="7" fill={BRASS_DARK} />
      <path d="M44 96 Q 44 54 78 48 Q 112 54 112 96 Z" fill={BRASS} />
      <path d="M52 94 Q 54 64 76 56" fill="none" stroke="#f0d58a" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
      <rect x="72" y="36" width="12" height="14" rx="3" fill={BRASS_DARK} />
      <circle cx="78" cy="34" r="6" fill={BRASS} />

      {/* Key lying flat with its tag. */}
      <g transform="rotate(-8 190 92)">
        <circle cx="160" cy="92" r="9" fill="none" stroke="#b08a3e" strokeWidth="5" />
        <rect x="168" y="89" width="46" height="6" rx="1" fill="#b08a3e" />
        <rect x="196" y="94" width="5" height="9" fill="#b08a3e" />
        <rect x="205" y="94" width="5" height="7" fill="#b08a3e" />
        <path d="M152 86 Q 136 74 128 60" fill="none" stroke={BRASS} strokeWidth="1.4" />
        <g transform="translate(108 30) rotate(-18)">
          <path d="M5 0 H 30 L 36 6 V 42 H 0 V 6 Z" fill={PAPER} />
          <circle cx="18" cy="7" r="3" fill="none" stroke={INK} strokeWidth="1.6" />
          <path d="M8 24 H 28 M 8 31 H 22" stroke="rgb(14 59 46 / 0.4)" strokeWidth="1.6" strokeLinecap="round" />
        </g>
      </g>

      {/* Glasses, folded. */}
      <g fill="none" stroke="#1c1c1c" strokeWidth="3" strokeLinecap="round" transform="rotate(10 300 96)">
        <ellipse cx="282" cy="96" rx="14" ry="9" />
        <ellipse cx="318" cy="96" rx="14" ry="9" />
        <path d="M296 95 Q 300 90 304 95" />
        <path d="M268 93 L 252 86" />
        <path d="M332 93 L 348 86" />
      </g>
    </svg>
  );
}

export function AmanahScene() {
  return (
    <div className="am">
      <div className="am-wall" />
      <div className="am-lamp" />
      <Clock />
      <Shelf />
      <div className="am-counter">
        <div className="am-counter-top" />
        <div className="am-counter-front" />
      </div>
      <DeskItems />
    </div>
  );
}
