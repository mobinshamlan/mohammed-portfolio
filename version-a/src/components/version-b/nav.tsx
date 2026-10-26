"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";

const upcoming = ["Work", "About", "Education", "Contact"] as const;

export function VersionBNav() {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className="vb-nav">
      <div className="vb-brand">
        <Link href="/version-b" className="vb-brand-mark">
          MBS
        </Link>
        <Link href="/" className="vb-brand-back">
          All experiences
        </Link>
      </div>

      <nav aria-label="Version B">
        <ul className="vb-nav-desktop">
          <li>
            <Link href="/version-b" aria-current="page">
              Home
            </Link>
          </li>
          {upcoming.map((item) => (
            <li key={item} className="vb-soon">
              {item}
              <small>Coming next</small>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="vb-menu-toggle"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen(true)}
        >
          Menu
        </button>
      </nav>

      {open ? (
        <div
          className="vb-menu"
          id={menuId}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="vb-menu-head">
            <p className="vb-brand-mark">MBS</p>
            <button
              type="button"
              className="vb-menu-toggle"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
          <ul className="vb-menu-list">
            <li>
              <Link href="/version-b" aria-current="page" onClick={() => setOpen(false)}>
                Home
              </Link>
            </li>
            {upcoming.map((item) => (
              <li key={item} className="vb-soon">
                {item}
                <small>Coming next</small>
              </li>
            ))}
          </ul>
          <Link href="/" className="vb-menu-experiences" onClick={() => setOpen(false)}>
            All experiences
          </Link>
        </div>
      ) : null}
    </header>
  );
}
