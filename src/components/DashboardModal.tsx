import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, CaretLeft, CaretRight } from '@/components/slab'
import { DASHBOARDS, FAKE_HOST, type DashboardItem } from '@/data/dataviz'
import { useIsPhone } from '@/hooks/useMediaQuery'
import type { BarrelItem } from './FunnelBarrel'

/**
 * The Data Visualizations viewer: the browser-chrome dialog from the funnel
 * modal, but the frame shows one screenshot (through /photo-frame.html, so a
 * tall dashboard scrolls inside the frame) and a footer below it carries the
 * text for whatever is on screen - dashboard name and description, then the
 * workbook's name and paragraph. Arrows step through the other dashboards of
 * the same workbook; the footer follows.
 */
export function useDashboardModal() {
  const [current, setCurrent] = useState<DashboardItem | null>(null)
  const phone = useIsPhone()
  // Workbook paragraph: open on desktop, tucked away on a phone so the
  // screenshot keeps the room. Once the visitor toggles it, it stays that way.
  const [wbOpen, setWbOpen] = useState(!phone)
  const lastTriggerRef = useRef<HTMLElement | null>(null)
  const closeRef = useRef<HTMLButtonElement | null>(null)

  const openItem = useCallback((item: BarrelItem, trigger?: HTMLElement | null) => {
    const next = DASHBOARDS.find((d) => d.key === item.key)
    if (!next) return
    lastTriggerRef.current = trigger ?? (document.activeElement as HTMLElement | null)
    setCurrent(next)
  }, [])

  const close = useCallback(() => {
    setCurrent(null)
    requestAnimationFrame(() => lastTriggerRef.current?.focus())
  }, [])

  const step = useCallback((dir: 1 | -1) => {
    setCurrent((cur) => {
      if (!cur) return cur
      const siblings = DASHBOARDS.filter((d) => d.workbook === cur.workbook)
      const next = siblings[(cur.index + dir + siblings.length) % siblings.length]
      return next ?? cur
    })
  }, [])

  const isOpen = current !== null
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') step(1)
      else if (e.key === 'ArrowLeft') step(-1)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => closeRef.current?.focus())
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, close, step])

  let modal = null
  if (current) {
    const { workbook, dashboard, index } = current
    const count = workbook.dashboards.length
    modal = createPortal(
      <div
        className="funnels__modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${dashboard.name} - ${workbook.name}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) close()
        }}
      >
        <div className="funnels__modal-shell">
          <div className="funnels__modal-bar">
            <div className="funnels__modal-lights" aria-hidden="true">
              <span className="funnels__modal-light funnels__modal-light--red" />
              <span className="funnels__modal-light funnels__modal-light--amber" />
              <span className="funnels__modal-light funnels__modal-light--green" />
            </div>
            <div className="funnels__modal-url" aria-hidden="true">
              <span className="funnels__modal-url-scheme">{FAKE_HOST}</span>
              <span className="funnels__modal-url-path">{current.fakePath}</span>
            </div>
            <div className="funnels__modal-actions">
              <button ref={closeRef} type="button" className="funnels__modal-close" onClick={close} aria-label="Close preview">
                <X weight="bold" size={18} aria-hidden="true" />
              </button>
            </div>
          </div>

          <iframe
            key={current.key}
            className="dvmodal__frame"
            src={`/photo-frame.html?src=${encodeURIComponent(current.src)}`}
            title={dashboard.name}
            sandbox="allow-same-origin allow-forms allow-scripts allow-popups"
          />

          <footer className="dvmodal__foot">
            <div className="dvmodal__row">
              {count > 1 && (
                <button type="button" className="dvmodal__step" onClick={() => step(-1)} aria-label="Previous dashboard">
                  <CaretLeft size={18} weight="bold" aria-hidden="true" />
                </button>
              )}
              <div className="dvmodal__titles">
                <h3 className="dvmodal__name">{dashboard.name}</h3>
                {count > 1 && (
                  <span className="dvmodal__count" aria-live="polite">
                    {index + 1} of {count}
                  </span>
                )}
              </div>
              {count > 1 && (
                <button type="button" className="dvmodal__step" onClick={() => step(1)} aria-label="Next dashboard">
                  <CaretRight size={18} weight="bold" aria-hidden="true" />
                </button>
              )}
            </div>
            {dashboard.desc && <p className="dvmodal__desc">{dashboard.desc}</p>}
            <details className="dvmodal__wb" open={wbOpen} onToggle={(e) => setWbOpen(e.currentTarget.open)}>
              <summary>
                <span className="dvmodal__wb-label">Workbook</span>
                <span className="dvmodal__wb-name">{workbook.name}</span>
              </summary>
              <p className="dvmodal__wb-desc">{workbook.desc}</p>
            </details>
          </footer>
        </div>
      </div>,
      document.body,
    )
  }

  return { openItem, modal }
}
