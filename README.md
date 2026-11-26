# Mohammed Bin Shamlan — portfolio

Live at https://mobinshamlan.github.io/mohammed-portfolio/

Next.js 16 (static export), React 19 and TypeScript. The portfolio is styled with plain CSS in `src/app/(portfolio)/styles/`; Tailwind CSS is used only by the `/version-a` baseline.

```bash
npm install
npm run dev     # http://localhost:3000/mohammed-portfolio/
npm run lint
npm run build   # writes the static site to out/
```

Pushing to `main` deploys to GitHub Pages (`.github/workflows/pages.yml`).

## Routes

- `/` — the portfolio: hero with the Naqah call example, a section for each project, the Work Line index, about, journey, skills, certificates and contact. Press ⌘K or `/` to jump to a project.
- `/projects/gthrz` — Gthrz, the one product not yet deployed. The others open on the home page and link to their live apps.
- `/experiment` — the prompt experiment: one brief, two prompts. Choose Version A or Version B.
- `/version-a` — the weak-prompt baseline, kept exactly as it was.
- `/version-b/` and `/version-b/projects/<slug>/` — old links; each is a small page that forwards to the new path.

## Where things are

- Project content, statuses and evidence: `src/lib/projects.ts`.
- Portfolio components: `src/components/portfolio/`.
- Product screenshots in `public/images/projects/` are captures of the live demos.
- `data/portfolio.ts` holds the Version A content only.

## Version A prompt

This is the prompt that produced the Version A baseline:

```text
Build me a modern personal portfolio website that includes information about me.

My information:

Name: Mohammed Bin Shamlan
Title: Software Developer exploring AI Engineering
Location: Saudi Arabia

Education:
- BSc Computer Science (Hons)
- Queen Mary University of London
- Graduated in 2026

Current education:
- AI Bootcamp at Tuwaiq Academy

Technical skills:
- JavaScript
- TypeScript
- React Native
- Next.js
- Supabase
- PostgreSQL
- Git and GitHub

Projects:

1. Gthrz
A privacy-first mobile event planning application built using React Native, Expo, TypeScript, and Supabase.

2. AMANAH
An AI-assisted lost-and-found web application project using Next.js and TypeScript.

Interests:
- Software development
- Artificial intelligence
- Music
- Gaming
- Photography

Include information about me, my education, skills, projects, and a contact section.

Use Next.js, TypeScript, and Tailwind CSS.

The project directory is currently empty, so set up the application and implement the website.

Make sure the website runs successfully.

Save this initial portfolio at /version-a.

Keep the portfolio content in a separate data file so it can be reused for another version later.

Do not create Version B yet.
```
