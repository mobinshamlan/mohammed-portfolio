import { Bodoni_Moda } from "next/font/google";
import Link from "next/link";

const display = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export function ExperimentShell({
  children,
  showBackLink = false,
  className = "",
}: {
  children: React.ReactNode;
  showBackLink?: boolean;
  className?: string;
}) {
  return (
    <div className={`experiment ${display.variable} ${className}`}>
      {showBackLink ? (
        <Link href="/experiment" className="experiment-back">
          Back to the experiment
        </Link>
      ) : null}
      {children}
    </div>
  );
}
