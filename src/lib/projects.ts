import type { CSSProperties } from "react";
import { publicUrl } from "@/lib/site";

/**
 * Every project on the portfolio, in the order they appear. Facts here were
 * checked against each repository or live demo; add numbers only with a source.
 */

export type ProjectId =
  | "naqah"
  | "tammeni"
  | "seet"
  | "kashta"
  | "amanah"
  | "gthrz"
  | "experiment";

export type Shot = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** How the screenshot is framed on the page. */
  frame: "browser" | "phone";
  caption?: string;
};

export type FlowStep = {
  /** Who or what acts at this step. */
  actor: string;
  /** What happens, in one line. */
  action: string;
  /** Optional engineering note shown under the step. */
  note?: string;
};

export type ProjectLink = {
  label: string;
  href: string;
};

export type Decision = {
  /** The constraint the product had to live with. */
  constraint: string;
  /** What was given up to respect it. */
  tradeoff: string;
  /** What was built as a result. */
  shipped: string;
  /** What that changed for the people using it. */
  changed: string;
};

/** A number checked in a public repository, with where and when it was read. */
export type Evidence = {
  kind: "tests" | "commits" | "scope";
  value: string;
  label: string;
  source: ProjectLink;
  /** When the number was read, e.g. "25 Nov 2026". */
  checked: string;
  /** A passing CI run on the same commit that runs these tests. Without one, the count was taken locally. */
  run?: { href: string; date: string };
};

/** A product result, such as usage or a customer decision. Only from the owner, with a source. */
export type Outcome = {
  text: string;
  /** When it was true, e.g. "Dec 2026". */
  date: string;
  source: ProjectLink;
};

export type Proof = {
  /** What the figure shows, in one line. */
  title: string;
  /** The states or steps, left to right. */
  moments: { time: string; label: string }[];
  /** Annotations under the figure. */
  notes: string[];
  /** Shown before the evidence when present. Leave empty until the owner supplies a sourced result. */
  outcome?: Outcome;
  /** Checked numbers from the public repository. Never traction claims. */
  evidence?: Evidence[];
};

export type Project = {
  id: ProjectId;
  name: string;
  arabic: string;
  /** Short status for the chip next to the first action. */
  statusChip: string;
  /** Month and year, from the repository's first and last commits. */
  dates: string;
  /** One specific thing Mohammed did on it. */
  contribution: string;
  /** An annotated figure of the key decision, drawn from data. */
  proof: Proof;
  /** Where the project opens from the index; defaults to its case study. */
  href?: string;
  /** The one decision that shaped the product. */
  decision: Decision;
  /** One line, under 90 characters, said in plain words. */
  tagline: string;
  /** Arabic tagline or motto, shown RTL. */
  arabicTagline?: string;
  status: string;
  year: string;
  kind: string;
  role: string;
  team?: string;
  /** Flat field colour for this project's cover, and the ink that reads on it. */
  field: string;
  fieldInk: string;
  fieldMuted: string;
  accent: string;
  /** Whether the field is light; controls the frame chrome. */
  light: boolean;
  problem: string;
  what: string;
  how: FlowStep[];
  /** Engineering decisions worth reading, each one sentence. */
  decisions: string[];
  stack: string[];
  links: ProjectLink[];
  /** Shown when a repo is private or there is no live deploy. */
  linkNote?: string;
  cover: Shot;
  coverPhone?: Shot;
  screens: Shot[];
  /** Site-wide credit for any third-party picture used on this project's pages. */
  credit?: string;
};

/** When the evidence numbers were read: test suites run on clean clones, commits counted with git log. */
export const EVIDENCE_CHECKED = "25 Nov 2026";

const browser = { width: 1000, height: 625, frame: "browser" } as const;
const phone = { width: 440, height: 952, frame: "phone" } as const;

export const projects: Project[] = [
  {
    id: "naqah",
    name: "Naqah",
    arabic: "ناقة",
    statusChip: "Live investor MVP · simulated demo",
    dates: "Nov 2026",
    contribution: "Lead contributor on a three-person team: the call flow, the owner's website and the test suite.",
    proof: {
      title: "What the ranch call keeps, and what it throws away",
      moments: [
        { time: "Audio", label: "Heard, never stored" },
        { time: "Answers", label: "Written as records" },
        { time: "Owner call", label: "Only what matters" },
        { time: "Website", label: "The full record" },
      ],
      notes: [
        "The worker's voice is processed live over the Twilio call and discarded. Nothing sensitive sits in a voice file.",
        "Each answer becomes a row against the ranch; the owner's evening call reads from those rows.",
        "Row-level security keeps one ranch to one owner.",
      ],
      evidence: [
        {
          kind: "tests",
          value: "2,908",
          label: "automated tests pass: 2,774 in Vitest and 134 for the voice bridge. 162 database tests need Postgres and were skipped.",
          source: { label: "Test setup at fee47bd", href: "https://github.com/justAbdulaziz10/Naqah/blob/fee47bd/vitest.config.ts" },
          checked: EVIDENCE_CHECKED,
          run: { href: "https://github.com/justAbdulaziz10/Naqah/actions/runs/43485948279", date: "13 Nov 2026" },
        },
        {
          kind: "commits",
          value: "128 of 209",
          label: "commits are mine, 5 to 13 Nov 2026, in a three-person team.",
          source: { label: "Commit history", href: "https://github.com/justAbdulaziz10/Naqah/commits/main" },
          checked: EVIDENCE_CHECKED,
        },
      ],
    },
    decision: {
      constraint:
        "The ranch worker has an ordinary phone and no time for an app. Anything he has to type will not get typed.",
      tradeoff:
        "A real voice call means Twilio, a live speech bridge and Arabic turn-taking, which is far more to build and test than a form. We took that cost instead of asking the worker to change.",
      shipped:
        "A scheduled call that asks the owner's questions one at a time, keeps the answers as records and throws the audio away. On the website the owner reads facts, not recordings.",
      changed:
        "The worker needs nothing new. The owner gets one short call with what matters and can check the full record later, which is what an investor demo now shows as a labelled in-browser simulation.",
    },
    tagline: "A camel ranch that phones its owner.",
    arabicTagline: "اطمئنان، دون انشغال",
    status: "Investor MVP",
    year: "2026",
    kind: "Voice AI · web app",
    role: "Lead contributor",
    team: "With Abdulaziz Alkhlaiwe and Faisal Alanazi",
    field: "#efd7b3",
    fieldInk: "#2f1c0e",
    fieldMuted: "#6b4a2e",
    accent: "#8a4b1e",
    light: true,
    problem:
      "A ranch owner in Saudi Arabia usually lives in the city, far from the ranch. Every update about the camels means a call to the worker, a chat thread to scroll back through, or driving out. The owner wants to know what matters, without being busy with it.",
    what: "Naqah runs private ranch operations for one owner and one ranch. At the time the owner chooses, it phones the ranch worker on an ordinary phone, asks the owner's questions one at a time, keeps only the facts, then calls the owner with what matters. The owner follows the ranch on the website.",
    how: [
      {
        actor: "Owner",
        action: "Picks the questions and the time of the daily call on the website.",
        note: "Supabase Auth and row-level security keep one ranch to one owner.",
      },
      {
        actor: "Naqah",
        action: "Phones the worker on an ordinary phone and asks one question at a time.",
        note: "Twilio Voice carries the call; an OpenAI Realtime bridge listens and speaks in Arabic.",
      },
      {
        actor: "Worker",
        action: "Answers in his own words. No app, no typing.",
      },
      {
        actor: "Naqah",
        action: "Keeps only the facts, never the audio, and stores them against the ranch.",
        note: "Answers are written as structured records; the recording is not kept.",
      },
      {
        actor: "Owner",
        action: "Gets a short call with what matters and sees the full record online.",
      },
    ],
    decisions: [
      "The worker needs nothing new: a phone call works on any handset and in any signal.",
      "Facts, not audio. The product stores answers as records, so nothing sensitive sits in a voice file.",
      "The live site runs a labelled simulation in the browser, so investors can hear the flow without a real phone line.",
      "Vitest covers the question flow and Playwright walks the owner's website end to end.",
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "Tailwind 4",
      "zustand",
      "Supabase",
      "Twilio Voice",
      "OpenAI Realtime",
      "Vitest",
      "Playwright",
    ],
    links: [
      { label: "Live demo (Arabic)", href: "https://naqah.vercel.app" },
      { label: "English", href: "https://naqah.vercel.app/en" },
      { label: "Source on GitHub", href: "https://github.com/justAbdulaziz10/Naqah" },
    ],
    cover: {
      ...browser,
      src: publicUrl("/images/projects/naqah/desktop.jpg"),
      alt: "Naqah landing page: camels crossing dunes at sunset under the headline, with a timeline of the daily call.",
    },
    coverPhone: {
      ...phone,
      src: publicUrl("/images/projects/naqah/phone.jpg"),
      alt: "Naqah on a phone: the Arabic headline above the camel photograph.",
    },
    screens: [
      {
        ...browser,
        src: publicUrl("/images/projects/naqah/desktop.jpg"),
        alt: "Naqah landing page in Arabic.",
        caption: "The Arabic landing page, with the day's call drawn as a timeline.",
      },
      {
        ...browser,
        src: publicUrl("/images/projects/naqah/desktop-en.jpg"),
        alt: "Naqah landing page in English.",
        caption: "The same page in English.",
      },
      {
        ...phone,
        src: publicUrl("/images/projects/naqah/phone.jpg"),
        alt: "Naqah on a phone.",
        caption: "On a phone.",
      },
    ],
  },
  {
    id: "tammeni",
    name: "Tammeni",
    arabic: "طمّني",
    statusChip: "Live demo",
    dates: "Oct–Nov 2026",
    contribution: "With Shaima Saud and Razan: the parent dashboard, the per-child alert schedules and the Lulwa voice flow.",
    proof: {
      title: "One family, two children, different rules per topic",
      moments: [
        { time: "Attendance", label: "Reem: right away, text" },
        { time: "Grades", label: "Reem: weekly, call" },
        { time: "Exams", label: "Nawaf: daily, call" },
        { time: "Attendance", label: "Nawaf: off" },
      ],
      notes: [
        "Every child and every topic has its own choice of timing and channel, stored per parent under row-level security.",
        "Lulwa delivers the update by call or text at the chosen time, then answers only from that child's record.",
        "Names here are from the fictional demo data.",
      ],
      evidence: [
        {
          kind: "tests",
          value: "47",
          label: "automated tests pass, covering alert schedules, call data and operator access.",
          source: { label: "Tests at 3c6fb48", href: "https://github.com/mobinshamlan/Madrasati-AI-Assistant/tree/3c6fb48/tests" },
          checked: EVIDENCE_CHECKED,
        },
        {
          kind: "commits",
          value: "47 of 59",
          label: "commits are mine, 28 Oct to 25 Nov 2026.",
          source: { label: "Commit history", href: "https://github.com/mobinshamlan/Madrasati-AI-Assistant/commits/main" },
          checked: EVIDENCE_CHECKED,
        },
      ],
    },
    decision: {
      constraint:
        "Parents do not want another feed. They want to be told at a time that suits them, in a form they will actually notice.",
      tradeoff:
        "Per-child, per-topic schedules make the settings screen heavier and the delivery logic more complex than a single daily digest. We accepted that so a family can have very different rules for an exam and for attendance.",
      shipped:
        "Alert choices of right away, daily, weekly or custom, by call or text, and a voice agent, Lulwa, who gives the update then answers questions only from the child's record.",
      changed:
        "A parent can get one phone call a week and still ask a follow-up on it. The operator studio lets us replay the whole flow in front of a room.",
    },
    tagline: "School news for parents, by phone call or text, on their own schedule.",
    arabicTagline: "وش صار مع عيالك اليوم؟",
    status: "Demo",
    year: "2026",
    kind: "Voice agent · parent dashboard",
    role: "Developer",
    team: "With Shaima Saud and Razan",
    field: "#0f3d33",
    fieldInk: "#f1ead9",
    fieldMuted: "#b9c9bf",
    accent: "#d9b35a",
    light: false,
    problem:
      "Parents hear about attendance, grades and exams late, in a crowd of app notifications, or not at all. Some would rather get a short call at a set time than another screen to check.",
    what: "Tammeni gives parents a dashboard of attendance, grades and upcoming exams, and lets them choose how each kind of news reaches them: right away, daily, weekly or on a custom schedule, by call or by text. A voice agent called Lulwa gives the update and answers questions from the child's record. Inspired by the Saudi Madrasati platform, not affiliated with it; all data is fictional.",
    how: [
      {
        actor: "Parent",
        action: "Chooses, per child and per topic, when and how to be told.",
        note: "Supabase row-level security scopes every record to the parent.",
      },
      {
        actor: "School record",
        action: "Attendance, grades and exam dates land in the dashboard.",
        note: "Fictional data served by a FastAPI service.",
      },
      {
        actor: "Lulwa",
        action: "Calls or texts at the chosen time with the update.",
        note: "OpenAI live voice over a Twilio call; text goes as an SMS.",
      },
      {
        actor: "Parent",
        action: "Asks a follow-up on the call and gets an answer from the child's record.",
      },
      {
        actor: "Operator",
        action: "Runs the demo studio to trigger calls and watch the flow.",
      },
    ],
    decisions: [
      "Alert choices are per child and per topic, so one family can have very different schedules.",
      "Lulwa only answers from the record she is given; the voice layer never guesses.",
      "An operator studio makes the demo repeatable in front of an audience.",
      "The web app runs on Vercel and the Python voice service on Railway.",
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "Tailwind 4",
      "Supabase",
      "FastAPI",
      "OpenAI",
      "Twilio",
      "Vercel",
      "Railway",
    ],
    links: [
      { label: "Live demo", href: "https://tammeni-demo.vercel.app/welcome" },
      {
        label: "Source on GitHub",
        href: "https://github.com/mobinshamlan/Madrasati-AI-Assistant",
      },
    ],
    cover: {
      ...browser,
      src: publicUrl("/images/projects/tammeni/desktop.jpg"),
      alt: "Tammeni welcome page: a dark green screen with the headline 'What happened with your kids today?' and the Lulwa character.",
    },
    coverPhone: {
      ...phone,
      src: publicUrl("/images/projects/tammeni/phone.jpg"),
      alt: "Tammeni on a phone.",
    },
    screens: [
      {
        ...browser,
        src: publicUrl("/images/projects/tammeni/dashboard.jpg"),
        alt: "Tammeni parent dashboard: latest grades per subject with the average, and attendance at 92% with the last recorded days.",
        caption: "The parent dashboard from the demo: grades, attendance, upcoming exams.",
      },
      {
        ...phone,
        src: publicUrl("/images/projects/tammeni/prefs-when.jpg"),
        alt: "Tammeni alert preferences, step 4 of 11: when should attendance news reach you, right away or after the school day.",
        caption: "Step 4 of 11: when attendance news reaches you.",
      },
      {
        ...phone,
        src: publicUrl("/images/projects/tammeni/prefs-how.jpg"),
        alt: "Tammeni alert preferences, step 3 of 11: text message or a call from Lulwa.",
        caption: "Step 3: a text, or Lulwa calls.",
      },
      {
        ...browser,
        src: publicUrl("/images/projects/tammeni/day.jpg"),
        alt: "Tammeni welcome page section: a sample text reminder from Lulwa about a maths test, and the per-topic choices for attendance, exams and grades.",
        caption: "A sample school day on the welcome page: Lulwa's text reminder.",
      },
    ],
  },
  {
    id: "seet",
    name: "Seet",
    arabic: "صيت",
    statusChip: "Landing page live · in development",
    dates: "Nov 2026",
    contribution: "Solo: the WhatsApp webhook, the Claude tool loop, the booking trigger and the dashboard.",
    proof: {
      title: "A booking's four states, and who may move it",
      moments: [
        { time: "Enquiry", label: "Brand messages" },
        { time: "Held", label: "Trigger locks the slot" },
        { time: "Deposit", label: "Link sent" },
        { time: "Confirmed", label: "Payment callback only" },
      ],
      notes: [
        "The model can move a booking to Held by calling a server tool; a Postgres trigger under a per-workspace lock refuses a second hold on the same slot.",
        "Only the payment callback can set Confirmed. The model has no tool for it and is told never to say the word.",
        "The dashboard shows holds and confirmations as two different things.",
      ],
    },
    decision: {
      constraint:
        "A booking is money. The agent must never promise a slot it cannot hold, and must never say 'confirmed' before the deposit lands.",
      tradeoff:
        "The model is less chatty and less 'helpful' than it could be: it cannot quote a price or a date on its own and cannot close a deal. Every number goes through a tool the server runs.",
      shipped:
        "Booking rules in a Postgres trigger under a per-workspace lock, a held slot with a deposit link, and a state that only the payment callback can move to confirmed.",
      changed:
        "A second hold on the same slot is refused by the Postgres trigger under a per-workspace lock, not by the prompt. The dashboard shows holds and confirmations as two different things.",
    },
    tagline: "An AI secretary for an influencer's ads WhatsApp number.",
    arabicTagline: "صيت يرد على المعلنين عنك",
    status: "In development",
    year: "2026",
    kind: "WhatsApp agent · bookings",
    role: "Developer",
    field: "#dba946",
    fieldInk: "#0b1220",
    fieldMuted: "#4a3a12",
    accent: "#0b1220",
    light: true,
    problem:
      "Brands message an influencer's ads number all day: prices, free dates, deposits. Replies are slow, slots get promised twice, and a booking is 'confirmed' before any money arrives.",
    what: "Seet answers brands on WhatsApp in Saudi dialect with the real packages and free days from the database, holds a slot, sends a deposit link, and confirms only after payment. The influencer and their managers get a private dashboard: Today, Calendar, Inbox, Brands, Money and Settings. Working name.",
    how: [
      {
        actor: "Brand",
        action: "Messages the ads number on WhatsApp.",
        note: "WhatsApp Cloud API webhook, with the signature checked before anything is read.",
      },
      {
        actor: "Seet",
        action: "Replies in Saudi dialect with packages and free days.",
        note: "Claude Haiku with tools; the server runs every tool against the database.",
      },
      {
        actor: "Database",
        action: "Holds the slot under a per-workspace lock.",
        note: "A Postgres trigger under a per-workspace lock enforces the rules, so a second hold on the same slot is refused.",
      },
      {
        actor: "Brand",
        action: "Pays the deposit through the link.",
        note: "A Moyasar-style payment flow; a bilingual quote PDF goes with it.",
      },
      {
        actor: "Payment callback",
        action: "Confirms the booking. Only this step can say 'confirmed'.",
      },
    ],
    decisions: [
      "The model never invents a price or a date: every number comes from a tool call the server runs.",
      "The model never says 'confirmed'. Only the payment callback can change a booking's state.",
      "Booking rules live in a Postgres trigger under a per-workspace lock, not in application code, so two holds on one slot cannot both succeed.",
      "Managers work in the same workspace as the influencer, with separate roles.",
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "Supabase",
      "Postgres triggers",
      "Anthropic Claude",
      "WhatsApp Cloud API",
    ],
    links: [{ label: "Live landing page", href: "https://seet-puce.vercel.app" }],
    linkNote: "Private repository.",
    cover: {
      ...browser,
      src: publicUrl("/images/projects/seet/desktop.jpg"),
      alt: "Seet landing page: a night-blue screen with a WhatsApp conversation in which Seet holds a Tuesday slot and asks for a deposit.",
    },
    coverPhone: {
      ...phone,
      src: publicUrl("/images/projects/seet/phone.jpg"),
      alt: "Seet on a phone.",
    },
    screens: [
      {
        ...browser,
        src: publicUrl("/images/projects/seet/desktop.jpg"),
        alt: "Seet landing page.",
        caption: "The landing page, with a sample conversation: request, packages, a held slot, a deposit.",
      },
      {
        ...browser,
        src: publicUrl("/images/projects/seet/how.jpg"),
        alt: "Seet landing page section: prices from your settings, no confirmation before the deposit, one dashboard, with a sample slot moving from held to confirmed.",
        caption: "Further down the landing page: a held slot becomes confirmed only after the deposit.",
      },
      {
        ...phone,
        src: publicUrl("/images/projects/seet/phone.jpg"),
        alt: "Seet on a phone.",
        caption: "On a phone, with the Riyadh skyline.",
      },
    ],
  },
  {
    id: "kashta",
    name: "Kashta",
    arabic: "كشتة",
    statusChip: "Live · open source",
    dates: "Nov 2026",
    contribution: "Solo: the scoring model, the forecast pipeline, the Llama guards and the Arabic-first interface.",
    proof: {
      title: "How a night gets its Kashta Score",
      moments: [
        { time: "Forecast", label: "Temperature, wind, rain, cloud, dust, moon" },
        { time: "Limits", label: "Each mapped to 0–100" },
        { time: "Weights", label: "Kashta or stars, your priorities" },
        { time: "Cap", label: "35 if any reading is dangerous" },
        { time: "Score", label: "Or 'incomplete'" },
      ],
      notes: [
        "The formula is code in src/lib/score.ts and written out on the app's About page; Llama never computes it.",
        "A missing measurement gives no number at all, so a night is never ranked on a guess.",
      ],
      evidence: [
        {
          kind: "scope",
          value: "62",
          label: "camping sites in 9 regions, taken from the NCVC Camping and Caravan Guide 2025, each scored for the next 7 nights.",
          source: { label: "Site list at 2f29fad", href: "https://github.com/mobinshamlan/kashta/blob/2f29fad/src/lib/destinations.ts" },
          checked: EVIDENCE_CHECKED,
        },
        {
          kind: "tests",
          value: "38",
          label: "automated tests pass, covering the score, the AI guards, share links and the sky timeline.",
          source: { label: "Tests at 2f29fad", href: "https://github.com/mobinshamlan/kashta/tree/2f29fad/tests" },
          checked: EVIDENCE_CHECKED,
          run: { href: "https://github.com/mobinshamlan/kashta/actions/runs/45579659392", date: "25 Nov 2026" },
        },
        {
          kind: "commits",
          value: "52 of 52",
          label: "commits are mine, 2 to 25 Nov 2026, for Project 4 (Meta × Startupbootcamp × Tuwaiq Academy).",
          source: { label: "Commit history", href: "https://github.com/mobinshamlan/kashta/commits/main" },
          checked: EVIDENCE_CHECKED,
        },
      ],
    },
    decision: {
      constraint:
        "A ranking people will drive two hours on cannot depend on a model's arithmetic, and the project brief required Llama to be central.",
      tradeoff:
        "Llama does less than it could: it never computes the score. It turns a trip description into settings and explains a ranking that code already produced, and anything it says with a number not in the forecast is cut.",
      shipped:
        "A deterministic Kashta Score, documented on the app's About page, with per-measurement limits and weights, a dangerous-condition cap, and 'incomplete' instead of a guess when data is missing.",
      changed:
        "Any night's score can be checked by hand against the forecast. The AI is useful and never the reason a trip went wrong.",
    },
    tagline: "A desert night planner for Riyadh, scored by code and explained by Llama.",
    arabicTagline: "أحسن ليلة لكشتتك، وأنسب مكان لها",
    status: "Live",
    year: "2026",
    kind: "Forecast ranking · Arabic-first",
    role: "Developer",
    team: "Project 4, Meta × Startupbootcamp × Tuwaiq Academy",
    field: "#151b2e",
    fieldInk: "#f3ece0",
    fieldMuted: "#b9b4c4",
    accent: "#f0945a",
    light: false,
    problem:
      "Picking a night for a kashta means checking wind, dust, cloud and the moon for each site by hand, and still not knowing whether a permit is needed.",
    what: "Kashta compares real forecasts of temperature, wind, rain, cloud, dust and moonlight for 62 camping sites in nine regions from the NCVC Camping Guide 2025, ranks the next seven nights with a transparent Kashta Score, shows permit information with its source, and has a Star Hunter page for stargazing nights. Meta Llama 4 Scout turns a trip description into settings and explains the results.",
    how: [
      {
        actor: "You",
        action: "Describe the trip in your own words, in Arabic or English.",
      },
      {
        actor: "Llama 4 Scout",
        action: "Turns the description into settings you can edit.",
        note: "The reply must parse against a Zod schema; unknown fields are dropped.",
      },
      {
        actor: "Open-Meteo + SunCalc",
        action: "Seven nights of forecast and moonlight for every site, in one call.",
        note: "Cached for 30 minutes on the server.",
      },
      {
        actor: "Kashta Score",
        action: "Ranks the nights. Code, not AI.",
        note: "Straight-line limits per measurement, weighted by your priorities; a dangerous reading caps the score.",
      },
      {
        actor: "Llama 4 Scout",
        action: "Explains the ranking, using only the numbers it was sent.",
        note: "Any sentence quoting a number not in the forecast is removed.",
      },
    ],
    decisions: [
      "The score is deterministic and documented in the app, so a ranking can be checked by hand against the forecast.",
      "Missing data gives no number: a night with no dust forecast shows 'incomplete' instead of a guess.",
      "Permit status is copied from the official guide with its URL and check date; there is no live permit API.",
      "Without AI credentials the AI routes answer 'not configured' and the interface says so. No mock AI.",
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind 4",
      "Zod",
      "SunCalc",
      "Open-Meteo",
      "Llama 4 Scout",
      "Cloudflare Workers AI",
    ],
    links: [
      { label: "Live app", href: "https://4kashta.vercel.app" },
      { label: "Source on GitHub", href: "https://github.com/mobinshamlan/kashta" },
    ],
    cover: {
      ...browser,
      src: publicUrl("/images/projects/kashta/desktop.jpg"),
      alt: "Kashta home: a drawn desert night with a tent and campfire, the best night of the week shown in a card.",
    },
    coverPhone: {
      ...phone,
      src: publicUrl("/images/projects/kashta/phone.jpg"),
      alt: "Kashta on a phone.",
    },
    screens: [
      {
        ...browser,
        src: publicUrl("/images/projects/kashta/score.jpg"),
        alt: "Kashta destination page: seven nights with their scores, and a Kashta Score of 99 explained by comfortable temperature, calm wind and no rain.",
        caption: "A destination page: seven nights scored, and why tonight is a 99.",
      },
      {
        ...browser,
        src: publicUrl("/images/projects/kashta/stars.jpg"),
        alt: "Kashta Star Hunter mode with the Milky Way over a dark ridge.",
        caption: "Star Hunter: nights ranked for stargazing by cloud, moon, dust and wind.",
      },
      {
        ...browser,
        src: publicUrl("/images/projects/kashta/plan.jpg"),
        alt: "Kashta plan page.",
        caption: "Plan: describe the trip, edit the settings Llama proposed, read the ranking.",
      },
      {
        ...phone,
        src: publicUrl("/images/projects/kashta/phone.jpg"),
        alt: "Kashta on a phone.",
        caption: "On a phone.",
      },
    ],
  },
  {
    id: "amanah",
    name: "Amanah",
    arabic: "أمانة",
    statusChip: "Live MVP",
    dates: "Oct–Nov 2026",
    contribution: "Solo: the private matching with Gemini, the hashed tracking links, the staff review and the bilingual interface.",
    proof: {
      title: "A report's path, with a person at the decision",
      moments: [
        { time: "Lost", label: "Private report, tracking link" },
        { time: "Found", label: "Logged, never public" },
        { time: "Match", label: "Gemini suggests" },
        { time: "Questions", label: "Owner answers two" },
        { time: "Decision", label: "Staff approve or reject" },
      ],
      notes: [
        "The tracking credential lives in the URL fragment; the server stores only its SHA-256 hash.",
        "Every staff decision is appended to a log that cannot be rewritten.",
      ],
      evidence: [
        {
          kind: "tests",
          value: "211",
          label: "automated tests pass in 55 suites, covering matching, ownership questions, Gemini and rate limits.",
          source: { label: "Tests at 2fdaa9d", href: "https://github.com/mobinshamlan/Amanah/tree/2fdaa9d/tests" },
          checked: EVIDENCE_CHECKED,
        },
        {
          kind: "commits",
          value: "90 of 90",
          label: "commits are mine, 23 Oct to 24 Nov 2026.",
          source: { label: "Commit history", href: "https://github.com/mobinshamlan/Amanah/commits/main" },
          checked: EVIDENCE_CHECKED,
        },
      ],
    },
    decision: {
      constraint:
        "A lost-and-found board that shows items to everyone leaks more than it should: a photo of a wallet is a description of its owner.",
      tradeoff:
        "No public gallery means the crowd cannot help find matches. Matching has to come from the system and the decision from staff, which is slower than a noticeboard but private.",
      shipped:
        "Gemini compares reports privately, staff approve or reject with an append-only log, and the owner proves ownership through two questions on a link whose credential is only ever stored as a hash.",
      changed:
        "Nothing about an item is public at any point. A visitor can follow the whole flow in the guided demo in about a minute.",
    },
    tagline: "Private lost and found for one organisation. AI suggests, staff decide.",
    arabicTagline: "كل مفقود أمانة",
    status: "MVP · live",
    year: "2026",
    kind: "Lost and found · Gemini matching",
    role: "Developer",
    field: "#f1ead9",
    fieldInk: "#0e3b2e",
    fieldMuted: "#3b5546",
    accent: "#7a5a12",
    light: true,
    problem:
      "A campus, venue or office collects lost things, then posts them on a public board or group chat, which shows everyone more than it should and still leaves staff to match reports by eye.",
    what: "Amanah is a private lost-and-found for one organisation. There is no public gallery. Gemini compares lost and found reports privately and suggests matches; staff approve or reject each one with an append-only log. The owner answers up to two ownership questions on a private tracking link. Arabic (right to left) and English. A guided demo follows a lost blue umbrella.",
    how: [
      {
        actor: "Owner",
        action: "Reports the lost thing and gets a private tracking link.",
        note: "The credential lives in the URL fragment; only its SHA-256 hash is stored.",
      },
      {
        actor: "Finder",
        action: "Logs a found thing. It never appears in public.",
      },
      {
        actor: "Gemini",
        action: "Compares the reports privately and suggests likely matches.",
      },
      {
        actor: "Owner",
        action: "Answers up to two ownership questions on the tracking link.",
      },
      {
        actor: "Staff",
        action: "Approve or reject. Every decision goes to an append-only log.",
        note: "Supabase row-level security scopes everything to the organisation.",
      },
    ],
    decisions: [
      "No public gallery: a match is suggested to staff, not shown to strangers.",
      "The tracking credential is never stored in plain text; the server keeps only a hash.",
      "Staff decisions are append-only, so the history of a report cannot be rewritten.",
      "The demo is a guided story, so a visitor sees the whole flow in a minute.",
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "Google Gemini",
      "Vercel",
    ],
    links: [
      { label: "Live site", href: "https://amanahz.vercel.app" },
      { label: "Guided demo", href: "https://amanahz.vercel.app/demo" },
      { label: "Source on GitHub", href: "https://github.com/mobinshamlan/Amanah" },
    ],
    cover: {
      ...browser,
      src: publicUrl("/images/projects/amanah/desktop.jpg"),
      alt: "Amanah home: a drawn front desk with a bell, a tag and an open drawer, under the headline 'Lost something? Or found something?'",
    },
    coverPhone: {
      ...phone,
      src: publicUrl("/images/projects/amanah/phone.jpg"),
      alt: "Amanah on a phone.",
    },
    screens: [
      {
        ...browser,
        src: publicUrl("/images/projects/amanah/desktop.jpg"),
        alt: "Amanah home page.",
        caption: "Home: report lost, report found, or follow a report.",
      },
      {
        ...browser,
        src: publicUrl("/images/projects/amanah/ownership.jpg"),
        alt: "Amanah guided demo, ownership step: staff ask 'What colour is the handle?' while the found report stays private.",
        caption: "The ownership step: one question from staff; the found report stays hidden.",
      },
      {
        ...browser,
        src: publicUrl("/images/projects/amanah/demo.jpg"),
        alt: "Amanah guided demo with a blue umbrella tag.",
        caption: "The guided demo starts with a lost blue umbrella.",
      },
      {
        ...phone,
        src: publicUrl("/images/projects/amanah/demo-phone.jpg"),
        alt: "Amanah demo on a phone.",
        caption: "The demo on a phone.",
      },
    ],
  },
  {
    id: "gthrz",
    name: "Gthrz",
    arabic: "",
    statusChip: "Open source · built 2026",
    dates: "Mar–Sep 2026",
    contribution: "Solo: the React Native app, the Supabase schema with row-level security and the Smart Planner.",
    proof: {
      title: "What a guest can see, by state",
      moments: [
        { time: "Discovered", label: "Title, time, category" },
        { time: "Requested", label: "Still no address" },
        { time: "Approved", label: "Exact location, if revealed" },
        { time: "Revealed", label: "Host chooses when" },
      ],
      notes: [
        "Privacy is set per event: address now or later, guest names and photos on or off.",
        "Row-level security enforces who can read what, not the client.",
      ],
    },
    decision: {
      constraint:
        "A host's address and guest list should not be visible to everyone who can see the event exists.",
      tradeoff:
        "Delayed location reveal and approval make an event harder to discover and slower to join than an open invite. We chose the host's control over reach.",
      shipped:
        "Privacy set per event: address now or later, guest names and photos on or off, RSVP approval and capacity, enforced with row-level security.",
      changed:
        "Only approved guests ever see the exact location, and the host decides when. The Smart Planner drafts the event but never publishes it.",
    },
    tagline: "Privacy-first event planning for iPhone and Android, with an AI planner.",
    status: "Built · open source",
    year: "2025",
    kind: "Mobile app · React Native",
    role: "Developer",
    field: "#141216",
    fieldInk: "#f3eee6",
    fieldMuted: "#b5aeb8",
    accent: "#8b6cf0",
    light: false,
    problem:
      "Public event tools show a host's address, guest list and photos to more people than the host meant. Private gatherings need invitations, approval and a location that stays hidden until the host says so.",
    what: "Gthrz is a mobile app for creating and running events with host control: guests request to join, hosts approve RSVPs, capacity is enforced, and the location can stay hidden until the host reveals it. A Smart Planner drafts the event from a sentence.",
    how: [
      {
        actor: "Host",
        action: "Creates the event: title, time, category, capacity.",
      },
      {
        actor: "Host",
        action: "Sets privacy per event: address now or later, guest names, guest photos.",
      },
      {
        actor: "Guest",
        action: "Finds the event or joins with a code, then requests to attend.",
      },
      {
        actor: "Host",
        action: "Approves. The exact location is revealed to approved guests only.",
        note: "Supabase row-level security enforces who sees what.",
      },
      {
        actor: "Smart Planner",
        action: "Drafts an event from a description when the host wants a head start.",
      },
    ],
    decisions: [
      "Privacy is a per-event setting, not a global one, so a party and a study group can differ.",
      "Location reveal is delayed by default; approval is what unlocks it.",
      "The planner writes a draft, never a final event; the host still decides everything.",
    ],
    stack: ["React Native", "Expo", "TypeScript", "Supabase", "PostgreSQL"],
    links: [{ label: "Source on GitHub", href: "https://github.com/mobinshamlan/Gthrz" }],
    cover: {
      src: publicUrl("/images/projects/gthrz/home.webp"),
      alt: "Gthrz home screen with upcoming events and create controls.",
      width: 455,
      height: 952,
      frame: "phone",
    },
    screens: [],
  },
];

projects.push({
  id: "experiment",
  name: "Prompt Experiment",
  arabic: "",
  statusChip: "Live",
  dates: "2026",
  contribution: "Wrote both prompts, kept Version A frozen and built Version B.",
  proof: {
    title: "Two prompts, one brief",
    moments: [
      { time: "Brief", label: "The same facts" },
      { time: "Version A", label: "One prompt, one pass" },
      { time: "Version B", label: "Direction, build, check, repeat" },
    ],
    notes: ["The Version A prompt is published in the README."],
  },
  href: "/experiment",
  tagline: "One brief, two prompts. The same portfolio built twice.",
  status: "Course project · live",
  year: "2026",
  kind: "Portfolio · prompt comparison",
  role: "Author",
  field: "#ded9d0",
  fieldInk: "#1c1c1a",
  fieldMuted: "#55534f",
  accent: "#4e2428",
  light: true,
  problem:
    "How much does the prompt change the product? One brief about the same person was given twice: once as a single simple prompt, once as a structured process.",
  what: "Version A came from one simple prompt and is kept exactly as it came out. Version B came from structured prompts, a design direction and rounds of refinement, and is the site you are on now.",
  how: [
    { actor: "Brief", action: "The same facts about me, once." },
    { actor: "Version A", action: "One prompt, one pass. Frozen as the baseline." },
    { actor: "Version B", action: "A design brief, then a loop: propose, approve, build, check in the browser." },
    { actor: "You", action: "Open both and compare." },
  ],
  decision: {
    constraint: "Version A had to stay untouched so the comparison stays honest.",
    tradeoff: "Its rough edges are kept on purpose, including the ones a quick fix would hide.",
    shipped: "Two versions on one domain, with the prompt that made Version A published in the README.",
    changed: "Version B became the portfolio; the experiment became one of its projects.",
  },
  decisions: [
    "Both versions share one data file for the facts, so the only variable is the prompt and the process.",
    "Version B's previews on the experiment page are captures of the current site.",
  ],
  stack: ["Next.js", "TypeScript", "Tailwind CSS"],
  links: [
    { label: "Read the experiment", href: "/experiment" },
    { label: "Open Version A", href: "/version-a" },
  ],
  cover: {
    src: publicUrl("/images/landing/a-desktop.jpg"),
    alt: "Version A of the portfolio: a pale page with a plain list of sections.",
    width: 1440,
    height: 3848,
    frame: "browser",
  },
  screens: [],
});

/** A project's field colours as CSS variables, for its section or case page. */
export function fieldStyle(project: Project) {
  return {
    "--field": project.field,
    "--field-ink": project.fieldInk,
    "--field-muted": project.fieldMuted,
    "--accent": project.accent,
  } as CSSProperties;
}

export const projectById = Object.fromEntries(
  projects.map((project) => [project.id, project]),
) as Record<ProjectId, Project>;

export function nextProject(id: ProjectId) {
  const index = projects.findIndex((project) => project.id === id);
  return projects[(index + 1) % projects.length];
}

export function previousProject(id: ProjectId) {
  const index = projects.findIndex((project) => project.id === id);
  return projects[(index - 1 + projects.length) % projects.length];
}

/** Third-party pictures used on the site, credited in the footer. */
export const photoCredits = [
  {
    file: "alula-night-sky.jpg",
    text: "Night sky between the mountains of AlUla, Saudi Press Agency, CC BY-SA 4.0, via Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:%D8%A7%D9%84%D8%B3%D9%85%D8%A7%D8%A1_%D9%85%D9%86_%D8%A8%D9%8A%D9%86_%D8%AC%D8%A8%D8%A7%D9%84_%D8%A7%D9%84%D8%B9%D9%84%D8%A7.jpg",
  },
];
