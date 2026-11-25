import { useId, type CSSProperties } from "react";

/*
 * Al Sadu: the Bedouin weave of Saudi Arabia and the Gulf. A band is a stack of
 * woven rows: a plain stripe, a row of teeth, a main row of one motif, and the
 * same again in mirror. Every motif here is drawn from basic Sadu geometry on a
 * small grid (triangles, diamonds, stepped eyes, combs, chevrons, checks).
 *
 * Colours come from four roles set in CSS on the band or any ancestor, so a
 * band takes the colours of the section it sits in:
 *   --sb-ground  the warp colour behind the motif
 *   --sb-motif   the main weft colour
 *   --sb-light   white wool
 *   --sb-accent  the second weft colour
 */

type Role = "ground" | "motif" | "light" | "accent";

type Motif = "stripe" | "teeth" | "ticks" | "diamond" | "eye" | "chevron" | "comb" | "hourglass" | "check" | "star";

type Row = {
  motif: Motif;
  /** Height of the row in grid units. */
  h: number;
  fg: Role;
  bg: Role;
  alt?: Role;
  flip?: boolean;
};

/** Tile width per motif, in grid units. */
const tileWidth: Record<Motif, number> = {
  stripe: 8,
  teeth: 8,
  ticks: 8,
  diamond: 20,
  eye: 16,
  chevron: 16,
  comb: 24,
  hourglass: 16,
  check: 8,
  star: 24,
};

/** Unset roles fall back to the maker's colours. */
const fallback: Record<Role, string> = {
  ground: "var(--sadu-red)",
  motif: "var(--sadu-ink)",
  light: "var(--sadu-wool)",
  accent: "var(--sadu-red)",
};

const fill = (role: Role) => `var(--sb-${role}, ${fallback[role]})`;

/** The stepped eye: a diamond built from 2×2 squares, with a hollow centre and a seed. */
const eyeOuter = "M7 0h2v2h2v2h2v2h2v4h-2v2h-2v2h-2v2H7v-2H5v-2H3v-2H1V6h2V4h2V2h2z";
const eyeInner = "M7 4h2v2h2v4H9v2H7v-2H5V6h2z";

function MotifShapes({ row }: { row: Row }) {
  const fg = fill(row.fg);
  const alt = fill(row.alt ?? row.fg);
  const { h } = row;
  switch (row.motif) {
    case "stripe":
      return null;
    case "teeth":
      return <polygon fill={fg} points={row.flip ? `0,0 4,${h} 8,0` : `0,${h} 4,0 8,${h}`} />;
    case "ticks":
      return <rect fill={fg} x="3" y={h / 2 - 1} width="2" height="2" />;
    case "diamond":
      return (
        <>
          <polygon fill={fg} points="10,1 19,8 10,15 1,8" />
          <polygon fill={fill(row.bg)} points="10,5 14,8 10,11 6,8" />
          <rect fill={alt} x="9" y="7" width="2" height="2" />
          <polygon fill={alt} points="0,0 3,0 0,2.4" />
          <polygon fill={alt} points="20,0 17,0 20,2.4" />
          <polygon fill={alt} points="0,16 3,16 0,13.6" />
          <polygon fill={alt} points="20,16 17,16 20,13.6" />
        </>
      );
    case "eye":
      return (
        <>
          <path fill={fg} d={eyeOuter} />
          <path fill={fill(row.bg)} d={eyeInner} />
          <rect fill={alt} x="7" y="7" width="2" height="2" />
        </>
      );
    case "chevron":
      return (
        <>
          <polygon fill={fg} points="0,1 8,9 16,1 16,5 8,13 0,5" />
          <polygon fill={alt} points="0,9 4,13 0,17" />
          <polygon fill={alt} points="16,9 12,13 16,17" />
        </>
      );
    case "comb":
      return (
        <>
          <rect fill={fg} x="0" y="12" width="12" height="2" />
          <rect fill={fg} x="1" y="5" width="2" height="7" />
          <rect fill={fg} x="5" y="5" width="2" height="7" />
          <rect fill={fg} x="9" y="5" width="2" height="7" />
          <rect fill={alt} x="12" y="2" width="12" height="2" />
          <rect fill={alt} x="13" y="4" width="2" height="7" />
          <rect fill={alt} x="17" y="4" width="2" height="7" />
          <rect fill={alt} x="21" y="4" width="2" height="7" />
        </>
      );
    case "hourglass":
      return (
        <>
          <polygon fill={fg} points="1,1 15,1 8,8" />
          <polygon fill={alt} points="1,15 15,15 8,8" />
        </>
      );
    case "check":
      return (
        <>
          <rect fill={fg} x="0" y="0" width={4} height={h / 2} />
          <rect fill={fg} x="4" y={h / 2} width={4} height={h / 2} />
        </>
      );
    case "star":
      return (
        <>
          <path fill={fg} d="M11 2h2v4h4v4h-4v4h-2v-4H7V6h4z" />
          <rect fill={alt} x="2" y="7" width="2" height="2" />
          <rect fill={alt} x="20" y="7" width="2" height="2" />
        </>
      );
  }
}

/* Each variant is one band: its rows from top to bottom. */
const variants = {
  /** The maker's own band: red ground, black eyes, white wool. */
  maker: [
    { motif: "stripe", h: 3, fg: "motif", bg: "motif" },
    { motif: "teeth", h: 6, fg: "accent", bg: "light" },
    { motif: "eye", h: 16, fg: "motif", bg: "accent", alt: "light" },
    { motif: "teeth", h: 6, fg: "accent", bg: "light", flip: true },
    { motif: "stripe", h: 3, fg: "motif", bg: "motif" },
  ],
  /** A narrow seam between two sections. */
  seam: [
    { motif: "stripe", h: 2, fg: "motif", bg: "motif" },
    { motif: "teeth", h: 5, fg: "accent", bg: "light" },
    { motif: "teeth", h: 5, fg: "accent", bg: "light", flip: true },
    { motif: "stripe", h: 2, fg: "motif", bg: "motif" },
  ],
  naqah: [
    { motif: "stripe", h: 2, fg: "motif", bg: "motif" },
    { motif: "ticks", h: 4, fg: "light", bg: "ground" },
    { motif: "diamond", h: 16, fg: "motif", bg: "ground", alt: "accent" },
    { motif: "teeth", h: 6, fg: "accent", bg: "ground", flip: true },
    { motif: "stripe", h: 2, fg: "motif", bg: "motif" },
  ],
  tammeni: [
    { motif: "stripe", h: 2, fg: "motif", bg: "motif" },
    { motif: "check", h: 6, fg: "light", bg: "motif" },
    { motif: "comb", h: 16, fg: "light", bg: "ground", alt: "accent" },
    { motif: "check", h: 6, fg: "light", bg: "motif" },
  ],
  seet: [
    { motif: "stripe", h: 3, fg: "accent", bg: "accent" },
    { motif: "chevron", h: 16, fg: "accent", bg: "ground", alt: "light" },
    { motif: "teeth", h: 5, fg: "light", bg: "ground", flip: true },
    { motif: "stripe", h: 2, fg: "motif", bg: "motif" },
  ],
  kashta: [
    { motif: "ticks", h: 4, fg: "light", bg: "ground" },
    { motif: "teeth", h: 5, fg: "motif", bg: "ground" },
    { motif: "star", h: 16, fg: "accent", bg: "motif", alt: "light" },
    { motif: "teeth", h: 5, fg: "motif", bg: "ground", flip: true },
  ],
  amanah: [
    { motif: "stripe", h: 3, fg: "motif", bg: "motif" },
    { motif: "comb", h: 16, fg: "motif", bg: "ground", alt: "accent" },
    { motif: "ticks", h: 4, fg: "motif", bg: "ground" },
    { motif: "stripe", h: 2, fg: "accent", bg: "accent" },
  ],
  gthrz: [
    { motif: "stripe", h: 2, fg: "accent", bg: "accent" },
    { motif: "hourglass", h: 16, fg: "accent", bg: "ground", alt: "light" },
    { motif: "teeth", h: 5, fg: "motif", bg: "ground", flip: true },
    { motif: "stripe", h: 2, fg: "motif", bg: "motif" },
  ],
  experiment: [
    { motif: "stripe", h: 2, fg: "motif", bg: "motif" },
    { motif: "eye", h: 16, fg: "motif", bg: "ground", alt: "accent" },
    { motif: "stripe", h: 2, fg: "motif", bg: "motif" },
  ],
} satisfies Record<string, Row[]>;

export type SaduVariant = keyof typeof variants;

/** Grid unit in px for each size. Whole pixels, so rows meet without seams. */
const unitPx = { s: 1, m: 2, l: 3 } as const;

type Orient = "across" | "down";

function WovenRow({
  row,
  unit,
  id,
  index,
  orient,
}: {
  row: Row;
  unit: number;
  id: string;
  index: number;
  orient: Orient;
}) {
  const width = tileWidth[row.motif];
  const thick = row.h * unit;
  // Down a page edge, the row turns a quarter: the tile's height runs across.
  const transform = orient === "down" ? `translate(${thick} 0) rotate(90) scale(${unit})` : `scale(${unit})`;
  return (
    <div
      className="sadu-row"
      data-dir={index % 2 ? "r" : "l"}
      style={orient === "down" ? { width: thick } : { height: thick }}
    >
      <svg width="100%" height="100%" focusable="false">
        <defs>
          <pattern id={id} width={width} height={row.h} patternUnits="userSpaceOnUse" patternTransform={transform}>
            <rect width={width} height={row.h} fill={fill(row.bg)} />
            <MotifShapes row={row} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    </div>
  );
}

/**
 * A woven band, full width (or, running down, full height) of its container.
 * Decorative: hidden from assistive technology. Rows weave in from alternate
 * sides as the band scrolls into view; static without JavaScript or with
 * reduced motion.
 */
export function SaduBand({
  variant = "maker",
  size = "m",
  orient = "across",
  className = "",
  style,
}: {
  variant?: SaduVariant;
  size?: keyof typeof unitPx;
  orient?: Orient;
  className?: string;
  style?: CSSProperties;
}) {
  const base = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const unit = unitPx[size];
  return (
    <div
      className={`sadu ${className}`}
      data-variant={variant}
      data-size={size}
      data-orient={orient}
      aria-hidden="true"
      style={style}
    >
      {(variants[variant] as Row[]).map((row, index) => (
        <WovenRow key={index} row={row} unit={unit} id={`sadu-${base}-${index}`} index={index} orient={orient} />
      ))}
    </div>
  );
}
