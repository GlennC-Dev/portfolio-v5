/**
 * Apps Script Reports: v4's four Apps Script projects, text word for word.
 * The shelf shows each project's cover (its first screenshot); opening one
 * brings up the drifting strip of macOS-framed screenshots, and a frame opens
 * full size with its caption as the window title.
 *
 * ADDING A SCREENSHOT: drop the image in public/project-photos/ and add a line
 * to that project's `shots`. The first shot is the shelf cover.
 * ADDING A PROJECT: add an entry below.
 */

export type AppScriptShot = {
  src: string
  /** What this screenshot shows - the frame's label and the enlarged window's title. */
  caption: string
}

export type AppScriptProject = {
  slug: string
  title: string
  desc: string
  tags: string[]
  shots: AppScriptShot[]
}

export const APPSCRIPT: AppScriptProject[] = [
  {
    slug: 'script-driven-report-generation',
    title: 'Script-Driven Report Generation',
    desc: 'Cut report generation time by over 90% using Apps Script and smart cell logic in Google Sheets, reducing a 1-hour manual workflow to a streamlined, sub-5-minute process. Comprehensive solution that automates report generation by performing data cleaning, standardization, duplicate removal, and formatting.',
    tags: ['Apps Script', 'Google Sheets'],
    shots: [
      { src: '/project-photos/projects_appscript_1_reportgeneration_1.png', caption: 'Apps Script function for automated data replacement and cell updating with processing counter' },
      { src: '/project-photos/projects_appscript_1_reportgeneration_2.png', caption: 'Data filtering and deletion logic for removing rows based on column criteria' },
      { src: '/project-photos/projects_appscript_1_reportgeneration_3.png', caption: 'Find and replace automation for standardizing data across spreadsheet ranges' },
      { src: '/project-photos/projects_appscript_1_reportgeneration_4.png', caption: 'Duplicate removal algorithm with unique value tracking and automated cleanup' },
      { src: '/project-photos/projects_appscript_1_reportgeneration_5.png', caption: 'Master checker function orchestrating the complete automation workflow' },
    ],
  },
  {
    slug: 'enps-automation',
    title: 'ENPS Automation',
    desc: 'Designed and deployed a fully automated Employee Net Promoter Score system that runs bi-monthly, sends surveys via script, and calculates scores in real time — delivering hands-free insights for leadership without manual intervention.',
    tags: ['Apps Script', 'Google Workspace'],
    shots: [
      { src: '/project-photos/projects_appscript_2_enps_1.png', caption: 'Apps Script automation code for ENPS data processing' },
      { src: '/project-photos/projects_appscript_2_enps_2.png', caption: 'Live ENPS dashboard with real-time score calculation and breakdown' },
      { src: '/project-photos/projects_appscript_2_enps_3.png', caption: 'Detailed ENPS analysis by category and department' },
    ],
  },
  {
    slug: 'google-forms-maintenance',
    title: 'Google Forms Maintenance',
    desc: 'Engineered a self-monitoring Apps Script system that auto-polls Google Forms response counts, alerts stakeholders at threshold, and clears entries preemptively to prevent sync failures past the 100K cap — fully automated across multiple forms.',
    tags: ['Apps Script', 'Google Workspace'],
    shots: [
      { src: '/project-photos/projects_appscript_3_oversight_1.png', caption: 'Automated workflow diagram for Google Forms response monitoring and maintenance' },
      { src: '/project-photos/projects_appscript_3_oversight_2.png', caption: 'Apps Script function for retrieving Google Forms response count and timestamp tracking' },
      { src: '/project-photos/projects_appscript_3_oversight_3.png', caption: 'Automated response clearing logic with email notification system for form oversight' },
      { src: '/project-photos/projects_appscript_3_oversight_4.png', caption: 'Time-based triggers configuration for automated form monitoring and maintenance' },
    ],
  },
  {
    slug: 'dbms-with-version-control',
    title: 'DBMS with Version Control',
    desc: 'Built a rule-enforced Google Sheets database system with input validation, version tracking, and automated change alerts — transforming a chaotic flat file into a controlled, traceable platform with email notifications and full audit trails.',
    tags: ['Apps Script', 'Google Workspace'],
    shots: [
      { src: '/project-photos/projects_appscript_4_dbms_1.png', caption: 'Apps Script function for database error handling and input validation with automated notification system' },
      { src: '/project-photos/projects_appscript_4_dbms_2.png', caption: 'Database management workflow showing data extraction, validation, and automated email population for change requests' },
      { src: '/project-photos/projects_appscript_4_dbms_3.png', caption: 'Request processing automation with status tracking, range manipulation, and email notification system for database updates' },
      { src: '/project-photos/projects_appscript_4_dbms_4.png', caption: 'Version control tracking spreadsheet showing request status, dates, ticket references, and change history for database management' },
    ],
  },
]
