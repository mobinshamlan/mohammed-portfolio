import type { KeyboardEvent } from "react";

export function keepDialogTab(event: KeyboardEvent<HTMLDialogElement>) {
  if (event.key !== "Tab") return;

  const stops = event.currentTarget.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
  const first = stops[0];
  if (!first) return;
  const last = stops[stops.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}
