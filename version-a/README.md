# Mohammed Bin Shamlan — portfolio experiment

Next.js, TypeScript, and Tailwind CSS. Shared portfolio content lives in `../data/portfolio.ts`.

Run the app from this directory:

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Routes

- `/` — experience selection. Visitors choose Version A or Version B.
- `/version-a` — the weak-prompt baseline. This is the original portfolio, kept as it was.
- `/version-b` — strong-prompt portfolio: hero, selected work, about, education, skills, and contact.
- `/version-b/projects/gthrz` — Gthrz case study.
- `/comparison` — reserved for a later comparison. It does not contain results.

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
- Upper Second-Class Honours (2:1)

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

No separate prompt for Version B is recorded, because Version B has not been built.
