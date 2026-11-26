import { Reveal } from "../reveal";

/*
 * Amanah on the home page: one lost umbrella matched in private. Two tags, one
 * for each side, tied by Gemini's suggestion; under them, the person who decides.
 * The owner's tag never shows the finder's report, and the finder's never
 * reaches the owner. A made-up claim, labelled as an example.
 */

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false">
      <circle cx="10" cy="10" r="9" fill="currentColor" />
      <path d="M6 10.4 8.6 13 14 7.4" fill="none" stroke="var(--field)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AmanahProof() {
  return (
    <Reveal className="vb-ap">
      <figure className="vb-ap-figure">
        <div className="vb-ap-tags">
          <section className="vb-ap-tag" data-side="owner" aria-label="The owner's lost report">
            <p className="vb-ap-who">Lost report &middot; only the owner sees it</p>
            <p className="vb-ap-item">
              <span lang="ar" dir="rtl">مظلة زرقاء</span> Blue umbrella
            </p>
            <div className="vb-ap-qa">
              <p className="vb-ap-q">
                <span lang="ar" dir="rtl">وش لون المقبض؟</span>
                What colour is the handle?
              </p>
              <p className="vb-ap-a">
                Owner answers <strong>Yellow</strong>
              </p>
            </div>
          </section>

          <p className="vb-ap-match">
            <span>Gemini suggests a match</span>
          </p>

          <section className="vb-ap-tag" data-side="finder" aria-label="The finder's found report">
            <p className="vb-ap-who">Found item &middot; only staff see it</p>
            <p className="vb-ap-item">
              <span lang="ar" dir="rtl">مظلة زرقاء</span> Blue umbrella
            </p>
            <dl className="vb-ap-facts">
              <div>
                <dt>Handle</dt>
                <dd>Yellow</dd>
              </div>
              <div>
                <dt>Handed in</dt>
                <dd>Reception desk</dd>
              </div>
            </dl>
          </section>
        </div>

        <p className="vb-ap-decision">
          <CheckIcon />
          <span>
            <strong>Staff approve.</strong> The answer matches the finder&rsquo;s report, so the owner can collect it.
            The decision is logged.
          </span>
        </p>

        <figcaption className="vb-ap-caption">Example: a made-up claim. Nothing in it is ever public.</figcaption>
      </figure>
    </Reveal>
  );
}
