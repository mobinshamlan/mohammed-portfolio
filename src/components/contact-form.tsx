"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";

type ContactFormProps = {
  recipientName: string;
};

type Fields = {
  fromName: string;
  email: string;
  message: string;
};

type FieldName = keyof Fields;

const emptyFields: Fields = {
  fromName: "",
  email: "",
  message: "",
};

const fieldOrder: FieldName[] = ["fromName", "email", "message"];

function validate(values: Fields): Partial<Record<FieldName, string>> {
  const errors: Partial<Record<FieldName, string>> = {};

  if (values.fromName.trim().length < 2) {
    errors.fromName = "Enter your name.";
  } else if (values.fromName.trim().length > 80) {
    errors.fromName = "Use a name under 80 characters.";
  }

  const email = values.email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  } else if (email.length > 120) {
    errors.email = "Use an email address under 120 characters.";
  }

  if (values.message.trim().length < 10) {
    errors.message = "Write a few words so the note is clear.";
  } else if (values.message.trim().length > 2000) {
    errors.message = "Keep the note under 2000 characters.";
  }

  return errors;
}

function buildNote(recipientName: string, values: Fields): string {
  return [
    `To: ${recipientName}`,
    `From: ${values.fromName.trim()} <${values.email.trim()}>`,
    "",
    values.message.trim(),
  ].join("\n");
}

export function ContactForm({ recipientName }: ContactFormProps) {
  const statusRef = useRef<HTMLDivElement>(null);
  const [fields, setFields] = useState<Fields>(emptyFields);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [note, setNote] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle",
  );

  function updateField(name: FieldName, value: string) {
    setFields((current) => ({ ...current, [name]: value }));
    setNote(null);
    setCopyState("idle");
  }

  async function copyNote(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(fields);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setNote(null);
      setCopyState("idle");
      const firstInvalid = fieldOrder.find((name) => nextErrors[name]);
      if (firstInvalid) {
        document.getElementById(`contact-${firstInvalid}`)?.focus();
      }
      return;
    }

    const nextNote = buildNote(recipientName, fields);
    setNote(nextNote);
    await copyNote(nextNote);
    requestAnimationFrame(() => {
      statusRef.current?.scrollIntoView({ block: "nearest" });
    });
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-7">
      <Field
        id="contact-fromName"
        label="Name"
        autoComplete="name"
        value={fields.fromName}
        error={errors.fromName}
        onChange={(value) => updateField("fromName", value)}
      />
      <Field
        id="contact-email"
        label="Email"
        type="email"
        autoComplete="email"
        value={fields.email}
        error={errors.email}
        onChange={(value) => updateField("email", value)}
      />
      <Field
        id="contact-message"
        label="Message"
        value={fields.message}
        error={errors.message}
        multiline
        onChange={(value) => updateField("message", value)}
      />

      <div>
        <button
          type="submit"
          className="cursor-pointer bg-sea px-5 py-3 font-sans text-base text-foam hover:bg-tide"
        >
          Copy note
        </button>
        <p className="mt-3 max-w-[42ch] text-base leading-7 text-muted">
          Copies a note you can paste into an email. Nothing is sent from this
          page.
        </p>
      </div>

      {note ? (
        <div
          ref={statusRef}
          role="status"
          aria-live="polite"
          className="border-t border-sea pt-6"
        >
          <p className="font-sans text-xl">
            {copyState === "copied" ? "Note copied" : "Note ready"}
          </p>
          <p className="mt-2 max-w-[48ch] text-base leading-7 text-muted">
            {copyState === "failed"
              ? "Select the note below and copy it yourself."
              : "Paste it into an email when you want to send it."}
          </p>
          <pre className="mt-5 max-w-full overflow-x-auto whitespace-pre-wrap break-words font-serif text-base leading-7">
            {note}
          </pre>
          {copyState === "failed" ? (
            <button
              type="button"
              className="mt-5 cursor-pointer bg-sea px-5 py-3 font-sans text-base text-foam hover:bg-tide"
              onClick={() => copyNote(note)}
            >
              Try copy again
            </button>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}

function Field({
  id,
  label,
  value,
  error,
  onChange,
  type = "text",
  autoComplete,
  multiline = false,
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  multiline?: boolean;
}) {
  const errorId = `${id}-error`;
  const fieldClass =
    "mt-2 w-full border-b border-muted bg-transparent py-2 font-serif text-lg text-ink outline-none focus-visible:border-b-2 focus-visible:border-tide";

  return (
    <div>
      <label htmlFor={id} className="font-sans text-base">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          name={id}
          rows={6}
          value={value}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => onChange(event.target.value)}
          className={fieldClass}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          autoComplete={autoComplete}
          value={value}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => onChange(event.target.value)}
          className={fieldClass}
        />
      )}
      {error ? (
        <p id={errorId} className="mt-2 text-sm leading-6 text-warn">
          {error}
        </p>
      ) : null}
    </div>
  );
}
