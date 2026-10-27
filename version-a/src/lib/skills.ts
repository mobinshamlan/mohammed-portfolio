/**
 * Skills, grouped, with evidence for each tier:
 * - `projects`: used in Gthrz or Amanah (checked against each repository).
 * - a group with `coursework`: module titles from the QMUL degree.
 * - `learning`: covered in the Tuwaiq Academy AI Fundamentals Bootcamp, in progress.
 * A skill with none of these is listed on the CV. Do not add one without evidence.
 */
export type SkillProjectId = "gthrz" | "amanah";

export type SkillProject = {
  id: SkillProjectId;
  name: string;
  note: string;
  href: string | null;
  linkLabel?: string;
  external?: boolean;
};

export const skillProjects: SkillProject[] = [
  {
    id: "gthrz",
    name: "Gthrz",
    note: "Privacy-first event management app. September 2025 to present.",
    href: "/version-b/projects/gthrz",
    linkLabel: "Read the case study",
  },
  {
    id: "amanah",
    name: "Amanah",
    note: "AI-assisted lost-and-found web application. In development.",
    href: "/version-b/projects/amanah",
    linkLabel: "Read the case study",
  },
];

export type Skill = {
  name: string;
  projects?: SkillProjectId[];
  learning?: boolean;
};

export type SkillGroup = {
  title: string;
  coursework?: boolean;
  skills: Skill[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Languages",
    skills: [
      { name: "TypeScript", projects: ["gthrz", "amanah"] },
      { name: "JavaScript" },
      { name: "Python" },
      { name: "Java" },
      { name: "C++" },
      { name: "SQL", projects: ["gthrz", "amanah"] },
    ],
  },
  {
    title: "Web & mobile",
    skills: [
      { name: "React", projects: ["amanah"] },
      {
        name: "React Native",
        projects: ["gthrz"],
      },
      { name: "Next.js", projects: ["amanah"] },
      { name: "Tailwind CSS", projects: ["amanah"] },
      { name: "HTML & CSS" },
      { name: "Vue.js" },
      {
        name: "State management",
        projects: ["gthrz"],
      },
    ],
  },
  {
    title: "Backend & data",
    skills: [
      {
        name: "Supabase",
        projects: ["gthrz", "amanah"],
      },
      { name: "PostgreSQL", projects: ["gthrz", "amanah"] },
      {
        name: "Row Level Security & migrations",
        projects: ["gthrz", "amanah"],
      },
      { name: "Database design", projects: ["gthrz"] },
      { name: "Authentication", projects: ["gthrz"] },
      { name: "REST APIs" },
      { name: "Django" },
    ],
  },
  {
    title: "AI",
    skills: [
      {
        name: "OpenAI & Gemini APIs",
        projects: ["gthrz", "amanah"],
      },
      {
        name: "LLM integration & AI workflows",
        projects: ["gthrz", "amanah"],
      },
      {
        name: "AI evaluation & monitoring",
        projects: ["amanah"],
        learning: true,
      },
      { name: "Prompt engineering", learning: true },
      {
        name: "AI-assisted development",
      },
    ],
  },
  {
    title: "Tools & testing",
    skills: [
      { name: "Git & GitHub" },
      { name: "Automated testing", projects: ["amanah"] },
      { name: "Debugging" },
      { name: "Figma" },
      { name: "Vite & Netlify" },
    ],
  },
  {
    title: "Coursework",
    coursework: true,
    skills: [
      { name: "Object-oriented programming" },
      { name: "Algorithms & data structures" },
      { name: "Database systems" },
      { name: "Software engineering" },
      { name: "Operating systems" },
      { name: "Networks" },
      { name: "GUIs" },
      { name: "Web technology" },
    ],
  },
];
