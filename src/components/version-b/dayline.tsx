/**
 * A line of moments: the motif of the site, taken from the day timelines on
 * Naqah's and Tammeni's own landing pages. Dots on a rail, each with a time
 * and a label. `active` fills the dots up to that index.
 */
export type Moment = { time: string; label: string };

export function DayLine({
  moments,
  active = moments.length - 1,
  className = "",
  label,
}: {
  moments: readonly Moment[];
  active?: number;
  className?: string;
  label?: string;
}) {
  return (
    <ol className={`vb-dayline ${className}`} aria-label={label}>
      {moments.map((moment, index) => (
        <li
          key={`${moment.time}-${moment.label}`}
          className="vb-dayline-moment"
          data-on={index <= active ? "true" : undefined}
          aria-current={index === active ? "step" : undefined}
        >
          <span className="vb-dayline-dot" aria-hidden="true" />
          <span className="vb-dayline-time">{moment.time}</span>
          <span className="vb-dayline-label">{moment.label}</span>
        </li>
      ))}
    </ol>
  );
}
