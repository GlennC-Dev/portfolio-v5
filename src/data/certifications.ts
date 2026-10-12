export interface Certification {
  name: string
  issuer: string
  issued: string
  credentialId: string
}

/** Listed in display order: the Lean Six Sigma path first, then the Programiz certificates. */
export const CERTIFICATIONS: Certification[] = [
  {
    name: 'Lean Six Sigma Green Belt',
    issuer: 'Process Doctors Academy',
    issued: 'Apr 2024',
    credentialId: 'LSSGB-1714052159-11372-11048',
  },
  {
    name: 'AI-Enabled Lean Six Sigma Practitioner',
    issuer: 'Process Doctors Academy',
    issued: 'Oct 2023',
    credentialId: 'AILSSP-1697286707-89622-11048',
  },
  {
    name: 'Lean Six Sigma Yellow Belt',
    issuer: 'Process Doctors Academy',
    issued: 'Jan 2023',
    credentialId: 'LSSYB-1672930349-2001-11048',
  },
  {
    name: 'Python Mastery',
    issuer: 'Programiz',
    issued: 'Sep 2024',
    credentialId: '0D1886E8797B',
  },
  {
    name: 'SQL Basics',
    issuer: 'Programiz',
    issued: 'May 2024',
    credentialId: '3FF64426D575',
  },
]
