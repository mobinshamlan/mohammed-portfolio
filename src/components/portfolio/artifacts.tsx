"use client";

import { useState } from "react";
import { callScript } from "@/lib/naqah-call";
import { gthrzVisibility } from "@/lib/gthrz";
import type { ProjectId } from "@/lib/projects";
import { useHydrated } from "@/lib/use-hydrated";
import { KashtaScoreDemo } from "./demos/kashta-score";

/**
 * Product artifacts that sit beside each project's decision: small, honest
 * pieces of the product itself. Simulations are labelled as such. Before
 * hydration each one renders its complete, read-only content.
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

/* ---------- Tammeni: per-child, per-topic schedules ---------- */

type Timing = "right away" | "daily" | "weekly" | "off";
type Channel = "call" | "text";
const timings: Timing[] = ["right away", "daily", "weekly", "off"];
const topics = ["Attendance", "Grades", "Exams"] as const;
const children = ["Reem", "Nawaf"] as const;
type Cell = { timing: Timing; channel: Channel };

const initial: Record<string, Cell> = {
  "Reem:Attendance": { timing: "right away", channel: "text" },
  "Reem:Grades": { timing: "weekly", channel: "call" },
  "Reem:Exams": { timing: "daily", channel: "call" },
  "Nawaf:Attendance": { timing: "off", channel: "text" },
  "Nawaf:Grades": { timing: "weekly", channel: "text" },
  "Nawaf:Exams": { timing: "daily", channel: "call" },
};

export function TammeniSchedule() {
  const hydrated = useHydrated();
  const [cells, setCells] = useState(initial);
  function set(key: string, patch: Partial<Cell>) {
    setCells((c) => ({ ...c, [key]: { ...c[key], ...patch } }));
  }
  const calls = Object.values(cells).filter((c) => c.timing !== "off" && c.channel === "call").length;
  const texts = Object.values(cells).filter((c) => c.timing !== "off" && c.channel === "text").length;
  return (
    <div className="vb-art vb-art-tammeni" data-ui="">
      <p className="vb-art-label">
        The schedule grid, recreated. Fictional children from the demo
        {hydrated ? "; change any cell." : "."}
      </p>
      <table className="vb-art-table">
        <thead>
          <tr>
            <th scope="col">Topic</th>
            {children.map((child) => (
              <th key={child} scope="col">
                {child}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {topics.map((topic) => (
            <tr key={topic}>
              <th scope="row">{topic}</th>
              {children.map((child) => {
                const key = `${child}:${topic}`;
                const cell = cells[key];
                if (!hydrated) {
                  return (
                    <td key={key}>
                      {cell.timing === "off" ? "off" : `${cell.timing}, by ${cell.channel}`}
                    </td>
                  );
                }
                return (
                  <td key={key}>
                    <label className="vb-art-sr" htmlFor={`${key}-t`}>
                      {child}, {topic}: when
                    </label>
                    <select
                      id={`${key}-t`}
                      value={cell.timing}
                      onChange={(e) => set(key, { timing: e.target.value as Timing })}
                    >
                      {timings.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="vb-art-toggle"
                      aria-pressed={cell.channel === "call"}
                      disabled={cell.timing === "off"}
                      onClick={() => set(key, { channel: cell.channel === "call" ? "text" : "call" })}
                      aria-label={`${child}, ${topic}: by ${cell.channel}. Switch channel`}
                    >
                      {cell.channel === "call" ? "Call" : "Text"}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="vb-art-sum" aria-live="polite">
        This family gets {calls} kind{calls === 1 ? "" : "s"} of news by call and {texts} by text.
        Each cell is one row per parent, child and topic under row-level security.
      </p>
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
    <div className={`vb-art vb-art-seet ${compact ? "vb-art-compact" : ""}`} data-ui="">
      <p className="vb-art-label">
        Simulated WhatsApp thread with made-up prices{hydrated ? ". Step through it." : "."}
      </p>
      <div className="vb-art-state">
        {["Enquiry", "Held", "Deposit", "Confirmed"].map((s) => (
          <span key={s} data-on={s === state ? "true" : undefined}>
            {s}
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

/* ---------- Amanah: proving ownership privately ---------- */

export function AmanahQuestions() {
  const hydrated = useHydrated();
  const [answered, setAnswered] = useState<string | null>(null);
  const options = ["Yellow", "Black", "Wooden"];
  const after =
    "If it matches, staff may ask one more question or approve; the finder's report is never shown to the owner, and the link credential is stored only as a SHA-256 hash.";
  return (
    <div className="vb-art vb-art-amanah" data-ui="">
      <p className="vb-art-label">
        Simulated ownership step, after the guided demo. Staff may ask up to two questions about a
        match; this is the first of them, chosen from what the finder reported. Your answer is a
        sample.
      </p>
      <p className="vb-art-h">
        <span lang="ar">وش لون المقبض؟</span> What colour is the handle?
      </p>
      {hydrated ? (
        <>
          <div className="vb-art-options" role="group" aria-label="Sample answer">
            {options.map((o) => (
              <button
                key={o}
                type="button"
                className="vb-btn vb-btn-quiet"
                aria-pressed={answered === o}
                onClick={() => setAnswered(o)}
              >
                {o}
              </button>
            ))}
          </div>
          <p className="vb-art-sum" aria-live="polite">
            {answered
              ? `Simulated: "${answered}" goes to staff on the private tracking link. ${after}`
              : "Pick a sample answer. In the product the answer goes to staff, not to the finder; a second question is asked only if staff want more certainty."}
          </p>
        </>
      ) : (
        <>
          <p className="vb-art-sum">
            Sample answers: {options.join(", ")}. Whichever the owner picks goes to staff on the
            private tracking link, not to the finder.
          </p>
          <p className="vb-art-sum">{after}</p>
        </>
      )}
    </div>
  );
}

/* ---------- Gthrz: what a guest sees, by state ---------- */

export function GthrzVisibility() {
  const { rows, columns: cols } = gthrzVisibility;
  return (
    <div className="vb-art vb-art-gthrz" data-ui="">
      <p className="vb-art-label">
        What a guest can read at each state. The title, time and category are always visible. This
        example assumes the host set &ldquo;reveal the address later&rdquo; and left guest names on;
        the row-level security rules enforce it.
      </p>
      <table className="vb-art-table">
        <thead>
          <tr>
            <th scope="col">State</th>
            {cols.map((c) => (
              <th key={c} scope="col">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.state}>
              <th scope="row">{r.state}</th>
              {r.values.map((v, i) => (
                <td key={i} data-label={cols[i]} data-on={v ? "true" : undefined}>
                  {v ? "Yes" : "No"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DecisionArtifact({ id }: { id: ProjectId }) {
  switch (id) {
    case "naqah":
      return <NaqahFacts />;
    case "tammeni":
      return <TammeniSchedule />;
    case "seet":
      return <SeetChat />;
    case "kashta":
      return <KashtaScoreDemo />;
    case "amanah":
      return <AmanahQuestions />;
    case "gthrz":
      return <GthrzVisibility />;
    default:
      return null;
  }
}
