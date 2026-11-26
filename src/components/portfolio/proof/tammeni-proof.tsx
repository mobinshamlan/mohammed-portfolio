import { Reveal } from "../reveal";

function TextIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5 5h14a1.5 1.5 0 0 1 1.5 1.5v8.5a1.5 1.5 0 0 1-1.5 1.5h-8.5l-4.5 3.5v-3.5H5A1.5 1.5 0 0 1 3.5 15V6.5A1.5 1.5 0 0 1 5 5Z" />
    </svg>
  );
}

function CallIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5 3.5h3.2l1.6 4.3-2.1 1.4a11 11 0 0 0 7.1 7.1l1.4-2.1 4.3 1.6V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.1 1.5 1.5 0 0 1 5 3.5Z" />
    </svg>
  );
}

const rules = [
  { topic: "Attendance", how: "Text", when: "Right away", icon: <TextIcon />, sent: "text" },
  { topic: "Grades", how: "Call", when: "Weekly", icon: <CallIcon />, sent: "call" },
  { topic: "Exams", how: "Call", when: "Daily", icon: <CallIcon /> },
] as const;

/**
 * Tammeni on the home page: one parent's choices for one child, and what
 * those choices send. The same words (text, right away; call, weekly) tie
 * each rule to its message. No controls; the live demo is a link away.
 */
export function TammeniProof() {
  return (
    <Reveal className="pf-tammeni">
      <figure className="pf-tammeni-fig">
        <div className="pf-tammeni-board">
          <div className="pf-tammeni-rules">
            <p className="pf-tammeni-who">
              <strong>Reem&rsquo;s alerts</strong>
              <span>chosen by her parent</span>
            </p>
            <table>
              <caption className="vb-sr">How and when Reem&rsquo;s parent hears each kind of school news</caption>
              <thead className="vb-sr">
                <tr>
                  <th scope="col">News</th>
                  <th scope="col">How</th>
                  <th scope="col">When</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((rule) => (
                  <tr key={rule.topic} data-sent={"sent" in rule ? rule.sent : undefined}>
                    <th scope="row">{rule.topic}</th>
                    <td className="pf-tammeni-how">
                      {rule.icon}
                      {rule.how}
                    </td>
                    <td className="pf-tammeni-when">{rule.when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="pf-tammeni-other">Her brother Nawaf has his own rules: no attendance alerts at all.</p>
          </div>

          <ul className="pf-tammeni-sent" aria-label="What those choices send">
            <li data-kind="text">
              <p className="pf-tammeni-meta">
                <TextIcon />
                Text, right away · 7:05 am
              </p>
              <p lang="ar" dir="rtl">
                ريم وصلت المدرسة الساعة ٧:٠٥ الصبح.
              </p>
              <p className="pf-tammeni-gloss">Reem got to school at 7:05 this morning.</p>
            </li>
            <li data-kind="call">
              <p className="pf-tammeni-meta">
                <CallIcon />
                Call, weekly · Lulwa speaking
              </p>
              <p lang="ar" dir="rtl">
                هلا، معك لولوة. هذا ملخص درجات ريم لهالأسبوع.
              </p>
              <p className="pf-tammeni-gloss">Hi, it&rsquo;s Lulwa. Here is Reem&rsquo;s grades summary for the week.</p>
            </li>
          </ul>
        </div>
        <figcaption className="pf-tammeni-note">Example family.</figcaption>
      </figure>
    </Reveal>
  );
}
