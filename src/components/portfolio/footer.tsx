import Link from "next/link";
export function Footer() {
  return (
    <footer className="vb-footer">
      <div className="vb-footer-top">
        <p className="vb-footer-name">Mohammed Bin&nbsp;Shamlan</p>
      </div>
      <nav className="vb-footer-grid" aria-label="Footer">
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
