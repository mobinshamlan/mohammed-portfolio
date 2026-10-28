import type { Metadata } from "next";
import Link from "next/link";
import { ExperimentShell } from "@/components/experiment-shell";

export const metadata: Metadata = {
  title: "Comparison",
  description:
    "Version A and Version B will be compared after Version B is complete.",
};

export default function ComparisonPage() {
  return (
    <ExperimentShell showBackLink>
      <main className="px-6 pb-24 pt-12 md:px-12 md:pt-16">
        <p className="experiment-kicker">COMPARISON</p>
        <h1 className="display mt-8 max-w-[14ch] text-[clamp(3rem,7vw,5.5rem)] leading-[0.9]">
          After Version B.
        </h1>
        <p className="mt-8 max-w-[46ch] text-lg leading-8">
          Version A and Version B will be compared after Version B is complete.
          This page does not include comparison results.
        </p>
        <ul className="mt-10 space-y-3 text-base">
          <li>
            <Link href="/version-a" className="underline underline-offset-4">
              Version A
            </Link>
          </li>
          <li>
            <Link href="/version-b" className="underline underline-offset-4">
              Version B placeholder
            </Link>
          </li>
        </ul>
      </main>
    </ExperimentShell>
  );
}
