"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { useHydrated } from "@/lib/use-hydrated";
import { contact } from "@/lib/contact";
import { Collapsible } from "./collapsible";
import { Reveal } from "./reveal";
import { ChapterMark } from "./chapter-mark";

type Fields = { name: string; email: string; message: string };
type FieldName = keyof Fields;
type Status = "idle" | "opening" | "opened" | "copied" | "failed";

const empty: Fields = { name: "", email: "", message: "" };

function validate(values: Fields) {
  const errors: Partial<Record<FieldName, string>> = {};
  if (values.name.trim().length < 2) {
    errors.name = "Add your name so I know who is writing.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "That email address does not look complete.";
  }
  if (values.message.trim().length < 10) {
    errors.message = "A sentence or two is enough, but this is too short.";
  }
  return errors;
}

function buildMail(values: Fields) {
  const subject = `Hello from ${values.name.trim()}`;
  const body = `${values.message.trim()}\n\n${values.name.trim()} <${values.email.trim()}>`;
  return {
    subject,
    body,
    href: `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  };
}

export function Contact() {
  const id = useId();
  const [fields, setFields] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [emailCopied, setEmailCopied] = useState(false);
  // The form needs JavaScript to open a draft; without it the email link above is the way in.
  const mounted = useHydrated();
  const noteRef = useRef<HTMLDivElement>(null);
  // The first invalid field, focused once its error message has rendered.
  const [invalid, setInvalid] = useState<{ field: FieldName; attempt: number } | null>(null);
  const mail = buildMail(fields);

  useEffect(() => {
    if (!invalid) return;
    const field = document.getElementById(`${id}-${invalid.field}`);
    if (!field) return;
    field.focus({ preventScroll: true });
    // Centred, so the sticky header never covers the field or its message.
    field.scrollIntoView({
      block: "center",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }, [id, invalid]);

  function update(name: FieldName, value: string) {
    setFields((current) => ({ ...current, [name]: value }));
    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: undefined }));
    }
    if (status !== "idle") {
      setStatus("idle");
    }
  }

  async function copyNote() {
    try {
      await navigator.clipboard.writeText(mail.body);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(contact.email);
      setEmailCopied(true);
      window.setTimeout(() => setEmailCopied(false), 2200);
    } catch {
      setEmailCopied(false);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = validate(fields);
    setErrors(next);
    const first = (["name", "email", "message"] as FieldName[]).find(
      (key) => next[key],
    );
    if (first) {
      setInvalid((current) => ({ field: first, attempt: (current?.attempt ?? 0) + 1 }));
      return;
    }
    setStatus("opening");
    window.location.href = mail.href;
    window.setTimeout(() => {
      setStatus((current) => (current === "opening" ? "opened" : current));
      noteRef.current?.scrollIntoView({ block: "nearest" });
    }, 900);
  }

  const filled =
    fields.name.trim() || fields.email.trim() || fields.message.trim();

  return (
    <section id="contact" className="vb-contact" aria-labelledby="contact-title">
      <div className="vb-contact-top">
        <ChapterMark n={5} en="Contact" ar="تواصل معي" />
        <Reveal>
          <h2 id="contact-title" className="vb-section-head">
            Write to me.
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="vb-lead">
            A role, a project, or a question, in Arabic or English.
          </p>
        </Reveal>
      </div>

      <Reveal className="vb-contact-email">
        <a href={`mailto:${contact.email}`} className="vb-contact-address">
          {contact.email.split("@")[0]}
          <span>@{contact.email.split("@")[1]}</span>
        </a>
        <div className="vb-contact-email-actions">
          {mounted ? (
            <button type="button" className="vb-btn vb-btn-quiet" onClick={copyEmail}>
              {emailCopied ? "Copied" : "Copy address"}
            </button>
          ) : null}
          <a
            href={contact.linkedin.href}
            className="vb-link"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
          <a
            href={contact.github.href}
            className="vb-link"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </Reveal>

      {mounted ? (
      <Collapsible className="vb-form-wrap" summary={<span className="vb-form-title">Draft an email</span>}>
      <form className="vb-form" onSubmit={onSubmit} noValidate>
        <div className="vb-form-grid">
          <Field
            id={`${id}-name`}
            label="Your name"
            autoComplete="name"
            value={fields.name}
            error={errors.name}
            onChange={(value) => update("name", value)}
          />
          <Field
            id={`${id}-email`}
            label="Your email"
            type="email"
            autoComplete="email"
            value={fields.email}
            error={errors.email}
            onChange={(value) => update("email", value)}
          />
          <Field
            id={`${id}-message`}
            label="Message"
            value={fields.message}
            error={errors.message}
            multiline
            onChange={(value) => update("message", value)}
            hint="A line about what you are building, or the role, is plenty."
          />
        </div>

        <div className="vb-form-actions">
          <button
            type="submit"
            className="vb-btn"
            disabled={status === "opening"}
            aria-busy={status === "opening"}
          >
            {status === "opening" ? "Opening your mail app…" : "Open in my mail app"}
          </button>
          <button
            type="button"
            className="vb-btn vb-btn-quiet"
            onClick={copyNote}
            disabled={!filled}
          >
            Copy the note instead
          </button>
        </div>

        <div ref={noteRef} className="vb-form-status" role="status" aria-live="polite">
          {status === "idle" ? (
            <p className="vb-muted">
              Nothing is sent from this page. The button opens a draft in your
              own mail app, addressed to me.
            </p>
          ) : null}
          {status === "opened" ? (
            <p className="vb-form-ok">
              Your mail app should be open with the draft. If nothing happened,
              copy the note and paste it into an email to {contact.email}.
            </p>
          ) : null}
          {status === "copied" ? (
            <p className="vb-form-ok">
              Copied. Paste it into an email to {contact.email}.
            </p>
          ) : null}
          {status === "failed" ? (
            <p className="vb-form-error">
              Copying did not work in this browser. Select the text below and copy it.
            </p>
          ) : null}
          {status === "failed" ? (
            <div className="vb-form-note">
              {mail.body.split("\n").map((line, i) => (
                <p key={i} dir="auto">
                  {line || "\u00a0"}
                </p>
              ))}
            </div>
          ) : null}
        </div>
      </form>
      </Collapsible>
      ) : (
        <p className="vb-form-fallback">
          The draft form appears once the page has loaded. The email link above works without it.
        </p>
      )}
    </section>
  );
}

function Field({
  id,
  label,
  value,
  error,
  hint,
  onChange,
  type = "text",
  autoComplete,
  multiline = false,
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  hint?: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  multiline?: boolean;
}) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const described = [error ? errorId : null, hint ? hintId : null]
    .filter(Boolean)
    .join(" ");
  return (
    <div className="vb-field" data-invalid={error ? "true" : undefined}>
      <label htmlFor={id}>{label}</label>
      {multiline ? (
        <textarea
          id={id}
          name={id}
          rows={5}
          dir="auto"
          value={value}
          aria-invalid={Boolean(error)}
          aria-describedby={described || undefined}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          dir={type === "email" ? undefined : "auto"}
          autoComplete={autoComplete}
          value={value}
          aria-invalid={Boolean(error)}
          aria-describedby={described || undefined}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {hint ? (
        <p id={hintId} className="vb-field-hint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="vb-field-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
