"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Content is visible in the static HTML. Once JavaScript runs, the root gets
 * data-motion="on" (see MotionRoot) and elements that have not yet entered the
 * viewport start hidden; they rise when they enter. Reduced motion: no move.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) {
      node.dataset.in = "true";
      return;
    }
    node.dataset.wait = "true";
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            node.dataset.in = "true";
            observer.disconnect();
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`vb-reveal${className ? ` ${className}` : ""}`}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}

/** Marks the page as motion-capable after mount, so no-JS visitors see everything. */
export function MotionRoot() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".vb");
    if (!root) {
      return;
    }
    root.dataset.motion = "on";
    requestAnimationFrame(() => {
      root.dataset.loaded = "true";
    });
    // Without scroll-driven animations, Sadu bands below the fold weave in once on entry.
    if (CSS.supports("animation-timeline: view()") || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.weave = "in";
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    root.querySelectorAll<HTMLElement>(".sadu").forEach((band) => {
      if (band.getBoundingClientRect().top > window.innerHeight) {
        band.dataset.weave = "wait";
        observer.observe(band);
      }
    });
    return () => observer.disconnect();
  }, []);
  return null;
}
