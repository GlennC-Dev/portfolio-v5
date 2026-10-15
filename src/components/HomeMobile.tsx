import { Link } from 'react-router-dom'
import { SealCheck, ArrowUpRight, Play, Coffee, Briefcase, Medal } from '@/components/slab'
import { profile } from '@/data/profile'
import { isHiddenView } from '@/data/hiddenViews'
import { mainExperience, hiddenExperience } from '@/data/experience'
import { CERTIFICATIONS } from '@/data/certifications'
import ThemeButton from './ThemeButton'

/**
 * Home on a phone, the parts the rail and the bento used to carry:
 *
 *   HomeProfile  avatar, name, verified mark, handle and the theme switch -
 *                the rail's identity block, laid flat
 *   HomeStats    three proof facts (profile.stats)
 *   HomeExplore  one tile per rail view in a snap row, then the first
 *                testimonial as a proof card
 */

export function HomeProfile() {
  return (
    <header className="hprofile">
      <img className="hprofile__avatar" src={profile.avatarSrc} alt="" width={56} height={56} />
      <div className="hprofile__who">
        <span className="hprofile__name">
          {profile.name}
          <SealCheck size={16} weight="fill" className="hprofile__verified" aria-label={profile.verifiedLabel} />
        </span>
        <span className="hprofile__handle">
          {profile.handle} · {profile.role}
        </span>
      </div>
      <ThemeButton className="hprofile__theme" />
    </header>
  )
}

export function HomeStats() {
  return (
    <ul className="hstats" role="list">
      {profile.stats.map((s, i) => (
        <li key={i}>
          <b>{s.value}</b>
          <span>{s.label}</span>
        </li>
      ))}
    </ul>
  )
}

// Skills & Experience tile: two chip rows drifting against each other, built from
// the same records the Skills page renders, so the names always match.
const pick = <T,>(list: T[], key: (x: T) => string, names: string[]) =>
  names.map((n) => list.find((x) => key(x) === n)).filter((x): x is T => Boolean(x))
const ROLE_CHIPS = pick(
  [...mainExperience, ...hiddenExperience],
  (e) => e.role,
  ['Reports and Automation Specialist', 'Operational Business Insights Analyst', 'Project Specialist'],
).map((e) => ({ name: e.role, Icon: Briefcase }))
const CRED_CHIPS = pick(
  CERTIFICATIONS,
  (c) => c.name,
  ['Lean Six Sigma Yellow Belt', 'Lean Six Sigma Green Belt', 'Python Mastery', 'SQL Basics'],
).map((c) => ({ name: c.name, Icon: Medal }))
const SKILLS_CHIP_ROWS = [ROLE_CHIPS, CRED_CHIPS]

const TILES = [
  { n: '01', label: 'Projects', to: '/projects', title: 'Every solution shipped.', desc: 'What it solved, how it works, and what came out the other end.', img: '/project-photos/thumbs/projects_tile_mobile.jpg' },
  { n: '02', label: 'Skills & Experience', to: '/services', title: "What I bring. How I've applied it.", desc: "Years of fixing things by hand, then building so I don't have to.", chips: true, dark: true },
  { n: '03', label: 'Showcase', to: '/showcase', title: 'PLACEHOLDER - your flagship', desc: 'Tell me what to put here.', Icon: Coffee, dark: true, accent: true },
  { n: '04', label: 'Testimonials', to: '/testimonials', title: 'PLACEHOLDER - testimonials headline', desc: 'Tell me what to put here.', img: '/placeholders/testimonial-1.jpg' },
  { n: '05', label: 'About', to: '/about', title: `Hi, I'm ${profile.firstName}.`, desc: 'PLACEHOLDER - one line about you.', img: profile.avatarSrc },
] as const

// Numbers follow what is actually shown, so hiding a tile never leaves a gap (01, 02, 05).
const VISIBLE_TILES = TILES.filter((t) => !isHiddenView(t.to))

export function HomeExplore() {
  return (
    <>
      <div className="hsec">
        <h2 className="hsec__title">Explore</h2>
        <span className="hsec__aside">Swipe</span>
      </div>
      <ul className="htiles" role="list">
        {VISIBLE_TILES.map((t, i) => (
          <li key={t.to}>
            <Link to={t.to} className={`htile${'dark' in t && t.dark ? ' htile--dark' : ''}${'accent' in t && t.accent ? ' htile--accent' : ''}`}>
              <span className="htile__n">{String(i + 1).padStart(2, '0')} {t.label}</span>
              {'img' in t ? (
                <img className="htile__img" src={t.img} alt="" loading="lazy" />
              ) : 'chips' in t ? (
                <span className="htile__chips" aria-hidden="true">
                  {SKILLS_CHIP_ROWS.map((row, r) => (
                    <span key={r} className="bento__chip-row" data-dir={r ? 'right' : 'left'}>
                      <span className="bento__chip-track">
                        {Array.from({ length: 4 }, () => row).flat().map((c, i) => (
                          <span key={`${c.name}-${i}`} className="bento__chip">
                            <c.Icon size={15} weight="duotone" />
                            {c.name}
                          </span>
                        ))}
                      </span>
                    </span>
                  ))}
                </span>
              ) : (
                <span className="htile__glyph"><t.Icon size={52} weight="duotone" aria-hidden="true" /></span>
              )}
              <span className="htile__body">
                <span className="htile__title">{t.title}</span>
                <span className="htile__desc">{t.desc}</span>
              </span>
              <span className="htile__go" aria-hidden="true"><ArrowUpRight size={16} weight="bold" /></span>
            </Link>
          </li>
        ))}
      </ul>

      {!isHiddenView('/testimonials') && (
        <>
      <div className="hsec">
        <h2 className="hsec__title">What clients say</h2>
        <Link to="/testimonials" className="hsec__aside">See all</Link>
      </div>
      <Link to="/testimonials" className="hproof">
        <span className="hproof__thumb">
          <img src="/placeholders/testimonial-1.jpg" alt="" width={96} height={96} loading="lazy" />
          <span className="hproof__play" aria-hidden="true"><Play size={14} weight="fill" /></span>
        </span>
        <span className="hproof__copy">
          <span className="hproof__kicker">Client testimonial · 0:00</span>
          <span className="hproof__title">PLACEHOLDER - tell me what to put here: a one-line teaser for your best testimonial.</span>
          <span className="hproof__meta">PLACEHOLDER - client role</span>
        </span>
      </Link>
        </>
      )}
    </>
  )
}
