import Link from "next/link";
import { contact } from "@/lib/contact";

export function Footer() {
  return (
    <footer className="vb-footer">
      <p className="vb-footer-name">
        Mohammed Bin&nbsp;Shamlan <span lang="ar">محمد بن شملان</span>
      </p>
      <div className="vb-footer-grid">
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
            <Link href="/experiment" prefetch={false}>
              How this site was built →
            </Link>
          </li>
          <li>Saudi Arabia, 2026</li>
        </ul>
        <p className="vb-footer-credit">
          Built with Next.js and set in Alexandria and Readex Pro.{" "}
          Product screenshots are from the live demos.
        </p>
      </div>
    </footer>
  );
}
