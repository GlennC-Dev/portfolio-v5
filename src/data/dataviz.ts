/**
 * Data Visualizations: the dashboards in the Projects barrel.
 *
 * Two levels, because that is how the work is organised: a WORKBOOK is the
 * thing you built (v4's project, its paragraph describes the whole workbook),
 * and a DASHBOARD is one screenshot of it. The barrel's hover label reads
 * "workbook name / dashboard name"; the pop-up footer shows the dashboard's
 * name and description, then the workbook's name and paragraph.
 *
 * ADDING A SCREENSHOT
 *   1. Drop the image in public/project-photos/ (keep the naming pattern:
 *      projects_dataviz_<n>_<workbook>_<k>.jpg - the fake address in the
 *      pop-up's URL strip is read from it).
 *   2. Add a line under its workbook below (or a whole new workbook).
 *   3. Make its barrel thumbnail:  python3 scripts/make-dataviz-thumbs.py
 *      (it also warns about files with no entry and entries with no file).
 *
 * TODO(Glenn): PER-DASHBOARD DESCRIPTIONS
 *   Every dashboard's `desc` below is still PLACEHOLDER_DESC. To write a real
 *   one, replace `PLACEHOLDER_DESC` on that dashboard's line with your own
 *   text in quotes. One or two sentences about what THIS dashboard shows
 *   (the workbook paragraph above it already covers the whole workbook).
 *   Set it to '' to hide the line in the pop-up entirely.
 */

export const PLACEHOLDER_DESC = 'PLACEHOLDER - tell me what to put here: what this dashboard shows.'

/** Host shown in the pop-up's fake URL strip (carried over from v4). */
export const FAKE_HOST = 'topgitconsulting.tech'

export type Dashboard = {
  /** Screenshot filename in public/project-photos/. */
  file: string
  /** Dashboard name: the barrel's second hover label and the pop-up headline. */
  name: string
  /** What this one dashboard shows. TODO(Glenn): see the note at the top. */
  desc: string
}

export type Workbook = {
  slug: string
  /** Workbook name: the barrel's first hover label. */
  name: string
  /** v4's paragraph, describing the workbook as a whole. */
  desc: string
  dashboards: Dashboard[]
}

export const WORKBOOKS: Workbook[] = [
  {
    slug: 'customer-experience-dashboard',
    name: 'CES Dashboard',
    desc: 'A self-service Customer Experience Score dashboard suite spanning brand, chevron, team leader, and agent-day views — giving operations and team leaders direct visibility into CSAT, CES, and NPS trends without a single manual report request.',
    dashboards: [
      { file: 'projects_dataviz_1_ces_1.jpg', name: 'Per Brand and Per Chevron CES View', desc: PLACEHOLDER_DESC },
      { file: 'projects_dataviz_1_ces_2.jpg', name: 'Team-Agent Performance View', desc: PLACEHOLDER_DESC },
    ],
  },
  {
    slug: 'chat-operations-dashboard',
    name: 'Chat Operations Dashboard',
    desc: 'A fully automated Chat Operations reporting suite covering queue health, transfer patterns, agent productivity, and bi-hourly intraday snapshots — delivered to operations leaders on schedule, every day, without a single manual pull.',
    dashboards: [
      { file: 'projects_dataviz_2_sfchat_1.jpg', name: 'Chat Queue Performance Report', desc: PLACEHOLDER_DESC },
      { file: 'projects_dataviz_2_sfchat_2.jpg', name: 'Chat Transfer Report', desc: PLACEHOLDER_DESC },
      { file: 'projects_dataviz_2_sfchat_3.png', name: 'Agent Performance Report', desc: PLACEHOLDER_DESC },
      { file: 'projects_dataviz_2_sfchat_4.jpg', name: 'Bi-Hourly Chat Volume Report', desc: PLACEHOLDER_DESC },
    ],
  },
  {
    slug: 'agent-and-tl-productivity-suite',
    name: 'Agent and TL Productivity Suite',
    desc: 'A cascading D-1 productivity suite delivered daily — team leaders receive agent-level calls, AHT, occupancy, aux usage, and CES; program managers get the same rolled up to team level alongside queue health. Aux monitoring flags overages before they become a pattern.',
    dashboards: [
      { file: 'projects_dataviz_3_dailyrpt_1.jpg', name: 'Agent Productivity Report for Team Leaders', desc: PLACEHOLDER_DESC },
      { file: 'projects_dataviz_3_dailyrpt_2.jpg', name: 'Overall Performance Report for Program Managers', desc: PLACEHOLDER_DESC },
      { file: 'projects_dataviz_3_dailyrpt_3.jpg', name: 'Daily Aux Monitoring Report', desc: PLACEHOLDER_DESC },
    ],
  },
  {
    slug: 'queue-intelligence',
    name: 'Queue Intelligence',
    desc: 'A D-1 queue summary delivered every morning and a week-on-week view sent every Monday — giving operations managers a complete picture of call volume, SLA performance, abandon rates, and interval-level patterns across all business units, automatically, without a single manual pull.',
    dashboards: [
      { file: 'projects_dataviz_4_queuerpt_1.jpg', name: 'Queue Performance Report for Yesterday', desc: PLACEHOLDER_DESC },
      { file: 'projects_dataviz_4_queuerpt_2.jpg', name: 'Queue Performance Report for MTD', desc: PLACEHOLDER_DESC },
    ],
  },
  {
    slug: 'manager-reports',
    name: 'Manager Reports',
    desc: 'A bi-monthly manager briefing built so that every question in a business review is answered before it\'s asked. Three LOB variants — Technical Support, Sales & Activations, and Customer Service — each surfacing queue health, productivity, shift utilization, and LOB-specific KPIs across two brands simultaneously. Eight independent data sources, one question: how did the business do?',
    dashboards: [
      { file: 'projects_dataviz_5_mgrview_1.jpg', name: 'Manager View for Technical Support Campaign', desc: PLACEHOLDER_DESC },
      { file: 'projects_dataviz_5_mgrview_2.jpg', name: 'Manager View for Sales and Activations Campaigns', desc: PLACEHOLDER_DESC },
      { file: 'projects_dataviz_5_mgrview_3.jpg', name: 'Manager View for Customer Service Campaigns', desc: PLACEHOLDER_DESC },
    ],
  },
]

/** One barrel card / pop-up entry per dashboard, flattened in order. */
export type DashboardItem = {
  key: string
  label: string
  tag: string
  thumb: string
  src: string
  fakePath: string
  workbook: Workbook
  dashboard: Dashboard
  /** 0-based position inside its workbook. */
  index: number
}

const base = (file: string) => file.replace(/\.[^.]+$/, '')

/** projects_dataviz_2_sfchat_3 -> /projects/dataviz/sfchat (v4's rule). */
const fakePathFor = (file: string, fallback: string) => {
  const m = base(file).match(/^projects_([a-z0-9]+)_(?:\d+_)?([a-z0-9]+)_\d+$/i)
  return m ? `/projects/${m[1]}/${m[2]}` : fallback
}

export const DASHBOARDS: DashboardItem[] = WORKBOOKS.flatMap((workbook) =>
  workbook.dashboards.map((dashboard, index) => ({
    key: base(dashboard.file),
    label: dashboard.name,
    tag: workbook.name,
    thumb: `/project-photos/thumbs/${base(dashboard.file)}.jpeg`,
    src: `/project-photos/${dashboard.file}`,
    fakePath: fakePathFor(dashboard.file, `/projects/dataviz/${workbook.slug}`),
    workbook,
    dashboard,
    index,
  })),
)
