"use client";

import { motion, useReducedMotion } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Temporary visual stand-in for a portrait.
 * Replace the inner composition with an image when one is available.
 */
export function PortraitSlot() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.aside
      className="vb-portrait"
      aria-hidden="true"
      initial={reduceMotion ? false : { clipPath: "inset(100% 0 0 0)" }}
      animate={{ clipPath: "inset(0% 0 0 0)" }}
      transition={{ duration: 1.1, delay: 0.15, ease }}
    >
      <span className="vb-portrait-bar" />
      <p className="vb-portrait-tag">Software development × AI</p>
      <p className="vb-portrait-letter">M</p>
      <p className="vb-portrait-year">26</p>
    </motion.aside>
  );
}
