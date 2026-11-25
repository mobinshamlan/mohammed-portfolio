import Link from "next/link";
import { contact } from "@/lib/contact";
import { photoCredits } from "@/lib/projects";

export function VersionBFooter() {
  return (
    <footer className="vb-footer">
      <p className="vb-footer-name">Mohammed Bin&nbsp;Shamlan</p>
      <p className="vb-footer-arabic" lang="ar">
        محمد بن شملان
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
          {photoCredits.map((credit, index) => (
            <span key={credit.file}>
              {index === 0 ? "Photographs: " : " "}
              <a href={credit.href} target="_blank" rel="noreferrer">
                {credit.text}
              </a>
              {index < photoCredits.length - 1 ? ";" : "."}
            </span>
          ))}{" "}
          Product screenshots are from the live demos.
        </p>
      </div>
    </footer>
  );
}
