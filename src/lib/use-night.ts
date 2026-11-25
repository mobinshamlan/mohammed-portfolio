import { useSyncExternalStore } from "react";
import { nightInRiyadh, type Night } from "./riyadh";

/*
 * One computation of tonight for the whole page, refreshed each minute while
 * anything is listening. Null during server rendering and hydration, so the
 * static page never shows the build day's sky.
 */
let night: Night | null = null;
const listeners = new Set<() => void>();
let timer: number | undefined;

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (timer === undefined) {
    timer = window.setInterval(() => {
      night = nightInRiyadh();
      listeners.forEach((l) => l());
    }, 60000);
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size) {
      window.clearInterval(timer);
      timer = undefined;
    }
  };
}

function snapshot() {
  night ??= nightInRiyadh();
  return night;
}

export function useNight() {
  return useSyncExternalStore(subscribe, snapshot, () => null);
}
