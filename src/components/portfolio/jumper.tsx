"use client";

import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { projectPage, projects } from "@/lib/projects";
import { projectThreads, type ToolkitProjectId } from "@/lib/toolkit";
import { useHydrated } from "@/lib/use-hydrated";
import { jumpToSection } from "./jump-link";

type Group = "Projects" | "Sections";

type Item = {
  label: string;
  /** Arabic name, shown after the English one. */
  arabic?: string;
  group: Group;
  href: string;
  /** The product whose colour marks the row. */
  colour?: ToolkitProjectId;
  /** Shown small after the name when the destination is its own page. */
  note?: string;
};

const sections: Item[] = [
  { label: "Home", group: "Sections", href: "/#home" },
  { label: "Work", group: "Sections", href: "/#work" },
  { label: "Where I come from", group: "Sections", href: "/#about" },
  { label: "Courses and certificates", group: "Sections", href: "/#certificates" },
  { label: "Skills", group: "Sections", href: "/#skills" },
  { label: "Get in touch", group: "Sections", href: "/#contact" },
  { label: "How this site was built", group: "Sections", href: "/experiment", note: "Page" },
];

const items: Item[] = [
  // Each product's chapter on the home page; Gthrz also has its own page.
  ...projects
    .filter((project) => project.id !== "experiment")
    .flatMap((project): Item[] => {
      const id = project.id as ToolkitProjectId;
      return [
        {
          label: project.name,
          arabic: project.arabic || undefined,
          group: "Projects",
          href: `/#${project.id}`,
          colour: id,
        },
        ...(project.id === "gthrz"
          ? [
              {
                label: "How Gthrz works",
                group: "Projects" as const,
                href: projectPage(project),
                colour: id,
                note: "Page",
              },
            ]
          : []),
      ];
    }),
  ...sections,
];

const groups: Group[] = ["Projects", "Sections"];

/** Lower case, without Arabic diacritics or tatweel, so طمني matches طمّني. */
function fold(text: string) {
  return text.toLowerCase().replace(/[ً-ٰٟـ]/g, "");
}

/**
 * Cmd/Ctrl+K opens a dialog with every project and
 * section. Type to filter, arrows to move, Enter to go, Escape to close.
 */
export function Jumper({ onHome }: { onHome: boolean }) {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const results = useRef<HTMLUListElement>(null);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const listId = useId();
  const returnTo = useRef<HTMLElement | null>(null);
  const hydrated = useHydrated();

  const needle = fold(query.trim());
  const shown = items.filter((item) =>
    fold(`${item.label} ${item.arabic ?? ""} ${item.group}`).includes(needle),
  );
  const active = Math.min(index, Math.max(0, shown.length - 1));

  function open(focusSearch = true) {
    const node = dialog.current;
    if (!node || node.open || document.querySelector("dialog:modal")) {
      return;
    }
    setQuery("");
    setIndex(0);
    const focused = document.activeElement;
    returnTo.current = focused instanceof HTMLElement && focused !== document.body ? focused : opener.current;
    node.showModal();
    results.current?.scrollTo({ top: 0, behavior: "instant" });
    (focusSearch ? input : closeButton).current?.focus({ preventScroll: true });
  }

  function close() {
    dialog.current?.close();
  }

  // Keep the selected result in view as the arrows move.
  useEffect(() => {
    if (dialog.current?.open) {
      document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: "nearest" });
    }
  }, [active, listId, query]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.isComposing || document.querySelector("dialog:modal")) return;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        open();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function go(item: Item) {
    returnTo.current = null;
    close();
    if (onHome && item.href.startsWith("/#")) {
      jumpToSection(item.href.slice(2));
    } else {
      router.push(item.href);
    }
  }

  function onInputKey(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing) return;
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIndex((i) => Math.max(0, Math.min(shown.length - 1, i + 1)));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setIndex((i) => Math.max(0, i - 1));
    } else if (event.key === "Enter" && shown[active]) {
      event.preventDefault();
      go(shown[active]);
    }
  }

  // The dialog needs JavaScript; without it the nav links do the same job.
  if (!hydrated) {
    return null;
  }

  const mac = /Mac|iPhone|iPad/.test(navigator.userAgent);

  return (
    <>
      <button
        ref={opener}
        type="button"
        className="vb-jump-open"
        onClick={(event) => open(event.detail === 0 || !window.matchMedia("(pointer: coarse)").matches)}
        aria-haspopup="dialog"
        aria-keyshortcuts={mac ? "Meta+K" : "Control+K"}
      >
        <svg className="vb-jump-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
          <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M15.5 15.5 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="vb-jump-text">Jump to</span>
        <kbd aria-hidden="true">{mac ? "⌘K" : "Ctrl K"}</kbd>
      </button>
      <dialog
        ref={dialog}
        className="vb-jump"
        aria-label="Jump to a project or section"
        onKeyDown={(event) => {
          // Tab moves between the search field and Close; arrows move through the results.
          if (event.key !== "Tab") return;
          const stops = [input.current, closeButton.current].filter((n): n is HTMLInputElement | HTMLButtonElement => n !== null);
          const at = stops.indexOf(document.activeElement as HTMLInputElement | HTMLButtonElement);
          event.preventDefault();
          const next = event.shiftKey ? (at <= 0 ? stops.length - 1 : at - 1) : (at + 1) % stops.length;
          stops[next]?.focus();
        }}
        onClose={() => {
          returnTo.current?.focus({ preventScroll: true });
          returnTo.current = null;
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            close();
          }
        }}
      >
        <div className="vb-jump-body">
          <div className="vb-jump-head">
            <label htmlFor={`${listId}-q`} className="vb-sr">
              Find a project or section
            </label>
            <svg className="vb-jump-glass" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M15.5 15.5 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              ref={input}
              id={`${listId}-q`}
              type="search"
              className="vb-jump-input"
              name="portfolio-search"
              placeholder="Search portfolio"
              spellCheck={false}
              value={query}
              role="combobox"
              aria-expanded={shown.length > 0}
              aria-controls={listId}
              aria-activedescendant={shown[active] ? `${listId}-${active}` : undefined}
              aria-autocomplete="list"
              autoComplete="off"
              onChange={(event) => {
                setQuery(event.target.value);
                setIndex(0);
              }}
              onKeyDown={onInputKey}
            />
            <button ref={closeButton} type="button" className="vb-jump-close" onClick={close}>
              Close
            </button>
          </div>
          <p className="vb-jump-empty" role="status">
            {shown.length === 0 ? "No matches." : ""}
          </p>
          <ul
            ref={results}
            id={listId}
            role="listbox"
            className="vb-jump-list"
            aria-label="Destinations"
            hidden={shown.length === 0}
          >
            {groups.map((group) => {
              const rows = shown
                .map((item, i) => ({ item, i }))
                .filter(({ item }) => item.group === group);
              if (rows.length === 0) {
                return null;
              }
              return (
                <li key={group} role="presentation" className="vb-jump-group">
                  <p className="vb-jump-group-title" aria-hidden="true">
                    {group}
                  </p>
                  <ul role="presentation" className="vb-jump-rows">
                    {rows.map(({ item, i }) => (
                      <li
                        key={item.href + item.label}
                        id={`${listId}-${i}`}
                        role="option"
                        aria-selected={i === active}
                        className="vb-jump-item"
                        style={
                          item.colour
                            ? ({ "--thread-colour": projectThreads[item.colour] } as CSSProperties)
                            : undefined
                        }
                        onMouseEnter={() => setIndex(i)}
                        onClick={() => go(item)}
                      >
                        {item.colour ? (
                          <span className="vb-jump-mark" aria-hidden="true" />
                        ) : null}
                        <span className="vb-jump-name">
                          {item.label}
                          {item.arabic ? (
                            <span className="vb-jump-arabic" lang="ar">
                              {item.arabic}
                            </span>
                          ) : null}
                        </span>
                        {item.note ? <span className="vb-jump-note">{item.note}</span> : null}
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
          <p className="vb-jump-foot" aria-hidden="true">
            <span>
              <kbd>↑</kbd>
              <kbd>↓</kbd> move
            </span>
            <span>
              <kbd>↵</kbd> open
            </span>
          </p>
        </div>
      </dialog>
    </>
  );
}
