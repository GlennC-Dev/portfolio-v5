/**
 * Technical Writing: v4's training decks and knowledge article, text word for
 * word. Each card shows the cover (the first screenshot) and links out to the
 * real document, so the full pages never have to be screenshotted here.
 *
 * ADDING ONE: drop the cover image in public/project-photos/ and add an entry
 * below (title, description, tags, the share link, the cover path).
 *
 * Lean Six Sigma for Financial Analysis is deliberately not here - it gets its
 * own tile.
 */

export type WritingItem = {
  slug: string
  title: string
  desc: string
  tags: string[]
  /** The shared Google Slides / Docs link the card opens in a new tab. */
  link: string
  cover: string
}

export const WRITING: WritingItem[] = [
  {
    slug: 'training-deck-for-time-management-techniques',
    title: 'Training Deck for Time Management Techniques',
    desc: 'Created a time management training deck for analysts, blending research and firsthand experience into a practical guide for improving focus, prioritization, and daily workflow discipline. Covers proven methodologies like \'Eat That Frog\' and Time Blocking.',
    tags: ['Training', 'Project Management'],
    link: 'https://docs.google.com/presentation/d/13qrHcai4HhWmjIRKk5eMt6jfP0OCQZDVu0VybFjZCiU/edit?usp=sharing',
    cover: '/project-photos/projects_casetechwriting_2_timemgmt_1.png',
  },
  {
    slug: 'ai-assisted-online-portfolio-building-for-analysts',
    title: 'AI-Assisted Online Portfolio Building for Analysts',
    desc: 'Developed a training deck to teach associates prompt engineering and no-code tools, empowering them to build personalized online portfolios that showcase their skills without needing web development experience. Covers the full workflow from Lovable.dev creation to GitHub Pages deployment.',
    tags: ['Training', 'Lovable.dev', 'GitHub', 'Prompt Engineering'],
    link: 'https://docs.google.com/presentation/d/1a64xQIAgWnZJ03lF7aFuHV_2zsB5NDLU6uvUPovmBUM/edit?usp=sharing',
    cover: '/project-photos/projects_casetechwriting_3_portfoliobuilding_1.png',
  },
  {
    slug: 'knowledge-article-for-sip101',
    title: 'Knowledge Article for SIP101',
    desc: 'Authored a SIP101 training article and companion deck to establish core VoIP fundamentals, equipping agents and support staff with a framework for accurate issue identification and deeper product understanding. Covers SIP call flow, registration, and end-to-end communication workflows.',
    tags: ['Technical Writing', 'VoIP', 'SIP', 'Training'],
    link: 'https://docs.google.com/document/d/1YjFRY2uslpvf3HjItRL5uxJ8mJ-IJilxvys72gEXG8g/edit?usp=sharing',
    cover: '/project-photos/projects_casetechwriting_4_sip_1.png',
  },
]
