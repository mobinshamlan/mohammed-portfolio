"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { publicUrl } from "@/lib/site";
import { useHydrated } from "@/lib/use-hydrated";

type DocumentViewerProps = {
  children: ReactNode;
  triggerClassName: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  title: string;
  subtitle: string;
  href: string;
};

/**
 * A document opened in a native modal dialog. Escape and the close button come
 * from the browser; focus returns to the trigger when the viewer closes.
 */
export function DocumentViewer({
  children,
  triggerClassName,
  src,
  width,
  height,
  alt,
  title,
  subtitle,
  href,
}: DocumentViewerProps) {
  const hydrated = useHydrated();
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const node = dialog.current;
    if (!node) {
      return;
    }
    if (open && !node.open) {
      node.showModal();
      document.body.style.overflow = "hidden";
    }
    if (!open && node.open) {
      node.close();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Without JavaScript the trigger is a plain link to the file.
  if (!hydrated) {
    return (
      <a href={publicUrl(href)} className={triggerClassName}>
        {children}
      </a>
    );
  }

  return (
    <>
      <button
        ref={trigger}
        type="button"
        className={triggerClassName}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        {children}
      </button>

      <dialog
        ref={dialog}
        className="vb-dialog"
        aria-label={title}
        onClose={() => {
          setOpen(false);
          trigger.current?.focus();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setOpen(false);
          }
        }}
      >
        <div className="vb-dialog-body">
          <header className="vb-dialog-head">
            <div>
              <h3>{title}</h3>
              <p>{subtitle}</p>
            </div>
            <button
              type="button"
              className="vb-btn vb-btn-quiet"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </header>
          {open ? (
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              sizes="(max-width: 899px) 94vw, 900px"
              className="vb-dialog-img"
            />
          ) : null}
          <footer className="vb-dialog-foot">
            <a href={publicUrl(href)} target="_blank" rel="noreferrer">
              Open the image in a new tab
            </a>
          </footer>
        </div>
      </dialog>
    </>
  );
}
