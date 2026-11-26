import type { CSSProperties, ReactNode } from "react";
import { projectById } from "@/lib/projects";
import { projectThreads, toolkitGroups, toolkitProjects, type ToolkitMark } from "@/lib/toolkit";

const toolMarks: Record<ToolkitMark, ReactNode> = {
  next: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 16.5v-9l10.4 12.1M15.6 7.5V14" />
    </g>
  ),
  react: (
    <>
      <g fill="none" stroke="currentColor" strokeWidth="1.25">
        <ellipse cx="12" cy="12" rx="10.4" ry="4.1" />
        <ellipse cx="12" cy="12" rx="10.4" ry="4.1" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10.4" ry="4.1" transform="rotate(120 12 12)" />
      </g>
      <circle cx="12" cy="12" r="1.7" />
    </>
  ),
  typescript: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <rect x="2.5" y="2.5" width="19" height="19" rx="1" />
      <path d="M5.6 11h6.3m-3.2 0v7m9.8-6.4c-1.9-1.8-5-.5-4.1 1.2.5 1 2.2 1.1 3.3 1.7 2.3 1.3.7 4.9-3.7 3" />
    </g>
  ),
  tailwind: (
    <path d="M12 5c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.9.2 1.6.9 2.3 1.6 1.2 1.2 2.6 2.6 5.5 2.6 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.9-.2-1.6-.9-2.3-1.6C16.3 6.4 14.9 5 12 5Zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.9.2 1.6.9 2.3 1.6C7.7 18 9.1 19.4 12 19.4c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.9-.2-1.6-.9-2.3-1.6-1.2-1.2-2.6-2.6-5.5-2.6Z" />
  ),
  expo: (
    <path d="M12 2.6c1 0 1.7.7 2.3 1.7l8.1 13.2c.6 1 .4 2.2-.6 2.8-.8.5-1.6.3-2.2-.4L13 11.3c-.5-.7-1.5-.7-2 0L4.4 20c-.6.7-1.4.9-2.2.4-1-.6-1.2-1.8-.6-2.8L9.7 4.3c.6-1 1.3-1.7 2.3-1.7Z" />
  ),
  supabase: <path d="M13.7 2 3.6 14.2h8.6l-.4 7.8 9.9-12.2h-8.5l.5-7.8Z" />,
  postgres: (
    <g fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.5 16.5C3 15.6 1 10.5 2.7 6.3 4 3 7.7 2.6 10.1 4m4.4.1c2.6-2 6.2-1.2 7 1.6 1 3.4-.8 7.3-3.9 9.2" />
      <path d="M8.3 6.9c1.8-3.8 7.2-4.1 8.6.4.5 1.5-.1 3.7-.7 5.6-.9 2.9-.1 5.5 2.7 4.6-.6 3.4-6.2 5.3-6.7.5l-.3-3c-2.4 1-4.8 0-4.8-3.1 0-1.5.6-3.8 1.2-5Z" />
      <path d="M10.3 9.1h.1m3.2-.2h.1" strokeWidth="2" />
    </g>
  ),
  sql: (
    <g fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round">
      <ellipse cx="12" cy="5.6" rx="8" ry="3.2" />
      <path d="M4 5.6v12.8a8 3.2 0 0 0 16 0V5.6M4 12a8 3.2 0 0 0 16 0" />
    </g>
  ),
  python: (
    <>
      <path fillRule="evenodd" d="M11.9 2c-4.3 0-5.4 1-5.4 3.8V7H12v1H4.8C2.9 8 2 9.7 2 12s.8 4.1 2.8 4.1h2.1v-2.4c0-2.4 1.4-3.6 3.8-3.6h3.1c2.1 0 3.6-1.1 3.6-3.1V5.8c0-2.8-1.3-3.8-5.5-3.8Zm-2 2.2a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" />
      <path fillRule="evenodd" d="M11.9 2c-4.3 0-5.4 1-5.4 3.8V7H12v1H4.8C2.9 8 2 9.7 2 12s.8 4.1 2.8 4.1h2.1v-2.4c0-2.4 1.4-3.6 3.8-3.6h3.1c2.1 0 3.6-1.1 3.6-3.1V5.8c0-2.8-1.3-3.8-5.5-3.8Zm-2 2.2a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" transform="rotate(180 12 12)" opacity=".75" />
    </>
  ),
  fastapi: (
    <path fillRule="evenodd" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1.3 3L6.5 13h5.1l-.8 6 6.7-8.5h-4.9l.7-5.5Z" />
  ),
  weather: (
    <g fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.2 11a4.3 4.3 0 1 1 6.9-4.1M8.6 1v1.3M2.8 3.2l1.1 1.1M1 9h1.6m13-6.3-1 1" />
      <path d="M7.2 20a4 4 0 1 1 1.3-7.8 5.1 5.1 0 0 1 9.6.8A3.5 3.5 0 1 1 19 20Z" />
    </g>
  ),
  openai: (
    <g fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinejoin="round">
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <path key={angle} transform={`rotate(${angle} 12 12)`} d="M5.8 10.1V6.6a4.6 4.6 0 0 1 8.7-2.1l-4.8 2.8v5.9" />
      ))}
    </g>
  ),
  twilio: (
    <>
      <circle cx="12" cy="12" r="9.1" fill="none" stroke="currentColor" strokeWidth="2.1" />
      <circle cx="9.3" cy="9.3" r="1.9" />
      <circle cx="14.7" cy="9.3" r="1.9" />
      <circle cx="9.3" cy="14.7" r="1.9" />
      <circle cx="14.7" cy="14.7" r="1.9" />
    </>
  ),
  claude: (
    <path d="m12 12-.8-10M12 12l4.4-8.4M12 12l8.1-4.5M12 12l10 .4M12 12l8.4 5.9M12 12l3.5 9.4M12 12l-2 9.7M12 12l-6.4 7.5M12 12l-9.3 3.5M12 12l-9.6-2M12 12 4 5.3M12 12 7.7 3" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
  ),
  gemini: (
    <path d="M12 1c.9 6 4.8 10.1 11 11-6.2.9-10.1 5-11 11-.9-6-4.8-10.1-11-11 6.2-.9 10.1-5 11-11Z" />
  ),
  llama: (
    <path d="M9.1 15.6C7.8 17.8 6.9 19 5.2 19 3.1 19 2 17.2 2 14.4 2 9.7 4.2 5 7.4 5c2.1 0 3.5 1.7 5.3 4.6l3.5 5.7c1.6 2.6 2.7 3.7 4 3.7 1.4 0 1.8-1.8 1.8-4.6C22 9.6 19.7 5 16.5 5c-2.2 0-3.8 2.6-5.1 5l-2.3 5.6Z" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
  ),
  whatsapp: (
    <>
      <path d="M21.8 11.9a9.7 9.7 0 0 1-14.3 8.6l-5.1 1.3 1.3-5a9.7 9.7 0 1 1 18.1-4.9Z" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinejoin="round" />
      <path d="M8 6.6c-1.2.4-1.7 1.4-1.5 2.6.6 3.3 3.7 6.4 7.1 7.4 1.5.5 3 0 3.4-1.2.2-.6 0-1.3-.6-1.5l-2.1-.9c-.5-.2-.7 0-1 .4l-.6.8a8 8 0 0 1-3.5-3.5l.7-.7c.4-.4.4-.6.2-1l-.9-2c-.2-.5-.7-.6-1.2-.4Z" />
    </>
  ),
  vitest: (
    <>
      <path d="M13 2 6.8 12h5.4l-1.1 5.1 6.2-9h-5L13 2Z" />
      <path d="m4 15 6.8 6.6L20 12.4" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  playwright: (
    <>
      <path d="M3.7 5.4c2.3 1 4.8 1.2 7.2.2M2.6 5.3l.8 5.6c.5 3.2 2.7 5.1 5.2 5m-3-6.8h.5m1 3.2c.7.4 1.4.5 2.1.2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path fillRule="evenodd" d="M12.3 8.2c3 1.6 6.4 2.3 9.7 2l-1 5.7c-.7 3.7-3.7 5.7-6.6 5.1-2.8-.6-4.3-3.7-3.6-7.4l1.5-5.4Zm1.2 4a.8.8 0 1 0 1.4.5.8.8 0 0 0-1.4-.5Zm4.5 1a.8.8 0 1 0 1.4.5.8.8 0 0 0-1.4-.5Zm-3.9 3.2a2.6 2.6 0 0 0 4 .8l-4-.8Z" />
    </>
  ),
  vercel: <path d="M12 3 23 21H1L12 3Z" />,
  railway: (
    <path fillRule="evenodd" d="M12 2a10 10 0 0 1 7.2 17H4.8a10 10 0 0 1-2.4-4.2h15.7a3.9 3.9 0 0 0-3.8-4.7H6.1l-1.9-4.3A10 10 0 0 1 12 2ZM3.1 7.9a10 10 0 0 0-1 5.2h14.6a2.4 2.4 0 0 0-2.4-1.5h-9L3.1 7.9ZM6.5 20.5h11a10 10 0 0 1-11 0Z" />
  ),
};

/* Legend beside the title: the six products in the colours their names take
   in the ledger below. Each one links to its chapter. */
function ProjectKey() {
  return (
    <ul className="vb-tools-key" aria-label="Products, in the colours used below">
      {toolkitProjects.map((id) => (
        <li key={id}>
          <a
            className="vb-tools-key-item"
            href={`#${id}`}
            style={{ "--thread-colour": projectThreads[id] } as CSSProperties}
          >
            <span className="vb-tools-key-dot" aria-hidden="true" />
            {projectById[id].name}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Toolkit() {
  return (
    <section id="skills" className="vb-tools" aria-labelledby="skills-title">
      <div className="vb-tools-cover">
        <h2 id="skills-title" className="vb-section-head vb-tools-title">
          Skills
        </h2>
        <ProjectKey />
      </div>

      <div className="vb-tools-index">
        {toolkitGroups.map(({ title, tools }) => (
          <section className="vb-tools-group" key={title} aria-label={title}>
            <h3 className="vb-tools-group-title">{title}</h3>
            <ul className="vb-tools-rows" role="list">
              {tools.map(({ name, mark, projects }) => (
                <li className="vb-tools-row" key={name}>
                  <span className="vb-tools-name">
                    <svg className="vb-tools-mark" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      {toolMarks[mark]}
                    </svg>
                    {name}
                  </span>
                  <ul className="vb-tools-uses" role="list">
                    {projects.map((id) => (
                      <li key={id}>
                        <a
                          className="vb-tools-project"
                          href={`#${id}`}
                          style={{ "--thread-colour": projectThreads[id] } as CSSProperties}
                        >
                          {projectById[id].name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
