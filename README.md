# Mohammed Bin Shamlan — portfolio

Software & AI product developer. This is the source of my portfolio site:

**https://mobinshamlan.github.io/mohammed-portfolio/**

The home page walks through six products I built or helped build — Naqah, Gthrz, Amanah, Kashta, Seet and Tammeni — each with a small try-it you can play with in the browser, then where I come from, my courses and certificates, the tools I use, and how to reach me.

## Built with

- Next.js 16 (static export) and React 19, in TypeScript
- Plain CSS, one file per area in `src/app/(portfolio)/styles/`
- Alexandria and Readex Pro from Google Fonts
- No backend: every try-it runs on sample data in the page

## Run it locally

```bash
npm install
npm run dev     # http://localhost:3000/mohammed-portfolio/
npm run lint
npm run build   # writes the static site to out/
```

Every push to `main` builds the site and publishes it to GitHub Pages (`.github/workflows/pages.yml`).

## Pages

- `/` — the portfolio. Press ⌘K (Ctrl K) or `/` to jump to any project or section.
- `/projects/gthrz/` — how Gthrz works. It is the one product without a public deployment; the others link to their live apps.
- `/experiment/` — how this site was built: one brief, two prompts.
- `/version-a/` — the result of the short first prompt, kept as it was.
- `/version-b/…` — old links that forward to the current pages.

## Where things are

- Project text and links: `src/lib/projects.ts`
- Home page sections: `src/components/portfolio/`
- Try-its: `src/components/portfolio/proof/`, with their backdrops in `scenes/`
- Product screenshots: `public/images/projects/` (captured from the real apps)
- Version A content: `data/portfolio.ts`

<details>
<summary>The Version A prompt</summary>

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

</details>
