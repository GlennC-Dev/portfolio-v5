import type { CSSProperties } from 'react'
import { ArrowUpRight, MapPin } from '@/components/slab'
import { profile } from '@/data/profile'

/**
 * AboutGrid - the About view as a fixed viewport.
 *
 * One glass sheet, two columns: who you are on the left, the illustration
 * on the right. Sized to the panel, so nothing here scrolls.
 *
 * The left column is a ladder, not a paragraph block: one display statement,
 * one line of context, then the four things you do - each carrying the marks
 * of the tools it is built with. The tools are the proof, so they are the
 * visual. Swap the marks below for your own (any square SVG/PNG in public/).
 */

// 👈 Icon sourcing note (brought over from v4's own comment): Tableau, Power BI, Salesforce and
// Power Query have no real marks available — same trademark-exclusion situation as the Daily
// Drivers row on Home. Those four, plus the Lean Six Sigma mark (not a software tool, so there's
// no brand mark to use at all), are generic original stand-ins, not official logos. n8n, Google
// Apps Script, Claude, and Gemini have real marks and use them.
const TABLEAU = { src: '/icons/tableau-generic.svg', name: 'Tableau' }
const POWERBI = { src: '/icons/powerbi-generic.svg', name: 'Power BI' }
const SALESFORCE = { src: '/icons/salesforce-generic.svg', name: 'Salesforce' }
const N8N = { src: '/icons/ai/n8n.svg', name: 'n8n' }
const APPSSCRIPT = { src: '/icons/appsscript.svg', name: 'Apps Script' }
const POWERQUERY = { src: '/icons/powerquery-generic.svg', name: 'Power Query' }
const CLAUDE = { src: '/icons/ai/claude-color.svg', name: 'Claude' }
const GEMINI = { src: '/icons/gemini.svg', name: 'Gemini' }
const LSS = { src: '/icons/lss-generic.svg', name: 'Lean Six Sigma' }

type Capability = {
  index: string
  title: string
  marks: { src: string; name: string }[]
}

// 👈 v4 had exactly 3 of these (BI Developer / Automation Specialist / AI-Enabled LSS
// Practitioner) — the template's 4th slot is dropped rather than invented.
const CAPABILITIES: Capability[] = [
  {
    index: '01',
    title: 'BI Developer',
    marks: [TABLEAU, POWERBI, SALESFORCE],
  },
  {
    index: '02',
    title: 'Automation Specialist',
    marks: [N8N, APPSSCRIPT, POWERQUERY],
  },
  {
    index: '03',
    title: 'AI-Enabled LSS Practitioner',
    marks: [CLAUDE, GEMINI, LSS],
  },
]

export default function AboutGrid() {
  return (
    <section className="pgrid agrid" aria-labelledby="about-title">
      <header className="pgrid__head">
        <span className="pgrid__eyebrow">About</span>
        <h1 className="pgrid__title" id="about-title">
          {`Hi, I’m ${profile.firstName}.`}
        </h1>
        <p className="pgrid__lede">
          I find what's broken before it breaks everyone else's day.
        </p>
      </header>

      <div className="home__glass agrid__glass">
        <div className="agrid__copy">
          <p className="agrid__lead">
            I came up through the phones.
            <span> That's where I learned that bad data costs more than no data. Everything I've built since has been an attempt to fix that.</span>
          </p>

          <p className="agrid__note">
            Data work taught me that the number everyone trusts is often the number nobody
            questions. I'm the one who checks it — then builds something so it doesn't need
            checking again.
          </p>

          <ul className="agrid__caps" role="list">
            {CAPABILITIES.map((c) => (
              <li key={c.index} className="agrid__cap">
                <span className="agrid__cap-marks">
                  {c.marks.map((m, i) => (
                    <span
                      key={m.name}
                      className="agrid__mark"
                      style={{ '--i': c.marks.length - i } as CSSProperties}
                    >
                      <img src={m.src} alt={m.name} loading="lazy" decoding="async" />
                    </span>
                  ))}
                </span>
                <span className="agrid__cap-title">{c.title}</span>
                <span className="agrid__cap-index" aria-hidden="true">
                  {c.index}
                </span>
              </li>
            ))}
          </ul>

          {/* One plate, two cells sharing a mark / title / meta anatomy. */}
          <div className="agrid__bar">
            <span className="agrid__cell">
              <span className="agrid__cell-mark agrid__cell-mark--img">
                <img src="/icons/lss-generic.svg" alt="" loading="lazy" decoding="async" />
              </span>
              <span className="agrid__cell-copy">
                <span className="agrid__cell-title">Lean Six Sigma Green Belt</span>
                <span className="agrid__cell-meta">PLACEHOLDER - credential ID</span>
              </span>
            </span>

            <span className="agrid__cell">
              <span className="agrid__cell-mark">
                <MapPin size={16} weight="fill" aria-hidden="true" />
              </span>
              <span className="agrid__cell-copy">
                <span className="agrid__cell-title">{profile.location}</span>
                <span className="agrid__cell-meta">Timezone · working hours</span>
              </span>
            </span>

            {/* PLACEHOLDER - no v4 equivalent for a community/affiliation link; left as the
                template's own placeholder rather than inventing one. */}
            <a className="agrid__cell agrid__cell--wide" href="#">
              <span className="agrid__cell-mark agrid__cell-mark--plain">
                <img src="/placeholders/logo.svg" alt="" loading="lazy" decoding="async" />
              </span>
              <span className="agrid__cell-copy">
                <span className="agrid__cell-title">Community or affiliation</span>
                <span className="agrid__cell-meta">Your role there</span>
              </span>
              <ArrowUpRight className="agrid__cell-go" size={15} weight="bold" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="agrid__portrait">
          <img
            src="/site-photos/about-illustration.png"
            alt="Illustration of Glenn at a laptop surrounded by dashboards, charts and AI panels"
            loading="eager"
            decoding="async"
            width={1200}
            height={896}
          />
        </div>
      </div>
    </section>
  )
}
