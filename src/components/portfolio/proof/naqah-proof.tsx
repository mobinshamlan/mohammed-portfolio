import { Reveal } from "../reveal";

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5 3.5h3.2l1.6 4.3-2.1 1.4a11 11 0 0 0 7.1 7.1l1.4-2.1 4.3 1.6V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.1 1.5 1.5 0 0 1 5 3.5Z" />
    </svg>
  );
}

function RecordIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M7 3.5h10a1.5 1.5 0 0 1 1.5 1.5v14a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5ZM9 8.5h6M9 12h6M9 15.5h3.5" />
    </svg>
  );
}

/** The worker's voice, drawn as bars that fall flat: heard on the call, never stored. */
const bars = [0.35, 0.7, 0.5, 0.95, 0.6, 0.8, 0.4, 0.9, 0.55, 0.75, 0.3, 0.65, 0.45, 0.85];

function Voice() {
  return (
    <svg className="pf-naqah-wave" viewBox="0 0 84 20" aria-hidden="true" focusable="false">
      {bars.map((h, i) => (
        <rect key={i} x={i * 6} y={10 - h * 9} width="3" height={h * 18} rx="1.5" />
      ))}
    </svg>
  );
}

/**
 * Naqah on the home page: one evening at the ranch in three moments. The
 * worker answers a call, the answers become facts and the audio goes, then
 * the owner hears only what matters. Readable at a glance, no controls.
 */
export function NaqahProof() {
  return (
    <Reveal className="pf-naqah">
      <figure className="pf-naqah-fig">
        <ol className="pf-naqah-day">
          <li className="pf-naqah-step">
            <p className="pf-naqah-time">
              <span className="pf-naqah-node">
                <PhoneIcon />
              </span>
              5:40 pm
            </p>
            <p className="pf-naqah-what">Naqah phones the worker. He answers in his own words.</p>
            <blockquote className="pf-naqah-say">
              <p lang="ar" dir="rtl">
                كلها شربت إلا وضحى، ما شربت من الصبح.
              </p>
              <p className="pf-naqah-gloss">&ldquo;All but Wadha drank. She hasn&rsquo;t drunk since morning.&rdquo;</p>
            </blockquote>
          </li>

          <li className="pf-naqah-step">
            <p className="pf-naqah-time">
              <span className="pf-naqah-node">
                <RecordIcon />
              </span>
              5:44 pm
            </p>
            <p className="pf-naqah-what">His answers are saved as facts.</p>
            <dl className="pf-naqah-facts">
              <div>
                <dt>Water</dt>
                <dd>11 of 12 drank</dd>
              </div>
              <div data-flag="true">
                <dt>Wadha</dt>
                <dd>No water since morning</dd>
              </div>
            </dl>
            <p className="pf-naqah-audio">
              <Voice />
              <span>
                <strong>Audio</strong> heard, never stored
              </span>
            </p>
          </li>

          <li className="pf-naqah-step">
            <p className="pf-naqah-time">
              <span className="pf-naqah-node">
                <PhoneIcon />
              </span>
              7:00 pm
            </p>
            <p className="pf-naqah-what">Naqah phones the owner with only what matters.</p>
            <blockquote className="pf-naqah-say" data-owner="true">
              <p lang="ar" dir="rtl">
                وضحى ما شربت من الصبح، والباقي بخير.
              </p>
              <p className="pf-naqah-gloss">&ldquo;Wadha hasn&rsquo;t drunk since morning. The rest are fine.&rdquo;</p>
            </blockquote>
          </li>
        </ol>
        <figcaption className="pf-naqah-note">Example call: the names and numbers are made up; the order of the call is the product&rsquo;s.</figcaption>
      </figure>
    </Reveal>
  );
}
