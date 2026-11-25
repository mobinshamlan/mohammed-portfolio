/**
 * Moments of an evening, set side by side as blocks of time, each with a time
 * and a label. `active` lights the blocks up to that index; it is the current one.
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
