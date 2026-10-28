// Decorative preview for a project with no screenshots yet: a lost tag and a
// found tag joined by a possible match. Sized in container units so it fits
// both the desktop stage and the mobile poster.
export function AmanahArt() {
  return (
    <div className="vb-aa" aria-hidden="true">
      <span className="vb-aa-letter">A</span>
      <svg className="vb-aa-link" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M30 34 C 52 30, 46 66, 70 62" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="vb-aa-tag vb-aa-lost">
        <span className="vb-aa-hole" />
        <span className="vb-aa-tag-name">Lost</span>
        <span className="vb-aa-bar" />
        <span className="vb-aa-bar" />
        <span className="vb-aa-bar vb-aa-bar-short" />
      </div>
      <div className="vb-aa-tag vb-aa-found">
        <span className="vb-aa-hole" />
        <span className="vb-aa-tag-name">Found</span>
        <span className="vb-aa-bar" />
        <span className="vb-aa-bar" />
        <span className="vb-aa-bar vb-aa-bar-short" />
      </div>
      <span className="vb-aa-match">Possible match</span>
      <span className="vb-aa-stamp">In development</span>
    </div>
  );
}
