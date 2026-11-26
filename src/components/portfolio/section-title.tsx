import { Reveal } from "./reveal";

/**
 * A chapter heading. Arabic appears in project names, not section titles.
 */
export function SectionTitle({ id, en, className = "" }: { id: string; en: string; className?: string }) {
  return (
    <Reveal>
      <h2 id={id} className={`vb-section-head vb-title ${className}`}>
        {en}
      </h2>
    </Reveal>
  );
}
