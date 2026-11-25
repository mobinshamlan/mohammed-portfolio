"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { contact } from "@/lib/contact";
import { appPath } from "@/lib/site";
import { useHydrated } from "@/lib/use-hydrated";
import { Jumper } from "./jumper";

const links = [
  { href: "/#work", id: "work", label: "Work" },
  { href: "/#about", id: "about", label: "About" },
  { href: "/#journey", id: "journey", label: "Journey" },
  { href: "/#skills", id: "skills", label: "Skills" },
  { href: "/#contact", id: "contact", label: "Contact" },
] as const;

type Tone = "dark" | "light";

/** Scroll to a section and move focus to its heading. */
export function focusSection(id: string) {
  const target = document.getElementById(id);
  if (!target) {
    return false;
  }
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  const heading = target.querySelector<HTMLElement>("h1, h2") ?? target;
  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
  return true;
}

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

  useEffect(() => {
    if (!onHome) {
      return;
    }
    const sections = links
      .map((item) => document.getElementById(item.id))
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
      return id === spy ? ("page" as const) : undefined;
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
    if (!onHome) {
      closeMenu();
      return;
    }
    // Focus goes to the section heading, not back to the Menu button. The
    // browser restores focus to the button as the dialog closes, so the heading
    // takes focus one tick later.
    refocus.current = false;
    const wasOpen = menu.current?.open;
    closeMenu();
    if (document.getElementById(id)) {
      event.preventDefault();
      window.history.replaceState(null, "", `#${id}`);
      if (wasOpen) {
        window.setTimeout(() => focusSection(id), 50);
      } else {
        focusSection(id);
      }
    }
  }

  // Keep Tab and Shift+Tab inside the open menu, whatever the browser does.
  function trapTab(event: React.KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") {
      return;
    }
    const nodes = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
    );
    if (nodes.length === 0) {
      return;
    }
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
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
          Mohammed Bin Shamlan
          <span lang="ar">محمد بن شملان</span>
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
        <Jumper />
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
        onKeyDown={trapTab}
        onClose={() => {
          if (refocus.current) {
            toggle.current?.focus();
          }
          refocus.current = true;
        }}
      >
        <div className="vb-menu-head">
          <p className="vb-wordmark">Mohammed</p>
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
