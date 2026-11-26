"use client";

import { useEffect, useRef } from "react";

/*
 * Tammeni's own world behind its chapter: one school day as the product tells
 * it, in Arabic and right to left. A marker walks the day; at each moment the
 * news Lulwa carries appears above it, the way the live site lays out Reem's day.
 * Reduced motion, or no script: the whole day stands, every message showing.
 */

const DAY = [
  { time: "7:30 ص", text: "المدرسة تسجّل الحضور", kind: "school" },
  { time: "2:00 م", text: "لولوة تتصل عليك", kind: "call" },
  { time: "6:00 م", text: "تذكير باختبار بكرة", kind: "text" },
] as const;

function Glyph({ kind }: { kind: (typeof DAY)[number]["kind"] }) {
  if (kind === "call") {
    return (
      <svg viewBox="0 0 16 16" className="tammeni-glyph">
        <path d="M4.2 1.5 6 4.6 4.7 6.2a8.4 8.4 0 0 0 5.1 5.1l1.6-1.3 3.1 1.8-.6 2.4c-.2.6-.8 1-1.4.9C6.8 13.9 2.1 9.2 1.3 3.5c-.1-.6.3-1.2.9-1.4z" />
      </svg>
    );
  }
  if (kind === "text") {
    return (
      <svg viewBox="0 0 16 16" className="tammeni-glyph">
        <path d="M2 3h12v8H6.5L3.5 13.5V11H2z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" className="tammeni-glyph">
      <path d="M8 1.8 15 5.5 8 9.2 1 5.5zM3.5 7.5v3.2c1.2 1.3 2.7 2 4.5 2s3.3-.7 4.5-2V7.5L8 9.9z" />
    </svg>
  );
}

export function TammeniScene() {
  const ref = useRef<HTMLDivElement>(null);

  // The day only runs while the chapter is on screen.
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      node.dataset.play = entry.isIntersecting ? "true" : "false";
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="tammeni-scene" dir="rtl" lang="ar">
      <div className="tammeni-line">
        <span className="tammeni-fill" />
        <span className="tammeni-runner">
          <span className="tammeni-now" />
        </span>
      </div>
      <ol className="tammeni-day">
        {DAY.map((stop, i) => (
          <li key={stop.time} className="tammeni-stop" data-step={i + 1}>
            <span className="tammeni-bubble">
              <Glyph kind={stop.kind} />
              {stop.text}
            </span>
            <span className="tammeni-dot" />
            <span className="tammeni-time">{stop.time}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
