"use client";

import { useState } from "react";
import { callScript } from "@/lib/naqah-call";
import type { ProjectId } from "@/lib/projects";
import { useHydrated } from "@/lib/use-hydrated";
import { AmanahClaimDemo } from "./demos/amanah-claim";
import { GthrzStatesDemo } from "./demos/gthrz-states";
import { KashtaScoreDemo } from "./demos/kashta-score";
import { TammeniScheduleDemo } from "./demos/tammeni-schedule";

/**
 * Product artifacts that sit beside each project's decision: small, honest
 * pieces of the product itself, most of them a short demo to try (see ./demos).
 * Simulations are labelled as such. Before hydration each one renders its
 * complete, read-only content.
 */

/* ---------- Naqah: the facts a call leaves behind ---------- */

export function NaqahFacts({ compact = false }: { compact?: boolean }) {
  const worker = callScript.filter((l) => l.kind === "worker").slice(0, compact ? 1 : 3);
  const facts = callScript.filter((l) => l.kind === "fact");
  const owner = callScript.find((l) => l.kind === "event" && l.time === "7:00 pm");
  return (
    <div className="vb-art vb-art-naqah" data-ui="">
      <p className="vb-art-label">Simulated sample of a Naqah call</p>
      <div className="vb-art-naqah-grid">
        <div>
          <p className="vb-art-h">The worker says</p>
          <ul className="vb-art-lines">
            {worker.map((line, i) =>
              line.kind === "worker" ? (
                <li key={i}>
                  <span lang="ar">{line.ar}</span>
                  <span className="vb-art-en">{line.en}</span>
                </li>
              ) : null,
            )}
          </ul>
        </div>
        <div>
          <p className="vb-art-h">Naqah keeps</p>
          <ul className="vb-art-facts">
            {facts.map((fact, i) =>
              fact.kind === "fact" ? (
                <li key={i} data-flag={fact.flag ? "true" : undefined}>
                  <span>{fact.label}</span>
                  <strong>{fact.value}</strong>
                </li>
              ) : null,
            )}
          </ul>
        </div>
      </div>
      {owner && owner.kind === "event" ? (
        <p className="vb-art-owner">
          <strong>{owner.time}</strong> {owner.text}
        </p>
      ) : null}
    </div>
  );
}

/* ---------- Seet: hold → deposit → confirmed ---------- */

type ChatLine = {
  who: "brand" | "seet" | "system";
  ar: string;
  en: string;
  state?: string;
  /** A Latin URL inside an Arabic message, isolated left to right. */
  link?: string;
};

const seetChat: ChatLine[] = [
  { who: "brand", ar: "السلام عليكم، كم سعر سناب ستوري؟", en: "Hi, how much is a Snap story?" },
  {
    who: "seet",
    ar: "هلا والله. سناب ستوري ٤٬٥٠٠ ر.س. الأيام الفاضية: الأحد، الثلاثاء، الخميس.",
    en: "Welcome. Snap story is 4,500 SAR. Free days: Sunday, Tuesday, Thursday.",
    state: "Enquiry",
  },
  { who: "brand", ar: "الثلاثاء", en: "Tuesday." },
  {
    who: "seet",
    ar: "تم، حجزت لكم الثلاثاء مؤقتًا لمدة ساعتين. يتأكد الحجز بعد العربون: ٢٬٢٥٠ ر.س.",
    en: "Done, Tuesday is held for two hours. The booking is confirmed after the deposit: 2,250 SAR.",
    state: "Held",
  },
  {
    who: "seet",
    ar: "رابط الدفع:",
    link: "moyasar.example/…",
    en: "Payment link sent.",
    state: "Deposit",
  },
  {
    who: "system",
    ar: "وصل العربون. الحجز مؤكد.",
    en: "Payment callback: deposit received. Booking confirmed.",
    state: "Confirmed",
  },
];

export function SeetChat({ compact = false }: { compact?: boolean }) {
  const hydrated = useHydrated();
  const [step, setStep] = useState(1);
  const last = seetChat.length - 1;
  const visible = hydrated ? step : last;
  const shown = seetChat.slice(0, visible + 1);
  const state = [...shown].reverse().find((m) => m.state)?.state ?? "Enquiry";
  const done = visible >= last;
  return (
    <div className={`vb-art vb-demo vb-art-seet ${compact ? "vb-art-compact" : ""}`} data-ui="">
      <p className="vb-demo-hint">
        <span className="vb-demo-tag">Simulated</span>
        {hydrated ? "Press Next to take the booking to confirmed." : "A WhatsApp booking with made-up prices."}
      </p>
      <div className="vb-art-state">
        {["Enquiry", "Held", "Deposit", "Confirmed"].map((s) => (
          <span key={s} data-on={s === state ? "true" : undefined}>
            {s}
            {s === state ? <span className="vb-art-sr"> (now)</span> : null}
          </span>
        ))}
      </div>
      {/* Controls sit above the thread, so they stay in place as it grows. */}
      {hydrated ? (
        <div className="vb-art-controls">
          <button
            type="button"
            className="vb-btn vb-btn-quiet"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step <= 1}
          >
            Back
          </button>
          <button
            type="button"
            className="vb-btn"
            onClick={() => setStep((s) => (done ? 1 : Math.min(last, s + 1)))}
          >
            {done ? "Start again" : "Next"}
          </button>
        </div>
      ) : null}
      <ol className="vb-art-chat" aria-live="polite">
        {shown.map((m, i) => (
          <li key={i} data-who={m.who}>
            <span lang="ar">{m.ar}</span>
            {m.link ? (
              <span className="vb-art-url" dir="ltr">
                {m.link}
              </span>
            ) : null}
            <span className="vb-art-en">{m.en}</span>
          </li>
        ))}
      </ol>
      <p className="vb-art-note">
        Only the last step, the payment callback, can write &ldquo;confirmed&rdquo;.
      </p>
    </div>
  );
}

export function DecisionArtifact({ id }: { id: ProjectId }) {
  switch (id) {
    case "naqah":
      return <NaqahFacts />;
    case "tammeni":
      return <TammeniScheduleDemo />;
    case "seet":
      return <SeetChat />;
    case "kashta":
      return <KashtaScoreDemo />;
    case "amanah":
      return <AmanahClaimDemo />;
    case "gthrz":
      return <GthrzStatesDemo />;
    default:
      return null;
  }
}
