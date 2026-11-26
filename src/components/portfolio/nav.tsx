"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { contact } from "@/lib/contact";
import { appPath } from "@/lib/site";
import { keepDialogTab } from "@/lib/dialog";
import { useHydrated } from "@/lib/use-hydrated";
import { focusSection, jumpToSection } from "./jump-link";
import { Jumper } from "./jumper";

const links = [
  { href: "/#work", id: "work", label: "Work" },
  { href: "/#about", id: "about", label: "Story" },
  { href: "/#skills", id: "skills", label: "Skills" },
  { href: "/#contact", id: "contact", label: "Contact" },
] as const;

type Tone = "dark" | "light";

export function Nav({
  tone = "dark",
  field,
  fieldInk,
}: {
  tone?: Tone;
  field?: string;
  fieldInk?: string;
}) {
  const [spy, setSpy] = useState("");
  const hydrated = useHydrated();
  const menu = useRef<HTMLDialogElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const refocus = useRef(true);
  const pathname = appPath(usePathname());
  const onHome = pathname === "/";
  const onProject = pathname.startsWith("/projects/");

  // Arriving from another page at /#section, or going Back and Forward
  // between sections: focus follows to that section's heading. Back to the
  // top of the page returns focus to the opening's heading.
  useEffect(() => {
    if (!onHome) {
      return;
    }
    const id = window.location.hash.slice(1);
    const frame = id ? requestAnimationFrame(() => focusSection(id, "instant")) : undefined;
    function onPop() {
      const target = window.location.hash.slice(1);
      if (target) requestAnimationFrame(() => focusSection(target, "instant"));
    }
    window.addEventListener("popstate", onPop);
    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      window.removeEventListener("popstate", onPop);
    };
  }, [onHome]);

  useEffect(() => {
    if (!onHome) {
      return;
    }
    const sections = ["home", ...links.map((item) => item.id)]
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setSpy(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [onHome]);

  function current(id: string) {
    if (onHome) {
      return id === spy ? ("location" as const) : undefined;
    }
    if (id === "work" && onProject) {
      return "page" as const;
    }
    return undefined;
  }

  function closeMenu() {
    menu.current?.close();
  }

  function onHashClick(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    if (!onHome) {
      closeMenu();
      return;
    }
    event.preventDefault();
    if (menu.current?.open) {
      refocus.current = false;
      closeMenu();
    }
    jumpToSection(id);
  }

  return (
    <header
      className="vb-nav"
      data-tone={tone}
      data-hydrated={hydrated ? "true" : undefined}
      style={
        field
          ? ({ "--field": field, "--field-ink": fieldInk } as React.CSSProperties)
          : undefined
      }
    >
      <div className="vb-brand">
        <Link href="/" className="vb-wordmark">
          <span className="vb-wordmark-full">Mohammed Bin Shamlan</span>
          <span className="vb-wordmark-short" aria-hidden="true">M. Bin Shamlan</span>
        </Link>
      </div>

      <nav aria-label="Site">
        <ul className="vb-nav-links">
          {links.map((item) => (
            <li key={item.id}>
              <Link
                href={onHome ? `#${item.id}` : item.href}
                aria-current={current(item.id)}
                onClick={(event) => onHashClick(event, item.id)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="vb-nav-actions">
        <Jumper onHome={onHome} />
        <a
          href={contact.github.href}
          className="vb-nav-back"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        <button
          ref={toggle}
          type="button"
          className="vb-menu-toggle"
          aria-haspopup="dialog"
          onClick={() => menu.current?.showModal()}
        >
          Menu
        </button>
      </div>

      <dialog
        ref={menu}
        className="vb-menu"
        aria-label="Menu"
        onKeyDown={keepDialogTab}
        onClose={() => {
          if (refocus.current) {
            toggle.current?.focus();
          }
          refocus.current = true;
        }}
      >
        <div className="vb-menu-head">
          <p className="vb-wordmark">Mohammed Bin Shamlan</p>
          <button type="button" className="vb-menu-toggle" onClick={closeMenu}>
            Close
          </button>
        </div>
        <ul className="vb-menu-list">
          <li>
            <Link href="/" onClick={closeMenu}>
              Home
            </Link>
          </li>
          {links.map((item) => (
            <li key={item.id}>
              <Link
                href={onHome ? `#${item.id}` : item.href}
                aria-current={current(item.id)}
                onClick={(event) => onHashClick(event, item.id)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="vb-menu-foot">
          <a href={contact.github.href} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={contact.linkedin.href} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <Link href="/experiment" onClick={closeMenu}>
            How this site was built
          </Link>
        </div>
      </dialog>
    </header>
  );
}
