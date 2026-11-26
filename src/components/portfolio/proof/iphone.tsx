import type { HTMLAttributes, ReactNode } from "react";

/*
 * One phone for the home page try-its (Naqah, Tammeni, Gthrz): true iPhone
 * proportions (393 x 852), a thin even bezel, the Dynamic Island, a status
 * bar, side buttons and the home indicator. Each try-it fills the screen with
 * its own app. Styles live in proof-naqah.css under ".pf-ip".
 */

function StatusIcons() {
  return (
    <span className="pf-ip-icons" aria-hidden="true">
      <svg viewBox="0 0 18 12" className="pf-ip-signal">
        <rect x="0" y="8" width="3" height="4" rx="0.8" />
        <rect x="5" y="5.5" width="3" height="6.5" rx="0.8" />
        <rect x="10" y="3" width="3" height="9" rx="0.8" />
        <rect x="15" y="0" width="3" height="12" rx="0.8" />
      </svg>
      <svg viewBox="0 0 16 12" className="pf-ip-wifi">
        <path d="M8 11.2 1.2 4.6a9.6 9.6 0 0 1 13.6 0Z" opacity="0.35" />
        <path d="M8 11.2 3.9 7.2a5.8 5.8 0 0 1 8.2 0Z" opacity="0.7" />
        <path d="M8 11.2 6.2 9.4a2.5 2.5 0 0 1 3.6 0Z" />
      </svg>
      <svg viewBox="0 0 27 12" className="pf-ip-battery">
        <rect x="0.5" y="0.5" width="22" height="11" rx="3" fill="none" stroke="currentColor" opacity="0.5" />
        <rect x="2" y="2" width="18" height="8" rx="1.8" />
        <path d="M24.5 4v4a2 2 0 0 0 0-4Z" opacity="0.5" />
      </svg>
    </span>
  );
}

export function IPhone({
  time,
  label,
  className,
  screenProps,
  children,
}: {
  /** The time in the status bar, as iOS shows it. */
  time: string;
  /** Whose phone this is, set in small type above the device. */
  label?: string;
  className?: string;
  screenProps?: HTMLAttributes<HTMLDivElement> & { [key: `data-${string}`]: string | undefined };
  children: ReactNode;
}) {
  return (
    <div className={["pf-ip-wrap", className].filter(Boolean).join(" ")} data-ui="">
      {label ? <p className="pf-ip-label">{label}</p> : null}
      <div className="pf-ip">
        <span className="pf-ip-btn pf-ip-btn-action" aria-hidden="true" />
        <span className="pf-ip-btn pf-ip-btn-up" aria-hidden="true" />
        <span className="pf-ip-btn pf-ip-btn-down" aria-hidden="true" />
        <span className="pf-ip-btn pf-ip-btn-side" aria-hidden="true" />
        <div {...screenProps} className={["pf-ip-screen", screenProps?.className].filter(Boolean).join(" ")}>
          <span className="pf-ip-island" aria-hidden="true" />
          <p className="pf-ip-status" aria-hidden="true">
            <span className="pf-ip-time">{time}</span>
            <StatusIcons />
          </p>
          <div className="pf-ip-body">{children}</div>
          <span className="pf-ip-home" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

/** The two round call buttons iOS shows: Decline, and Accept or Call again. */
export function CallEndIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12 9c-2.3 0-4.5.4-6.5 1.2-.7.3-1.1.9-1.1 1.6v2.1c0 .6-.5 1.1-1.1 1-.9-.2-1.8-.5-2.6-.9-.4-.2-.7-.6-.7-1v-1.6C0 9.4 5.3 7 12 7s12 2.4 12 4.4V13c0 .4-.3.8-.7 1-.8.4-1.7.7-2.6.9-.6.1-1.1-.4-1.1-1v-2.1c0-.7-.4-1.3-1.1-1.6C16.5 9.4 14.3 9 12 9Z"
      />
    </svg>
  );
}

export function CallIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1L6.6 10.8Z"
      />
    </svg>
  );
}
