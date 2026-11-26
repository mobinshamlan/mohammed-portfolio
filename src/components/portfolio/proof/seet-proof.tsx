"use client";

import { useState } from "react";
import { useHydrated } from "@/lib/use-hydrated";
import { Reveal } from "../reveal";

/*
 * Seet on the home page: the influencer's ads number on WhatsApp beside the
 * calendar in their Seet dashboard (navy and gold). A brand asks for Tuesday,
 * Seet answers with the price, holds the day and sends the deposit link. One
 * button stands in for the brand paying; only then does Tuesday turn from
 * "held" to "booked". The AI never says "confirmed" on its own.
 * Without JavaScript it shows the hold.
 */

const WEEK = [
  { day: "Sun", n: 9, taken: "Reel" },
  { day: "Mon", n: 10 },
  { day: "Tue", n: 11, slot: true },
  { day: "Wed", n: 12 },
  { day: "Thu", n: 13 },
] as const;

function Ticks({ read }: { read?: boolean }) {
  return (
    <svg viewBox="0 0 20 12" className="pf-seet-ticks" data-read={read ? "true" : undefined} aria-hidden="true" focusable="false">
      <path d="m1 6.5 3.5 3.5L11 3M7.5 10 9 11.5 18 2.5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

export function SeetProof() {
  const hydrated = useHydrated();
  const [paid, setPaid] = useState(false);

  return (
    <Reveal className="pf-seet">
      <figure className="pf-seet-stage" data-paid={paid ? "true" : undefined}>
        {/* The brand's WhatsApp chat with the influencer's ads number. */}
        <div className="pf-seet-wa" data-ui="">
          <div className="pf-seet-wa-head">
            <span className="pf-seet-wa-back" aria-hidden="true">
              ‹
            </span>
            <span className="pf-seet-brand" aria-hidden="true">
              م
            </span>
            <p className="pf-seet-who">
              <strong>Mathaq restaurant</strong>
              <span>online · sample chat</span>
            </p>
            <span className="pf-seet-wa-icons" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M4 7h11v10H4zM15 10l5-3v10l-5-3" />
              </svg>
              <svg viewBox="0 0 24 24">
                <path d="M5 3.5h3.2l1.6 4.3-2.1 1.4a11 11 0 0 0 7.1 7.1l1.4-2.1 4.3 1.6V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.1 1.5 1.5 0 0 1 5 3.5Z" />
              </svg>
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="5" r="1.2" />
                <circle cx="12" cy="12" r="1.2" />
                <circle cx="12" cy="19" r="1.2" />
              </svg>
            </span>
          </div>

          <ol className="pf-seet-chat" aria-label="Sample ad booking chat">
            <li className="pf-seet-stamp" aria-hidden="true">
              Today
            </li>
            <li className="pf-seet-msg" data-from="brand">
              <span lang="ar" dir="rtl">
                نبي سناب ستوري الثلاثاء، كم السعر؟
              </span>
              <small>How much for a Snapchat Story on Tuesday?</small>
              <time>9:14</time>
            </li>
            <li className="pf-seet-msg" data-from="seet">
              <em className="pf-seet-auto">Seet · auto-reply</em>
              <span lang="ar" dir="rtl">
                سناب ستوري ٤٬٥٠٠ ر.س، والثلاثاء فاضي. حجزته لكم مؤقتًا ويتأكد بعد العربون ٢٬٢٥٠ ر.س.
              </span>
              <small>A Snapchat Story is SAR 4,500 and Tuesday is free. I&rsquo;ve held it for you; it&rsquo;s confirmed once the SAR 2,250 deposit is paid.</small>
              <span className="pf-seet-linkcard" aria-hidden="true">
                <b>Deposit link · SAR 2,250</b>
                <i>seet.app/pay/mathaq-tue</i>
              </span>
              <time>
                9:14 <Ticks read />
              </time>
            </li>
            {paid ? (
              <>
                <li className="pf-seet-msg" data-from="pay" key="pay">
                  <CheckIcon />
                  <span>Deposit received · SAR 2,250</span>
                </li>
                <li className="pf-seet-msg" data-from="seet" key="done">
                  <em className="pf-seet-auto">Seet · auto-reply</em>
                  <span lang="ar" dir="rtl">
                    وصل العربون، وتأكد حجز الثلاثاء. بنرسل لكم التفاصيل.
                  </span>
                  <small>Deposit received. Tuesday is booked; the details are on their way.</small>
                  <time>
                    9:21 <Ticks />
                  </time>
                </li>
              </>
            ) : null}
          </ol>

          {/* The one action: stand in for the brand paying the link. */}
          <div className="pf-seet-wa-foot">
            <button
              type="button"
              className="pf-seet-pay"
              onClick={() => setPaid((p) => !p)}
              disabled={!hydrated}
              aria-hidden={hydrated ? undefined : "true"}
            >
              {paid ? "Start the sample again" : "Pay the SAR 2,250 deposit"}
            </button>
            <p className="pf-seet-wa-note">{paid ? "The brand paid. Nothing else was needed." : "Sample: this button stands in for the brand paying the link."}</p>
          </div>
        </div>

        {/* The influencer's calendar in Seet: the week, and Tuesday on it. */}
        <figcaption className="pf-seet-cal">
          <p className="pf-seet-cal-head">
            <strong>Calendar</strong>
            <span>Sample dashboard · Nov</span>
          </p>
          <ol className="pf-seet-week" aria-hidden="true">
            {WEEK.map((d) => (
              <li key={d.day} data-slot={"slot" in d ? "true" : undefined} data-taken={"taken" in d ? "true" : undefined}>
                <span>{d.day}</span>
                <b>{d.n}</b>
                {"slot" in d ? <i>{paid ? "Booked" : "Held"}</i> : "taken" in d ? <i>{d.taken}</i> : null}
              </li>
            ))}
          </ol>
          <div className="pf-seet-day" role="status" aria-atomic="true">
            <span className="pf-seet-pill" key={paid ? "booked" : "held"}>
              {paid ? <CheckIcon /> : null}
              {paid ? "Booked" : "Held, not booked"}
            </span>
            <strong>Tue 11 · Snapchat Story</strong>
            <span className="pf-seet-day-who">Mathaq restaurant · SAR 4,500</span>
            <span className="pf-seet-day-money">
              {paid ? "Deposit paid SAR 2,250 · SAR 2,250 due after the story" : "Waiting for the SAR 2,250 deposit · hold ends in 24h"}
            </span>
          </div>
        </figcaption>
      </figure>
    </Reveal>
  );
}
