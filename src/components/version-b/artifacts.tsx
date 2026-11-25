"use client";

import { useState } from "react";
import { callScript } from "@/lib/naqah-call";
import type { ProjectId } from "@/lib/projects";

/**
 * Product artifacts that sit beside each project's decision: small, honest
 * pieces of the product itself. Simulations are labelled as such.
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
  const [cells, setCells] = useState(initial);
  function set(key: string, patch: Partial<Cell>) {
    setCells((c) => ({ ...c, [key]: { ...c[key], ...patch } }));
  }
  const calls = Object.values(cells).filter((c) => c.timing !== "off" && c.channel === "call").length;
  const texts = Object.values(cells).filter((c) => c.timing !== "off" && c.channel === "text").length;
  return (
    <div className="vb-art vb-art-tammeni" data-ui="">
      <p className="vb-art-label">
        The schedule grid, recreated. Fictional children from the demo; change any cell.
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

type ChatLine = { who: "brand" | "seet" | "system"; ar: string; en: string; state?: string };

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
  { who: "seet", ar: "رابط الدفع: moyasar.example/… ", en: "Payment link sent.", state: "Deposit" },
  {
    who: "system",
    ar: "وصل العربون. الحجز مؤكد.",
    en: "Payment callback: deposit received. Booking confirmed.",
    state: "Confirmed",
  },
];

export function SeetChat() {
  const [step, setStep] = useState(1);
  const shown = seetChat.slice(0, step + 1);
  const state = [...shown].reverse().find((m) => m.state)?.state ?? "Enquiry";
  const done = step >= seetChat.length - 1;
  return (
    <div className="vb-art vb-art-seet" data-ui="">
      <p className="vb-art-label">Simulated WhatsApp thread with made-up prices. Step through it.</p>
      <div className="vb-art-state">
        {["Enquiry", "Held", "Deposit", "Confirmed"].map((s) => (
          <span key={s} data-on={s === state ? "true" : undefined}>
            {s}
          </span>
        ))}
      </div>
      <ol className="vb-art-chat" aria-live="polite">
        {shown.map((m, i) => (
          <li key={i} data-who={m.who}>
            <span lang="ar">{m.ar}</span>
            <span className="vb-art-en">{m.en}</span>
          </li>
        ))}
      </ol>
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
          onClick={() => setStep((s) => (done ? 1 : Math.min(seetChat.length - 1, s + 1)))}
        >
          {done ? "Start again" : "Next"}
        </button>
        <span className="vb-art-note">
          Only the last step, the payment callback, can write &ldquo;confirmed&rdquo;.
        </span>
      </div>
    </div>
  );
}

/* ---------- Kashta: a worked score ---------- */

/** Real limits and weights from Kashta's src/lib/score.ts; the night from the live app. */
const kashtaExample = {
  site: "Al-Rahmaniya Park, Al-Kharj",
  night: "Wednesday 25 November 2026",
  liveScore: 99,
  rows: [
    { factor: "Temperature", value: "22° evening, 15° min feels-like", rule: "100 in the 14–22° mild band, −8 per degree outside", score: 100, weight: 0.3 },
    { factor: "Wind", value: "12 km/h gust", rule: "100 at ≤30 km/h, 0 at ≥55 (medium tolerance)", score: 100, weight: 0.3 },
    { factor: "Rain", value: "0% chance", rule: "100 at ≤10%, 0 at ≥70%", score: 100, weight: 0.2 },
    { factor: "Dust", value: "from the air-quality forecast", rule: "100 at ≤60 µg/m³, 0 at ≥400", score: null, weight: 0.15 },
    { factor: "Cloud", value: "mean 20:00–04:00", rule: "100 at ≤10%, 0 at ≥80%", score: null, weight: 0.05 },
  ],
};

export function KashtaScore() {
  return (
    <div className="vb-art vb-art-kashta" data-ui="">
      <p className="vb-art-label">
        A worked Kashta Score. Limits and weights are the app&rsquo;s own; the night is from the live app.
      </p>
      <p className="vb-art-h">
        {kashtaExample.site}, {kashtaExample.night}
      </p>
      <table className="vb-art-table vb-art-score">
        <thead>
          <tr>
            <th scope="col">Factor</th>
            <th scope="col">Forecast</th>
            <th scope="col">Rule</th>
            <th scope="col">0–100</th>
            <th scope="col">Weight</th>
          </tr>
        </thead>
        <tbody>
          {kashtaExample.rows.map((row) => (
            <tr key={row.factor}>
              <th scope="row">{row.factor}</th>
              <td>{row.value}</td>
              <td>{row.rule}</td>
              <td>{row.score ?? "from forecast"}</td>
              <td>{row.weight}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="vb-art-sum">
        Weighted average, capped at 35 if any reading is dangerous, no number if a measurement is missing.
        The live app scored this night <strong>{kashtaExample.liveScore}</strong>: the dust and cloud terms cost one point.
      </p>
    </div>
  );
}

/* ---------- Amanah: proving ownership privately ---------- */

export function AmanahQuestions() {
  const [answered, setAnswered] = useState<string | null>(null);
  const options = ["Yellow", "Black", "Wooden"];
  return (
    <div className="vb-art vb-art-amanah" data-ui="">
      <p className="vb-art-label">The ownership step from the guided demo, recreated. One question, chosen by staff.</p>
      <p className="vb-art-h">
        <span lang="ar">وش لون المقبض؟</span> What colour is the handle?
      </p>
      <div className="vb-art-options" role="group" aria-label="Answer">
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
          ? `Sent to staff. The found report stays private; the finder never sees your answer. Tracking link credential: stored only as a SHA-256 hash.`
          : "Pick an answer. The finder's report is never shown to you, and your answer goes to staff, not to the finder."}
      </p>
    </div>
  );
}

/* ---------- Gthrz: what a guest sees, by state ---------- */

export function GthrzVisibility() {
  const rows = [
    { state: "Discovered", title: true, time: true, address: false, exact: false, guests: false },
    { state: "Requested", title: true, time: true, address: false, exact: false, guests: false },
    { state: "Approved", title: true, time: true, address: true, exact: false, guests: true },
    { state: "Revealed by host", title: true, time: true, address: true, exact: true, guests: true },
  ];
  const cols = ["Title", "Time", "Address", "Exact pin", "Guest list"];
  return (
    <div className="vb-art vb-art-gthrz" data-ui="">
      <p className="vb-art-label">What a guest can read at each state, as the row-level security rules allow.</p>
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
              {[r.title, r.time, r.address, r.exact, r.guests].map((on, i) => (
                <td key={i} data-on={on ? "true" : undefined}>
                  {on ? "Yes" : "No"}
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
      return <KashtaScore />;
    case "amanah":
      return <AmanahQuestions />;
    case "gthrz":
      return <GthrzVisibility />;
    default:
      return null;
  }
}
