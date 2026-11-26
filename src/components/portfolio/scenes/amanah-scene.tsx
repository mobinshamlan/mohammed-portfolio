import type { CSSProperties, ReactNode } from "react";

/*
 * Amanah's lost-property tags, the paper tag from the app's demo: clipped
 * corners, a green eyelet with a brass rim, the item drawn on it and its name
 * in Arabic. They hang on brass strings in the margins beside the centred
 * heading and swing a little as the chapter scrolls past, then settle.
 */

type Item = "umbrella" | "key" | "watch" | "glasses";

const TAGS: { item: Item; label: string; code: string; slot: string; swing: number }[] = [
  // The umbrella from the demo, with the yellow handle the finder reported.
  { item: "umbrella", label: "مظلة زرقاء", code: "A-0142", slot: "1", swing: 1 },
  { item: "key", label: "مفتاح", code: "A-0139", slot: "2", swing: -0.8 },
  { item: "watch", label: "ساعة يد", code: "A-0151", slot: "3", swing: 0.9 },
  { item: "glasses", label: "نظارة", code: "A-0147", slot: "4", swing: -1.1 },
];

const INK = "#0e3b2e";

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

export function Tag({ item, label, code }: { item: Item; label: string; code: string }) {
  return (
    <svg viewBox="0 0 120 176" focusable="false">
      <path d="M18 0 H 102 L 120 18 V 176 H 0 V 18 Z" fill="#fbf8f0" stroke="rgb(14 59 46 / 0.14)" />
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

export function AmanahScene() {
  return (
    <div className="am">
      {TAGS.map((tag) => (
        <div key={tag.code} className="am-tag" data-slot={tag.slot} style={{ "--swing": tag.swing } as CSSProperties}>
          <span className="am-string" />
          <Tag item={tag.item} label={tag.label} code={tag.code} />
        </div>
      ))}
    </div>
  );
}
