# Mohammed Bin Shamlan — portfolio experiment

Next.js, TypeScript, and Tailwind CSS. Shared portfolio content lives in `data/portfolio.ts`.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Routes

- `/` — the portfolio: hero, flagship work, the full index, about, journey, skills, certificates and contact.
- `/projects/naqah`, `/projects/tammeni`, `/projects/seet`, `/projects/kashta`, `/projects/amanah`, `/projects/gthrz` — case studies.
- `/experiment` — the prompt experiment: one brief, two prompts. Choose Version A or Version B.
- `/version-a` — the weak-prompt baseline, kept exactly as it was.
- `/version-b/` and `/version-b/projects/<slug>/` — old links; each is a small page that forwards to the new path.

Project content lives in `src/lib/projects.ts`. Product screenshots in `public/images/projects/` are captures of the live demos.

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
