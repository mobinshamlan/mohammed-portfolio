"use client";

import { useId, useState } from "react";
import { useHydrated } from "@/lib/use-hydrated";
import { Reveal } from "../reveal";
import { IPhone } from "./iphone";

function TextIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5 5h14a1.5 1.5 0 0 1 1.5 1.5v8.5a1.5 1.5 0 0 1-1.5 1.5h-8.5l-4.5 3.5v-3.5H5A1.5 1.5 0 0 1 3.5 15V6.5A1.5 1.5 0 0 1 5 5Z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5 3.5h3.2l1.6 4.3-2.1 1.4a11 11 0 0 0 7.1 7.1l1.4-2.1 4.3 1.6V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.1 1.5 1.5 0 0 1 5 3.5Z" />
    </svg>
  );
}

function TorchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M8 3h8v3l-2 3v12H10V9L8 6V3Z" />
      <circle cx="12" cy="13" r="1" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 8h3l1.5-2h7L17 8h3v11H4V8Z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

/* The same news, two ways: the parent picks, per child and per topic. */
const ways = [
  {
    id: "text",
    label: "Text",
    icon: <TextIcon />,
    ar: "ريم وصلت المدرسة الساعة ٧:٠٥ الصبح.",
    en: "Reem got to school at 7:05 this morning.",
  },
  {
    id: "call",
    label: "Call",
    icon: <PhoneIcon />,
    ar: "هلا، معك لولوة من طمّني. ريم وصلت المدرسة الساعة ٧:٠٥. تبين تسألين عن شي؟",
    en: "Hi, it’s Lulwa from Tammeni. Reem got to school at 7:05. Anything you want to ask?",
  },
] as const;

/**
 * Tammeni on the home page: the parent's rule for Reem's attendance news,
 * and the parent's iPhone at 7:06 showing how that news lands: a notification
 * on the lock screen, or Lulwa calling. Without JavaScript it shows the text.
 */
export function TammeniProof() {
  const hydrated = useHydrated();
  const [way, setWay] = useState<(typeof ways)[number]["id"]>("text");
  const id = useId();
  const shown = ways.find((w) => w.id === way) ?? ways[0];

  return (
    <Reveal className="pf-tammeni">
      <div className="pf-tammeni-stage">
        {/* The rule, as the parent set it in Tammeni. */}
        <fieldset className="pf-tm-rule" data-ui="" disabled={!hydrated}>
          <legend className="pf-tm-rule-head">
            <span className="pf-tm-rule-who">
              Reem
            </span>
            <span className="pf-tm-rule-what">Get an update when Reem arrives</span>
          </legend>
          <div className="pf-tm-seg">
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
          <p className="pf-tm-rule-note">Sample family</p>
        </fieldset>

        {/* The parent's phone, one minute after the school marked Reem present. */}
        <IPhone
          time="7:06"
          label="The parent's phone"
          className="pf-tm-phone"
          screenProps={{ className: "pf-tm-screen", role: "status", "aria-atomic": true, "data-kind": shown.id }}
        >
          {shown.id === "text" ? (
            <div className="pf-tm-lock" key="text">
              <p className="pf-tm-clock" aria-hidden="true">
                <span className="pf-tm-time">7:06</span>
              </p>
              <div className="pf-tm-banner">
                <span className="pf-tm-app" aria-hidden="true" lang="ar">
                  ط
                </span>
                <span className="pf-tm-banner-body">
                  <span className="pf-tm-banner-top">
                    <strong>Tammeni</strong>
                    <span>now</span>
                  </span>
                  <span className="pf-tm-ar" lang="ar" dir="rtl">
                    {shown.ar}
                  </span>
                </span>
              </div>
              <p className="pf-tm-gloss">{shown.en}</p>
              <span className="pf-tm-corners" aria-hidden="true">
                <i>
                  <TorchIcon />
                </i>
                <i>
                  <CameraIcon />
                </i>
              </span>
            </div>
          ) : (
            <div className="pf-tm-call" key="call">
              <div className="pf-tm-caller">
                <span className="pf-tm-ring" aria-hidden="true">
                  <span className="pf-tm-avatar" lang="ar">
                    ل
                  </span>
                </span>
                <strong>Lulwa</strong>
                <span>Tammeni · sample call</span>
              </div>
              <div className="pf-tm-saying">
                <span className="pf-tm-wave" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
                <span className="pf-tm-ar pf-tm-said" lang="ar" dir="rtl">
                  {shown.ar}
                </span>
                <p className="pf-tm-gloss">{shown.en}</p>
              </div>
            </div>
          )}
        </IPhone>
      </div>
    </Reveal>
  );
}
