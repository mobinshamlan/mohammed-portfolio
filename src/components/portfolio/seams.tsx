/*
 * One object on each line between two worlds, half in each, because it
 * belongs to both stories. They are decoration: everything they say is also
 * in the text, so each one is hidden from assistive technology.
 */

/** Naqah → Tammeni: the ranch call ends as another phone starts ringing. */
export function CallEndedSeam() {
  return (
    <div className="w-seam w-seam-call" aria-hidden="true">
      <p className="w-seam-ended">
        <span className="w-seam-icon" />
        Call ended · records saved
      </p>
      <p className="w-seam-ringing">
        <span className="w-seam-icon" />
        Lulwa · calling a parent
      </p>
    </div>
  );
}

/** Tammeni → Seet: a text message turns over into a WhatsApp bubble. */
export function TypingSeam() {
  return (
    <div className="w-seam w-seam-typing" aria-hidden="true">
      <span className="w-seam-sms">
        <i />
        <i />
        <i />
      </span>
      <span className="w-seam-wa">
        <i />
        <i />
        <i />
      </span>
    </div>
  );
}

/** Seet → Kashta: the booking receipt, torn on the line, hanging into the night. Its state follows the chat. */
export function ReceiptSeam() {
  return (
    <div className="w-seam w-seam-receipt" aria-hidden="true">
      <div className="w-receipt">
        <p className="w-receipt-head">
          <span>Booking</span>
          <span className="w-receipt-state">
            <span data-s="Enquiry">Enquiry</span>
            <span data-s="Held">Held</span>
            <span data-s="Deposit">Deposit due</span>
            <span data-s="Confirmed">Confirmed</span>
          </span>
        </p>
        <dl>
          <div>
            <dt>Snap story</dt>
            <dd>4,500 SAR</dd>
          </div>
          <div>
            <dt>Tuesday</dt>
            <dd>2 hours</dd>
          </div>
          <div>
            <dt>Deposit</dt>
            <dd>2,250 SAR</dd>
          </div>
        </dl>
        <p className="w-receipt-note">Confirmed only by the payment callback. Simulated.</p>
      </div>
    </div>
  );
}

/** Kashta → Amanah: a lantern left at camp, already tagged at the counter. */
export function LanternSeam() {
  return (
    <div className="w-seam w-seam-lantern">
      <svg viewBox="0 0 150 220" aria-hidden="true">
        <rect x="56" y="4" width="38" height="10" rx="3" fill="#2b2418" />
        <path d="M60 14 L90 14 L104 42 L46 42 Z" fill="#3a3020" />
        <rect x="44" y="42" width="62" height="96" rx="6" fill="#f6c27a" />
        <rect x="44" y="42" width="62" height="96" rx="6" fill="none" stroke="#3a3020" strokeWidth="6" />
        <ellipse cx="75" cy="98" rx="9" ry="16" fill="#f0945a" />
        <rect x="38" y="136" width="74" height="12" rx="3" fill="#3a3020" />
        <path d="M106 70 C 124 74, 126 100, 118 116" fill="none" stroke="#7a5a12" strokeWidth="3" />
        <g transform="rotate(-12 120 160)">
          <path d="M98 118 L142 118 L150 128 L150 198 L90 198 L90 128 Z" fill="#e7d9b8" />
          <circle cx="120" cy="130" r="5" fill="#f1ead9" stroke="#7a5a12" strokeWidth="3" />
          <text x="120" y="160" textAnchor="middle" fontSize="14" fontWeight="700" fill="#0e3b2e">
            Found
          </text>
          <text x="120" y="178" textAnchor="middle" fontSize="10.5" fill="#0e3b2e">
            for its owner
          </text>
        </g>
      </svg>
    </div>
  );
}

/** Amanah → Gthrz: the luggage tag's punched hole lines up with the invite's perforation. */
export function TagSeam() {
  return (
    <div className="w-seam w-seam-tag" aria-hidden="true">
      <span className="w-seam-tag-card">
        <i />
      </span>
    </div>
  );
}

/** Gthrz → the experiment: the torn stub lands on the plain sheet. */
export function StubSeam() {
  return (
    <div className="w-seam w-seam-stub" aria-hidden="true">
      <span>Going</span>
    </div>
  );
}
