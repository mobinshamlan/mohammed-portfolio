import { Reveal } from "../reveal";

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M7 10.5V8a5 5 0 0 1 10 0v2.5M6.5 10.5h11a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19v-7a1.5 1.5 0 0 1 1.5-1.5Z" />
    </svg>
  );
}

const states = [
  { name: "Enquiry", what: "A brand asks for a price and a free day." },
  { name: "Held", what: "Seet holds the slot. A second hold on it is refused." },
  { name: "Deposit link", what: "Seet sends the link to pay the deposit." },
  { name: "Confirmed", what: "Set by the payment arriving. Seet’s AI has no way to say it." },
];

/**
 * Seet on the home page: a booking's life in four states, with the one rule
 * that matters marked under the track. Seet's AI can take a booking as far as
 * the deposit link; only the payment can confirm it.
 */
export function SeetProof() {
  return (
    <Reveal className="pf-seet">
      <figure className="pf-seet-fig">
        <div className="pf-seet-flow">
          <div className="pf-seet-bubble">
            <p className="pf-seet-from">Seet, replying on WhatsApp</p>
            <p lang="ar" dir="rtl">
              تم، حجزت لكم الثلاثاء مؤقتًا لمدة ساعتين. يتأكد الحجز بعد العربون.
            </p>
            <p className="pf-seet-gloss">&ldquo;Done, Tuesday is held for two hours. It is confirmed once the deposit is paid.&rdquo;</p>
          </div>

          <ol className="pf-seet-track" role="list" aria-label="A booking's four states">
            {states.map((state, i) => (
              <li key={state.name} className="pf-seet-state" data-final={i === states.length - 1 ? "true" : undefined}>
                <span className="pf-seet-node" aria-hidden="true">
                  {i === states.length - 1 ? <LockIcon /> : null}
                </span>
                <strong>{state.name}</strong>
                <span className="pf-seet-what">{state.what}</span>
              </li>
            ))}
          </ol>

          <p className="pf-seet-rule" data-by="ai">
            Seet&rsquo;s AI can take a booking this far.
          </p>
          <p className="pf-seet-rule" data-by="pay">
            Only the payment can confirm it.
          </p>
        </div>
        <figcaption className="pf-seet-note">Example chat.</figcaption>
      </figure>
    </Reveal>
  );
}
