import type { CSSProperties } from 'react'
import { MagnifyingGlass, Wrench, Lightning, CheckCircle } from '@/components/slab'
import type { Icon } from '@/components/slab'
import Autopilot, { TOOLS } from '@/components/Autopilot'

/**
 * ServicesGrid - the Services view on one glass sheet.
 *
 * Three bands, top to bottom: your three-step method (on a dark plate so it
 * is the first thing the eye lands on), the five services as cards that carry
 * the marks of what each one is built with, and the live automation demo
 * scaled into whatever height is left. Same object language as Home and
 * Projects: the glass, the bento card, plated marks, orange for the index
 * and the accent.
 *
 * Every string below is a PLACEHOLDER. Replace it, or hand this file to your
 * AI assistant and tell it what to put in each spot.
 */

/* ---------- The method ---------- */

type Stage = {
  index: string
  label: string
  body: string
  Icon: Icon
  chips: string[]
}

const STAGES: Stage[] = [
  {
    index: '01',
    label: 'Probe',
    body: "Understand the actual problem — not the one described, the real one. Requirements don't always say what they mean. I ask until they do.",
    Icon: MagnifyingGlass,
    chips: ['Requirements', 'Stakeholder Interviews'],
  },
  {
    index: '02',
    label: 'Build',
    body: 'Design the system that solves it. Not the most complex one. The right one — reliable, maintainable, and built to last past the first week.',
    Icon: Wrench,
    chips: ['Systems Design', 'Maintainability'],
  },
  {
    index: '03',
    label: 'Automate',
    body: "Make it run itself. If someone still has to touch it every day, the job isn't done.",
    Icon: Lightning,
    chips: ['Scripting', 'Triggers'],
  },
]

/* ---------- The services ---------- */

type Service = {
  index: string
  title: string
  description: string
  chip: string
  bullets: string[]
}

const SERVICES: Service[] = [
  {
    index: '01',
    title: 'Business Intelligence',
    description: 'The right number, in the right hands, without asking for it',
    chip: 'Decisions that land',
    bullets: [
      'Dashboards built for the person acting on them',
      'Multiple sources, one coherent view',
      'Self-service — no manual pulls needed',
    ],
  },
  {
    index: '02',
    title: 'Workflow Automation',
    description: 'Built once. Runs forever.',
    chip: 'Zero manual effort',
    bullets: [
      'Repetitive tasks replaced with pipelines',
      'Systems that update and deliver on their own',
      'Humans freed for work that actually needs them',
    ],
  },
  {
    index: '03',
    title: 'AI-Enabled Operations',
    description: 'AI that works for you — not the other way around',
    chip: 'Practical, not reckless',
    bullets: [
      'Get more from tools already in your stack',
      'The right prompt beats the fanciest model',
      'Adoption built on understanding, not hype',
    ],
  },
  {
    index: '04',
    title: 'Process Improvement',
    description: 'Fix the process, not just the symptom',
    chip: 'Less waste, more output',
    bullets: [
      'Root cause first, solution second',
      'LSS Green Belt-backed methodology',
      'Improvements that hold past the first week',
    ],
  },
]

/* ---------- The page ---------- */

export default function ServicesGrid() {
  return (
    <section className="pgrid sgrid" aria-labelledby="services-title">
      <header className="pgrid__head">
        <span className="pgrid__eyebrow">Skills &amp; Capabilities</span>
        <h1 className="pgrid__title" id="services-title">
          What I bring. <em>How</em> I&apos;ve applied it.
        </h1>
        <p className="pgrid__lede">
          Backed by years of actually being the one who had to fix things by hand.
        </p>
      </header>

      <div className="home__glass sgrid__glass">
        {/* One dark plate, the headline on the left, the three stages wired
            in order on the right with a signal running them. */}
        <div className="sgrid__method" aria-labelledby="method-title">
          <div className="sgrid__method-copy">
            <span className="sgrid__method-eyebrow">The Approach</span>
            <h2 className="sgrid__method-title" id="method-title">
              Probe. Build. Automate.
            </h2>
            <p className="sgrid__method-sub">
              A well-built system solves one problem — everything else stems from getting that one right.
            </p>
          </div>

          <ol className="sgrid__stages" role="list">
            {STAGES.map((s, i) => {
              const StageIcon = s.Icon
              return (
                <li key={s.index} className="sgrid__stage" style={{ '--i': i } as CSSProperties}>
                  <span className="sgrid__stage-ghost" aria-hidden="true">{s.index}</span>
                  <span className="sgrid__stage-icon" aria-hidden="true">
                    <StageIcon size={22} weight="duotone" />
                  </span>
                  <h3 className="sgrid__stage-label">{s.label}.</h3>
                  <p className="sgrid__stage-body">{s.body}</p>
                  <ul className="sgrid__stage-chips" role="list" aria-label={`${s.label} touches`}>
                    {s.chips.map((c) => (
                      <li key={c} className="sgrid__stage-chip">{c}</li>
                    ))}
                  </ul>
                </li>
              )
            })}
          </ol>
        </div>

        {/* Five cards, each carrying the marks of what it is built with. */}
        <div className="sgrid__offers">
          <div className="sgrid__offers-head">
            <h2 className="sgrid__offers-title">What I can do for you.</h2>
            <p className="sgrid__offers-sub">Pick one, stack a few, or leave it to me.</p>
          </div>
          <ul className="bento sgrid__services" role="list">
            {SERVICES.map((s) => (
              <li key={s.title} className="bento__card sgrid__service">
                <span className="bento__head">
                  <span className="sgrid__service-top">
                    <span className="sgrid__service-index" aria-hidden="true">{s.index} / 04</span>
                  </span>
                  <span className="bento__title">{s.title}</span>
                  <span className="bento__desc">{s.description}</span>
                </span>
                <span className="sgrid__chip" aria-hidden="true">{s.chip}</span>
                <ul className="sgrid__bullets" role="list">
                  {s.bullets.map((b) => (
                    <li key={b} className="sgrid__bullet">
                      <CheckCircle size={15} weight="duotone" aria-hidden="true" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>

        {/* The live workflow. Its caption and the tool chips sit in a header
            above the window, so the canvas gets the whole glass width. */}
        <div className="sgrid__flow">
          <header className="sgrid__flow-head">
            <div className="sgrid__flow-copy">
              <span className="sgrid__flow-eyebrow">Live automation</span>
              <h2 className="sgrid__flow-title">Your automation headline.</h2>
              <p className="sgrid__flow-sub">
                PLACEHOLDER - tell me what to put here: one sentence on what this example automation does for a client.
              </p>
            </div>
            <ul className="sgrid__flow-tools" role="list" aria-label="Tools that power this flow">
              {TOOLS.map(({ Icon: ToolIcon, label }) => (
                <li key={label} className="sgrid__flow-tool">
                  <ToolIcon size={14} weight="duotone" aria-hidden="true" />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </header>
          <div className="sgrid__flow-main">
            <Autopilot compact maxScale={1.08} />
          </div>
        </div>
      </div>
    </section>
  )
}
