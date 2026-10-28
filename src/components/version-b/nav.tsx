"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import type { MouseEvent } from "react";

const links = [
  { href: "/version-b", hash: "", label: "Home", extra: false },
  { href: "/version-b#work", hash: "#work", label: "Work", extra: false },
  { href: "/version-b#about", hash: "#about", label: "About", extra: false },
  {
    href: "/version-b#education",
    hash: "#education",
    label: "Education",
    extra: false,
  },
  { href: "/version-b#skills", hash: "#skills", label: "Skills", extra: true },
  {
    href: "/version-b#certifications",
    hash: "#certifications",
    label: "Certifications",
    extra: true,
  },
  {
    href: "/version-b#contact",
    hash: "#contact",
    label: "Contact",
    extra: false,
  },
] as const;

export function VersionBNav() {
  const [open, setOpen] = useState(false);
  const [spy, setSpy] = useState("home");
  const menuId = useId();
  const pathname = usePathname();
  const onHome = pathname === "/version-b";
  const onProject = pathname.startsWith("/version-b/projects/");

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

  // On the homepage, mark the section nearest the middle of the screen.
  useEffect(() => {
    if (!onHome) {
      return;
    }
    const sections = links
      .map((item) =>
        document.getElementById(item.hash ? item.hash.slice(1) : "home"),
      )
      .filter((node): node is HTMLElement => node !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setSpy(entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [onHome]);

  function current(item: (typeof links)[number]) {
    if (onHome) {
      const id = item.hash ? item.hash.slice(1) : "home";
      return id === spy ? ("page" as const) : undefined;
    }
    if (item.label === "Work" && onProject) {
      return "page" as const;
    }
    return undefined;
  }

  function hrefFor(item: (typeof links)[number]) {
    if (!item.hash) {
      return item.href;
    }
    return onHome ? item.hash : item.href;
  }

  function onHashClick(event: MouseEvent<HTMLAnchorElement>, hash: string) {
    setOpen(false);
    if (!onHome || !hash) {
      return;
    }
    const target = document.getElementById(hash.slice(1));
    if (!target) {
      return;
    }
    event.preventDefault();
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    target.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
    window.history.replaceState(null, "", hash);
  }

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
          {links.map((item) => (
            <li
              key={item.label}
              className={item.extra ? "vb-nav-extra" : undefined}
            >
              <Link
                href={hrefFor(item)}
                aria-current={current(item)}
                onClick={(event) => onHashClick(event, item.hash)}
              >
                {item.label}
              </Link>
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
            {links.map((item) => (
              <li key={item.label}>
                <Link
                  href={hrefFor(item)}
                  aria-current={current(item)}
                  onClick={(event) => onHashClick(event, item.hash)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/"
            className="vb-menu-experiences"
            onClick={() => setOpen(false)}
          >
            All experiences
          </Link>
        </div>
      ) : null}
    </header>
  );
}
