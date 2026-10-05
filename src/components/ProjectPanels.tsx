import { useEffect, useState, type ReactNode } from 'react'
import { Ticket, Robot, FlowArrow, ArrowLeft, type Icon } from '@/components/slab'
import { lazy, Suspense } from 'react'
import AIStackGrid from './AIStackGrid'
import { WritingSection } from './WritingSection'
import { AppScriptShelf } from './AppScriptSection'
import WorkflowSamples from './WorkflowSamples'
import type { AppScriptProject } from '@/data/appscript'
import type { WritingItem } from '@/data/writing'
import { useDashboardModal } from './DashboardModal'
import { DASHBOARDS } from '@/data/dataviz'

const FunnelBarrel = lazy(() => import('./FunnelBarrel'))

/**
 * What the Projects dialogs show. Each panel is the work itself, on screen
 * the moment the dialog opens - no section chrome to read past and no second
 * dialog to click into.
 */

/** Only the strip of macOS windows, drifting on the backdrop. No window. */
export function AutomationsPanel() {
  return (
    <div className="ppanel ppanel--strip">
      <WorkflowSamples />
    </div>
  )
}

/** A plain mac window with a scrolling body, for the sections that are
 *  pages rather than frames. */
function SectionWindow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="ppanel ppanel--window">
      <div className="ppanel__bar">
        <span className="ppanel__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="ppanel__url">
          <span className="ppanel__url-host">{label}</span>
        </span>
      </div>
      <div className="ppanel__scroll">{children}</div>
    </div>
  )
}

/** Only the barrel, spinning on the backdrop. Its own page preview still
 *  stacks above (z 9000). */
export function BarrelPanel() {
  const { openItem, modal } = useDashboardModal()
  return (
    <div className="ppanel ppanel--barrel">
      <Suspense fallback={<div className="funnels__barrel-skeleton" aria-hidden="true" />}>
        <FunnelBarrel funnels={DASHBOARDS} onOpen={openItem} />
      </Suspense>
      {modal}
    </div>
  )
}

/** The systems as a logo-first grid, in a scrolling window. */
export function AIWindow() {
  return (
    <SectionWindow label="Your systems">
      <AIStackGrid />
    </SectionWindow>
  )
}
/** The strip view both shelves open: screenshots only, drifting, with a way
 *  back to the shelf. */
function ScreenshotStrip({
  slug,
  shots,
  fit,
  onBack,
}: {
  slug: string
  shots: { src: string; caption: string }[]
  fit?: 'cover' | 'contain'
  onBack: () => void
}) {
  return (
    <div className="ppanel ppanel--strip ppanel--appscript">
      <button type="button" className="appscript__back" onClick={onBack} autoFocus>
        <ArrowLeft size={16} weight="bold" aria-hidden="true" />
        All projects
      </button>
      <WorkflowSamples
        key={slug}
        samples={shots.map((x) => ({ src: x.src, label: x.caption }))}
        caption={null}
        fill={6}
        fit={fit}
      />
    </div>
  )
}

/** Apps Script Reports: a shelf of projects; picking one swaps the dialog to
 *  that project's screenshot strip. */
export function AppScriptWindow() {
  const [selected, setSelected] = useState<AppScriptProject | null>(null)
  if (!selected) {
    return (
      <SectionWindow label="Apps Script Reports">
        <AppScriptShelf onSelect={setSelected} />
      </SectionWindow>
    )
  }
  return <ScreenshotStrip slug={selected.slug} shots={selected.shots} onBack={() => setSelected(null)} />
}

/** Technical Writing: the same shelf-then-strip, with each page shown whole
 *  (slides and diagrams are not cropped). */
export function WritingWindow() {
  const [selected, setSelected] = useState<WritingItem | null>(null)
  if (!selected) {
    return (
      <SectionWindow label="Technical Writing">
        <WritingSection onSelect={setSelected} />
      </SectionWindow>
    )
  }
  return <ScreenshotStrip slug={selected.slug} shots={selected.shots} fit="contain" onBack={() => setSelected(null)} />
}

/** The plan document, full height, straight away. */
export function PlanPanel() {
  return (
    <div className="ppanel ppanel--frame">
      <FrameBar
        host="topgitconsulting.tech"
        path="/projects/lean-six-sigma-case-study"
      />
      <LiveFrame src="/projects/financial-process-improvement.html" title="Financial Process Improvement case study" />
    </div>
  )
}

/** `src` is a local page framed in the panel; `path` is what the fake
 *  address bar shows. Point these at your own pages. */
type Build = { id: string; label: string; src: string; path: string; Icon: Icon }

const BUILDS: Build[] = [
  { id: 'ticketing', label: 'Daily Information Assistant', src: '/projects/daily-information-assistant.html', path: '/projects/n8n-daily-information-assistant', Icon: Ticket },
  { id: 'framework', label: 'AI-Driven Portfolio Chatbot', src: '/projects/ai-portfolio-assistant.html', path: '/projects/ai-portfolio-assistant', Icon: Robot },
  { id: 'workflow', label: 'Featured Project Three', src: '/placeholders/sample-plan.html?doc=3', path: '/featured-three', Icon: FlowArrow },
]

/** One build, framed, open on arrival. */
function BuildPanel({ build }: { build: Build }) {
  return (
    <div className="ppanel ppanel--frame">
      <FrameBar host="topgitconsulting.tech" path={build.path} />
      <LiveFrame src={build.src} title={build.label} />
    </div>
  )
}
export const TicketingPanel = () => <BuildPanel build={BUILDS[0]} />
export const FrameworkPanel = () => <BuildPanel build={BUILDS[1]} />
export const WorkflowPanel = () => <BuildPanel build={BUILDS[2]} />

function FrameBar({ host, path }: { host: string; path: string }) {
  return (
    <div className="ppanel__bar">
      <span className="ppanel__dots" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className="ppanel__url">
        <span className="ppanel__url-host">{host}</span>
        <span className="ppanel__url-path">{path}</span>
      </span>
    </div>
  )
}

/** Matches `pmodal-panel` (420ms). Same-site frames share the portfolio's
 *  main thread, so loading one mid-animation stalled the open by 100ms+. */
const FRAME_DELAY_MS = 440

function LiveFrame({ src, title }: { src: string; title: string }) {
  const [ready, setReady] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), FRAME_DELAY_MS)
    return () => window.clearTimeout(id)
  }, [])
  return (
    <div className="ppanel__stage">
      {!ready && <div className="ppanel__skeleton" aria-hidden="true" />}
      {mounted && <iframe
        className="ppanel__iframe"
        src={src}
        title={title}
        loading="eager"
        onLoad={() => setReady(true)}
        data-ready={ready ? 'true' : 'false'}
      />}
    </div>
  )
}
