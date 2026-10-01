/**
 * YOUR IDENTITY - start here.
 *
 * Everything that says who you are lives in this file: name, handle, photo,
 * socials, email and the Home headline. Every value below is a PLACEHOLDER.
 * Replace the text, or hand this file to your AI assistant and tell it what
 * to put in each field.
 *
 * Page-specific copy (projects, services, testimonials, FAQs) lives in the
 * other files in src/data/ and at the top of each view component.
 */

export type SocialLink = {
  label: string
  href: string
  iconPath: string
}

export type Stat = { value: string; label: string }

export type Profile = {
  name: string
  /** First name, used in "Hi, I'm ___." on About. */
  firstName: string
  handle: string
  /** Short role line under the handle on phones. */
  role: string
  /** Square image. An SVG, WebP or PNG with a transparent background looks best. */
  avatarSrc: string
  /** Tooltip / screen-reader label on the verified tick next to your name. */
  verifiedLabel: string
  email: string
  location: string
  /** Three short proof facts shown on phones under the Home lede. */
  stats: Stat[]
  displayName: { line1: string; line2: string }
  hero: {
    body: string
    portraitSrc: string
    portraitAlt: string
  }
  socials: SocialLink[]
}

export const profile: Profile = {
  name: 'Glenn Charifa',
  firstName: 'Glenn',
  handle: '@yourhandle',
  role: 'Data and Automation',
  avatarSrc: '/site-photos/avatar.png',
  verifiedLabel: 'PLACEHOLDER - what the tick means (e.g. a certification)',
  email: 'you@example.com',
  location: 'Manila, Philippines (GMT+8)',
  stats: [
    { value: '12 Yrs', label: 'In Ops' },
    { value: 'LSSGB', label: 'Certified' },
    { value: 'GMT+8', label: 'Manila' },
  ],
  // The intro types this line, then flies it into the Home headline.
  // Keep it short: two halves, 5-8 words total.
  displayName: { line1: 'Automate the Build.', line2: 'Trust the Output.' },
  hero: {
    body: 'I design the systems that turn messy processes into pipelines — then make sure what comes out the other end is actually right.',
    portraitSrc: '/site-photos/avatar.png',
    portraitAlt: 'Glenn Charifa',
  },
  socials: [
    { label: 'Facebook profile', href: '#', iconPath: '/icons/facebook.svg' },
    { label: 'LinkedIn profile', href: '#', iconPath: '/icons/linkedin.svg' },
    { label: 'Discord profile', href: '#', iconPath: '/icons/discord.svg' },
  ],
}
