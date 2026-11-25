import { Reveal } from "./reveal";

/**
 * A chapter heading in both languages: the English title, and its Arabic
 * counterpart in the accent colour, set on the same line where it fits.
 */
export function SectionTitle({ id, en, ar, className = "" }: { id: string; en: string; ar: string; className?: string }) {
  return (
    <Reveal>
      <h2 id={id} className={`vb-section-head vb-title ${className}`}>
        <span className="vb-title-en">{en}</span>{" "}
        <span className="vb-title-ar" lang="ar" dir="rtl">
          {ar}
        </span>
      </h2>
    </Reveal>
  );
}
