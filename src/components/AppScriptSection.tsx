import { ArrowRight } from '@/components/slab'
import { APPSCRIPT, type AppScriptProject } from '@/data/appscript'

/**
 * The Apps Script Reports shelf - the Technical Writing card layout, but each
 * button opens that project's screenshot strip instead of a document.
 */
export function AppScriptShelf({ onSelect }: { onSelect: (p: AppScriptProject) => void }) {
  return (
    <section className="projects projects--apps projects--appscript" aria-label="Apps Script reports" data-reveal>
      <div className="projects__panel">
        <ul className="projects__apps" role="list">
          {APPSCRIPT.map((p) => (
            <li key={p.slug} className="app-card" style={{ ['--app-color' as string]: 'var(--orange)' }}>
              <div className="app-card__img-wrap">
                <img
                  className="app-card__img"
                  src={p.shots[0].src}
                  alt={`${p.title} cover`}
                  loading="lazy"
                  decoding="async"
                />
                <span className="app-card__img-fade" aria-hidden="true" />
              </div>
              <div className="app-card__body">
                <h3 className="app-card__name">{p.title}</h3>
                <p className="app-card__desc">{p.desc}</p>
                <ul className="wcard__tags" role="list">
                  {p.tags.map((t) => (
                    <li key={t} className="wcard__tag">
                      {t}
                    </li>
                  ))}
                </ul>
                <button type="button" className="wcard__link" onClick={() => onSelect(p)}>
                  View screenshots
                  <ArrowRight size={15} weight="bold" aria-hidden="true" />
                  <span className="sr-only"> of {p.title}</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
