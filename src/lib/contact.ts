export const contact = {
  email: "mohabinshamlan@gmail.com",
  linkedin: {
    label: "linkedin.com/in/mohammed-bin-shamlan",
    href: "https://www.linkedin.com/in/mohammed-bin-shamlan",
  },
  github: {
    label: "github.com/mobinshamlan",
    href: "https://github.com/mobinshamlan",
  },
  status: "Open to opportunities in Software Engineering & AI",
  /**
   * The CV download. Leave `href` null until an approved PDF is in
   * public/cv/; the hero then shows the button as unavailable instead of a
   * broken link. Example: "/cv/Mohammed-Bin-Shamlan-CV.pdf".
   */
  cv: { href: null as string | null },
  timeZone: "Asia/Riyadh",
} as const;
