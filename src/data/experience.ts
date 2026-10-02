/**
 * Work history for the Services page. Text is v4's, word for word, including
 * the <strong> emphasis inside bullets (rendered with dangerouslySetInnerHTML:
 * these strings are static and ours, never user input).
 * mainExperience always shows its bullets; hiddenExperience is the
 * click-to-open "Earlier roles" list.
 */

export interface ExpItem {
  role: string;
  period: string;
  company: string;
  bullets?: string[];
  muted?: boolean;
}

export const mainExperience: ExpItem[] = [
  {
    role: "Reports and Automation Specialist",
    period: "AUG 2023 — PRESENT",
    company: "Acquire Intelligence",
    bullets: [
      "Built Tableau dashboards that <strong>eliminated hours of manual data transformation</strong>, freeing analysts to focus on insights.",
      "Corrected a structural reporting error, surfacing 17,185 unrecorded interactions over 5 months and <strong>revealing a true SL of 34.4% vs the reported 37.8%</strong> — impacting target setting and workforce planning.",
      "Prepared dashboards that utilizes Tableau's Subscriptions function, sending <strong>tailored reports straight to stakeholder's inbox</strong> on cue.",
      "Leveraged Power Query for Scorecard Automation, enabling <strong>D-1 scorecard availability</strong> at a fraction of previous processing time.",
      "Developed scorecards, automated reports, and data collection systems using <strong>Google Apps Script</strong> within Google Workspace.",
    ],
  },
  {
    role: "Operational Business Insights Analyst",
    period: "OCT 2022 — AUG 2023",
    company: "Acquire BPO",
    bullets: [
      "Engineered QRAW — a self-sustaining offline activity tracking system built on Google Forms, Apps Script, and Sheets — solving the phone system's inbound-only blind spot.",
      "Overlaid QRAW with phone system data to produce the org's first true utilization metrics, driving 90% staff utilization and 92% efficiency across multiple business units — results that got it adopted org-wide.",
      "Deployed an automated eNPS system that reduced processing time <strong>from weeks to near real-time</strong>, enabling immediate insights.",
    ],
  },
];

export const hiddenExperience: ExpItem[] = [
  {
    role: "Project Specialist",
    period: "MAR 2022 — OCT 2022",
    company: "Acquire BPO",
    bullets: [
      "Built a web-app mapping every troubleshooting scenario from Level 1 through TIO escalations — covering manual modem configuration to cloud-based IVR routing for IP phones. Adopted and expanded by client to cover IPV and cloud hosted telephony.",
      "Redesigned operations training curriculum — cutting required training time by 50% — and served as interim team lead for 5+ new hire classes, teaching how systems actually work rather than just what to do",
      "Authored 20+ knowledge articles and led training sessions for four new hire classes during their transition to operations.",
    ],
  },
  {
    role: "ADSL/Fiber Support → Business Faults → Tech Escalations",
    period: "JAN 2017 — MAR 2022",
    company: "Acquire BPO",
    bullets: ["Primarily worked on manager escalations, client escalations, or cases involving Australia's Telecommunication Industry Ombudsman (TIO).",
              "Acted as SME for new hire classes, assisted with team level reporting, wrote processes for new products and spearheaded discovery sessions for optimizing troubleshooting flow.",
              "Acted on cases needing supplier intervention -- coordinating technician dispatches, equipment delivery and outage status.",
    ],
  },
  {
    role: "Residential ADSL/PSTN Technical Support",
    period: "FEB 2016 — JAN 2017",
    company: "Acquire BPO",
    bullets: ["Frontline Technical Support Staff answering and assisting residential customers with concerns related to ADSL and technologies.",
              "Assisted with minor billing concerns, technician dispatch and outage status.",
    ],
  },
  {
    role: "High Speed Internet Technical Support Agent",
    period: "AUG 2014 — JUN 2015",
    company: "Sykes Asia Incorporated",
    bullets: ["Frontline Technical Support Staff answering and assisting residential customers with concerns related to ADSL internet and related technologies at the time.",
              "Assisted with minor billing concerns, technician dispatch and outage status.",
    ],
  },
];
