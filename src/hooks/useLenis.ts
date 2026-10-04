import { useEffect } from 'react'

/**
 * The shell pins the page to the viewport and scrolls this element instead of
 * the document from 1100px up, so scroll reads must target it, not `window`.
 */
export const SCROLLER_ID = 'main-content'

export function getScroller(): HTMLElement | null {
  return document.getElementById(SCROLLER_ID)
}

/**
 * Native scrolling only (Lenis smooth-scroll was removed for input lag).
 * This hook just keeps in-page anchor links (#top, #section) gliding inside
 * the scrolling panel, which `html { scroll-behavior }` cannot reach.
 */
export function useLenis() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const onAnchorClick = (e: MouseEvent) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
      const link = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]')
      if (!link) return
      const href = link.getAttribute('href')
      if (!href || href === '#' || href === `#${SCROLLER_ID}`) return

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const behavior: ScrollBehavior = reduced ? 'auto' : 'smooth'
      const panel = getScroller()
      const panelScrolls = !!panel && window.innerWidth >= 1100

      if (href === '#top') {
        e.preventDefault()
        if (panelScrolls) panel!.scrollTo({ top: 0, behavior })
        else window.scrollTo({ top: 0, behavior })
        history.replaceState(null, '', ' ')
        return
      }
      const target = document.querySelector(href) as HTMLElement | null
      if (!target) return
      e.preventDefault()
      target.scrollIntoView({ behavior, block: 'start' })
      history.replaceState(null, '', href)
    }

    document.addEventListener('click', onAnchorClick)
    return () => document.removeEventListener('click', onAnchorClick)
  }, [])
}
