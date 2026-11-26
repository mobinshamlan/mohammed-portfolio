"use client";

import { useState } from "react";
import { useHydrated } from "@/lib/use-hydrated";
import { Reveal } from "../reveal";

/*
 * Seet on the home page, in the product's own navy and gold: a brand asks for
 * Tuesday on the ads number, Seet holds it and sends the deposit link. The
 * week strip on the dashboard shows the hold as a dashed day. Paying the
 * deposit is the only thing that fills it in: the AI never says "confirmed".
 * Without JavaScript it shows the hold.
 */

const WEEK = [
  { day: "Sun", n: 9 },
  { day: "Mon", n: 10 },
  { day: "Tue", n: 11, slot: true },
  { day: "Wed", n: 12 },
  { day: "Thu", n: 13 },
] as const;

export function SeetProof() {
  const hydrated = useHydrated();
  const [paid, setPaid] = useState(false);

  return (
    <Reveal className="pf-seet">
      <figure className="pf-seet-card" data-ui="" data-paid={paid ? "true" : undefined}>
        <div className="pf-seet-head">
          <span className="pf-seet-brand" aria-hidden="true">
            م
          </span>
          <p className="pf-seet-who">
            <strong>Mathaq restaurant</strong>
            <span>Sample WhatsApp chat</span>
          </p>
        </div>

        <ol className="pf-seet-chat" aria-label="Sample ad booking chat">
          <li className="pf-seet-msg" data-from="brand">
            <span lang="ar" dir="rtl">
              نبي سناب ستوري الثلاثاء، كم السعر؟
            </span>
            <small>How much for a Snapchat Story on Tuesday?</small>
          </li>
          <li className="pf-seet-msg" data-from="seet">
            <span lang="ar" dir="rtl">
              سناب ستوري ٤٬٥٠٠ ر.س، والثلاثاء فاضي. حجزته لكم مؤقتًا ويتأكد بعد العربون ٢٬٢٥٠ ر.س.
            </span>
            <small>A Snapchat Story costs SAR 4,500. I&rsquo;ve held Tuesday for you. Pay a SAR 2,250 deposit to confirm.</small>
          </li>
          {paid ? (
            <>
              <li className="pf-seet-msg" data-from="pay" key="pay">
                <span>SAR 2,250 deposit received</span>
              </li>
              <li className="pf-seet-msg" data-from="seet" key="done">
                <span lang="ar" dir="rtl">
                  وصل العربون، وتأكد حجز الثلاثاء. بنرسل لكم التفاصيل.
                </span>
                <small>Tuesday is booked. We&rsquo;ll send you the details.</small>
              </li>
            </>
          ) : null}
        </ol>

        <figcaption className="pf-seet-board">
          <p className="pf-seet-board-head">
            <span>Ad booking calendar</span>
            <strong role="status" aria-atomic="true" className="pf-seet-state">
              <span className="vb-sr">Tuesday: </span>
              {paid ? "Booking confirmed" : "Waiting for deposit"}
            </strong>
          </p>
          <ol className="pf-seet-week" aria-hidden="true">
            {WEEK.map((d) => (
              <li key={d.day} data-slot={"slot" in d ? "true" : undefined}>
                <span>{d.day}</span>
                <b>{d.n}</b>
                {"slot" in d ? <i>{paid ? "Snap story" : "Held"}</i> : null}
              </li>
            ))}
          </ol>
          <button
            type="button"
            className="pf-seet-pay"
            onClick={() => setPaid((p) => !p)}
            disabled={!hydrated}
            aria-hidden={hydrated ? undefined : "true"}
          >
            {paid ? "Restart sample chat" : "Simulate the deposit"}
          </button>
        </figcaption>
      </figure>
    </Reveal>
  );
}
