/**
 * Shared portfolio content for Mohammed Bin Shamlan.
 * Version A imports this module. A later version can import it as well.
 */

export const portfolio = {
  name: "Mohammed Bin Shamlan",
  title: "Software Developer exploring AI Engineering",
  location: "Saudi Arabia",
  summary:
    "Mohammed Bin Shamlan is a software developer based in Saudi Arabia. He studied computer science at Queen Mary University of London and is now exploring AI engineering in the AI Bootcamp at Tuwaiq Academy.",
  education: [
    {
      qualification: "BSc Computer Science (Hons)",
      institution: "Queen Mary University of London",
      period: "Graduated in 2026",
      detail: "",
      status: "completed",
    },
    {
      qualification: "AI Bootcamp",
      institution: "Tuwaiq Academy",
      period: "In progress",
      detail: "",
      status: "current",
    },
  ],
  skills: [
    "JavaScript",
    "TypeScript",
    "React Native",
    "Next.js",
    "Supabase",
    "PostgreSQL",
    "Git and GitHub",
  ],
  projects: [
    {
      name: "Gthrz",
      summary:
        "A privacy-first mobile event planning application built using React Native, Expo, TypeScript, and Supabase.",
    },
    {
      name: "AMANAH",
      summary:
        "An AI-assisted lost-and-found web application project using Next.js and TypeScript.",
    },
  ],
  interests: [
    "Software development",
    "Artificial intelligence",
    "Music",
    "Gaming",
    "Photography",
  ],
  contact: {
    introduction: "Write about a project, a role, or a question.",
  },
} as const;

export type Portfolio = typeof portfolio;
