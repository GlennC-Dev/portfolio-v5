import { useEffect, useRef, useState } from 'react'
import { profile } from '@/data/profile'

/**
 * IntroOverlay - "probe, build, automate".
 *
 * A radial instrument that does what the work does, in three beats:
 *
 *   Probe     0.00-0.75  a radar sweep finds what is broken (orange = flagged)
 *   Build     0.75-1.50  one pulse leaves the hub and crosses the whole page.
 *                        The solid ring detects, including what nobody asked
 *                        for; the dashed ring 150ms behind fixes it. Bars grow
 *                        and spokes draw while it travels.
 *   Automate  1.50-2.10  the system runs one lap by itself
 *   Handoff   2.10-3.15  the instrument tightens away, the headline rises word
 *                        by word, then FLIES onto the real `.home__title` rect
 *                        at scale 1, and the page assembles around it
 *
 * Plays once per visit (sessionStorage), never for reduced motion, never off
 * the home route. There is deliberately no skip control: at ~3s nobody would
 * find it in time.
 *
 * The overlay paints no backdrop. `html.is-intro` (set at module load, before
 * React's first paint) hides the page instead, so the contour shader drifts
 * behind the whole sequence.
 *
 * Everything is a pure function of elapsed time, driven by one rAF loop, and
 * only transform / opacity / stroke-dashoffset change.
 */

const T = {
  probeEnd: 750,
  buildEnd: 1500,
  wordsStart: 2100,
  flyStart: 2600,
  flyEnd: 3150,
  pageStart: 2900, // the rest of the page is handed back here
}

const PULSE = { start: 780, dur: 620, trail: 150 }
const SEEN_KEY = 'intro-seen'
const WARN = '#FF7A1A'

const PHASES = ['Probe', 'Build', 'Automate'] as const
const CAPTIONS = [
  'Scanning for what is broken.',
  'Building it, and catching what nobody asked for.',
  'Letting it run on its own.',
] as const

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x))
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a))
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3)
const easeOutBack = (x: number) => {
  const c = 1.70158
  return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2)
}
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
const invEaseOut = (y: number) => 1 - Math.pow(1 - clamp(y), 1 / 3)
const lerp = (a: number, b: number, x: number) => a + (b - a) * x
const frac = (x: number) => x - Math.floor(x)
const pol = (deg: number, r: number): [number, number] => {
  const a = (deg * Math.PI) / 180
  return [r * Math.sin(a), -r * Math.cos(a)]
}
const hexRgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
const mix = (c1: string, c2: string, x: number) => {
  const a = hexRgb(c1)
  const b = hexRgb(c2)
  return `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], x))).join(',')})`
}

const NS = 'http://www.w3.org/2000/svg'
const svgEl = <K extends keyof SVGElementTagNameMap>(
  name: K,
  attrs: Record<string, string | number> = {},
  parent?: Element,
) => {
  const n = document.createElementNS(NS, name)
  for (const k in attrs) n.setAttribute(k, String(attrs[k]))
  parent?.appendChild(n)
  return n
}

const WORDS = `${profile.displayName.line1} ${profile.displayName.line2}`.split(' ')

const seenAlready = () => {
  try {
    return window.sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}

const shouldRun =
  typeof window !== 'undefined' &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
  window.location.pathname === '/' &&
  !seenAlready()

// Two classes, because the page and the headline are handed back at different
// moments: `is-intro` holds the whole page, `is-intro-head` holds only the real
// headline, which must stay hidden until the flying clone has landed on it.
if (shouldRun) {
  document.documentElement.classList.add('is-intro', 'is-intro-head')
  try {
    window.sessionStorage.setItem(SEEN_KEY, '1')
  } catch {
    /* private mode: the intro just plays again next load */
  }
}

const release = () => document.documentElement.classList.remove('is-intro')
const releaseHead = () => document.documentElement.classList.remove('is-intro-head')

export default function IntroOverlay() {
  const [gone, setGone] = useState(!shouldRun)
  const stageRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const stepsRef = useRef<HTMLDivElement>(null)
  const captionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!shouldRun) {
      release()
      releaseHead()
      return
    }

    // Re-assert here, not just at module load: StrictMode mounts, unmounts and
    // remounts in dev, and the first unmount's cleanup releases the class.
    document.documentElement.classList.add('is-intro', 'is-intro-head')

    const stage = stageRef.current
    const svg = svgRef.current
    const stepsWrap = stepsRef.current
    const caption = captionRef.current
    const title = titleRef.current
    if (!stage || !svg || !stepsWrap || !caption || !title) {
      release()
      releaseHead()
      setGone(true)
      return
    }

    let cancelled = false
    let raf = 0

    const run = async () => {
      if (document.fonts?.ready) await document.fonts.ready
      if (cancelled) return

      const css = getComputedStyle(document.documentElement)
      const hexVar = (name: string, fallback: string) => {
        const v = css.getPropertyValue(name).trim()
        return /^#[0-9a-f]{6}$/i.test(v) ? v : fallback
      }
      const NAVY = hexVar('--navy', '#0B1E3F')
      const BLUE = hexVar('--orange', '#1A62FF') // the site's accent token

      /* ---------------- headline: same machinery as before ---------------- */
      const target = document.querySelector<HTMLElement>('.home__title')
      const tr = target?.getBoundingClientRect()
      const width = tr?.width ?? Math.min(760, window.innerWidth * 0.86)
      title.style.width = `${width}px`
      title.style.transform = 'none'
      const wordEls = Array.from(title.querySelectorAll<HTMLElement>('.boot__word'))
      const wordIn = wordEls.map((w) => w.querySelector<HTMLElement>('.boot__word-in'))

      // Flex swallows the literal spaces, so the column gap is one measured
      // space and the row is allowed to wrap (see boot.css).
      const probe = document.createElement('span')
      probe.className = 'boot__word'
      probe.textContent = ' '
      title.append(probe)
      const space = probe.getBoundingClientRect().width
      probe.remove()
      const inked = wordEls.reduce((sum, el) => sum + el.getBoundingClientRect().width, 0)
      const fits = inked + (wordEls.length - 1) * space <= width + 0.5
      title.style.columnGap = `${fits ? Math.max(0, (width - inked) / (wordEls.length - 1)) : space}px`

      const height = tr?.height ?? title.offsetHeight
      const s0 = Math.min(1.3, (window.innerWidth * 0.88) / width)
      const sx = (window.innerWidth - width * s0) / 2
      const sy = (window.innerHeight - height * s0) / 2 - 10
      title.style.opacity = '1'

      /* ---------------- the radial ---------------- */
      svg.replaceChildren()
      const root = svgEl('g', {}, svg)
      const track = svgEl('circle', { r: 202, fill: 'none', stroke: NAVY, 'stroke-opacity': 0.07, 'stroke-width': 2 }, root)
      const sys = svgEl('g', {}, root)

      const rings = [70, 130, 190].map((r) =>
        svgEl('circle', { r, fill: 'none', stroke: NAVY, 'stroke-opacity': 0.11, 'stroke-width': 1.25 }, sys),
      )
      const cross = [0, 90].map((a) => {
        const [x, y] = pol(a, 196)
        return svgEl('line', { x1: -x, y1: -y, x2: x, y2: y, stroke: NAVY, 'stroke-opacity': 0.07, 'stroke-width': 1 }, sys)
      })

      // radial bars: the thing that gets "built"
      const BARS = 36
      const bars = Array.from({ length: BARS }, (_, i) => {
        const len = 20 + 44 * (0.5 + 0.5 * Math.sin(i * 1.7) * Math.cos(i * 0.45 + 1))
        const ang = i * (360 / BARS) + 360 / BARS / 2
        const ln = svgEl('line', { stroke: BLUE, 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-opacity': i % 2 ? 0.45 : 0.9 }, sys)
        return { ln, len, ang, delay: i * 10 }
      })

      // nodes found by the probe: [angle, radius, flagged]
      const checkD = 'M-3.2 .2 L-.9 2.6 L3.4 -2.4'
      const NODES = (
        [
          [20, 130, 0], [75, 190, 1], [120, 70, 0], [155, 190, 0], [200, 130, 1],
          [240, 70, 0], [275, 190, 0], [310, 130, 1], [345, 190, 0],
        ] as const
      ).map(([a, r, flag], i) => {
        const [x, y] = pol(a, r)
        const spoke = svgEl('line', { x1: 0, y1: 0, x2: x, y2: y, stroke: NAVY, 'stroke-opacity': 0.28, 'stroke-width': 1.25 }, sys)
        const len = Math.hypot(x, y)
        spoke.setAttribute('stroke-dasharray', String(len))
        spoke.setAttribute('stroke-dashoffset', String(len))
        const g = svgEl('g', { transform: `translate(${x} ${y})` }, sys)
        const ping = svgEl('circle', { r: 4, fill: 'none', stroke: flag ? WARN : NAVY, 'stroke-width': 1.5, opacity: 0 }, g)
        const core = svgEl('circle', { r: 0, fill: flag ? WARN : NAVY }, g)
        const check = svgEl('path', { d: checkD, fill: 'none', stroke: '#fff', 'stroke-width': 1.9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0 }, g)
        return { a, flag: !!flag, spoke, len, ping, core, check, i }
      })

      // the probe sweep: a leading line with a fading trail, kept inside the ring
      const defs = svgEl('defs', {}, svg)
      const grad = svgEl('radialGradient', { id: 'boot-sw', gradientUnits: 'userSpaceOnUse', cx: 0, cy: 0, r: 196 }, defs)
      svgEl('stop', { offset: 0, 'stop-color': BLUE, 'stop-opacity': 1 }, grad)
      svgEl('stop', { offset: 1, 'stop-color': BLUE, 'stop-opacity': 0.35 }, grad)
      const sweep = svgEl('g', {}, root)
      const WEDGES = 18
      const STEP = 2.6
      const SR = 196
      for (let i = 0; i < WEDGES; i++) {
        const [x0, y0] = pol(-(i + 1) * STEP, SR)
        const [x1, y1] = pol(-i * STEP, SR)
        svgEl('path', {
          d: `M0 0 L${x0} ${y0} A${SR} ${SR} 0 0 1 ${x1} ${y1} Z`,
          fill: 'url(#boot-sw)',
          'fill-opacity': 0.26 * Math.pow(1 - i / WEDGES, 1.4),
        }, sweep)
      }
      svgEl('line', { x1: 0, y1: 0, x2: 0, y2: -SR, stroke: BLUE, 'stroke-width': 1.75, 'stroke-linecap': 'round' }, sweep)

      // the pulse: a soft halo, a crisp detecting ring, a dashed fixing ring
      const ne = { fill: 'none', 'vector-effect': 'non-scaling-stroke' }
      const pulseG = svgEl('g', {}, root)
      root.insertBefore(pulseG, sweep)
      const pSoft = svgEl('circle', { ...ne, r: 0, stroke: BLUE, 'stroke-width': 16, opacity: 0 }, pulseG)
      const pFront = svgEl('circle', { ...ne, r: 0, stroke: BLUE, 'stroke-width': 2, opacity: 0 }, pulseG)
      const pTrail = svgEl('circle', { ...ne, r: 0, stroke: BLUE, 'stroke-width': 1.25, 'stroke-dasharray': '3 5', opacity: 0 }, pulseG)

      const orbit = svgEl('circle', { r: 202, fill: 'none', stroke: BLUE, 'stroke-width': 3, 'stroke-linecap': 'round', transform: 'rotate(-90)', pathLength: 100 }, root)
      const orbitDot = svgEl('circle', { r: 6, fill: BLUE }, root)
      const hub = svgEl('circle', { r: 5, fill: BLUE }, root)
      const hubPing = svgEl('circle', { r: 5, fill: 'none', stroke: BLUE, 'stroke-width': 1.5 }, root)

      /* ---------------- what nobody asked for ----------------
         Scattered across the whole viewport, away from the ring, the caption
         and the step labels. Every third one is a flagged need. */
      const rect = svg.getBoundingClientRect()
      const k = rect.width / 600 // px per svg unit
      const c = [rect.left + rect.width / 2, rect.top + rect.height / 2]
      const RFULL =
        Math.max(
          ...[[0, 0], [window.innerWidth, 0], [0, window.innerHeight], [window.innerWidth, window.innerHeight]].map(
            ([x, y]) => Math.hypot(x - c[0], y - c[1]),
          ),
        ) / k + 24
      const kr = [stepsWrap, caption].map((e) => e.getBoundingClientRect())
      const keep = {
        l: Math.min(...kr.map((r) => r.left)) - 30,
        r: Math.max(...kr.map((r) => r.right)) + 30,
        t: Math.min(...kr.map((r) => r.top)) - 26,
        b: Math.max(...kr.map((r) => r.bottom)) + 26,
      }
      const EXTRAS: { ping: SVGElement; core: SVGElement; check: SVGElement; r: number; flag: boolean; n: number }[] = []
      const placed: [number, number][] = []
      const hash = (i: number) => frac(Math.sin(i * 12.9898 + 4.1414) * 43758.5453)
      const MIN_GAP = Math.max(90, Math.min(window.innerWidth, window.innerHeight) * 0.16)
      for (let n = 0, guard = 0; n < 20 && guard < 600; ) {
        guard++
        const px = window.innerWidth * (0.05 + 0.9 * hash(guard * 2 + 1))
        const py = window.innerHeight * (0.07 + 0.72 * hash(guard * 2 + 2))
        if (placed.some(([qx, qy]) => Math.hypot(qx - px, qy - py) < MIN_GAP)) continue
        if (px > keep.l && px < keep.r && py > keep.t && py < keep.b) continue
        const x = (px - c[0]) / k
        const y = (py - c[1]) / k
        const r = Math.hypot(x, y)
        if (r < 320) continue
        placed.push([px, py])
        const flag = n % 3 === 0
        const g = svgEl('g', { transform: `translate(${x} ${y})` }, sys)
        const ping = svgEl('circle', { r: 4, fill: 'none', stroke: flag ? WARN : BLUE, 'stroke-width': 1.5, opacity: 0 }, g)
        const core = svgEl('circle', { r: 0, fill: flag ? WARN : NAVY }, g)
        const check = svgEl('path', { d: checkD, fill: 'none', stroke: '#fff', 'stroke-width': 1.9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0 }, g)
        EXTRAS.push({ ping, core, check, r, flag, n })
        n++
      }

      const stepEls = Array.from(stepsWrap.querySelectorAll<HTMLElement>('.boot__step'))

      /* ---------------- render(t): a pure function of time ---------------- */
      const render = (t: number) => {
        // ring system draws in, then turns once the build is done
        const ringIn = easeOut(seg(t, 0, 320))
        rings.forEach((el, i) => {
          el.setAttribute('opacity', String(ringIn))
          el.setAttribute('transform', `scale(${lerp(0.82 + i * 0.02, 1, ringIn)})`)
        })
        cross.forEach((el) => el.setAttribute('opacity', String(ringIn)))
        sys.setAttribute('transform', `rotate(${0.0001 * Math.pow(Math.max(0, t - T.buildEnd), 2)})`)

        // resolve: the instrument tightens away
        const away = easeInOut(seg(t, 2050, 2500))
        root.setAttribute('opacity', String(1 - away))
        root.setAttribute('transform', `scale(${lerp(1, 0.55, away)})`)
        stage.style.opacity = String(1 - seg(t, 2400, 2650))

        // hub
        hub.setAttribute('r', String(4 + 1.5 * Math.sin(t / 120)))
        hubPing.setAttribute('r', String(5 + 30 * ((t % 700) / 700)))
        hubPing.setAttribute('opacity', String(t < T.probeEnd ? 0.6 * (1 - (t % 700) / 700) : 0))

        // probe: one sweep around the ring
        const sweepAng = 370 * easeInOut(seg(t, 0, T.probeEnd))
        sweep.setAttribute('transform', `rotate(${sweepAng})`)
        sweep.setAttribute('opacity', String(easeOut(seg(t, 0, 120)) * (1 - easeOut(seg(t, T.probeEnd, T.probeEnd + 160)))))

        NODES.forEach((n) => {
          const age = Math.min(sweepAng, 370) - n.a // degrees since the sweep passed
          const shown = age > 0
          const q = clamp(age / 55)
          n.ping.setAttribute('r', String(4 + 22 * easeOut(q)))
          n.ping.setAttribute('opacity', String(shown ? 0.9 * (1 - q) : 0))

          const sp = easeOut(seg(t, T.probeEnd + 30 + n.i * 28, T.probeEnd + 330 + n.i * 28))
          n.spoke.setAttribute('stroke-dashoffset', String(n.len * (1 - sp)))
          const fixT = seg(t, 1150 + n.i * 10, 1350 + n.i * 10)
          const base = shown ? easeOutBack(clamp(age / 14)) : 0
          let rad = (n.flag ? 5.5 : 3.6) * base
          if (n.flag) rad = lerp(rad, 8, easeOut(fixT))
          n.core.setAttribute('r', String(Math.max(0, rad)))
          n.core.setAttribute('fill', n.flag ? mix(WARN, BLUE, fixT) : NAVY)
          n.check.setAttribute('opacity', String(n.flag ? easeOut(seg(t, 1300 + n.i * 10, 1450 + n.i * 10)) : 0))
        })

        // build: one pulse crosses the page. Front detects, trailing ring fixes.
        const maxR = RFULL
        const rf = maxR * easeOut(seg(t, PULSE.start, PULSE.start + PULSE.dur))
        const rt = maxR * easeOut(seg(t, PULSE.start + PULSE.trail, PULSE.start + PULSE.trail + PULSE.dur))
        const fade = (a: number) => seg(t, a, a + 40) * (1 - seg(t, a + PULSE.dur * 0.7, a + PULSE.dur + 60))
        const of = fade(PULSE.start)
        const ot = fade(PULSE.start + PULSE.trail)
        pFront.setAttribute('r', String(rf)); pFront.setAttribute('opacity', String(0.6 * of))
        pSoft.setAttribute('r', String(rf)); pSoft.setAttribute('opacity', String(0.08 * of))
        pTrail.setAttribute('r', String(rt)); pTrail.setAttribute('opacity', String(0.45 * ot))

        EXTRAS.forEach((e) => {
          const tHit = PULSE.start + PULSE.dur * invEaseOut(e.r / maxR)
          const ms = t - tHit
          const age = ms > 0 ? ms / 4.2 : -1
          const fixT = seg(t, tHit + PULSE.trail, tHit + PULSE.trail + 180)
          const chkT = seg(t, tHit + PULSE.trail + 120, tHit + PULSE.trail + 270)
          const shown = age > 0
          const q = clamp(age / 55)
          e.ping.setAttribute('r', String(4 + 20 * easeOut(q)))
          e.ping.setAttribute('opacity', String(shown ? 0.85 * (1 - q) : 0))
          const base = shown ? easeOutBack(clamp(age / 14)) : 0
          let rad = (e.flag ? 5 : 3.2) * base
          if (e.flag) rad = lerp(rad, 7.5, easeOut(fixT))
          e.core.setAttribute('r', String(Math.max(0, rad)))
          e.core.setAttribute('fill', e.flag ? mix(WARN, BLUE, fixT) : NAVY)
          e.check.setAttribute('opacity', String(e.flag ? easeOut(chkT) : 0))
        })

        // build: radial bars grow
        bars.forEach((b) => {
          const g = easeOut(seg(t, 880 + b.delay, 1260 + b.delay))
          const [x0, y0] = pol(b.ang, 214)
          const [x1, y1] = pol(b.ang, 214 + 0.01 + b.len * g)
          b.ln.setAttribute('x1', String(x0)); b.ln.setAttribute('y1', String(y0))
          b.ln.setAttribute('x2', String(x1)); b.ln.setAttribute('y2', String(y1))
          b.ln.setAttribute('opacity', g > 0 ? '1' : '0')
        })

        // automate: one full lap by itself
        const lap = easeInOut(seg(t, T.buildEnd, 2100))
        const visible = String(easeOut(seg(t, T.buildEnd - 60, T.buildEnd + 80)))
        track.setAttribute('opacity', visible)
        orbit.setAttribute('opacity', visible)
        orbit.setAttribute('stroke-dasharray', `${lap * 100} 100`)
        const [ox, oy] = pol(lap * 360, 202)
        orbitDot.setAttribute('cx', String(ox)); orbitDot.setAttribute('cy', String(oy))
        orbitDot.setAttribute('opacity', visible)

        // labels
        const active = t < T.probeEnd ? 0 : t < T.buildEnd ? 1 : 2
        stepEls.forEach((s, i) => {
          s.classList.toggle('on', i === active)
          s.classList.toggle('done', i < active)
        })
        if (caption.textContent !== CAPTIONS[active]) caption.textContent = CAPTIONS[active]

        // headline: rises from the centre, then flies home
        wordIn.forEach((w, i) => {
          if (!w) return
          const p = easeOut(seg(t, T.wordsStart + i * 40, T.wordsStart + i * 40 + 330))
          w.style.transform = `translateY(${lerp(132, 0, p)}%)`
        })
        if (tr) {
          const f = easeInOut(seg(t, T.flyStart, T.flyEnd))
          title.style.transform = `translate(${lerp(sx, tr.left, f)}px, ${lerp(sy, tr.top, f)}px) scale(${lerp(s0, 1, f)})`
        } else {
          title.style.transform = `translate(${sx}px, ${sy}px) scale(${s0})`
          title.style.opacity = String(1 - seg(t, T.flyStart, T.flyStart + 420))
        }
      }

      render(0)
      let pageReleased = false
      const start = performance.now()
      const frame = (now: number) => {
        if (cancelled) return
        const t = now - start
        render(Math.min(t, T.flyEnd))
        if (!pageReleased && t >= T.pageStart) {
          pageReleased = true
          release()
        }
        if (t < T.flyEnd) {
          raf = requestAnimationFrame(frame)
        } else {
          release()
          releaseHead()
          setGone(true)
        }
      }
      raf = requestAnimationFrame(frame)
    }

    void run()

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      release()
      releaseHead()
    }
  }, [])

  if (gone) return null

  return (
    <div className="boot" aria-hidden="true" role="presentation">
      <div className="boot__stage" ref={stageRef}>
        <svg className="boot__radial" ref={svgRef} viewBox="-300 -300 600 600" />
        <div className="boot__steps" ref={stepsRef}>
          {PHASES.map((p, i) => (
            <span className="boot__step" key={p}>
              <i>{`0${i + 1}`}</i>
              {p}
            </span>
          ))}
        </div>
        <div className="boot__caption" ref={captionRef} />
      </div>

      <div className="boot__title" ref={titleRef}>
        {WORDS.map((word, i) => (
          <span className="boot__word" key={`${word}-${i}`}>
            <span className="boot__word-in">{word}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
