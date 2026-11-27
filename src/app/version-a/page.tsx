import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
// Shared content sits beside this app so a later version can import it too.
import { portfolio } from "../../../data/portfolio";

export const metadata: Metadata = {
  title: "Mohammed Bin Shamlan",
  description:
    "Software developer in Saudi Arabia exploring AI engineering. Computer science graduate of Queen Mary University of London, now in the AI Bootcamp at Tuwaiq Academy.",
};

const sections = [
  { id: "about", label: "About" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "interests", label: "Interests" },
  { id: "contact", label: "Contact" },
] as const;

const sectionClass = "border-t border-line";
const sectionInner = "mx-auto max-w-6xl px-6 py-16 md:py-24";
const headingClass =
  "font-sans text-3xl font-medium tracking-tight md:text-4xl";

export default function VersionAPage() {
  return (
    <div className="version-a min-h-full bg-paper font-serif text-ink">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-foam focus:px-3 focus:py-2 focus:font-sans focus:text-ink"
      >
        Skip to content
      </a>

      <header className="on-sea sticky top-0 z-20 bg-sea text-foam">
        <div className="mx-auto flex max-w-6xl flex-wrap items-baseline justify-between gap-x-8 gap-y-3 px-6 py-4">
          <div>
            <a href="#top" className="font-sans text-base font-medium">
              {portfolio.name}
            </a>
            <Link
              href="/"
              className="mt-1 block font-sans text-sm text-mist underline decoration-transparent underline-offset-4 hover:decoration-sand"
            >
              Back to Experiences
            </Link>
          </div>
          <nav aria-label="Sections">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 font-sans text-base">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="underline decoration-transparent underline-offset-4 hover:decoration-sand"
                  >
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main id="content">
        <section id="top" className="on-sea bg-sea text-foam">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-10 md:grid-cols-[minmax(0,1.35fr)_minmax(16rem,0.65fr)] md:items-end md:pb-28 md:pt-16">
            <div>
              <h1 className="max-w-[11ch] text-balance font-sans text-[clamp(3.5rem,8vw,6.75rem)] font-medium leading-[0.9] tracking-[-0.04em]">
                {portfolio.name}
              </h1>
              <p className="mt-8 max-w-[16ch] text-balance font-sans text-2xl leading-snug text-sand md:text-[2rem]">
                {portfolio.title}
              </p>
            </div>
            <div className="font-sans text-lg leading-8 md:pb-1">
              <p>{portfolio.location}</p>
              <ul className="mt-5 space-y-2 text-mist">
                {portfolio.education.map((item) => (
                  <li key={item.institution}>{item.institution}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="about" className={sectionClass}>
          <div className={sectionInner}>
            <h2 className={headingClass}>About</h2>
            <p className="mt-8 max-w-[62ch] text-xl leading-9">{portfolio.summary}</p>
          </div>
        </section>

        <section id="education" className={sectionClass}>
          <div className={sectionInner}>
            <h2 className={headingClass}>Education</h2>
            <ul className="mt-10 divide-y divide-line border-y border-line">
              {portfolio.education.map((item) => (
                <li
                  key={item.institution}
                  className="grid gap-3 py-8 md:grid-cols-[minmax(0,1.4fr)_minmax(14rem,0.8fr)] md:gap-10"
                >
                  <div>
                    <h3 className="font-sans text-2xl font-medium tracking-tight">
                      {item.qualification}
                    </h3>
                    <p className="mt-2 text-lg leading-8">{item.institution}</p>
                  </div>
                  <div>
                    <p className="font-sans text-lg">{item.period}</p>
                    {item.detail ? (
                      <p className="mt-2 text-lg leading-8 text-muted">{item.detail}</p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="skills" className={sectionClass}>
          <div className={sectionInner}>
            <h2 className={headingClass}>Skills</h2>
            <ul className="mt-10 grid grid-cols-1 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              {portfolio.skills.map((skill) => (
                <li
                  key={skill}
                  className="font-sans text-2xl font-medium tracking-tight"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="projects" className={sectionClass}>
          <div className={sectionInner}>
            <h2 className={headingClass}>Projects</h2>
            <ul className="mt-10 border-b border-line">
              {portfolio.projects.map((project) => (
                <li key={project.name} className="border-t border-line py-10">
                  <h3 className="font-sans text-4xl font-medium tracking-tight md:text-5xl">
                    {project.name}
                  </h3>
                  <p className="mt-5 max-w-[62ch] text-xl leading-9">
                    {project.summary}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="interests" className={sectionClass}>
          <div className={sectionInner}>
            <h2 className={headingClass}>Interests</h2>
            <ul className="mt-8 flex flex-wrap gap-x-10 gap-y-3">
              {portfolio.interests.map((interest) => (
                <li key={interest} className="text-xl leading-9">
                  {interest}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="contact" className={sectionClass}>
          <div className={`${sectionInner} grid gap-12 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.1fr)] md:gap-16`}>
            <div>
              <h2 className={headingClass}>Contact</h2>
              <p className="mt-8 max-w-[28ch] text-xl leading-9">
                {portfolio.contact.introduction}
              </p>
            </div>
            <ContactForm recipientName={portfolio.name} />
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-3 px-6 py-8 font-sans text-base">
          <p>{portfolio.name}</p>
          <p>{portfolio.location}</p>
        </div>
      </footer>
    </div>
  );
}
