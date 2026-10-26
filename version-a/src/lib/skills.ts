/**
 * Skills, grouped, with the projects each one was actually used in.
 * A skill with no `projects` is listed on the CV or site but not tied to one
 * of the three projects below. Do not add a project here without evidence.
 */
export type SkillProjectId = "gthrz" | "movie" | "amanah";

export type SkillProject = {
  id: SkillProjectId;
  name: string;
  note: string;
  href: string | null;
};

export const skillProjects: SkillProject[] = [
  {
    id: "gthrz",
    name: "Gthrz",
    note: "Privacy-first event management app. September 2025 to present.",
    href: "/version-b/projects/gthrz",
  },
  {
    id: "movie",
    name: "Movie Discovery",
    note: "Personal web project. January to February 2025.",
    href: null,
  },
  {
    id: "amanah",
    name: "Amanah",
    note: "Lost-and-found web application. In development.",
    href: "/version-b/projects/amanah",
  },
];

export type Skill = {
  name: string;
  detail?: string;
  projects?: SkillProjectId[];
};

export type SkillGroup = {
  title: string;
  skills: Skill[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Languages",
    skills: [
      { name: "TypeScript", projects: ["gthrz", "amanah"] },
      { name: "JavaScript", projects: ["movie"] },
      { name: "Python" },
      { name: "Java" },
      { name: "SQL" },
      { name: "C++" },
    ],
  },
  {
    title: "Frontend & mobile",
    skills: [
      { name: "React", projects: ["movie"] },
      { name: "React Native", projects: ["gthrz"] },
      { name: "Expo", projects: ["gthrz"] },
      { name: "Expo Router" },
      { name: "Expo Notifications", projects: ["gthrz"] },
      { name: "React Router", projects: ["movie"] },
      { name: "Next.js", projects: ["amanah"] },
      { name: "Vue.js" },
      { name: "Tailwind CSS", projects: ["amanah"] },
      { name: "HTML" },
      { name: "CSS" },
    ],
  },
  {
    title: "Backend, data & APIs",
    skills: [
      {
        name: "Supabase",
        detail: "Auth, Realtime, Storage, Edge Functions",
        projects: ["gthrz"],
      },
      { name: "PostgreSQL", projects: ["gthrz"] },
      { name: "Row Level Security", projects: ["gthrz"] },
      { name: "Django" },
      { name: "REST APIs" },
      { name: "OpenAI Responses API", projects: ["gthrz"] },
      { name: "TMDB API", projects: ["movie"] },
    ],
  },
  {
    title: "AI & development workflow",
    skills: [
      { name: "Prompt engineering" },
      { name: "AI-assisted development" },
      { name: "AI integration concepts" },
      { name: "Cursor" },
      { name: "Claude Code" },
    ],
  },
  {
    title: "Tools",
    skills: [
      { name: "Git" },
      { name: "GitHub" },
      { name: "Figma" },
      { name: "Vite", projects: ["movie"] },
      { name: "Netlify", projects: ["movie"] },
    ],
  },
  {
    title: "Engineering fundamentals",
    skills: [
      { name: "Object-oriented programming" },
      { name: "Data structures" },
      { name: "Relational database design" },
      { name: "Authentication", projects: ["gthrz"] },
      { name: "Debugging" },
    ],
  },
];
