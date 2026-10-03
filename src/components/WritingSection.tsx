import { ArrowUpRight } from '@/components/slab'
import { WRITING } from '@/data/writing'

/**
 * Technical Writing: one card per document - the cover, v4's description, its
 * tags, and a button that opens the real Google Slides / Doc in a new tab.
 * Reuses the app-card look (image well, hover lift) so it matches the rest of
 * the Projects dialogs.
 */
export function WritingSection() {
  return (
    <section className="projects projects--apps projects--writing" aria-label="Technical writing" data-reveal>
      <div className="projects__panel">
        <ul className="projects__apps" role="list">
          {WRITING.map((w) => (
            <li key={w.slug} className="app-card" style={{ ['--app-color' as string]: 'var(--orange)' }}>
              <div className="app-card__img-wrap">
                <img className="app-card__img" src={w.cover} alt={`${w.title} cover`} loading="lazy" decoding="async" />
                <span className="app-card__img-fade" aria-hidden="true" />
              </div>
              <div className="app-card__body">
                <h3 className="app-card__name">{w.title}</h3>
                <p className="app-card__desc">{w.desc}</p>
                <ul className="wcard__tags" role="list">
                  {w.tags.map((t) => (
                    <li key={t} className="wcard__tag">
                      {t}
                    </li>
                  ))}
                </ul>
                <a className="wcard__link" href={w.link} target="_blank" rel="noopener noreferrer">
                  Open document
                  <ArrowUpRight size={15} weight="bold" aria-hidden="true" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
