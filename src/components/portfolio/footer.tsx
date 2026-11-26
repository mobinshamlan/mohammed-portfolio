import Link from "next/link";
import { contact } from "@/lib/contact";

export function Footer() {
  return (
    <footer className="vb-footer">
      <div className="vb-footer-top">
        <p className="vb-footer-name">Mohammed Bin&nbsp;Shamlan</p>
        <p className="vb-footer-place">Software &amp; AI product developer · Riyadh, Saudi Arabia</p>
      </div>
      <nav className="vb-footer-grid" aria-label="Footer">
        <ul>
          <li>
            <a href={contact.github.href} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </li>
          <li>
            <a href={contact.linkedin.href} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </li>
          <li>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
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
            <Link href="/#skills">Skills</Link>
          </li>
          <li>
            <Link href="/experiment" prefetch={false}>
              How this site was built
            </Link>
          </li>
        </ul>
        <p className="vb-footer-credit">
          Built with Next.js, set in Alexandria and Readex Pro. Product screenshots are from the
          live demos. © 2026
        </p>
      </nav>
    </footer>
  );
}
