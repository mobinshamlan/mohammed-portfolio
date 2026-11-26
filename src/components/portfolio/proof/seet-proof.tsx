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
            <span>Ads number on WhatsApp · sample chat</span>
          </p>
        </div>

        <ol className="pf-seet-chat" aria-label="The chat">
          <li className="pf-seet-msg" data-from="brand">
            <span lang="ar" dir="rtl">
              نبي سناب ستوري الثلاثاء، كم السعر؟
            </span>
            <small>We want a Snap story on Tuesday, how much?</small>
          </li>
          <li className="pf-seet-msg" data-from="seet">
            <span lang="ar" dir="rtl">
              سناب ستوري ٤٬٥٠٠ ر.س، والثلاثاء فاضي. حجزته لكم مؤقتًا ويتأكد بعد العربون ٢٬٢٥٠ ر.س.
            </span>
            <small>A Snap story is SAR 4,500 and Tuesday is free. I&rsquo;ve held it for you; it&rsquo;s confirmed once the SAR 2,250 deposit lands.</small>
          </li>
          {paid ? (
            <>
              <li className="pf-seet-msg" data-from="pay" key="pay">
                <span>Deposit SAR 2,250 received · payment callback</span>
              </li>
              <li className="pf-seet-msg" data-from="seet" key="done">
                <span lang="ar" dir="rtl">
                  وصل العربون، وتأكد حجز الثلاثاء. بنرسل لكم التفاصيل.
                </span>
                <small>The deposit is in and Tuesday is confirmed. We&rsquo;ll send the details.</small>
              </li>
            </>
          ) : null}
        </ol>

        <figcaption className="pf-seet-board">
          <p className="pf-seet-board-head">
            <span>The influencer&rsquo;s calendar</span>
            <strong role="status" aria-atomic="true" className="pf-seet-state" key={paid ? "paid" : "held"}>
              <span className="vb-sr">Tuesday: </span>
              {paid ? "Confirmed by the payment" : "Held by the AI"}
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
            {paid ? "Start the chat again" : "Pay the deposit (sample)"}
          </button>
        </figcaption>
      </figure>
    </Reveal>
  );
}
