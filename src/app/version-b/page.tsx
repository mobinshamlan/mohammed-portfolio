import type { Metadata } from "next";
import { Redirect } from "@/components/redirect";

export const metadata: Metadata = {
  title: "Moved",
  robots: { index: false },
};

/** The portfolio now lives at the root. Old links keep working. */
export default function VersionBMovedPage() {
  return <Redirect to="/" label="the portfolio" />;
}
