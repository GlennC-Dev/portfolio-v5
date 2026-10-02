import { useState } from 'react'
import { CaretDown } from '@/components/slab'
import { mainExperience, hiddenExperience, type ExpItem } from '@/data/experience'

/**
 * ExperienceTimeline - v4's work history on the Services glass.
 * The two most recent roles always show their bullets; the older four are
 * click-to-open, company name visible even when collapsed.
 */

function Bullets({ bullets }: { bullets: string[] }) {
  return (
    <ul className="sgrid__exp-bullets" role="list">
      {bullets.map((b, i) => (
        <li key={i} className="sgrid__exp-bullet">
          <span dangerouslySetInnerHTML={{ __html: b }} />
        </li>
      ))}
    </ul>
  )
}

function Role({ item }: { item: ExpItem }) {
  return (
    <article className="sgrid__exp-item">
      <div className="sgrid__exp-role-row">
        <h3 className="sgrid__exp-role">{item.role}</h3>
        <span className="sgrid__exp-period">{item.period}</span>
      </div>
      <div className="sgrid__exp-company">{item.company}</div>
      {item.bullets && <Bullets bullets={item.bullets} />}
    </article>
  )
}

function EarlierRole({ item, open, onToggle }: { item: ExpItem; open: boolean; onToggle: () => void }) {
  return (
    <article className="sgrid__exp-item sgrid__exp-item--earlier">
      <button type="button" className="sgrid__exp-toggle" aria-expanded={open} onClick={onToggle}>
        <span>
          <span className="sgrid__exp-role-row">
            <span className="sgrid__exp-role">{item.role}</span>
            <span className="sgrid__exp-period">{item.period}</span>
          </span>
          <span className="sgrid__exp-company">{item.company}</span>
        </span>
        <CaretDown size={16} weight="bold" className={`sgrid__exp-caret${open ? ' is-open' : ''}`} aria-hidden="true" />
      </button>
      {open && item.bullets && <Bullets bullets={item.bullets} />}
    </article>
  )
}

export default function ExperienceTimeline() {
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set())
  const toggle = (i: number) =>
    setOpenIndices((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })

  return (
    <section className="sgrid__exp" aria-labelledby="experience-title">
      <header className="sgrid__exp-head">
        <span className="sgrid__exp-eyebrow">Work History</span>
        <h2 className="sgrid__exp-title" id="experience-title">Experience</h2>
      </header>
      <div className="sgrid__exp-timeline">
        {mainExperience.map((item) => (
          <Role key={item.role + item.period} item={item} />
        ))}
        <div className="sgrid__exp-earlier-label">Earlier roles</div>
        {hiddenExperience.map((item, i) => (
          <EarlierRole key={item.role + item.period} item={item} open={openIndices.has(i)} onToggle={() => toggle(i)} />
        ))}
      </div>
    </section>
  )
}
