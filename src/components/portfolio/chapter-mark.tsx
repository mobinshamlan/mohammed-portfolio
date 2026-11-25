/**
 * The marker that opens each chapter of the home page: its number in both
 * numeral systems and its name in English and Arabic, on one short rule.
 */
const arabicDigits = "٠١٢٣٤٥٦٧٨٩";

export function ChapterMark({ n, en, ar, className = "" }: { n: number; en: string; ar: string; className?: string }) {
  const latin = String(n).padStart(2, "0");
  const arabic = latin.replace(/\d/g, (d) => arabicDigits[Number(d)]);
  return (
    <p className={`vb-mark ${className}`}>
      <span className="vb-mark-n" aria-hidden="true">
        {latin}
      </span>
      <span className="vb-mark-en">{en}</span>
      <span className="vb-mark-rule" aria-hidden="true" />
      <span className="vb-mark-ar" lang="ar" dir="rtl">
        {ar}
      </span>
      <span className="vb-mark-n" lang="ar" aria-hidden="true">
        {arabic}
      </span>
    </p>
  );
}
