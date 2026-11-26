"use client";

import { useId, useState } from "react";
import { Reveal } from "../reveal";

function TextIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5 5h14a1.5 1.5 0 0 1 1.5 1.5v8.5a1.5 1.5 0 0 1-1.5 1.5h-8.5l-4.5 3.5v-3.5H5A1.5 1.5 0 0 1 3.5 15V6.5A1.5 1.5 0 0 1 5 5Z" />
    </svg>
  );
}

function CallIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5 3.5h3.2l1.6 4.3-2.1 1.4a11 11 0 0 0 7.1 7.1l1.4-2.1 4.3 1.6V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.1 1.5 1.5 0 0 1 5 3.5Z" />
    </svg>
  );
}

/* The same news, two ways: the parent picks, per child and per topic. */
const ways = [
  {
    id: "text",
    label: "Text",
    icon: <TextIcon />,
    from: "Text · 7:05 am",
    ar: "ريم وصلت المدرسة الساعة ٧:٠٥ الصبح.",
    en: "Reem got to school at 7:05 this morning.",
  },
  {
    id: "call",
    label: "Call",
    icon: <CallIcon />,
    from: "Lulwa calling · 7:05 am",
    ar: "هلا، معك لولوة. ريم وصلت المدرسة الساعة ٧:٠٥.",
    en: "Hi, it’s Lulwa. Reem got to school at 7:05.",
  },
] as const;

/**
 * Tammeni on the home page: the parent chooses how Reem's attendance news
 * reaches them, and the message below changes to match. Without JavaScript
 * it shows the text.
 */
export function TammeniProof() {
  const [way, setWay] = useState<(typeof ways)[number]["id"]>("text");
  const id = useId();
  const shown = ways.find((w) => w.id === way) ?? ways[0];

  return (
    <Reveal className="pf-tammeni">
      <figure className="pf-tammeni-card">
        <fieldset className="pf-tammeni-pick">
          <legend>How should Reem&rsquo;s attendance news reach you?</legend>
          <div className="pf-tammeni-seg">
            {ways.map((w) => (
              <label key={w.id}>
                <input type="radio" name={`${id}-way`} value={w.id} checked={way === w.id} onChange={() => setWay(w.id)} />
                <span>
                  {w.icon}
                  {w.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <figcaption className="pf-tammeni-live" role="status" aria-atomic="true">
          <div className="pf-tammeni-msg" data-kind={shown.id} key={shown.id}>
            <p className="pf-tammeni-from">
              {shown.icon}
              {shown.from}
              <span className="pf-tammeni-note">
                <span className="vb-sr">. </span>Sample family
              </span>
            </p>
            <p className="pf-tammeni-ar" lang="ar" dir="rtl">
              {shown.ar}
            </p>
            <p className="pf-tammeni-gloss">{shown.en}</p>
          </div>
        </figcaption>
      </figure>
    </Reveal>
  );
}
