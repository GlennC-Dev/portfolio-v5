/**
 * Technical Writing: v4's training decks and knowledge article, text word for
 * word. Each card shows the cover (the first screenshot), links out to the real
 * document, and "View screenshots" opens a strip of the pages we captured.
 *
 * ADDING A SCREENSHOT: drop the image in public/project-photos/ and add a line
 * to that item's `shots`. The first shot is the shelf cover.
 * ADDING ONE: add an entry below (title, description, tags, share link, shots).
 *
 * Lean Six Sigma for Financial Analysis is deliberately not here - it gets its
 * own tile.
 */

export type WritingShot = {
  src: string
  /** What this page shows - the frame's label and the enlarged window's title. */
  caption: string
}

export type WritingItem = {
  slug: string
  title: string
  desc: string
  tags: string[]
  /** The shared Google Slides / Docs link the card opens in a new tab. */
  link: string
  shots: WritingShot[]
}

export const WRITING: WritingItem[] = [
  {
    slug: 'training-deck-for-time-management-techniques',
    title: 'Training Deck for Time Management Techniques',
    desc: 'Created a time management training deck for analysts, blending research and firsthand experience into a practical guide for improving focus, prioritization, and daily workflow discipline. Covers proven methodologies like \'Eat That Frog\' and Time Blocking.',
    tags: ['Training', 'Project Management'],
    link: 'https://docs.google.com/presentation/d/13qrHcai4HhWmjIRKk5eMt6jfP0OCQZDVu0VybFjZCiU/edit?usp=sharing',
    shots: [
      { src: '/project-photos/projects_casetechwriting_2_timemgmt_1.png', caption: 'Title slide: Mastering the Art of Time — Professional Techniques for Effective Time Management' },
      { src: '/project-photos/projects_casetechwriting_2_timemgmt_2.png', caption: 'Technique 2: Eat That Frog — tackling the most challenging task first to overcome procrastination and boost productivity' },
      { src: '/project-photos/projects_casetechwriting_2_timemgmt_3.png', caption: 'Technique 4: Time Blocking — allocating specific time blocks to tasks for prioritization and focused, uninterrupted work' },
    ],
  },
  {
    slug: 'ai-assisted-online-portfolio-building-for-analysts',
    title: 'AI-Assisted Online Portfolio Building for Analysts',
    desc: 'Developed a training deck to teach associates prompt engineering and no-code tools, empowering them to build personalized online portfolios that showcase their skills without needing web development experience. Covers the full workflow from Lovable.dev creation to GitHub Pages deployment.',
    tags: ['Training', 'Lovable.dev', 'GitHub', 'Prompt Engineering'],
    link: 'https://docs.google.com/presentation/d/1a64xQIAgWnZJ03lF7aFuHV_2zsB5NDLU6uvUPovmBUM/edit?usp=sharing',
    shots: [
      { src: '/project-photos/projects_casetechwriting_3_portfoliobuilding_1.png', caption: 'Title slide: Building Online Portfolios for Business Insights Analysts using AI, Lovable.dev and GitHub' },
      { src: '/project-photos/projects_casetechwriting_3_portfoliobuilding_2.png', caption: 'Workflow overview: three-step process from Lovable.dev AI creation to manual customization to GitHub Pages deployment' },
      { src: '/project-photos/projects_casetechwriting_3_portfoliobuilding_3.png', caption: 'Implementation guide: four-step process from prompt creation to live portfolio deployment with GitHub integration' },
    ],
  },
  {
    slug: 'knowledge-article-for-sip101',
    title: 'Knowledge Article for SIP101',
    desc: 'Authored a SIP101 training article and companion deck to establish core VoIP fundamentals, equipping agents and support staff with a framework for accurate issue identification and deeper product understanding. Covers SIP call flow, registration, and end-to-end communication workflows.',
    tags: ['Technical Writing', 'VoIP', 'SIP', 'Training'],
    link: 'https://docs.google.com/document/d/1YjFRY2uslpvf3HjItRL5uxJ8mJ-IJilxvys72gEXG8g/edit?usp=sharing',
    shots: [
      { src: '/project-photos/projects_casetechwriting_4_sip_1.png', caption: 'SIP Call Flow: diagram illustrating SIP trapezoid architecture with proxy servers and user agent communication' },
      { src: '/project-photos/projects_casetechwriting_4_sip_2.png', caption: 'The Registration Process: SIP endpoint registration workflow showing AOR binding and location service interaction' },
      { src: '/project-photos/projects_casetechwriting_4_sip_3.png', caption: 'SIP Communication Flow: complete call establishment process between user agents through proxy servers and DNS resolution' },
    ],
  },
]
