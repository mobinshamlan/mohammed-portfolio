/** SVG filter that maps the photo's tones from wine (shadows) to paper (highlights). */
export function DuotoneDefs() {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden="true"
      focusable="false"
      className="vb-cv-defs"
    >
      <filter id="vb-duotone" colorInterpolationFilters="sRGB">
        <feColorMatrix
          type="matrix"
          values="0.33 0.5 0.17 0 0  0.33 0.5 0.17 0 0  0.33 0.5 0.17 0 0  0 0 0 1 0"
        />
        <feComponentTransfer>
          <feFuncR type="table" tableValues="0.16 0.42 0.78 0.96" />
          <feFuncG type="table" tableValues="0.07 0.2 0.66 0.95" />
          <feFuncB type="table" tableValues="0.08 0.22 0.62 0.93" />
        </feComponentTransfer>
      </filter>
    </svg>
  );
}
