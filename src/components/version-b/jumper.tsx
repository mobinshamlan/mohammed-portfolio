"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { projects } from "@/lib/projects";
import { focusSection } from "./nav";

type Item = { label: string; hint: string; href: string };

const sections: Item[] = [
  { label: "Work", hint: "Section", href: "/#work" },
  { label: "About", hint: "Section", href: "/#about" },
  { label: "Journey", hint: "Section", href: "/#journey" },
  { label: "Skills", hint: "Section", href: "/#skills" },
  { label: "Contact", hint: "Section", href: "/#contact" },
  { label: "How this site was built", hint: "Experiment", href: "/experiment" },
];

const items: Item[] = [
  ...projects.map((project) => ({
    label: project.arabic ? `${project.name} ${project.arabic}` : project.name,
    hint: `${project.statusChip} · ${project.dates}`,
    href: project.href ?? `/projects/${project.id}`,
  })),
  ...sections,
];

/**
 * Jump anywhere: Cmd/Ctrl+K or "/" opens a dialog with every project and
 * section. Type to filter, arrows to move, Enter to go, Escape to close.
 */
export function Jumper() {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const listId = useId();
  const returnTo = useRef<HTMLElement | null>(null);

  const shown = items.filter((item) =>
    `${item.label} ${item.hint}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const active = Math.min(index, Math.max(0, shown.length - 1));

  function open() {
    const node = dialog.current;
    if (!node || node.open) {
      return;
    }
    setQuery("");
    setIndex(0);
    returnTo.current = document.activeElement as HTMLElement | null;
    node.showModal();
    requestAnimationFrame(() => input.current?.focus());
  }

  function close() {
    dialog.current?.close();
  }

  // Keep the selected result in view as the arrows move.
  useEffect(() => {
    document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active, listId]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        open();
      } else if (event.key === "/" && !typing) {
        event.preventDefault();
        open();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function go(item: Item) {
    close();
    router.push(item.href);
    if (item.href.startsWith("/#")) {
      const id = item.href.slice(2);
      window.setTimeout(() => focusSection(id), 400);
    }
  }

  function onInputKey(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIndex((i) => Math.min(shown.length - 1, i + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setIndex((i) => Math.max(0, i - 1));
    } else if (event.key === "Enter" && shown[active]) {
      event.preventDefault();
      go(shown[active]);
    }
  }

  return (
    <>
      <button
        ref={opener}
        type="button"
        className="vb-jump-open"
        onClick={open}
        aria-haspopup="dialog"
      >
        Jump to
        <kbd aria-hidden="true">⌘K</kbd>
      </button>
      <dialog
        ref={dialog}
        className="vb-jump"
        aria-label="Jump to a project or section"
        onClose={() => {
          const target = returnTo.current;
          if (target && target !== document.body && document.contains(target)) {
            target.focus();
          } else {
            opener.current?.focus();
          }
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            close();
          }
        }}
      >
        <div className="vb-jump-body">
          <label htmlFor={`${listId}-q`} className="vb-jump-label">
            Where to?
          </label>
          <input
            ref={input}
            id={`${listId}-q`}
            type="search"
            className="vb-jump-input"
            placeholder="Type a project or section"
            value={query}
            role="combobox"
            aria-expanded="true"
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
          <ul id={listId} role="listbox" className="vb-jump-list" aria-label="Destinations">
            {shown.length === 0 ? (
              <li className="vb-jump-empty">Nothing matches. Try a project name.</li>
            ) : (
              shown.map((item, i) => (
                <li
                  key={item.href + item.label}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={i === active}
                  className="vb-jump-item"
                  onMouseEnter={() => setIndex(i)}
                  onClick={() => go(item)}
                >
                  <span className="vb-jump-name">{item.label}</span>
                  <span className="vb-jump-hint">{item.hint}</span>
                </li>
              ))
            )}
          </ul>
          <p className="vb-jump-foot">
            Arrows move, Enter opens, Esc closes. Press / anywhere to open this.
          </p>
        </div>
      </dialog>
    </>
  );
}
