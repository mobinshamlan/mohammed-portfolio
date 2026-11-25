"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { publicUrl } from "@/lib/site";

/**
 * A tiny page for an old URL. The static export cannot redirect on the server,
 * so the browser does it: a meta refresh for everyone, router.replace once
 * JavaScript runs, and a visible link in case neither fires.
 */
export function Redirect({ to, label }: { to: string; label: string }) {
  const router = useRouter();

  useEffect(() => {
    router.replace(to);
  }, [router, to]);

  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
        background: "#0b0e14",
        color: "#efe6d3",
        fontFamily: "var(--font-plex), system-ui, sans-serif",
        textAlign: "center",
      }}
    >
      <meta httpEquiv="refresh" content={`0;url=${publicUrl(to)}`} />
      <p>
        This page moved.{" "}
        <Link
          href={to}
          style={{ color: "#e9a24a", textUnderlineOffset: "0.2em" }}
        >
          Open {label}
        </Link>
      </p>
    </main>
  );
}
