import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from '@/components/slab'

/**
 * WorkflowSamples
 *
 * A horizontally scrolling marquee of project screenshots. The strip loops
 * seamlessly; clicking any frame opens the full image in a faux macOS window
 * over the page. Swap the images in SAMPLES for your own.
 *
 * Marquee: the list is duplicated so the CSS keyframe can translate -50% and
 * land the reset on a seamless seam. The track pauses on hover/focus so frames
 * are easy to click. The duplicate half is aria-hidden + removed from the tab
 * order so screen readers and keyboard users see each frame once.
 *
 * Modal: createPortal to body (escapes any transformed ancestor), Escape +
 * backdrop close, body scroll lock, focus moved into the dialog and returned to
 * the trigger on close - the same pattern as the other in-page previews.
 */

export type Sample = { src: string; label: string }

const DEFAULT_SAMPLES: Sample[] = ['project-1.jpg', 'project-2.jpg', 'project-3.jpg', 'project-4.jpg'].map((file, i) => ({
  src: `/placeholders/${encodeURIComponent(file)}`,
  label: `Project Screenshot ${i + 1}`,
}))

const DEFAULT_CAPTION = 'PLACEHOLDER - tell me what to put here: one line on what these screenshots show.'

type Props = {
  /** The screenshots. Defaults to the template's four placeholders. */
  samples?: Sample[]
  /** Line above the strip; null hides it. */
  caption?: string | null
  /** Minimum frames per half of the loop. A short list is repeated until a
   *  half is at least this long, so it still fills a wide screen. */
  fill?: number
}

export default function WorkflowSamples({ samples = DEFAULT_SAMPLES, caption = DEFAULT_CAPTION, fill = 0 }: Props) {
  const n = samples.length
  const reps = fill > 0 ? Math.max(1, Math.ceil(fill / n)) : 1
  const doubled = useMemo(() => {
    const half = Array.from({ length: reps }, () => samples).flat()
    return [...half, ...half]
  }, [samples, reps])

  const [active, setActive] = useState<Sample | null>(null)
  const lastTriggerRef = useRef<HTMLElement | null>(null)
  const closeRef = useRef<HTMLButtonElement | null>(null)

  const open = useCallback((s: Sample, trigger: HTMLElement | null) => {
    lastTriggerRef.current = trigger ?? (document.activeElement as HTMLElement | null)
    setActive(s)
  }, [])

  const close = useCallback(() => {
    setActive(null)
    requestAnimationFrame(() => lastTriggerRef.current?.focus())
  }, [])

  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => closeRef.current?.focus())
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [active, close])

  return (
    <section className="wfs" id="workflow-samples" aria-labelledby="wfs-heading" data-reveal>
      {caption !== null && (
        <p className="wfs__caption" id="wfs-heading">
          {caption}
        </p>
      )}

      <div className="wfs__strip">
        {/* Longer loops get a longer duration so the drift keeps the same pace. */}
        <div className="wfs__track" style={reps > 1 ? { animationDuration: `${doubled.length * 8}s` } : undefined}>
          {doubled.map((s, i) => {
            const clone = i >= n
            return (
              <button
                key={`${s.src}-${i}`}
                type="button"
                className="wfs__frame"
                onClick={(e) => open(s, e.currentTarget)}
                aria-hidden={clone || undefined}
                tabIndex={clone ? -1 : undefined}
                aria-label={clone ? undefined : `Open ${s.label} screenshot`}
              >
                <span className="wfs__frame-bar" aria-hidden="true">
                  <span className="wfs__dot wfs__dot--r" />
                  <span className="wfs__dot wfs__dot--y" />
                  <span className="wfs__dot wfs__dot--g" />
                </span>
                <img
                  className="wfs__img"
                  src={s.src}
                  alt={clone ? '' : `${s.label} screenshot`}
                  loading="lazy"
                  decoding="async"
                />
              </button>
            )
          })}
        </div>
      </div>

      {active &&
        createPortal(
          <div
            className="wfs__modal"
            role="dialog"
            aria-modal="true"
            aria-label={`${active.label} screenshot`}
            onClick={(e) => {
              if (e.target === e.currentTarget) close()
            }}
          >
            <div className="wfs__window">
              <div className="wfs__bar">
                <span className="wfs__bar-dots" aria-hidden="true">
                  <span className="wfs__dot wfs__dot--r" />
                  <span className="wfs__dot wfs__dot--y" />
                  <span className="wfs__dot wfs__dot--g" />
                </span>
                <span className="wfs__bar-title">{active.label}</span>
                <button
                  ref={closeRef}
                  type="button"
                  className="wfs__close"
                  onClick={close}
                  aria-label="Close image"
                >
                  <X weight="bold" size={18} aria-hidden="true" />
                </button>
              </div>
              <div className="wfs__imgwrap">
                <img className="wfs__full" src={active.src} alt={`${active.label} screenshot`} />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </section>
  )
}
