/**
 * The Naqah daily call, as a short illustrative script. Names, animals and
 * numbers are made up for the demo; the shape of the call is the product's.
 */

export type CallLine =
  | { kind: "event"; time: string; text: string }
  | { kind: "naqah"; ar: string; en: string }
  | { kind: "worker"; ar: string; en: string }
  | { kind: "fact"; label: string; value: string; flag?: boolean };

export const callScript: CallLine[] = [
  { kind: "event", time: "5:40 pm", text: "Naqah phones the ranch worker." },
  {
    kind: "naqah",
    ar: "مساء الخير يا أبو سعد. كم ناقة شربت اليوم؟",
    en: "Good evening, Abu Saad. How many camels drank today?",
  },
  {
    kind: "worker",
    ar: "كلها شربت إلا وضحى، ما شربت من الصبح.",
    en: "All of them except Wadha. She has not drunk since morning.",
  },
  { kind: "fact", label: "Water", value: "11 of 12 drank" },
  { kind: "fact", label: "Wadha", value: "No water since morning", flag: true },
  { kind: "naqah", ar: "وصل العلف؟", en: "Did the feed arrive?" },
  {
    kind: "worker",
    ar: "وصل العصر، عشرين كيس.",
    en: "This afternoon, twenty sacks.",
  },
  { kind: "fact", label: "Feed", value: "20 sacks delivered" },
  {
    kind: "naqah",
    ar: "في شي ثاني يحتاج المالك يعرفه؟",
    en: "Anything else the owner should know?",
  },
  {
    kind: "worker",
    ar: "السياج الشرقي محتاج إصلاح.",
    en: "The east fence needs repair.",
  },
  { kind: "fact", label: "Fence", value: "East side needs repair", flag: true },
  {
    kind: "event",
    time: "5:44 pm",
    text: "Call ends. The audio is discarded; four facts are saved.",
  },
  {
    kind: "event",
    time: "7:00 pm",
    text: "Naqah phones the owner: Wadha has not drunk since morning, the east fence needs repair. Feed arrived.",
  },
];

/** The rail of moments above the transcript. */
export const callMoments = [
  { time: "5:40 pm", label: "Calls the worker", at: 0 },
  { time: "5:44 pm", label: "Keeps the facts", at: 11 },
  { time: "7:00 pm", label: "Calls the owner", at: 12 },
] as const;
