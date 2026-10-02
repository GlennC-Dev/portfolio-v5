/**
 * The four capabilities, v4's copy. One source for the Services page cards
 * and the Home card that indexes them.
 */

export type Service = {
  index: string
  title: string
  description: string
  chip: string
  bullets: string[]
}

export const CAPABILITIES: Service[] = [
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
