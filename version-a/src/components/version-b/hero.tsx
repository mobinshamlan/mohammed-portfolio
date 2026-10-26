"use client";

import { motion, useReducedMotion } from "motion/react";
import { portfolio } from "../../../../data/portfolio";
import { PortraitSlot } from "./portrait-slot";

const ease = [0.16, 1, 0.3, 1] as const;

const nameLines = [
  { text: "Mohammed", className: "" },
  { text: "Bin", className: "vb-name-bin" },
  { text: "Shamlan", className: "" },
] as const;

export function VersionBHero() {
  const reduceMotion = useReducedMotion();

  return (
    <main id="content" className="vb-hero">
      <div className="vb-identity">
        <motion.p
          className="vb-kicker"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Portfolio / 2026
        </motion.p>
        <h1 className="vb-name">
          {nameLines.map((line, index) => (
            <motion.span
              key={line.text}
              className={line.className}
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.12 + index * 0.1, ease }}
            >
              {line.text}
            </motion.span>
          ))}
        </h1>
      </div>

      <motion.div
        className="vb-copy"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.42, ease }}
      >
        <p className="vb-title">{portfolio.title}</p>
        <p className="vb-intro">
          Building thoughtful digital products through software, creativity, and
          emerging technologies.
        </p>
      </motion.div>

      <PortraitSlot />

      <motion.p
        className="vb-meta"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.7 }}
      >
        <span>Based in {portfolio.location}</span>
        <span>Software development × AI</span>
      </motion.p>
    </main>
  );
}
