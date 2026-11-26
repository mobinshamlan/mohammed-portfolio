import Link from "next/link";
import { contact } from "@/lib/contact";

export function Footer() {
  return (
    <footer className="vb-footer">
      <div className="vb-footer-top">
        <p className="vb-footer-name">Mohammed Bin&nbsp;Shamlan</p>
        <p className="vb-footer-place">
          Software &amp; AI product developer
          <span className="vb-footer-dot" aria-hidden="true"> · </span>
          <span className="vb-footer-city">Riyadh, Saudi Arabia</span>
        </p>
      </div>
      <nav className="vb-footer-grid" aria-label="Footer">
        <ul>
          <li>
            <a href={contact.github.href} target="_blank" rel="noreferrer">
              GitHub<span className="vb-sr"> (opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a href={contact.linkedin.href} target="_blank" rel="noreferrer">
              LinkedIn<span className="vb-sr"> (opens in a new tab)</span>
            </a>
          </li>
        </ul>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/#work">Work</Link>
          </li>
          <li>
            <Link href="/#contact">Contact</Link>
          </li>
          <li>
            <Link href="/experiment" prefetch={false}>
              How this site was built
            </Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
}
